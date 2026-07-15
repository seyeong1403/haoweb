/* ============================================================
   HAOWEB — 상공 레퍼런스 재설계 · redesign.js
   오버레이 메뉴 · 히어로 슬라이더 · 헤더 상태 · 프리뷰 안전망
   진행적 향상: JS 없으면 전체 콘텐츠 그대로 노출.
   ============================================================ */
(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.add("rd-js");
  var reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
  var hasGSAP = typeof window.gsap !== "undefined";

  /* ---------- Header: 스크롤 시 solid ---------- */
  var header = document.querySelector(".rd-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("solid", window.scrollY > 40);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- 오버레이 메뉴 ---------- */
  var overlay = document.querySelector(".rd-overlay");
  var openBtn = document.querySelector("[data-menu-open]");
  var closeBtn = document.querySelector("[data-menu-close]");
  var lastFocus = null;

  function focusables() {
    if (!overlay) return [];
    return Array.prototype.slice.call(
      overlay.querySelectorAll('a[href],button:not([disabled])')
    ).filter(function (el) { return el.offsetParent !== null; });
  }
  var ovBg = overlay ? overlay.querySelector(".rd-overlay-bg") : null;
  var ovIn = overlay ? overlay.querySelector(".rd-overlay-in") : null;
  var menuWords = overlay ? overlay.querySelectorAll(".rd-menu-list > li > a") : [];
  function openMenu() {
    if (!overlay) return;
    lastFocus = document.activeElement;
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    if (openBtn) openBtn.setAttribute("aria-expanded", "true");
    document.body.classList.add("rd-lock");
    var f = focusables();
    if (f[0]) setTimeout(function () { f[0].focus(); }, 60);
    // 안전망: 배경/메뉴어 transition이 진행되지 않으면 최종상태 강제(프리뷰 정지 대비)
    setTimeout(function () {
      if (!overlay.classList.contains("open")) return;
      if (ovBg && getComputedStyle(ovBg).transform.indexOf(", 0, 0)") > -1) {
        ovBg.style.transition = "none"; ovBg.style.transform = "scaleY(1)";
      }
      if (ovIn && parseFloat(getComputedStyle(ovIn).opacity) < 0.05) {
        ovIn.style.transition = "none"; ovIn.style.opacity = "1";
      }
      menuWords.forEach(function (a) {
        var t = getComputedStyle(a).transform;
        if (t !== "none" && t !== "matrix(1, 0, 0, 1, 0, 0)") {
          a.style.transition = "none"; a.style.transform = "translateY(0)";
        }
      });
    }, 760);
  }
  function closeMenu() {
    if (!overlay) return;
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    if (openBtn) openBtn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("rd-lock");
    // 강제했던 inline 초기화 — 다음 열림에서 다시 애니메이션되도록
    if (ovBg) { ovBg.style.transform = ""; ovBg.style.transition = ""; }
    if (ovIn) { ovIn.style.opacity = ""; ovIn.style.transition = ""; }
    menuWords.forEach(function (a) { a.style.transform = ""; a.style.transition = ""; });
    if (lastFocus) lastFocus.focus();
  }
  if (openBtn) openBtn.addEventListener("click", openMenu);
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);
  document.addEventListener("keydown", function (e) {
    if (!overlay || !overlay.classList.contains("open")) return;
    if (e.key === "Escape") { closeMenu(); return; }
    if (e.key === "Tab") {
      var f = focusables();
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- 히어로 슬라이더 ---------- */
  var hero = document.querySelector(".rd-hero");
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".rd-hero-slide"));
    var frames = Array.prototype.slice.call(hero.querySelectorAll(".rd-hframe"));
    var cur = document.querySelector("[data-count-cur]");
    var totalEl = document.querySelector("[data-count-total]");
    var progBar = document.querySelector(".rd-prog i");
    var prev = document.querySelector("[data-hero-prev]");
    var next = document.querySelector("[data-hero-next]");
    var i = 0, timer = null, frameTimer = null, DURATION = 6400;
    var n = slides.length;
    if (totalEl) totalEl.textContent = ("0" + n).slice(-2);

    function reconcileFrames() {
      // 실브라우저: 이 시점(0.9s)엔 이미 transition(0.7s) 완료 → 대개 no-op(페이드 유지)
      // 프리뷰(transition 정지): 값이 안 넘어가면 transition을 끄고 최종값 강제
      frames.forEach(function (f) {
        var want = f.classList.contains("active") ? "1" : "0";
        if (getComputedStyle(f).opacity !== want) {
          f.style.transition = "none";
          f.style.opacity = want;
        }
        f.style.transform = want === "1" ? "none" : "";
      });
    }

    function paint(idx, dir) {
      slides.forEach(function (s, k) {
        var on = k === idx;
        s.classList.toggle("active", on);
        if (on) revealSlide(s, dir);
      });
      frames.forEach(function (f, k) { f.classList.toggle("active", k === idx); });
      // 안전망(debounce): 클래스(=진실원본) 기준으로만 최종 opacity 강제 — 프리뷰 transition 정지 대비
      clearTimeout(frameTimer);
      frameTimer = setTimeout(reconcileFrames, 900);
      if (cur) cur.textContent = ("0" + (idx + 1)).slice(-2);
    }
    function show(items) {
      items.forEach(function (el) { el.style.opacity = 1; el.style.transform = "none"; });
    }
    function revealSlide(s, dir) {
      var items = s.querySelectorAll(".rd-anim");
      if (!hasGSAP || reduce) { show(items); return; }
      window.gsap.killTweensOf(items);
      window.gsap.fromTo(items,
        { yPercent: dir < 0 ? -40 : 40, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.85, ease: "power3.out", stagger: 0.08, overwrite: true }
      );
      // 안전망: 트윈이 진행되지 않으면(프리뷰 rAF 정지 등) 강제 노출
      setTimeout(function () {
        if (!s.classList.contains("active")) return;
        items.forEach(function (el) {
          if (parseFloat(getComputedStyle(el).opacity) < 0.05) { el.style.opacity = 1; el.style.transform = "none"; }
        });
      }, 1200);
    }
    function runProgress() {
      if (!progBar) return;
      if (hasGSAP && !reduce) {
        window.gsap.killTweensOf(progBar);
        window.gsap.fromTo(progBar, { scaleX: 0 }, { scaleX: 1, duration: DURATION / 1000, ease: "none" });
      }
    }
    function go(idx, manual) {
      var dir = idx > i || (i === n - 1 && idx === 0) ? 1 : -1;
      i = (idx + n) % n;
      paint(i, manual ? dir : 1);
      runProgress();
      if (manual) restart();
    }
    function nextSlide() { go(i + 1); }
    function start() { if (n > 1) timer = setInterval(nextSlide, DURATION); runProgress(); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function restart() { stop(); start(); }

    if (prev) prev.addEventListener("click", function () { go(i - 1, true); });
    if (next) next.addEventListener("click", function () { go(i + 1, true); });
    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", function () { if (!timer) start(); });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop(); else if (!timer) start();
    });

    // 초기: 첫 슬라이드 즉시 노출(폰트/IO 대기 없음 — 프리뷰 프리즈 안전)
    paint(0, 1);
    if (!reduce && n > 1) start();
    // 안전망: 혹시 애니메이션이 걸려 숨어있으면 강제 노출
    setTimeout(function () {
      var a = hero.querySelector(".rd-hero-slide.active");
      if (a) a.querySelectorAll(".rd-anim").forEach(function (el) {
        if (parseFloat(getComputedStyle(el).opacity) < 0.05) { el.style.opacity = 1; el.style.transform = "none"; }
      });
    }, 1600);
  }
})();
