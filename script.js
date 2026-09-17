/* =============================================================================
   2008 HORROR ARG CONFIGURATION
   -----------------------------------------------------------------------------
   Configure your background, passwords, clues, and responses here!
   ============================================================================= */
const ARG_CONFIG = {
  // Optional background image override in JavaScript.
  // By default, it uses '--bg-image' in style.css.
  backgroundImage: "",

  // Active Hint:
  hint: "What Occult Freak is going through",

  // Passwords and outcomes (case-insensitive)
  passwords: {
    "splitpersonality": {
      title: "ACCESS GRANTED",
      message: "The fracture is recognized. Two minds, one vessel.",
      clue: "Archive unlocked: 'What Occult Freak is going through.' The other side has awakened.",
      redirectUrl: null
    }
  },

  // Error messages on invalid password:
  errorMessages: [
    "access denied.",
    "invalid cipher key.",
    "tape sequence corrupted.",
    "nothing here.",
    "the eye is closed."
  ]
};

/* =============================================================================
   SAFE AUDIO ENGINE (Zero dependencies, won't throw if blocked)
   ============================================================================= */
class HorrorAudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = false;
    this.noiseNode = null;
  }

  ensureContext() {
    try {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
    } catch (e) {
      console.warn("AudioContext unavailable:", e);
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    this.ensureContext();

    if (this.enabled) {
      this.startTapeHiss();
      this.playTone(320, 0.08, "square", 0.04);
    } else {
      this.stopTapeHiss();
    }
    return this.enabled;
  }

  startTapeHiss() {
    try {
      if (!this.ctx || this.noiseNode) return;

      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 850;
      filter.Q.value = 1.0;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();
      this.noiseNode = whiteNoise;
    } catch (e) {}
  }

  stopTapeHiss() {
    if (this.noiseNode) {
      try {
        this.noiseNode.stop();
        this.noiseNode.disconnect();
      } catch (e) {}
      this.noiseNode = null;
    }
  }

  playKeypress() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = "triangle";
      osc.frequency.setValueAtTime(400 + Math.random() * 200, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.025);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch (e) {}
  }

  playDenialBuzz() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(95, now);
      osc.frequency.linearRampToValueAtTime(45, now + 0.35);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch (e) {}
  }

  playSuccessDrone() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const freqs = [164.81, 196.00, 246.94];
      const now = this.ctx.currentTime;

      freqs.forEach(freq => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.04, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 2.5);
      });
    } catch (e) {}
  }

  playTone(freq, duration, type = "sine", volume = 0.05) {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {}
  }
}

const audio = new HorrorAudioEngine();

/* =============================================================================
   SAFE 2008 ANALOG STATIC NOISE CANVAS
   ============================================================================= */
(function initNoiseCanvas() {
  try {
    const canvas = document.getElementById("noise-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resizeCanvas() {
      canvas.width = window.innerWidth || 800;
      canvas.height = window.innerHeight || 600;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const grainWidth = 160;
    const grainHeight = 100;
    const offscreen = document.createElement("canvas");
    offscreen.width = grainWidth;
    offscreen.height = grainHeight;
    const offCtx = offscreen.getContext("2d");
    if (!offCtx) return;

    const imgData = offCtx.createImageData(grainWidth, grainHeight);
    const data = imgData.data;

    let lastTime = 0;
    const frameInterval = 1000 / 22; // 22 fps

    function loop(timestamp) {
      requestAnimationFrame(loop);
      if (timestamp - lastTime < frameInterval) return;
      lastTime = timestamp;

      for (let i = 0; i < data.length; i += 4) {
        const shade = (Math.random() * 255) | 0;
        data[i] = shade;
        data[i + 1] = shade;
        data[i + 2] = shade;
        data[i + 3] = 255;
      }

      offCtx.putImageData(imgData, 0, 0);

      if (canvas.width > 0 && canvas.height > 0) {
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(offscreen, 0, 0, canvas.width, canvas.height);
      }
    }

    requestAnimationFrame(loop);
  } catch (err) {
    console.warn("Noise canvas failed to initialize:", err);
  }
})();

/* =============================================================================
   PUPIL TRACKING
   ============================================================================= */
(function initPupil() {
  try {
    const pupilGroup = document.getElementById("pupil-group");
    const eye = document.getElementById("eye-container");
    if (!pupilGroup || !eye) return;

    function movePupil(clientX, clientY) {
      const rect = eye.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = clientX - centerX;
      const dy = clientY - centerY;
      const angle = Math.atan2(dy, dx);
      const dist = Math.min(6, Math.hypot(dx, dy) / 25);

      const x = Math.cos(angle) * dist;
      const y = Math.sin(angle) * dist;

      pupilGroup.style.transform = `translate(${x}px, ${y}px)`;
    }

    window.addEventListener("mousemove", e => movePupil(e.clientX, e.clientY));
    window.addEventListener("touchmove", e => {
      if (e.touches && e.touches[0]) {
        movePupil(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
  } catch (e) {}
})();

/* =============================================================================
   GLOBAL EXPOSURES (Fail-safe for inline onclick/onsubmit)
   ============================================================================= */
window.toggleAudio = function() {
  const isEnabled = audio.toggle();
  const soundBtn = document.getElementById("sound-btn");
  if (soundBtn) {
    soundBtn.textContent = isEnabled ? "[ audio: on ]" : "[ audio: muted ]";
    soundBtn.style.color = isEnabled ? "#7cd986" : "";
  }
};

window.submitPassword = function() {
  const input = document.getElementById("password-input");
  const output = document.getElementById("output-log");
  const container = document.querySelector(".horror-container");

  if (!input || !output) return;

  const rawVal = input.value.trim();
  if (!rawVal) {
    output.innerHTML = '<div class="log-line error">&gt; enter a password.</div>';
    input.focus();
    return;
  }

  const val = rawVal.toLowerCase();
  audio.playKeypress();

  const match = ARG_CONFIG.passwords[val];
  output.innerHTML = "";

  if (match) {
    // ACCESS GRANTED
    audio.playSuccessDrone();

    const lineTitle = document.createElement("div");
    lineTitle.className = "log-line success";
    lineTitle.textContent = `> ${match.title}`;
    output.appendChild(lineTitle);

    const lineMsg = document.createElement("div");
    lineMsg.className = "log-line";
    lineMsg.textContent = match.message;
    output.appendChild(lineMsg);

    if (match.clue) {
      const lineClue = document.createElement("div");
      lineClue.className = "log-line clue";
      lineClue.textContent = match.clue;
      output.appendChild(lineClue);
    }

    if (match.redirectUrl) {
      setTimeout(() => {
        window.location.href = match.redirectUrl;
      }, 3000);
    }
  } else {
    // DENIED / ERROR
    audio.playDenialBuzz();

    if (container) {
      container.classList.remove("glitch-active");
      void container.offsetWidth;
      container.classList.add("glitch-active");
    }

    const randomErr = ARG_CONFIG.errorMessages[
      Math.floor(Math.random() * ARG_CONFIG.errorMessages.length)
    ];

    const errLine = document.createElement("div");
    errLine.className = "log-line error";
    errLine.textContent = `> ${randomErr}`;
    output.appendChild(errLine);

    const hintLine = document.createElement("div");
    hintLine.className = "log-line clue";
    hintLine.textContent = `hint: ${ARG_CONFIG.hint}`;
    output.appendChild(hintLine);
  }

  input.value = "";
  input.focus();
};

/* =============================================================================
   INITIALIZE LISTENERS
   ============================================================================= */
function initApp() {
  // Override background if configured in JS
  if (ARG_CONFIG.backgroundImage && ARG_CONFIG.backgroundImage.trim() !== "") {
    const bg = document.getElementById("bg-layer");
    if (bg) {
      bg.style.backgroundImage = `url('${ARG_CONFIG.backgroundImage}')`;
    }
  }

  const form = document.getElementById("password-form");
  const input = document.getElementById("password-input");
  const soundBtn = document.getElementById("sound-btn");

  if (soundBtn) {
    soundBtn.addEventListener("click", window.toggleAudio);
  }

  if (input) {
    input.addEventListener("input", () => audio.playKeypress());
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      window.submitPassword();
      return false;
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

console.log("[REC: 2008-11-04 // CAM-02] All seeing eye initialized. Hint: 'What Occult Freak is going through'");
