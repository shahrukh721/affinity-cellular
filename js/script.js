/* ============================================================
   Affinity Cellular — interactions
   ============================================================ */
(function () {
  "use strict";

  var RED = "#e11b22";
  var TRACK = "#cdd4de";

  /* ---------- Slider: value + red fill ---------- */
  var slider = document.getElementById("bill");
  var billValue = document.getElementById("billValue");

  function paintSlider() {
    if (!slider) return;
    var min = +slider.min, max = +slider.max, val = +slider.value;
    var pct = ((val - min) / (max - min)) * 100;
    slider.style.background =
      "linear-gradient(to right," + RED + " 0%," + RED + " " + pct + "%," +
      TRACK + " " + pct + "%," + TRACK + " 100%)";
    if (billValue) billValue.textContent = val >= 250 ? "250+" : val;
  }
  if (slider) {
    slider.addEventListener("input", function () { paintSlider(); markDirty(); });
    paintSlider();
  }

  /* ---------- Line toggle ---------- */
  var lineBtns = document.querySelectorAll(".line-btn");
  var selectedLines = 1;
  lineBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      lineBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      selectedLines = +btn.getAttribute("data-lines");
      markDirty();
    });
  });

  /* radios mark the form dirty too */
  document.querySelectorAll('#savingsForm input[type="radio"]').forEach(function (r) {
    r.addEventListener("change", markDirty);
  });

  /* Track whether the user changed anything. Until they do, the results
     panel keeps the exact figures shown in the original design. */
  var dirty = false;
  function markDirty() { dirty = true; }

  /* ---------- Savings calculation ---------- */
  var form = document.getElementById("savingsForm");

  var dataBase = { calls: 20, browsing: 30, social: 40, streaming: 55 };

  function fmt(n) { return n.toLocaleString("en-US"); }

  function animateNumber(el, to, withComma) {
    if (!el) return;
    var from = parseInt((el.textContent || "0").replace(/[^0-9]/g, ""), 10) || 0;
    var start = null, dur = 650;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var cur = Math.round(from + (to - from) * eased);
      el.textContent = withComma ? fmt(cur) : cur;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function calculate() {
    var currentMonthly = slider ? +slider.value : 142;
    var dataChoice = (document.querySelector('input[name="data"]:checked') || {}).value || "calls";

    var affinityMonthly = (dataBase[dataChoice] || 20) + (selectedLines - 1) * 15;
    var currentAnnual = currentMonthly * 12;
    var affinityAnnual = affinityMonthly * 12;
    var monthlyOverpay = Math.max(0, currentMonthly - affinityMonthly);
    var annualSavings = Math.max(0, currentAnnual - affinityAnnual);

    animateNumber(document.getElementById("overpay"), monthlyOverpay, false);
    animateNumber(document.getElementById("currentAnnual"), currentAnnual, true);
    animateNumber(document.getElementById("affinityAnnual"), affinityAnnual, true);
    animateNumber(document.getElementById("annualSavings"), annualSavings, true);
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      calculate();
      var results = document.querySelector(".results-card");
      if (results && window.matchMedia("(max-width:1000px)").matches) {
        results.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  /* ---------- Countdown timer ---------- */
  var cd = document.getElementById("countdown");
  if (cd) {
    var DURATION = ((2 * 24 + 14) * 60 * 60 + 37 * 60 + 26) * 1000; // 2d 14h 37m 26s
    var KEY = "affinityCountdownEnd";
    var end = +sessionStorage.getItem(KEY);
    if (!end || end < Date.now()) {
      end = Date.now() + DURATION;
      try { sessionStorage.setItem(KEY, end); } catch (e) {}
    }

    var units = {
      days: cd.querySelector('[data-unit="days"]'),
      hours: cd.querySelector('[data-unit="hours"]'),
      minutes: cd.querySelector('[data-unit="minutes"]'),
      seconds: cd.querySelector('[data-unit="seconds"]')
    };
    function pad(n) { return (n < 10 ? "0" : "") + n; }

    function tick() {
      var diff = end - Date.now();
      if (diff <= 0) {
        end = Date.now() + DURATION;
        try { sessionStorage.setItem(KEY, end); } catch (e) {}
        diff = DURATION;
      }
      var s = Math.floor(diff / 1000);
      units.days.textContent = pad(Math.floor(s / 86400));
      units.hours.textContent = pad(Math.floor((s % 86400) / 3600));
      units.minutes.textContent = pad(Math.floor((s % 3600) / 60));
      units.seconds.textContent = pad(s % 60);
    }
    tick();
    setInterval(tick, 1000);
  }
})();
