import json
from pathlib import Path
from textwrap import dedent


ROOT = Path(__file__).resolve().parents[1]
NOTEBOOKS_DIR = ROOT / "notebooks"


def source_lines(text: str) -> list[str]:
    return dedent(text).lstrip("\n").splitlines(keepends=True)


def markdown_cell(text: str) -> dict:
    return {
        "cell_type": "markdown",
        "metadata": {},
        "source": source_lines(text),
    }


def code_cell(text: str) -> dict:
    return {
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": source_lines(text),
    }


def notebook(cells: list[dict]) -> dict:
    return {
        "cells": cells,
        "metadata": {
            "kernelspec": {
                "display_name": "Python 3",
                "language": "python",
                "name": "python3",
            },
            "language_info": {
                "name": "python",
                "version": "3.11",
            },
        },
        "nbformat": 4,
        "nbformat_minor": 5,
    }


overview_nb = notebook(
    [
        markdown_cell(
            """
            # Compost Coders Analysis Overview

            The original mixed analysis has been split into dedicated notebooks:

            - `analysis_compost_2.ipynb`: Compost 2 temperature, moisture, heating, and stability analysis.
            - `analysis_sensors.ipynb`: Growing sensor reliability, moisture behaviour, and downtime analysis.

            The compost-focused work now centers on **Compost 2** throughout.
            """
        )
    ]
)


compost_nb = notebook(
    [
        markdown_cell(
            """
            # Compost 2 Analysis

            This notebook focuses only on **Compost 2** and extends the earlier analysis with:

            - a compact data quality profile,
            - thermal delta tracking against ambient conditions,
            - monthly heating demand versus retained heat,
            - depth-based layer analysis,
            - correlation mapping, and
            - shock detection based on rolling temperature residuals.
            """
        ),
        code_cell(
            """
            import numpy as np
            import pandas as pd
            import seaborn as sns
            import matplotlib.pyplot as plt

            sns.set_theme(style="whitegrid", context="talk")
            plt.rcParams["figure.figsize"] = (12, 6)
            """
        ),
        code_cell(
            """
            file_path = "../data/combined_compost_measurements.csv"

            df = pd.read_csv(file_path, parse_dates=["Day"])

            compost_2 = (
                df.rename(
                    columns={
                        "Day": "day",
                        "Compost 2-Inside-Heating - kWh": "heating_kwh",
                        "Compost 2-Inside-Heating - w": "heating_w",
                        "Compost 2-Lower-Moisture": "lower_moisture",
                        "Compost 2-Lower-Temperature": "lower_temp",
                        "Compost 2-Middle-Moisture": "middle_moisture",
                        "Compost 2-Middle-Temperature": "middle_temp",
                        "Compost 2-Upper-Moisture": "upper_moisture",
                        "Compost 2-Upper-Temperature": "upper_temp",
                        "Outside-Outside-Moisture": "outside_moisture",
                        "Outside-Outside-Temperature": "outside_temp",
                    }
                )[
                    [
                        "day",
                        "heating_kwh",
                        "heating_w",
                        "lower_moisture",
                        "lower_temp",
                        "middle_moisture",
                        "middle_temp",
                        "upper_moisture",
                        "upper_temp",
                        "outside_moisture",
                        "outside_temp",
                    ]
                ]
                .sort_values("day")
                .reset_index(drop=True)
            )

            compost_2
            """
        ),
        markdown_cell(
            """
            ## Data Quality Snapshot

            Before plotting trends, it helps to check whether the main Compost 2 signals are sparse, zero-heavy, or unexpectedly flat.
            """
        ),
        code_cell(
            """
            compost_2_pd = compost_2.copy()
            metric_cols = [column for column in compost_2_pd.columns if column != "day"]

            profile = pd.DataFrame(
                {
                    "missing_values": compost_2_pd[metric_cols].isna().sum(),
                    "zero_share": (compost_2_pd[metric_cols] == 0).mean().round(3),
                    "mean": compost_2_pd[metric_cols].mean().round(2),
                    "min": compost_2_pd[metric_cols].min().round(2),
                    "max": compost_2_pd[metric_cols].max().round(2),
                }
            ).sort_index()

            profile
            """
        ),
        code_cell(
            """
            fig, ax = plt.subplots(figsize=(13, 4))
            sns.heatmap(
                compost_2_pd[metric_cols].isna(),
                yticklabels=False,
                cbar=False,
                cmap="magma_r",
                ax=ax,
            )
            ax.set_title("Compost 2 missing-value map")
            ax.set_xlabel("Metric")
            plt.tight_layout()
            plt.show()
            """
        ),
        markdown_cell(
            """
            ## Thermal Behaviour Against Ambient Temperature

            The next view compares the Compost 2 core temperature with the outside air and tracks the temperature gap that the pile maintains over time.
            """
        ),
        code_cell(
            """
            compost_2_pd["temp_delta"] = compost_2_pd["middle_temp"] - compost_2_pd["outside_temp"]
            compost_2_pd["middle_temp_7d"] = compost_2_pd["middle_temp"].rolling(7, min_periods=1).mean()
            compost_2_pd["temp_delta_7d"] = compost_2_pd["temp_delta"].rolling(7, min_periods=1).mean()

            fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 10), sharex=True)

            ax1.plot(compost_2_pd["day"], compost_2_pd["middle_temp"], label="Middle temperature", color="tab:red", alpha=0.35)
            ax1.plot(compost_2_pd["day"], compost_2_pd["middle_temp_7d"], label="Middle temperature (7d mean)", color="tab:red", linewidth=2)
            ax1.plot(compost_2_pd["day"], compost_2_pd["outside_temp"], label="Outside temperature", color="tab:blue", linewidth=1.5)
            ax1.set_ylabel("Temperature")
            ax1.set_title("Compost 2 core temperature versus outside air")
            ax1.legend(loc="upper right")

            ax2.plot(compost_2_pd["day"], compost_2_pd["temp_delta"], color="tab:green", alpha=0.3, label="Daily delta")
            ax2.plot(compost_2_pd["day"], compost_2_pd["temp_delta_7d"], color="tab:green", linewidth=2, label="Delta (7d mean)")
            ax2.axhline(0, color="black", linewidth=1, linestyle="--")
            ax2.set_ylabel("Middle minus outside")
            ax2.set_xlabel("Day")
            ax2.set_title("Heat retained by Compost 2 over ambient conditions")
            ax2.legend(loc="upper right")

            plt.tight_layout()
            plt.show()
            """
        ),
        markdown_cell(
            """
            The rolling delta is useful because it separates true thermal resilience from short-lived day-to-day noise. Sustained positive gaps indicate that Compost 2 retains biologically generated or externally supported heat even during colder periods.
            """
        ),
        code_cell(
            """
            compost_2_pd["month"] = compost_2_pd["day"].dt.to_period("M").dt.to_timestamp()

            monthly = (
                compost_2_pd.groupby("month", as_index=False)
                .agg(
                    avg_middle_temp=("middle_temp", "mean"),
                    avg_outside_temp=("outside_temp", "mean"),
                    avg_temp_delta=("temp_delta", "mean"),
                    avg_heating_w=("heating_w", "mean"),
                    total_heating_kwh=("heating_kwh", "sum"),
                )
            )

            x = np.arange(len(monthly))

            fig, ax1 = plt.subplots(figsize=(14, 6))
            ax1.bar(x, monthly["total_heating_kwh"], color="#d95f02", alpha=0.75, label="Total heating kWh")
            ax1.set_ylabel("Total heating kWh", color="#d95f02")
            ax1.tick_params(axis="y", labelcolor="#d95f02")

            ax2 = ax1.twinx()
            ax2.plot(x, monthly["avg_temp_delta"], color="#1b9e77", marker="o", linewidth=2.5, label="Average thermal delta")
            ax2.plot(x, monthly["avg_middle_temp"], color="#7570b3", marker="s", linewidth=2, label="Average middle temperature")
            ax2.set_ylabel("Average temperature / delta")
            ax2.tick_params(axis="y")

            ax1.set_xticks(x)
            ax1.set_xticklabels(monthly["month"].dt.strftime("%Y-%m"), rotation=45, ha="right")
            ax1.set_title("Monthly heating demand versus retained heat for Compost 2")

            handles_1, labels_1 = ax1.get_legend_handles_labels()
            handles_2, labels_2 = ax2.get_legend_handles_labels()
            ax2.legend(handles_1 + handles_2, labels_1 + labels_2, loc="upper right")

            plt.tight_layout()
            plt.show()

            monthly.round(2)
            """
        ),
        markdown_cell(
            """
            ## Layer Behaviour Inside Compost 2

            Compost systems often stratify. Looking at upper, middle, and lower layers separately helps show whether the pile is stable throughout or only active in one zone.
            """
        ),
        code_cell(
            """
            layer_temp_cols = ["lower_temp", "middle_temp", "upper_temp"]
            layer_moisture_cols = ["lower_moisture", "middle_moisture", "upper_moisture"]

            layered = compost_2_pd[["day"] + layer_temp_cols + layer_moisture_cols].copy()
            for column in layer_temp_cols + layer_moisture_cols:
                layered[f"{column}_7d"] = layered[column].rolling(7, min_periods=1).mean()

            fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(18, 6), sharex=True)

            for column in layer_temp_cols:
                ax1.plot(layered["day"], layered[f"{column}_7d"], linewidth=2, label=column.replace("_", " ").title())
            ax1.set_title("Layer temperatures (7d rolling mean)")
            ax1.set_ylabel("Temperature")
            ax1.legend(loc="upper right")

            for column in layer_moisture_cols:
                ax2.plot(layered["day"], layered[f"{column}_7d"], linewidth=2, label=column.replace("_", " ").title())
            ax2.set_title("Layer moisture (7d rolling mean)")
            ax2.set_ylabel("Moisture")
            ax2.legend(loc="upper right")

            plt.tight_layout()
            plt.show()
            """
        ),
        code_cell(
            """
            layer_summary = pd.DataFrame(
                {
                    "avg_temp": compost_2_pd[layer_temp_cols].mean().round(2),
                    "temp_std": compost_2_pd[layer_temp_cols].std().round(2),
                    "avg_moisture": compost_2_pd[layer_moisture_cols].mean().round(2).values,
                    "moisture_std": compost_2_pd[layer_moisture_cols].std().round(2).values,
                },
                index=["Lower layer", "Middle layer", "Upper layer"],
            )

            layer_summary
            """
        ),
        markdown_cell(
            """
            ## Cross-Metric Correlation

            Correlations show which metrics move together. This is especially helpful for spotting whether heating, moisture, and temperature respond as one system or as loosely connected subsystems.
            """
        ),
        code_cell(
            """
            corr_matrix = compost_2_pd[metric_cols].corr()

            plt.figure(figsize=(12, 10))
            sns.heatmap(corr_matrix, annot=True, cmap="coolwarm", center=0, fmt=".2f")
            plt.title("Compost 2 metric correlation map")
            plt.tight_layout()
            plt.show()
            """
        ),
        markdown_cell(
            """
            ## Rolling Shock Detection

            Instead of a full anomaly model, a robust first pass is to compare the current middle temperature with its rolling median. Large residuals highlight abrupt operational changes worth investigating.
            """
        ),
        code_cell(
            """
            compost_2_pd["middle_residual_14d"] = (
                compost_2_pd["middle_temp"] - compost_2_pd["middle_temp"].rolling(14, min_periods=3).median()
            )

            threshold = compost_2_pd["middle_residual_14d"].abs().quantile(0.95)
            shock_events = compost_2_pd.loc[
                compost_2_pd["middle_residual_14d"].abs() >= threshold,
                ["day", "middle_temp", "middle_residual_14d", "heating_w", "outside_temp"],
            ].copy()

            plt.figure(figsize=(14, 6))
            plt.plot(compost_2_pd["day"], compost_2_pd["middle_temp"], color="tab:blue", linewidth=1.5, label="Middle temperature")
            plt.scatter(
                shock_events["day"],
                shock_events["middle_temp"],
                color="tab:red",
                s=60,
                label="Largest rolling residuals",
            )
            plt.title("Compost 2 temperature shocks based on rolling residuals")
            plt.xlabel("Day")
            plt.ylabel("Temperature")
            plt.legend()
            plt.tight_layout()
            plt.show()

            shock_events.sort_values("day")
            """
        ),
        markdown_cell(
            """
            ## Takeaways

            - Compost 2 can be reviewed independently now, without mixing sensor behaviour into the same narrative.
            - The thermal delta and monthly demand views make it easier to judge when heating support is carrying the pile and when the pile is retaining heat on its own.
            - Layer plots show whether instability is localized to one part of the pile or shared across the full compost profile.
            - Rolling residuals highlight abrupt events that deserve a manual check in the raw logs or hardware notes.
            """
        ),
    ]
)


sensor_nb = notebook(
    [
        markdown_cell(
            """
            # Growing Sensor Analysis

            This notebook isolates the growing sensor analysis from the compost analysis and adds:

            - sensor-level uptime and zero-rate profiling,
            - rolling active-sensor tracking,
            - sensor timelines,
            - correlation analysis using active readings only, and
            - a weekly moisture heatmap to spot persistent gaps.
            """
        ),
        code_cell(
            """
            import numpy as np
            import pandas as pd
            import seaborn as sns
            import matplotlib.pyplot as plt

            sns.set_theme(style="whitegrid", context="talk")
            plt.rcParams["figure.figsize"] = (12, 6)
            """
        ),
        code_cell(
            """
            file_path = "../data/combined_compost_measurements.csv"

            df = pd.read_csv(file_path, parse_dates=["Day"])

            sensor_df = (
                df.rename(
                    columns={
                        "Day": "day",
                        "Growing-Sensor 01-Moisture": "Sensor 01",
                        "Growing-Sensor 02-Moisture": "Sensor 02",
                        "Growing-Sensor 03-Moisture": "Sensor 03",
                        "Growing-Sensor 04-Moisture": "Sensor 04",
                        "Growing-Sensor 05-Moisture": "Sensor 05",
                        "Growing-Sensor 06-Moisture": "Sensor 06",
                        "Growing-Sensor 07-Moisture": "Sensor 07",
                        "Growing-Sensor 08-Moisture": "Sensor 08",
                        "Growing-Sensor 09-Moisture": "Sensor 09",
                        "Growing-Sensor 10-Moisture": "Sensor 10",
                        "Growing-Sensor 11-Moisture": "Sensor 11",
                        "Growing-Sensor 12-Moisture": "Sensor 12",
                    }
                )[
                    [
                        "day",
                        "Sensor 01",
                        "Sensor 02",
                        "Sensor 03",
                        "Sensor 04",
                        "Sensor 05",
                        "Sensor 06",
                        "Sensor 07",
                        "Sensor 08",
                        "Sensor 09",
                        "Sensor 10",
                        "Sensor 11",
                        "Sensor 12",
                    ]
                ]
                .sort_values("day")
                .reset_index(drop=True)
            )

            sensor_df
            """
        ),
        markdown_cell(
            """
            ## Reliability Profile

            A zero reading can mean either truly dry soil or a dead/idle sensor. The summary below treats zeros as a reliability signal first, then shows the average moisture only when the sensor is actively reporting above zero.
            """
        ),
        code_cell(
            """
            sensor_pd = sensor_df.copy()
            sensor_cols = [column for column in sensor_pd.columns if column != "day"]

            def longest_zero_streak(series: pd.Series) -> int:
                longest = 0
                current = 0

                for is_zero in series.fillna(0).eq(0):
                    if is_zero:
                        current += 1
                        longest = max(longest, current)
                    else:
                        current = 0

                return longest

            sensor_summary = pd.DataFrame(
                {
                    "zero_share": (sensor_pd[sensor_cols] == 0).mean().round(3),
                    "active_share": (sensor_pd[sensor_cols] > 0).mean().round(3),
                    "mean_when_active": sensor_pd[sensor_cols].replace(0, np.nan).mean().round(2),
                    "longest_zero_streak_days": [longest_zero_streak(sensor_pd[column]) for column in sensor_cols],
                }
            ).sort_values(["zero_share", "longest_zero_streak_days"], ascending=False)

            sensor_summary
            """
        ),
        code_cell(
            """
            plt.figure(figsize=(12, 6))
            sns.barplot(
                data=sensor_summary.reset_index(),
                x="index",
                y="zero_share",
                hue="index",
                palette="crest",
                legend=False,
            )
            plt.xticks(rotation=45, ha="right")
            plt.ylabel("Share of zero readings")
            plt.xlabel("Sensor")
            plt.title("Zero-rate ranking across growing sensors")
            plt.tight_layout()
            plt.show()
            """
        ),
        markdown_cell(
            """
            ## How Many Sensors Are Active At Once?

            This helps distinguish between individual failures and broader downtime events that hit many sensors at the same time.
            """
        ),
        code_cell(
            """
            sensor_pd["active_sensor_count"] = (sensor_pd[sensor_cols] > 0).sum(axis=1)
            sensor_pd["active_sensor_count_7d"] = sensor_pd["active_sensor_count"].rolling(7, min_periods=1).mean()

            fig, ax = plt.subplots(figsize=(14, 6))
            ax.plot(sensor_pd["day"], sensor_pd["active_sensor_count"], color="tab:gray", alpha=0.35, label="Daily active count")
            ax.plot(sensor_pd["day"], sensor_pd["active_sensor_count_7d"], color="tab:green", linewidth=2.5, label="7d rolling active count")
            ax.set_title("Number of growing sensors reporting above zero")
            ax.set_xlabel("Day")
            ax.set_ylabel("Active sensors")
            ax.set_ylim(0, len(sensor_cols) + 0.5)
            ax.legend(loc="upper right")
            plt.tight_layout()
            plt.show()
            """
        ),
        code_cell(
            """
            long_sensor = sensor_pd.melt(
                id_vars="day",
                value_vars=sensor_cols,
                var_name="sensor",
                value_name="moisture",
            )

            sensor_grid = sns.relplot(
                data=long_sensor,
                x="day",
                y="moisture",
                col="sensor",
                col_wrap=4,
                kind="line",
                height=3,
                aspect=1.2,
                facet_kws={"sharey": False},
            )
            sensor_grid.figure.subplots_adjust(top=0.93)
            sensor_grid.figure.suptitle("Per-sensor moisture timelines")
            plt.show()
            """
        ),
        markdown_cell(
            """
            Looking at the individual timelines is useful for spotting partial recoveries. Some sensors can resume normal variation after a shared outage, while others remain flat and likely need a hardware check.
            """
        ),
        code_cell(
            """
            active_only_corr = sensor_pd[sensor_cols].replace(0, np.nan).corr()

            plt.figure(figsize=(12, 10))
            sns.heatmap(active_only_corr, annot=True, cmap="magma", center=0, fmt=".2f")
            plt.title("Sensor correlation using active readings only")
            plt.tight_layout()
            plt.show()
            """
        ),
        code_cell(
            """
            weekly_sensor = long_sensor.copy()
            weekly_sensor["moisture"] = weekly_sensor["moisture"].replace(0, np.nan)
            weekly_sensor["week"] = weekly_sensor["day"].dt.to_period("W").apply(lambda value: value.start_time)

            weekly_heatmap = weekly_sensor.pivot_table(
                index="sensor",
                columns="week",
                values="moisture",
                aggfunc="median",
            )

            plt.figure(figsize=(16, 6))
            sns.heatmap(weekly_heatmap, cmap="YlGnBu", linewidths=0.2, linecolor="white")
            plt.title("Weekly median moisture by sensor")
            plt.xlabel("Week")
            plt.ylabel("Sensor")
            plt.tight_layout()
            plt.show()
            """
        ),
        markdown_cell(
            """
            ## Takeaways

            - The sensor analysis now stands on its own and is easier to review separately from compost temperature behaviour.
            - Zero-rate ranking and longest-streak summaries make hardware issues easier to prioritize.
            - Active-sensor counts expose shared downtime windows that are hard to see from one sensor at a time.
            - The weekly heatmap gives a compact view of where recovery happens and which sensors remain persistently silent.
            """
        ),
    ]
)


def write_notebook(path: Path, contents: dict) -> None:
    path.write_text(json.dumps(contents, indent=1) + "\n", encoding="utf-8")


def main() -> None:
    NOTEBOOKS_DIR.mkdir(parents=True, exist_ok=True)
    write_notebook(NOTEBOOKS_DIR / "analysis_fabian.ipynb", overview_nb)
    write_notebook(NOTEBOOKS_DIR / "analysis_compost_2.ipynb", compost_nb)
    write_notebook(NOTEBOOKS_DIR / "analysis_sensors.ipynb", sensor_nb)


if __name__ == "__main__":
    main()
