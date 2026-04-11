/* ============================================================
   Compost Lab — Expo 2026 · main.js
   ============================================================ */

/* ── Tab navigation ─────────────────────────────────────── */

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
  if (id === 'quizz') {
    renderQuiz();
  }
}

/* ── Chart initialisation ───────────────────────────────── */

var chartsInited = false;

function initCharts() {
  if (chartsInited) return;
  chartsInited = true;

  /* Shared grid line colour */
  var gridColor = 'rgba(140, 190, 80, 0.05)';
  var tickColor = '#4a6630';
  var tickFont  = { size: 11 };

  /* ── Bar chart: Monthly waste input (Moisture indicators) ── */
  new Chart(document.getElementById('barChart'), {
    type: 'bar',
    data: {
      labels: ['May','Jun','Jul','Aug','Sep','Oct'],
      datasets: [{
        label: 'moisture %',
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(122, 191, 58, 0.5)',
        borderColor: '#7abf3a',
        borderWidth: 1,
        borderRadius: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: tickColor,
            font: { size: 10 },
            autoSkip: false,
            maxRotation: 0
          }
        },
        y: {
          grid: { color: gridColor },
          ticks: {
            color: tickColor,
            font: { size: 10 },
            callback: function (v) { return v + '%'; }
          }
        }
      }
    }
  });

  /* ── Line chart: Bin temperature cycle ── */
  new Chart(document.getElementById('tempChart'), {
    type: 'line',
    data: {
      labels: ['D1','D2','D3','D4','D5','D6','D7','D8','D9','D10','D11','D12','D13','D14','D15','D16','D17','D18','D19','D20','D21','D22','D23','D24','D25','D26','D27','D28','D29','D30'],
      datasets: [{
        label: 'Bin 1 — Middle Layer',
        data: [2.4, 3.2, 4.6, 6.9, 9.8, 13.1, 17.1, 21.6, 27.2, 34.9, 45.1, 56.3, 
          59.9, 56.9, 52.0, 45.2, 37.6, 31.1, 27.2, 24.9, 24.3, 24.4, 24.0, 25.5, 30.2, 
          32.9, 35.6, 38.4, 41.6, 45.5],
        borderColor: '#c47a3a',
        backgroundColor: 'rgba(196, 122, 58, 0.08)',
        fill: true,
        tension: 0.3,
        pointRadius: 2,
        pointBackgroundColor: '#c47a3a',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: tickColor, font: { size: 10 } }
        },
        y: {
          min: 0,
          max: 65,
          grid: { color: gridColor },
          ticks: {
            color: tickColor,
            font: { size: 10 },
            callback: function (v) { return v + '°'; }
          }
        }
      }
    }
  });

  /* ── Line chart: Bin 1 Temperature (filtered to 2025-09-16) ── */
  new Chart(document.getElementById('bin1TempChart'), {
    type: 'line',
    data: {
      labels: Array.from({length: 20}, (_, i) => 'D' + (i * 7 + 1)),
      datasets: [
        {
          label: 'Lower Layer',
          data: [0.7, 20.9, 54.3, 25.7, 33.4, 36.0, 22.6, 20.2, 28.2, 25.6, 35.0, 39.9, 
            30.7, 29.1, 19.5, 21.3, 22.6, 20.0, 22.2, 15.8],
          borderColor: '#7abf3a',
          backgroundColor: 'rgba(122, 191, 58, 0.07)',
          fill: true,
          tension: 0.3,
          pointRadius: 2,
          pointBackgroundColor: '#7abf3a',
          borderWidth: 2
        },
        {
          label: 'Middle Layer',
          data: [2.4, 21.6, 52.0, 24.4, 41.6, 37.0, 22.5, 19.2, 22.9, 20.0, 30.3, 34.3, 
            26.9, 26.3, 17.8, 19.8, 20.9, 18.9, 19.6, 14.5],
          borderColor: '#4a9e6a',
          backgroundColor: 'rgba(74, 158, 106, 0.07)',
          fill: true,
          tension: 0.3,
          pointRadius: 2,
          pointBackgroundColor: '#4a9e6a',
          borderWidth: 2
        },
        {
          label: 'Upper Layer',
          data: [2.7, 19.3, 37.7, 21.1, 43.2, 30.9, 22.2, 17.4, 22.3, 19.2, 29.7, 33.9, 
            26.8, 26.1, 17.7, 19.7, 20.9, 18.8, 19.4, 14.3],
          borderColor: '#c47a3a',
          backgroundColor: 'rgba(196, 122, 58, 0.05)',
          fill: true,
          tension: 0.3,
          pointRadius: 2,
          pointBackgroundColor: '#c47a3a',
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
          grid: { color: gridColor },
          ticks: { color: tickColor, font: { size: 9 } }
        },
        y: {
          min: 0,
          max: 65,
          grid: { color: gridColor },
          ticks: {
            color: tickColor,
            font: { size: 10 },
            callback: function (v) { return v + '°C'; }
          }
        }
      }
    }
  });

  /* ── Line chart: Bin 1 Moisture (filtered to 2025-09-16) ── */
  new Chart(document.getElementById('bin1MoistChart'), {
    type: 'line',
    data: {
      labels: Array.from({length: 20}, (_, i) => 'D' + (i * 7 + 1)),
      datasets: [
        {
          label: 'Lower Layer',
          data: [17.9, 20.9, 37.1, 42.9, 22.5, 16.7, 19.7, 37.8, 65.9, 66.5, 99.8, 100.0, 97.3, 100.0, 86.9, 81.9, 
            83.7, 81.8, 82.2, 70.2],
          borderColor: '#7abf3a',
          backgroundColor: 'rgba(122, 191, 58, 0.07)',
          fill: true,
          tension: 0.3,
          pointRadius: 2,
          pointBackgroundColor: '#7abf3a',
          borderWidth: 2
        },
        {
          label: 'Middle Layer',
          data: [16.5, 21.6, 44.7, 20.2, 13.8, 18.5, 5.9, 8.5, 2.5, 0.2, 2.8, 3.3, 
            2.7, 1.1, 0.0, 0.0, 3.0, 0.1, 0.0, 0.0],
          borderColor: '#4a9e6a',
          backgroundColor: 'rgba(74, 158, 106, 0.07)',
          fill: true,
          tension: 0.3,
          pointRadius: 2,
          pointBackgroundColor: '#4a9e6a',
          borderWidth: 2
        },
        {
          label: 'Upper Layer',
          data: [0.0, 0.0, 0.0, 0.0, 9.0, 8.5, 8.0, 5.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
          borderColor: '#c47a3a',
          backgroundColor: 'rgba(196, 122, 58, 0.05)',
          fill: true,
          tension: 0.3,
          pointRadius: 2,
          pointBackgroundColor: '#c47a3a',
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
          grid: { color: gridColor },
          ticks: { color: tickColor, font: { size: 9 } }
        },
        y: {
          min: 0,
          max: 110,
          grid: { color: gridColor },
          ticks: {
            color: tickColor,
            font: { size: 10 },
            callback: function (v) { return v + '%'; }
          }
        }
      }
    }
  });

  /* ── Line chart: Bin 2 Temperature (filtered to 2025-09-16) ── */
  new Chart(document.getElementById('bin2TempChart'), {
    type: 'line',
    data: {
      labels: Array.from({length: 20}, (_, i) => 'D' + (i * 7 + 1)),
      datasets: [
        {
          label: 'Lower Layer',
          data: [1.5, 21.8, 59.9, 39.4, 20.8, 18.2, 23.2, 21.4, 30.7, 21.5, 34.6, 40.6, 
            34.3, 33.8, 20.7, 14.8, 11.3, 12.2, 16.6, 14.1],
          borderColor: '#7abf3a',
          backgroundColor: 'rgba(122, 191, 58, 0.07)',
          fill: true,
          tension: 0.3,
          pointRadius: 2,
          pointBackgroundColor: '#7abf3a',
          borderWidth: 2
        },
        {
          label: 'Middle Layer',
          data: [6.4, 32.1, 60.4, 36.9, 25.6, 20.9, 27.5, 24.4, 31.9, 21.8, 33.7, 39.5, 
            33.7, 31.3, 18.7, 13.6, 11.3, 13.0, 16.2, 13.7],
          borderColor: '#4a9e6a',
          backgroundColor: 'rgba(74, 158, 106, 0.07)',
          fill: true,
          tension: 0.3,
          pointRadius: 2,
          pointBackgroundColor: '#4a9e6a',
          borderWidth: 2
        },
        {
          label: 'Upper Layer',
          data: [4.3, 27.6, 47.7, 28.8, 40.1, 21.1, 46.0, 32.7, 28.7, 19.4, 29.6, 33.7, 
            29.5, 29.0, 17.8, 12.9, 11.2, 13.5, 15.4, 13.0],
          borderColor: '#c47a3a',
          backgroundColor: 'rgba(196, 122, 58, 0.05)',
          fill: true,
          tension: 0.3,
          pointRadius: 2,
          pointBackgroundColor: '#c47a3a',
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
          grid: { color: gridColor },
          ticks: { color: tickColor, font: { size: 9 } }
        },
        y: {
          min: 0,
          max: 65,
          grid: { color: gridColor },
          ticks: {
            color: tickColor,
            font: { size: 10 },
            callback: function (v) { return v + '°C'; }
          }
        }
      }
    }
  });

  /* ── Line chart: Bin 2 Moisture (filtered to 2025-09-16) ── */
  new Chart(document.getElementById('bin2MoistChart'), {
    type: 'line',
    data: {
      labels: Array.from({length: 20}, (_, i) => 'D' + (i * 7 + 1)),
      datasets: [
        {
          label: 'Lower Layer',
          data: [61.8, 86.7, 100.0, 100.0, 6.5, 9.7, 7.8, 21.2, 42.2, 37.1, 52.9, 100.0, 
            100.0, 100.0, 100.0, 94.9, 90.6, 90.3, 91.3, 87.6],
          borderColor: '#7abf3a',
          backgroundColor: 'rgba(122, 191, 58, 0.07)',
          fill: true,
          tension: 0.3,
          pointRadius: 2,
          pointBackgroundColor: '#7abf3a',
          borderWidth: 2
        },
        {
          label: 'Middle Layer',
          data: [3.4, 11.4, 22.8, 22.2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 29.4, 28.8, 
            8.7, 0.3, 8.8, 4.3, 3.9, 4.2, 10.9, 10.7],
          borderColor: '#4a9e6a',
          backgroundColor: 'rgba(74, 158, 106, 0.07)',
          fill: true,
          tension: 0.3,
          pointRadius: 2,
          pointBackgroundColor: '#4a9e6a',
          borderWidth: 2
        },
        {
          label: 'Upper Layer',
          data: [0.0, 0.0, 0.0, 0.0, 17.9, 16.7, 22.3, 39.8, 23.1, 21.1, 21.3, 23.8, 4.8, 
            5.4, 3.6, 2.9, 3.1, 4.0, 4.9, 4.9],
          borderColor: '#c47a3a',
          backgroundColor: 'rgba(196, 122, 58, 0.05)',
          fill: true,
          tension: 0.3,
          pointRadius: 2,
          pointBackgroundColor: '#c47a3a',
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
          grid: { color: gridColor },
          ticks: { color: tickColor, font: { size: 9 } }
        },
        y: {
          min: 0,
          max: 110,
          grid: { color: gridColor },
          ticks: {
            color: tickColor,
            font: { size: 10 },
            callback: function (v) { return v + '%'; }
          }
        }
      }
    }
  });
}

/*Quiz functionality*/

var quizQuestions = [
  {
    q: "Question 01",
    opts: ["Answer 01", "Answer 02", "Answer 03", "Answer 04"],
    ans: 1,
    why: "Explanation of the correct answer"
  },
  {
    q: "Question 02",
    opts: ["Answer 01", "Answer 02", "Answer 03", "Answer 04"],
    ans: 2,
    why: "Explanation of the correct answer "
  },
  {
    q: "Question 03",
    opts: ["Answer 01", "Answer 02", "Answer 03", "Answer 04"],
    ans: 2,
    why: "Explanation of the correct answer"
  },
  {
    q: "Question 04",
    opts: ["Answer 01", "Answer 02", "Answer 03", "Answer 04"],
    ans: 2,
    why: "Explanation of the correct answer"
  },
  {
    q: "Question 05",
    opts: ["Answer 01", "Answer 02", "Answer 03", "Answer 04"],
    ans: 2,
    why: "Explanation of the correct answer"
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
