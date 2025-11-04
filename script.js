document.addEventListener("DOMContentLoaded", () => {
  const servoGrid = document.querySelector(".servo-grid");
  const logsList = document.querySelector(".logs-list");
  const watchdogValue = document.getElementById("watchdog-value");
  const watchdogProgress = document.getElementById("watchdog-progress");
  const watchdogStatus = document.getElementById("watchdog-status");
  const watchdogStatusContainer = document.querySelector(".timer-status");

  const startBtn = document.getElementById("start-btn");
  const pauseBtn = document.getElementById("pause-btn");
  const estopBtn = document.getElementById("estop-btn");

  const servos = [
    { name: "SERVO 6", angle: 90, max: 180 },
    { name: "SERVO 5", angle: 45, max: 180 },
    { name: "SERVO 4", angle: 120, max: 180 },
    { name: "SERVO 3", angle: 90, max: 180 },
    { name: "SERVO 2", angle: 0, max: 180 },
    { name: "SERVO 1", angle: 50, max: 100 },
  ];

  // --- Initialize UI --- //

  async function updateDashboard() {
    try {
      const res = await fetch("/api/data");
      const data = await res.json();
      if (!data) return;
      for (const [id, val] of Object.entries(data)) {
        const angleEl = document.getElementById(`angle-${id}`);
        const barEl = document.getElementById(`bar-${id}`);
        if (angleEl && barEl) {
          angleEl.textContent = val;
          const pct = id === "gripper" ? val : (val / 180) * 100;
          barEl.style.width = pct + "%";
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  setInterval(updateDashboard, 1000);

  function initializeServos() {
    servoGrid.innerHTML = "";
    servos.forEach((servo, index) => {
      const unit = servo.name === "Gripper" ? "%" : "°";
      const servoEl = document.createElement("div");
      servoEl.classList.add("servo-item");
      servoEl.innerHTML = `
                <div class="servo-header">
                    <span class="servo-name">${servo.name}</span>
                    <span class="servo-angle" id="angle-${index}">${servo.angle}${unit}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-bar-fill" id="progress-${index}"></div>
                </div>
            `;
      servoGrid.appendChild(servoEl);
      updateServoUI(index);
    });
  }

  function updateServoUI(index) {
    const servo = servos[index];
    const unit = servo.name === "Gripper" ? "%" : "°";
    const angleEl = document.getElementById(`angle-${index}`);
    const progressEl = document.getElementById(`progress-${index}`);

    angleEl.textContent = `${Math.round(servo.angle)}${unit}`;
    progressEl.style.width = `${(servo.angle / servo.max) * 100}%`;
  }

  // --- Logging --- //

  let logCount = 0;
  const MAX_LOGS = 20;

  function addLog(message) {
    const timestamp = new Date().toLocaleTimeString();
    const li = document.createElement("li");
    li.innerHTML = `<span class="timestamp">${timestamp}</span> ${message}`;

    logsList.prepend(li);

    if (logsList.children.length > MAX_LOGS) {
      logsList.removeChild(logsList.lastChild);
    }
  }

  // --- Event Listeners --- //

  // Removed servoGrid.addEventListener for slider input

  // Removed event listeners for Start, Pause, and E-Stop buttons

  // --- Timed Intervals --- //

  function simulateServoMotion() {
    servos.forEach((servo, index) => {
      const change = (Math.random() - 0.5) * 2; // -1 to +1
      let newAngle = servo.angle + change;

      if (newAngle < 0) newAngle = 0;
      if (newAngle > servo.max) newAngle = servo.max;

      servo.angle = newAngle;
      updateServoUI(index);
    });
  }

  const WATCHDOG_DURATION = 60;
  let watchdogCounter = WATCHDOG_DURATION;

  function updateWatchdogStatus(counter) {
    if (counter <= 10) {
      watchdogStatus.textContent = "Timeout imminent";
      watchdogProgress.classList.add("is-warning");
      watchdogStatusContainer.classList.add("is-warning");
    } else {
      watchdogStatus.textContent = "Counting down";
      watchdogProgress.classList.remove("is-warning");
      watchdogStatusContainer.classList.remove("is-warning");
    }
  }

  function updateWatchdog() {
    watchdogCounter--;
    if (watchdogCounter < 0) {
      watchdogCounter = WATCHDOG_DURATION;
      addLog("Watchdog timer reset.");
    }

    const formattedValue = String(watchdogCounter).padStart(2, "0");
    watchdogValue.textContent = formattedValue;
    const progress = Math.max(watchdogCounter / WATCHDOG_DURATION, 0);
    watchdogProgress.style.width = `${progress * 100}%`;
    updateWatchdogStatus(watchdogCounter);
  }

  // --- Initialization Call --- //

  initializeServos();
  addLog("System initialized and ready.");
  addLog("Heartbeat signal detected.");
  addLog("Packet received: 22 ms bus latency");

  // Stagger card animations
  document.querySelectorAll(".card").forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
  });

  watchdogValue.textContent = String(WATCHDOG_DURATION);
  watchdogProgress.style.width = "100%";
  updateWatchdogStatus(watchdogCounter);

  setInterval(simulateServoMotion, 1000);
  setInterval(updateWatchdog, 1000);
});
