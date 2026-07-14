/* ============================================================
   하오웹 — main.js  v5 · MOTION (narnia.ai 레퍼런스)
   1) 헤더 스크롤  2) 모바일 메뉴  3) 진단 폼
   4) Lenis 스무스 스크롤 + GSAP ScrollTrigger 리빌/패럴랙스/진행바
   폴백: reduced-motion 또는 CDN 미로드 시 즉시 표시(콘텐츠 안 사라짐)
   ============================================================ */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var reveals = document.querySelectorAll(".reveal");
  function showAll() { for (var i = 0; i < reveals.length; i++) reveals[i].classList.add("in"); }

  /* ---------- 1) 헤더 스크롤 상태 ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() { if (header) header.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 2) 모바일 메뉴 ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var mnav = document.getElementById("mobile-nav");
  if (toggle && mnav) {
    toggle.addEventListener("click", function () {
      var open = !mnav.hasAttribute("data-open");
      if (open) { mnav.setAttribute("data-open", ""); mnav.hidden = false; }
      else { mnav.removeAttribute("data-open"); mnav.hidden = true; }
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    });
    mnav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mnav.removeAttribute("data-open"); mnav.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- 3) 무료 진단 폼 (데모) ---------- */
  var form = document.querySelector("[data-diag]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = form.querySelector("[data-diag-note]");
      if (note) note.hidden = false;
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.textContent = "신청 완료 ✓"; btn.disabled = true; }
    });
  }

  /* ---------- 3b) 포트폴리오 업종 필터 ---------- */
  var chips = document.querySelectorAll(".pf-chip");
  var pcards = document.querySelectorAll(".port-card");
  if (chips.length) {
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.classList.remove("is-active"); });
        chip.classList.add("is-active");
        var f = chip.getAttribute("data-filter");
        pcards.forEach(function (card) {
          card.style.display = (f === "all" || card.getAttribute("data-cat") === f) ? "" : "none";
        });
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      });
    });
  }

  /* ---------- 3b-2) 포트폴리오 그리드/리스트 보기 토글 ---------- */
  var viewBtns = document.querySelectorAll(".pv-btn");
  var pgrid = document.querySelector(".port-grid");
  if (viewBtns.length && pgrid) {
    viewBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        viewBtns.forEach(function (b) { b.classList.remove("is-active"); b.setAttribute("aria-pressed", "false"); });
        btn.classList.add("is-active"); btn.setAttribute("aria-pressed", "true");
        pgrid.classList.toggle("is-list", btn.getAttribute("data-view") === "list");
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      });
    });
  }

  /* ---------- 3b-3) 제작 서비스 전환 (데스크톱 hover·click / 모바일 목록→상세) ---------- */
  var svcTabs = document.querySelectorAll(".svc-tab");
  if (svcTabs.length) {
    var svcActivate = function (key, scrollTo) {
      svcTabs.forEach(function (t) {
        var on = t.getAttribute("data-svc") === key;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", String(on));
      });
      var panel = null;
      document.querySelectorAll(".svc-panel").forEach(function (p) {
        var on = p.id === "svp-" + key;
        p.hidden = !on;
        p.classList.toggle("is-active", on);
        if (on) panel = p;
      });
      // 모바일: 선택 상세가 목록 아래에 나타나므로 살짝 스크롤해 보여줌
      if (scrollTo && panel && window.matchMedia("(max-width: 900px)").matches) {
        var y = panel.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
      }
    };
    svcTabs.forEach(function (t) {
      var key = t.getAttribute("data-svc");
      // hover 전환은 데스크톱(포인터) 전용 — 터치에서는 click만
      t.addEventListener("mouseenter", function () {
        if (window.matchMedia("(hover: hover) and (min-width: 901px)").matches) svcActivate(key);
      });
      t.addEventListener("focus", function () { svcActivate(key); });
      t.addEventListener("click", function () { svcActivate(key, true); });
    });
  }

  /* ---------- 3c) FAQ 부드러운 아코디언 ---------- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var sum = item.querySelector("summary");
    var body = item.querySelector(".faq-a");
    if (!sum || !body) return;
    sum.addEventListener("click", function (e) {
      if (reduce) return; // 감속 설정 시 기본 동작
      e.preventDefault();
      if (item.dataset.animating) return;
      item.dataset.animating = "1";
      body.classList.add("faq-anim");
      var finish = function () {
        body.style.height = ""; body.classList.remove("faq-anim");
        delete item.dataset.animating; body.removeEventListener("transitionend", finish);
      };
      if (item.open) {
        body.style.height = body.scrollHeight + "px";
        requestAnimationFrame(function () { body.style.height = "0px"; });
        body.addEventListener("transitionend", function h() {
          item.open = false; body.removeEventListener("transitionend", h); finish();
        });
      } else {
        item.open = true;
        var target = body.scrollHeight;
        body.style.height = "0px";
        requestAnimationFrame(function () { body.style.height = target + "px"; });
        body.addEventListener("transitionend", finish);
      }
    });
  });

  /* ---------- 4) 모션 ---------- */
  var hasGSAP = !!(window.gsap && window.ScrollTrigger);

  // 폴백: 모션 끄기(reduced-motion) 또는 GSAP 미로드 → 즉시/IO 표시
  if (reduce || !hasGSAP) {
    if (reduce) { showAll(); return; }
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
      }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
      reveals.forEach(function (el) { io.observe(el); });
    } else { showAll(); }
    return;
  }

  // GSAP 경로
  try {
    document.body.classList.add("gsap-on");
    gsap.registerPlugin(ScrollTrigger);

    // Lenis 스무스 스크롤
    if (window.Lenis) {
      var lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
      // 앵커 이동을 Lenis로 부드럽게
      document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener("click", function (e) {
          var id = a.getAttribute("href");
          if (id && id.length > 1) {
            var target = document.querySelector(id);
            if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -80 }); }
          }
        });
      });
    }

    // 히어로 인트로 (로드 시 시네마틱 등장) — rAF 정지/백그라운드에도 콘텐츠는 반드시 보이게
    if (document.querySelector(".hero-title")) {
      var heroSel = ".hero .eyebrow, .hero-title, .hero-lead, .hero-actions, .hero-foot";
      var heroShow = function () { gsap.set(heroSel, { opacity: 1, y: 0 }); gsap.set(".hero-watermark", { opacity: 1, scale: 1 }); };
      if (document.visibilityState === "visible") {
        gsap.set(heroSel, { opacity: 0, y: 30 });
        gsap.set(".hero-watermark", { opacity: 0, scale: 1.06 });
        gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: heroShow })
          .to(".hero-watermark", { opacity: 1, scale: 1, duration: 1.2 }, 0)
          .to(".hero .eyebrow", { opacity: 1, y: 0, duration: 0.6 }, 0.1)
          .to(".hero-title", { opacity: 1, y: 0, duration: 0.9 }, "-=0.35")
          .to(".hero-lead", { opacity: 1, y: 0, duration: 0.6 }, "-=0.5")
          .to(".hero-actions", { opacity: 1, y: 0, duration: 0.6 }, "-=0.45")
          .to(".hero-niche", { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
          .to(".hero-demo", { opacity: 1, y: 0, duration: 0.8 }, "-=0.5")
          .to(".hero-foot", { opacity: 1, y: 0, duration: 0.6 }, "-=0.5");
        // 안전장치: rAF가 멈춰 애니가 진행 안 돼도 콘텐츠 강제 표시
        setTimeout(heroShow, 2600);
      }
    }

    // 스크롤 리빌 (한 번 나타나면 계속 유지 — 되돌아와도 사라지지 않음)
    var animIn = function (els) {
      gsap.to(els, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out", stagger: { each: 0.08, from: "start" }, overwrite: true });
    };
    gsap.set(reveals, { opacity: 0, y: 28, scale: 0.985 });
    ScrollTrigger.batch(".reveal", {
      start: "top 92%",
      onEnter: animIn,      // 아래로 스크롤해 처음 들어올 때
      onEnterBack: animIn   // 위로 스크롤해 다시 들어올 때
      // onLeave/onLeaveBack 제거: 화면 밖으로 나가도 숨기지 않음(콘텐츠 사라짐 방지)
    });

    // 히어로 패럴랙스 (미묘하게)
    if (document.querySelector(".hero-demo")) {
      gsap.to(".hero-demo", { yPercent: 14, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    }
    if (document.querySelector(".hero-copy")) {
      gsap.to(".hero-copy", { yPercent: -5, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    }

    // 브랜드 통합 4단계 — 스크롤에 따라 현재 단계 활성화 + 연결선 진행
    var biSteps = gsap.utils.toArray(".bi-step");
    if (biSteps.length) {
      biSteps.forEach(function (step) {
        ScrollTrigger.create({
          trigger: step, start: "top 62%", end: "bottom 42%",
          onToggle: function (self) { step.classList.toggle("on", self.isActive); }
        });
      });
      var biFill = document.querySelector(".bi-rail-fill");
      var biList = document.querySelector(".bi-steps");
      if (biFill && biList) {
        ScrollTrigger.create({
          trigger: biList, start: "top 60%", end: "bottom 46%", scrub: true,
          onUpdate: function (self) { biFill.style.height = (self.progress * 100).toFixed(1) + "%"; }
        });
      }
    }

    // 제작 프로세스 7단계 — 스크롤에 따라 좌측 대형 표시 전환 + 진행선
    var procItems = gsap.utils.toArray(".proc-item");
    if (procItems.length) {
      var pCurNo = document.querySelector(".proc-cur-no");
      var pCurTitle = document.querySelector(".proc-cur-title");
      var pCount = document.querySelector(".proc-count b");
      var pFill = document.querySelector(".proc-track-fill");
      var total = procItems.length;
      var setProc = function (i) {
        procItems.forEach(function (it, idx) { it.classList.toggle("on", idx === i); });
        var el = procItems[i];
        if (pCurNo) pCurNo.textContent = el.getAttribute("data-no");
        if (pCurTitle) pCurTitle.textContent = el.getAttribute("data-title");
        if (pCount) pCount.textContent = el.getAttribute("data-no");
        if (pFill) pFill.style.width = (((i + 1) / total) * 100).toFixed(1) + "%";
      };
      procItems.forEach(function (it, i) {
        ScrollTrigger.create({
          trigger: it, start: "top 60%", end: "bottom 40%",
          onToggle: function (self) { if (self.isActive) setProc(i); }
        });
      });
    }

    // 세부페이지 프로세스(.steps .step) — 현재 단계 활성화(딤은 CSS·데스크톱)
    gsap.utils.toArray(".steps .step").forEach(function (step) {
      ScrollTrigger.create({
        trigger: step, start: "top 62%", end: "bottom 42%",
        onToggle: function (self) { step.classList.toggle("on", self.isActive); }
      });
    });

    // 스크롤 진행바
    var bar = document.querySelector(".scroll-progress");
    if (bar) {
      gsap.to(bar, {
        scaleX: 1, ease: "none",
        scrollTrigger: { start: 0, end: function () { return document.documentElement.scrollHeight - window.innerHeight; }, scrub: 0.3 }
      });
    }

    ScrollTrigger.refresh();
  } catch (err) {
    // GSAP 도중 오류 → 콘텐츠 무조건 표시
    document.body.classList.remove("gsap-on");
    showAll();
  }
})();
