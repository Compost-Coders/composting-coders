/* ============================================================
   Compost Lab - Expo 2026 - main.js
   ============================================================ */

var chartsInited = false;
var chartDataPromise = null;

function showTab(id, el) {
  document.querySelectorAll('.section').forEach(function (s) {
    s.classList.remove('active');
  });
  document.querySelectorAll('.nav-tab').forEach(function (t) {
    t.classList.remove('active');
  });
  document.getElementById('sec-' + id).classList.add('active');
  el.classList.add('active');
  if (id === 'home') {
    initCharts();
  }
  if (id === 'quiz') {
    renderQuiz();
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
  var peakC1 = maxValue(rows, "C1_Mid_T");
  var peakC2 = maxValue(rows, "C2_Mid_T");
  var outsideMin = minValue(rows, "Out_T");
  var outsideMax = maxValue(rows, "Out_T");
  var lowerMoistureC1 = maxValue(rows, "C1_Low_M");
  var lowerMoistureC2 = maxValue(rows, "C2_Low_M");
  var avgHeatC1 = avgValue(rows, "C1_Inside_Heating");
  var avgHeatC2 = avgValue(rows, "C2_Inside_Heating");

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
            data: rows.map(function (row) { return row["C1_Upper_T"]; }),
            borderColor: "#a8d05a",
            backgroundColor: "rgba(168, 208, 90, 0.08)",
            tension: 0.35,
            fill: false,
            pointRadius: 0,
            borderWidth: 2
          },
          {
            label: "Middle layer",
            data: rows.map(function (row) { return row["C1_Mid_T"]; }),
            borderColor: "#7abf3a",
            backgroundColor: "rgba(122, 191, 58, 0.10)",
            tension: 0.35,
            fill: false,
            pointRadius: 0,
            borderWidth: 2
          },
          {
            label: "Lower layer",
            data: rows.map(function (row) { return row["C1_Low_T"]; }),
            borderColor: "#4a9e6a",
            backgroundColor: "rgba(74, 158, 106, 0.08)",
            tension: 0.35,
            fill: false,
            pointRadius: 0,
            borderWidth: 2
          },
          {
            label: "Outside air",
            data: rows.map(function (row) { return row["Out_T"]; }),
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
            data: rows.map(function (row) { return row["C1_Mid_T"]; }),
            borderColor: "#7abf3a",
            backgroundColor: "rgba(122, 191, 58, 0.10)",
            tension: 0.35,
            fill: false,
            pointRadius: 0,
            borderWidth: 2
          },
          {
            label: "C2 middle",
            data: rows.map(function (row) { return row["C2_Mid_T"]; }),
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
              data: rows.map(function (row) { return row["C1_Low_M"]; }),
              borderColor: "#7abf3a",
              backgroundColor: "rgba(122, 191, 58, 0.08)",
              tension: 0.35,
              fill: false,
              pointRadius: 0,
              borderWidth: 2
            },
            {
              label: "C2 lower moisture",
              data: rows.map(function (row) { return row["C2_Low_M"]; }),
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
            data: rows.map(function (row) { return row["C1_Inside_heat_w"]; }),
            borderColor: "#c47a3a",
            backgroundColor: "rgba(196, 122, 58, 0.08)",
            tension: 0.35,
            fill: false,
            pointRadius: 0,
            borderWidth: 2
          },
          {
            label: "C2 heating",
            data: rows.map(function (row) { return row["C2_Inside_heat_w"]; }),
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

/*Quiz functionality*/

var quizQuestions = [
  {
    q: "Question 01 : How moist should compost ideally be?",
    opts: ["Completely dry", "Waterlogged", "Like a wrung‑out sponge", "Covered in standing water"],
    ans: 2,
    why: "Compost should be moist enough to support microorganisms, which need water to break down organic material—but not so wet that air is pushed out. A wrung‑out sponge has just the right balance: damp to the touch, but not dripping."
  },
  {
    q: "Question 02 : Which material is most important for preventing smells in compost?",
    opts: ["Brown, carbon rich materials (e.g., leaves, paper, fiber hemp)", "Food scraps", "Grass clippings", "Water"],
    ans: 0,
    why: "Most compost problems come from lack of browns, not too many food scraps."
  },
  {
    q: "Why does turning compost speed up the composting process in the first place?",
    opts: ["It scares away pests", "It adds oxygen for aerobic microbes", "It mixes food scraps evenly", "It redistributes moisture"],
    ans: 1,
    why: "All of them help somehow, but home composting is essentially an aerobic microbial activity, so it needs oxygen for the process."
  },
  {
    q: "What is the strictest country in the world for household composting?",
    opts: ["India", "Japan", "Finland", "USA"],
    ans: 1,
    why: "In Japan home composting of food waste is not permitted unless you use a registered bin. Open compost heaps are generally prohibited. Animal products, cooked food, and mixed waste are forbidden. Compost outputs may not be used freely as fertilizer without compliance with fertilizer laws. Using compost incorrectly (odors, pests, mis-sorting) can lead to fines or confiscation"
  },
  {
    q: "Which EU country allows home composting of meat & fish waste?",
    opts: ["Sweden", "Italy", "Germany", "Finland"],
    ans: 3,
    why: "Finland is the only EU country where composting meat and fish at home is explicitly legal and nationally supported. But one must use a closed, pest‑proof composter, an insulated composter is required in winter."
  }
];

var quizCurrent = 0;
var quizScore = 0;
var quizAnswered = false;

function renderQuiz() {
  var app = document.getElementById('quiz-app');
  document.getElementById('quiz-prog').style.width = Math.round((quizCurrent / quizQuestions.length) * 100) + '%';

  if (quizCurrent >= quizQuestions.length) {
    var msg = quizScore <= 2 ? "Keep learning — every expert starts somewhere!" :
              quizScore === 3 ? "Good work! You know your composting basics." :
              quizScore === 4 ? "Great job! Almost a compost pro." :
              "Perfect score! You're a Compost Champion!";
    app.innerHTML = '<div class="score"><div class="num">' + quizScore + ' / ' + quizQuestions.length + '</div><div class="msg">' + msg + '</div><button class="restart" onclick="restartQuiz()">Try again</button></div>';
    document.getElementById('quiz-prog').style.width = '100%';
    return;
  }

  var q = quizQuestions[quizCurrent];
  var optsHtml = '';
  for (var i = 0; i < q.opts.length; i++) {
    optsHtml += '<button class="opt" id="qo' + i + '" onclick="pickQuiz(' + i + ')">' + q.opts[i] + '</button>';
  }

  app.innerHTML = '<h2>Question ' + (quizCurrent + 1) + ' of ' + quizQuestions.length + '</h2><h3>' + q.q + '</h3>' + optsHtml + '<div id="qfb"></div><div id="qnav"></div>';
  quizAnswered = false;
}

function pickQuiz(i) {
  if (quizAnswered) return;
  quizAnswered = true;
  var q = quizQuestions[quizCurrent];
  for (var j = 0; j < q.opts.length; j++) {
    document.getElementById('qo' + j).disabled = true;
  }
  document.getElementById('qo' + q.ans).className = 'opt correct';
  var fb = document.getElementById('qfb');
  if (i === q.ans) {
    quizScore++;
    fb.innerHTML = '<div class="feedback correct"><strong>Correct!</strong> ' + q.why + '</div>';
  } else {
    document.getElementById('qo' + i).className = 'opt wrong';
    fb.innerHTML = '<div class="feedback wrong"><strong>Not quite.</strong> ' + q.why + '</div>';
  }
  var label = quizCurrent < quizQuestions.length - 1 ? 'Next question →' : 'See my score →';
  document.getElementById('qnav').innerHTML = '<button class="next" onclick="nextQuiz()">' + label + '</button>';
}

function nextQuiz() { quizCurrent++; renderQuiz(); }
function restartQuiz() { quizCurrent = 0; quizScore = 0; renderQuiz(); }

/*Boot*/

document.addEventListener('DOMContentLoaded', function () {
  initCharts();
  renderQuiz();
});

