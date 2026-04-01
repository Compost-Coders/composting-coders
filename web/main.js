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

  /* ── Line chart: Decomposition rate ── */
  new Chart(document.getElementById('lineChart'), {
    type: 'line',
    data: {
      labels: ['Wk 1','Wk 2','Wk 3','Wk 4','Wk 5','Wk 6','Wk 7','Wk 8'],
      datasets: [
        {
          label: 'Site A',
          data: [52, 47, 43, 39, 36, 34, 33, 32],
          borderColor: '#7abf3a',
          backgroundColor: 'rgba(122, 191, 58, 0.07)',
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: '#7abf3a',
          borderWidth: 2
        },
        {
          label: 'Site B',
          data: [55, 50, 46, 43, 40, 37, 35, 34],
          borderColor: '#4a9e6a',
          backgroundColor: 'rgba(74, 158, 106, 0.05)',
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: '#4a9e6a',
          borderWidth: 2
        },
        {
          label: 'Site C',
          data: [58, 55, 51, 48, 46, 44, 42, 41],
          borderColor: '#c47a3a',
          backgroundColor: 'rgba(196, 122, 58, 0.05)',
          fill: true,
          tension: 0.4,
          pointRadius: 3,
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
          ticks: { color: tickColor, font: tickFont }
        },
        y: {
          min: 25,
          max: 65,
          grid: { color: gridColor },
          ticks: {
            color: tickColor,
            font: tickFont,
            callback: function (v) { return v + 'd'; }
          }
        }
      }
    }
  });

  /* ── Donut chart: Feedstock composition ── */
  new Chart(document.getElementById('donutChart'), {
    type: 'doughnut',
    data: {
      labels: ['Food waste', 'Garden', 'Paper', 'Other'],
      datasets: [{
        data: [48, 31, 13, 8],
        backgroundColor: ['#7abf3a', '#4a9e6a', '#2d6e4a', '#1a3d2a'],
        borderWidth: 0,
        hoverOffset: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: { legend: { display: false } }
    }
  });

  /* ── Bar chart: Monthly waste input ── */
  new Chart(document.getElementById('barChart'), {
    type: 'bar',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      datasets: [{
        label: 'kg input',
        data: [310, 280, 420, 510, 600, 740, 820, 790, 680, 520, 390, 280],
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
            callback: function (v) { return v + 'kg'; }
          }
        }
      }
    }
  });

  /* ── Line chart: Bin temperature cycle ── */
  new Chart(document.getElementById('tempChart'), {
    type: 'line',
    data: {
      labels: ['D1','D3','D5','D7','D9','D11','D13','D15','D17','D19','D21'],
      datasets: [{
        label: '°C',
        data: [22, 38, 55, 62, 65, 63, 58, 50, 42, 35, 28],
        borderColor: '#c47a3a',
        backgroundColor: 'rgba(196, 122, 58, 0.08)',
        fill: true,
        tension: 0.4,
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
          min: 10,
          max: 75,
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
}

/* ── Boot ───────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', function () {
  initCharts();
});
