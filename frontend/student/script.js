let attChart, suspChart;

const user = JSON.parse(localStorage.getItem('user') || 'null');
if (!user) window.location.href = '../index.html';

const userName = user?.user_metadata?.full_name || user?.email || 'Student';
const studentId = user?.email || '';

document.getElementById('welcomeText').textContent = userName;
document.getElementById('welcomeName').textContent = `Welcome, ${userName}!`;

function logout() {
  localStorage.clear();
  window.location.href = '../index.html';
}

function initCharts() {
  const opts = (color) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: '#555', font: { size: 10 } }, grid: { color: '#1e1e2e' } },
      y: { min: 0, max: 100, ticks: { color: '#555' }, grid: { color: '#1e1e2e' } }
    }
  });

  attChart = new Chart(document.getElementById('attChart'), {
    type: 'line',
    data: { labels: [], datasets: [{ data: [], borderColor: '#4ade80', backgroundColor: '#4ade8011', tension: 0.4, fill: true, pointRadius: 3 }] },
    options: opts('#4ade80')
  });

  suspChart = new Chart(document.getElementById('suspChart'), {
    type: 'line',
    data: { labels: [], datasets: [{ data: [], borderColor: '#f87171', backgroundColor: '#f8717111', tension: 0.4, fill: true, pointRadius: 3 }] },
    options: opts('#f87171')
  });
}

function getScoreColor(score, isAttention) {
  if (isAttention) return score >= 70 ? 'green' : score >= 40 ? 'amber' : 'red';
  return score < 30 ? 'green' : score < 60 ? 'amber' : 'red';
}

function generateTips(logs) {
  const tips = [];
  const phoneCount   = logs.filter(l => l.phone_detected).length;
  const talkingCount = logs.filter(l => l.talking).length;
  const eyesCount    = logs.filter(l => l.eyes_closed).length;
  const awayCount    = logs.filter(l => !l.looking_forward).length;

  if (phoneCount > 0)   tips.push(`<span>📱</span> Phone detected ${phoneCount} times — keep it away`);
  if (talkingCount > 0) tips.push(`<span>🤫</span> Talking detected ${talkingCount} times — stay silent`);
  if (eyesCount > 0)    tips.push(`<span>👁️</span> Eyes closed ${eyesCount} times — stay awake`);
  if (awayCount > 0)    tips.push(`<span>👀</span> Looking away ${awayCount} times — face the camera`);
  if (tips.length === 0) tips.push(`<span>✅</span> Great job! Keep maintaining focus`);
  return tips;
}

async function loadData() {
  try {
    const res  = await fetch(`${API}/logs/${encodeURIComponent(studentId)}`);
    const data = await res.json();
    const logs = data.logs || [];

    if (logs.length === 0) {
      document.getElementById('myLogsBody').innerHTML =
        '<tr><td colspan="7" style="text-align:center;color:#666;padding:24px;">No monitoring data yet. Start a session!</td></tr>';
      return;
    }

    document.getElementById('totalSessions').textContent = logs.length;
    const avgAtt  = Math.round(logs.reduce((s, l) => s + l.attention_score, 0) / logs.length);
    const avgSusp = Math.round(logs.reduce((s, l) => s + l.suspicious_score, 0) / logs.length);
    const alerts  = logs.filter(l => l.suspicious_score >= 50).length;
    document.getElementById('avgAttention').textContent  = avgAtt;
    document.getElementById('avgSuspicious').textContent = avgSusp;
    document.getElementById('myAlerts').textContent      = alerts;

    const statusEl = document.getElementById('overallStatus');
    if (avgSusp >= 50) {
      statusEl.textContent = '⚠ Under Review';
      statusEl.className   = 'status-badge danger';
    } else if (avgSusp >= 30) {
      statusEl.textContent = '⚡ Needs Attention';
      statusEl.className   = 'status-badge warning';
    } else {
      statusEl.textContent = '✓ Good Standing';
      statusEl.className   = 'status-badge good';
    }

    const latest = logs[0];
    const latAttEl  = document.getElementById('latestAttention');
    const latSuspEl = document.getElementById('latestSuspicious');
    latAttEl.textContent  = latest.attention_score;
    latSuspEl.textContent = latest.suspicious_score;
    latAttEl.className    = `score-circle ${getScoreColor(latest.attention_score, true)}`;
    latSuspEl.className   = `score-circle ${getScoreColor(latest.suspicious_score, false)}`;

    document.getElementById('tipList').innerHTML =
      generateTips(logs).map(t => `<li>${t}</li>`).join('');

    const recent = [...logs].reverse().slice(0, 20);
    const labels  = recent.map(l =>
      new Date(l.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
    attChart.data.labels = labels;
    attChart.data.datasets[0].data = recent.map(l => l.attention_score);
    attChart.update();
    suspChart.data.labels = labels;
    suspChart.data.datasets[0].data = recent.map(l => l.suspicious_score);
    suspChart.update();

    document.getElementById('myLogsBody').innerHTML = logs.slice(0, 50).map(l => `
      <tr>
        <td>${new Date(l.created_at).toLocaleString()}</td>
        <td><span class="badge ${l.attention_score >= 70 ? 'success' : l.attention_score >= 40 ? 'warning' : 'danger'}">${l.attention_score}</span></td>
        <td><span class="badge ${l.suspicious_score >= 50 ? 'danger' : 'success'}">${l.suspicious_score}</span></td>
        <td>${l.phone_detected ? '📱 Yes' : '✓ No'}</td>
        <td>${l.talking ? 'Yes' : 'No'}</td>
        <td>${l.eyes_closed ? 'Closed' : 'Open'}</td>
        <td>${l.looking_forward ? 'Forward' : 'Away'}</td>
      </tr>`).join('');

  } catch(e) {
    console.error(e);
  }
}

initCharts();
loadData();
setInterval(loadData, 10000);