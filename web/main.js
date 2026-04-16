/* ============================================================
   Compost Lab - Expo 2026 - main.js
   ============================================================ */

var chartsInited = false;
var chartDataPromise = null;

function showTab(id, el) {
  document.querySelectorAll(".section").forEach(function (section) {
    section.classList.remove("active");
  });

  document.querySelectorAll(".nav-tab").forEach(function (tab) {
    tab.classList.remove("active");
  });

  document.getElementById("sec-" + id).classList.add("active");
  el.classList.add("active");

  if (id === "home") {
    initCharts();
  }
}

function loadChartRows() {
  if (!chartDataPromise) {
    chartDataPromise = fetch("data/dataset1_chart_data.json").then(function (response) {
      if (!response.ok) {
        throw new Error("Could not load dataset1_chart_data.json");
      }
      return response.json();
    });
  }

  return chartDataPromise;
}

function formatDateLabel(dateString) {
  var date = new Date(dateString);
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

function formatMonthRange(startDate, endDate) {
  var start = new Date(startDate).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  var end = new Date(endDate).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  return start === end ? start : start + " to " + end;
}

function maxValue(rows, key) {
  return Math.max.apply(null, rows.map(function (row) { return row[key] ?? Number.NEGATIVE_INFINITY; }));
}

function minValue(rows, key) {
  return Math.min.apply(null, rows.map(function (row) { return row[key] ?? Number.POSITIVE_INFINITY; }));
}

function avgValue(rows, key) {
  var values = rows
    .map(function (row) { return row[key]; })
    .filter(function (value) { return typeof value === "number"; });

  if (!values.length) return 0;

  return values.reduce(function (sum, value) { return sum + value; }, 0) / values.length;
}

function updateSummary(rows) {
  var peakC1 = maxValue(rows, "Compost 1-Middle-Temperature");
  var peakC2 = maxValue(rows, "Compost 2-Middle-Temperature");
  var outsideMin = minValue(rows, "Outside-Outside-Temperature");
  var outsideMax = maxValue(rows, "Outside-Outside-Temperature");
  var lowerMoistureC1 = maxValue(rows, "Compost 1-Lower-Moisture");
  var lowerMoistureC2 = maxValue(rows, "Compost 2-Lower-Moisture");
  var avgHeatC1 = avgValue(rows, "Compost 1-Inside-Heating - w");
  var avgHeatC2 = avgValue(rows, "Compost 2-Inside-Heating - w");

  document.getElementById("stat-days").textContent = String(rows.length);
  document.getElementById("stat-range").textContent = formatMonthRange(rows[0].Day, rows[rows.length - 1].Day);
  document.getElementById("stat-peak").textContent = peakC2.toFixed(1) + " C";
  document.getElementById("stat-peak-unit").textContent = "C2 middle maximum";
  document.getElementById("stat-peak-detail").textContent = "C1 middle also reached " + peakC1.toFixed(1) + " C";

  document.getElementById("finding-temp").textContent =
    "In the exported notebook rows, the middle layer peaked at " + peakC1.toFixed(1) +
    " C in Composter 1 and " + peakC2.toFixed(1) + " C in Composter 2.";

  document.getElementById("finding-moisture").textContent =
    "The lower layer reached " + lowerMoistureC1.toFixed(0) + "% in Composter 1 and " +
    lowerMoistureC2.toFixed(0) + "% in Composter 2, while upper layers stayed much drier.";

  document.getElementById("finding-heating").textContent =
    "In this filtered May to July window, average heating stayed at " +
    avgHeatC1.toFixed(1) + " W for C1 and " + avgHeatC2.toFixed(1) + " W for C2.";

  document.getElementById("finding-outside").textContent =
    "Within the exported notebook slice, outside temperatures ranged from " +
    outsideMin.toFixed(1) + " C to " + outsideMax.toFixed(1) +
    " C while compost temperatures climbed much higher.";
}

function createLineChart(canvasId, labels, datasets, yMin, yMax, suffix) {
  var gridColor = "rgba(140, 190, 80, 0.08)";
  var tickColor = "#5e7a3f";

  return new Chart(document.getElementById(canvasId), {
    type: "line",
    data: {
      labels: labels,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: tickColor, font: { size: 10 }, maxTicksLimit: 8 }
        },
        y: {
          min: yMin,
          max: yMax,
          grid: { color: gridColor },
          ticks: {
            color: tickColor,
            font: { size: 10 },
            callback: function (value) { return value + suffix; }
          }
        }
      }
    }
  });
}

function initCharts() {
  if (chartsInited) return;

  loadChartRows()
    .then(function (rows) {
      chartsInited = true;
      updateSummary(rows);

      var labels = rows.map(function (row) { return formatDateLabel(row.Day); });

      createLineChart(
        "lineChart",
        labels,
        [
          {
            label: "Upper layer",
            data: rows.map(function (row) { return row["Compost 1-Upper-Temperature"]; }),
            borderColor: "#a8d05a",
            backgroundColor: "rgba(168, 208, 90, 0.08)",
            tension: 0.35,
            fill: false,
            pointRadius: 0,
            borderWidth: 2
          },
          {
            label: "Middle layer",
            data: rows.map(function (row) { return row["Compost 1-Middle-Temperature"]; }),
            borderColor: "#7abf3a",
            backgroundColor: "rgba(122, 191, 58, 0.10)",
            tension: 0.35,
            fill: false,
            pointRadius: 0,
            borderWidth: 2
          },
          {
            label: "Lower layer",
            data: rows.map(function (row) { return row["Compost 1-Lower-Temperature"]; }),
            borderColor: "#4a9e6a",
            backgroundColor: "rgba(74, 158, 106, 0.08)",
            tension: 0.35,
            fill: false,
            pointRadius: 0,
            borderWidth: 2
          },
          {
            label: "Outside air",
            data: rows.map(function (row) { return row["Outside-Outside-Temperature"]; }),
            borderColor: "#c47a3a",
            backgroundColor: "rgba(196, 122, 58, 0.08)",
            tension: 0.35,
            fill: false,
            pointRadius: 0,
            borderWidth: 2,
            borderDash: [5, 5]
          }
        ],
        0,
        65,
        " C"
      );

      createLineChart(
        "comparisonChart",
        labels,
        [
          {
            label: "C1 middle",
            data: rows.map(function (row) { return row["Compost 1-Middle-Temperature"]; }),
            borderColor: "#7abf3a",
            backgroundColor: "rgba(122, 191, 58, 0.10)",
            tension: 0.35,
            fill: false,
            pointRadius: 0,
            borderWidth: 2
          },
          {
            label: "C2 middle",
            data: rows.map(function (row) { return row["Compost 2-Middle-Temperature"]; }),
            borderColor: "#d8e86e",
            backgroundColor: "rgba(216, 232, 110, 0.08)",
            tension: 0.35,
            fill: false,
            pointRadius: 0,
            borderWidth: 2
          }
        ],
        0,
        65,
        " C"
      );

      new Chart(document.getElementById("moistureChart"), {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "C1 lower moisture",
              data: rows.map(function (row) { return row["Compost 1-Lower-Moisture"]; }),
              borderColor: "#7abf3a",
              backgroundColor: "rgba(122, 191, 58, 0.08)",
              tension: 0.35,
              fill: false,
              pointRadius: 0,
              borderWidth: 2
            },
            {
              label: "C2 lower moisture",
              data: rows.map(function (row) { return row["Compost 2-Lower-Moisture"]; }),
              borderColor: "#4a9e6a",
              backgroundColor: "rgba(74, 158, 106, 0.08)",
              tension: 0.35,
              fill: false,
              pointRadius: 0,
              borderWidth: 2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: "#5e7a3f", font: { size: 10 }, maxTicksLimit: 8 }
            },
            y: {
              min: 0,
              max: 100,
              grid: { color: "rgba(140, 190, 80, 0.08)" },
              ticks: {
                color: "#5e7a3f",
                font: { size: 10 },
                callback: function (value) { return value + "%"; }
              }
            }
          }
        }
      });

      createLineChart(
        "outsideChart",
        labels,
        [
          {
            label: "C1 heating",
            data: rows.map(function (row) { return row["Compost 1-Inside-Heating - w"]; }),
            borderColor: "#c47a3a",
            backgroundColor: "rgba(196, 122, 58, 0.08)",
            tension: 0.35,
            fill: false,
            pointRadius: 0,
            borderWidth: 2
          },
          {
            label: "C2 heating",
            data: rows.map(function (row) { return row["Compost 2-Inside-Heating - w"]; }),
            borderColor: "#7abf3a",
            backgroundColor: "rgba(122, 191, 58, 0.10)",
            tension: 0.35,
            fill: false,
            pointRadius: 0,
            borderWidth: 2
          }
        ],
        0,
        5,
        " W"
      );
    })
    .catch(function (error) {
      console.error(error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  initCharts();
});
