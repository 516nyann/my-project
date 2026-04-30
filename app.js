const clockEl = document.getElementById('clock');
const alarmInput = document.getElementById('alarm-time');
const setBtn = document.getElementById('set-btn');
const cancelBtn = document.getElementById('cancel-btn');
const statusEl = document.getElementById('status');

let alarmTime = null;
let audioCtx = null;
let ringingInterval = null;

function pad(n) {
  return String(n).padStart(2, '0');
}

function getNow() {
  const d = new Date();
  return {
    h: d.getHours(),
    m: d.getMinutes(),
    s: d.getSeconds(),
    hm: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  };
}

function updateClock() {
  const { h, m, s } = getNow();
  clockEl.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function beep() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = 'sine';
  osc.frequency.value = 880;
  gain.gain.setValueAtTime(0.6, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.6);
}

function startRinging() {
  statusEl.textContent = '🔔 アラーム鳴動中！タップして止める';
  statusEl.className = 'status ringing';
  beep();
  ringingInterval = setInterval(beep, 1200);

  document.addEventListener('click', stopAlarm, { once: true });
}

function stopAlarm() {
  if (ringingInterval) {
    clearInterval(ringingInterval);
    ringingInterval = null;
  }
  alarmTime = null;
  cancelBtn.disabled = true;
  setBtn.disabled = false;
  statusEl.textContent = 'アラームが設定されていません';
  statusEl.className = 'status';
}

function checkAlarm() {
  if (!alarmTime) return;
  const { hm } = getNow();
  if (hm === alarmTime && new Date().getSeconds() === 0) {
    startRinging();
  }
}

setBtn.addEventListener('click', () => {
  const val = alarmInput.value;
  if (!val) {
    statusEl.textContent = '時刻を選んでください';
    statusEl.className = 'status';
    return;
  }
  alarmTime = val;
  setBtn.disabled = true;
  cancelBtn.disabled = false;
  statusEl.textContent = `✅ ${val} にアラームをセット`;
  statusEl.className = 'status active';
});

cancelBtn.addEventListener('click', stopAlarm);

setInterval(updateClock, 1000);
setInterval(checkAlarm, 1000);
updateClock();
