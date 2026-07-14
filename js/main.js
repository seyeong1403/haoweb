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

  /* ---------- 1b) 히어로 — 영상 2개 레이어 크로스페이드 + 영상별 카피 전환 ---------- */
  // 영상·카피를 하나의 데이터로 관리(영상 추가 시 slide 객체만 추가하면 됨)
  var heroSlides = [
    {
      video: "assets/hero-1.mp4",
      eyebrow: "AI SEARCH READY",
      title: "AI는 당신의 홈페이지를<br>이해하고 있습니까?",
      lead: "고객이 쉽게 이해하고, 검색엔진과 AI도 정확하게 읽을 수 있도록 홈페이지의 정보와 콘텐츠 구조를 설계합니다."
    },
    {
      video: "assets/hero-3.mp4",
      eyebrow: "BRAND INTEGRATION",
      title: "홈페이지를 넘어,<br>브랜드의 모든 접점을<br>연결합니다.",
      lead: "브랜딩과 촬영, 카탈로그와 편집디자인부터 웹과 앱까지 한 팀이 하나의 기준으로 연결합니다."
    }
    // 예비(영상 추가 시 사용, 현재 미노출):
    // { video: "assets/hero-4.mp4", eyebrow: "ONE TEAM", title: "브랜딩부터 웹과 앱까지,<br>하나의 브랜드를 한 팀이 완성합니다.", lead: "" }
  ];
  var heroLayers = [document.getElementById("heroVidA"), document.getElementById("heroVidB")];
  var heroCopy = document.getElementById("heroCopy");
  if (heroLayers[0] && heroLayers[1] && heroCopy) {
    var hEyebrow = heroCopy.querySelector(".hero-eyebrow");
    var hTitle = heroCopy.querySelector(".hero-title");
    var hLead = heroCopy.querySelector(".hero-lead");
    var hActions = heroCopy.querySelector(".hero-actions");
    var hCur = heroCopy.querySelector(".hi-cur");
    var hTot = heroCopy.querySelector(".hi-tot");
    var copyEls = [hEyebrow, hTitle, hLead, hActions].filter(Boolean);
    if (hTot) hTot.textContent = "/ " + String(heroSlides.length).padStart(2, "0");

    var setCopy = function (i) {
      var s = heroSlides[i];
      if (hEyebrow) hEyebrow.textContent = s.eyebrow;
      if (hTitle) hTitle.innerHTML = s.title;
      if (hLead) hLead.textContent = s.lead;
      if (hCur) hCur.textContent = String(i + 1).padStart(2, "0");
    };
    var copyOut = function () { copyEls.forEach(function (el) { el.style.transitionDelay = "0s"; }); heroCopy.classList.add("copy-out"); };
    var copyIn = function () {
      var d = [0, 0.08, 0.18, 0.28]; // 제목 → 설명 → CTA 순으로 등장
      copyEls.forEach(function (el, k) { el.style.transitionDelay = (d[k] || 0) + "s"; });
      heroCopy.classList.remove("copy-out");
    };

    if (reduce) {
      // 모션 최소화: 첫 영상·첫 문구만 정적 표시(HTML 그대로), 영상 정지·포스터 노출
      heroLayers.forEach(function (l) { l.removeAttribute("autoplay"); l.pause(); });
    } else {
      var front = 0;   // 현재 보이는 레이어
      var ci = 0;      // 앞 레이어가 재생 중인 슬라이드 index
      var tryPlay = function (v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); };
      // 초기: A=슬라이드0(재생), B=슬라이드1(프리로드·정지·투명)
      heroLayers[0].src = heroSlides[0].video;
      heroLayers[1].src = heroSlides[1 % heroSlides.length].video;
      heroLayers[0].style.opacity = "1";
      heroLayers[1].style.opacity = "0";
      heroLayers[1].load();
      tryPlay(heroLayers[0]);

      var advance = function () {
        var back = 1 - front;
        var bl = heroLayers[back], fl = heroLayers[front];
        var nextCi = (ci + 1) % heroSlides.length;
        // 1) 현재 문구 페이드 아웃 + 영상 크로스페이드(동시)
        copyOut();
        try { bl.currentTime = 0; } catch (e) {}
        tryPlay(bl);
        bl.style.opacity = "1"; // 다음 영상 나타남
        fl.style.opacity = "0"; // 현재 영상 사라짐
        front = back; ci = nextCi;
        // 2) 다음 슬라이드 영상 미리 로드(방금 빠진 레이어에)
        var afterNext = (ci + 1) % heroSlides.length;
        fl.pause();
        if (fl.getAttribute("src") !== heroSlides[afterNext].video) { fl.src = heroSlides[afterNext].video; fl.load(); }
        else { try { fl.currentTime = 0; } catch (e2) {} }
        // 3) 영상 전환 중반에 새 문구 교체 후 제목→설명→CTA 순으로 등장
        setTimeout(function () { setCopy(ci); copyIn(); }, 560);
      };
      heroLayers.forEach(function (l) {
        l.addEventListener("ended", function () { if (heroLayers[front] === l) advance(); });
      });
    }
  }

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
    var svcPanels = document.querySelectorAll(".svc-panel");
    // 떠난 패널은 전환이 끝나면 오른쪽 대기 위치로 순간 복귀(다음엔 다시 오른쪽에서 등장)
    svcPanels.forEach(function (p) {
      p.addEventListener("transitionend", function (e) {
        if (e.propertyName !== "transform") return;
        if (!p.classList.contains("is-active")) {
          p.classList.add("no-anim");
          p.classList.remove("is-leave"); // 기본(오른쪽 +108%) 대기 상태로
          void p.offsetWidth;             // 리플로우로 트랜지션 없이 스냅
          p.classList.remove("no-anim");
        }
      });
    });
    var svcActivate = function (key, scrollTo) {
      svcTabs.forEach(function (t) {
        var on = t.getAttribute("data-svc") === key;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", String(on));
      });
      var panel = null;
      svcPanels.forEach(function (p) {
        var on = p.id === "svp-" + key;
        if (on) {
          p.classList.remove("is-leave");
          p.classList.add("is-active");     // 오른쪽에서 슬라이드 인 → 정지
          p.setAttribute("aria-hidden", "false");
          panel = p;
        } else if (p.classList.contains("is-active")) {
          p.classList.remove("is-active");
          p.classList.add("is-leave");      // 왼쪽으로 슬라이드 아웃
          p.setAttribute("aria-hidden", "true");
        }
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

  /* ---------- 3b-4) 서비스 고객 흐름 칩 마퀴 (끊김 없는 루프 위해 1회 복제) ---------- */
  document.querySelectorAll(".sp-track").forEach(function (t) {
    if (t.dataset.dup) return;
    t.dataset.dup = "1";
    t.innerHTML += t.innerHTML;
  });

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

  /* ---- 레퍼런스 모션(경로 무관): 워드 라이트업 분할 + 커튼 클립 리빌 ---- */
  // 워드 라이트업: 대상 문장을 단어 단위로 분할(진행 점등은 GSAP path에서)
  document.querySelectorAll("[data-wordlight]").forEach(function (el) {
    if (el.dataset.wlReady) return;
    el.dataset.wlReady = "1";
    el.innerHTML = el.textContent.trim().split(/\s+/).map(function (w) {
      return '<span class="wl">' + w + "</span>";
    }).join(" ");
    if (reduce || !hasGSAP) el.querySelectorAll(".wl").forEach(function (w) { w.classList.add("lit"); });
  });
  // 커튼 클립 리빌: 화면 진입 시 .in → CSS 트랜지션이 clip-path 처리
  var curtains = document.querySelectorAll(".reveal-cur");
  if (curtains.length) {
    if (reduce || !("IntersectionObserver" in window)) {
      curtains.forEach(function (el) { el.classList.add("in"); });
    } else {
      var curIO = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("in"); }         // 진입 시 좌→우 와이프
          else {                                                          // 화면 밖: 트랜지션 없이 즉시 리셋 → 재진입 때 다시 정방향 와이프
            e.target.style.transition = "none";
            e.target.classList.remove("in");
            void e.target.offsetWidth;
            e.target.style.transition = "";
          }
        });
      }, { threshold: 0.2, rootMargin: "0px 0px -8% 0px" });
      curtains.forEach(function (el) { curIO.observe(el); }); // unobserve 안 함 → 재진입마다 재생
    }
  }

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

    // 스크롤 리빌 — 재진입(위로 올렸다 다시 볼 때)마다 동일하게 재생
    var animIn = function (els) {
      gsap.to(els, { opacity: 1, y: 0, scale: 1, duration: 0.62, ease: "power3.out", stagger: { each: 0.07, from: "start" }, overwrite: true });
    };
    var animReset = function (els) { gsap.set(els, { opacity: 0, y: 26, scale: 0.99 }); }; // 화면 밖에서 즉시 리셋(재진입 시 다시 등장)
    gsap.set(reveals, { opacity: 0, y: 26, scale: 0.99 });
    ScrollTrigger.batch(".reveal", {
      start: "top 92%",
      onEnter: animIn,        // 아래로 스크롤해 들어올 때
      onEnterBack: animIn,    // 위로 스크롤해 다시 들어올 때
      onLeave: animReset,     // 아래로 지나쳐 위로 사라질 때 리셋
      onLeaveBack: animReset  // 위로 지나쳐 아래로 사라질 때 리셋
    });

    // 제목 라인 마스크 리빌 (SplitText 대체: <br> 기준 라인 분할 → 순차 상승) — 108 Creativemore·004 Primora·105 Towards 시그니처
    gsap.utils.toArray(".section-title, .bi-title, .page-hero-title, .final-cta h2, .dfx-title").forEach(function (h) {
      if (h.dataset.split || !h.innerHTML.trim()) return;
      h.dataset.split = "1";
      h.innerHTML = h.innerHTML.split(/<br\s*\/?>/i).map(function (seg) {
        return '<span class="rl"><span class="rl-i">' + seg + "</span></span>";
      }).join("");
      var inner = h.querySelectorAll(".rl-i");
      gsap.set(h, { opacity: 1, y: 0, scale: 1 }); // 배치 페이드/스케일 대신 라인 리빌 사용
      gsap.set(inner, { yPercent: 115 });
      var rlIn = function () { gsap.to(inner, { yPercent: 0, duration: 0.8, ease: "power4.out", stagger: 0.08, overwrite: true }); };
      var rlReset = function () { gsap.set(inner, { yPercent: 115 }); };
      ScrollTrigger.create({
        trigger: h, start: "top 90%", end: "bottom 8%",
        onEnter: rlIn, onEnterBack: rlIn,     // 재진입마다 다시 상승
        onLeave: rlReset, onLeaveBack: rlReset // 화면 밖에서 즉시 리셋
      });
    });

    // 히어로 패럴랙스 (미묘하게)
    if (document.querySelector(".hero-demo")) {
      gsap.to(".hero-demo", { yPercent: 14, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    }
    if (document.querySelector(".hero-copy")) {
      gsap.to(".hero-copy", { yPercent: -5, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    }

    // 핵심 3축 — 스크롤 위치에 따라 활성화(번호·라벨 강조)
    gsap.utils.toArray(".axis3").forEach(function (ax) {
      ScrollTrigger.create({
        trigger: ax, start: "top 78%", end: "bottom 40%",
        onToggle: function (self) { ax.classList.toggle("on", self.isActive); }
      });
    });

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

    // 숫자 카운트업 — 번호가 화면에 들어오거나 서비스가 활성화될 때 0→N (제로패딩 유지)
    var countUp = function (el, force) {
      if (!el || el.dataset.counting) return;
      var target = parseInt((el.dataset.num || el.textContent || "").replace(/\D/g, ""), 10);
      if (isNaN(target)) return;
      if (!el.dataset.num) { el.dataset.num = String(target); el.dataset.pad = String((el.textContent || "").trim().length || String(target).length); }
      if (el.dataset.counted && !force) return;
      el.dataset.counted = "1"; el.dataset.counting = "1";
      var pad = parseInt(el.dataset.pad, 10) || 1;
      var o = { v: 0 };
      gsap.to(o, {
        v: target, duration: 0.7, ease: "power2.out",
        onUpdate: function () { el.textContent = String(Math.round(o.v)).padStart(pad, "0"); },
        onComplete: function () { el.textContent = String(target).padStart(pad, "0"); el.dataset.counting = ""; }
      });
    };
    var popNum = function (el) { el.classList.remove("num-pop"); void el.offsetWidth; el.classList.add("num-pop"); }; // 애니메이션 재생
    gsap.utils.toArray(".step-no, .pj-no, .bc-no, .bi-no").forEach(function (el) {
      var runNum = function () { el.dataset.counted = ""; countUp(el, true); popNum(el); }; // 재진입마다 0→N + 팝
      ScrollTrigger.create({
        trigger: el, start: "top 92%", end: "bottom 8%",
        onEnter: runNum, onEnterBack: runNum,
        onLeave: function () { el.classList.remove("num-pop"); },
        onLeaveBack: function () { el.classList.remove("num-pop"); }
      });
    });

    // 워드 라이트업 — 스크롤 진행에 따라 문장의 단어를 순차 점등
    document.querySelectorAll("[data-wordlight]").forEach(function (el) {
      var ws = el.querySelectorAll(".wl");
      if (!ws.length) return;
      ScrollTrigger.create({
        trigger: el, start: "top 85%", end: "bottom 62%", scrub: 0.3,
        onUpdate: function (self) {
          var n = Math.round(self.progress * ws.length);
          for (var i = 0; i < ws.length; i++) ws[i].classList.toggle("lit", i < n);
        }
      });
    });
    // 라인 와이프 텍스트 로테이터 — 얇은 라인이 좌→우로 지나가며 옛 글자를 지우고 새 글자를 드러냄
    document.querySelectorAll(".lw").forEach(function (lw) {
      var words = (lw.getAttribute("data-words") || "").split("|").filter(Boolean);
      var cur = lw.querySelector(".lw-cur"), inc = lw.querySelector(".lw-inc"), bar = lw.querySelector(".lw-bar");
      if (words.length < 2 || !cur || !inc || !bar) return;
      var i = 0;
      var setP = function (p) {
        inc.style.clipPath = "inset(0 " + (100 - 100 * p).toFixed(2) + "% 0 0)"; // 새 글자: 좌→우로 드러남
        cur.style.clipPath = "inset(0 0 0 " + (100 * p).toFixed(2) + "%)";        // 옛 글자: 좌→우로 지워짐
        bar.style.left = (100 * p).toFixed(2) + "%";                              // 라인: 경계에서 이동
        bar.style.opacity = (p > 0.02 && p < 0.98) ? "1" : "0";
      };
      var cycle = function () {
        var ni = (i + 1) % words.length;
        inc.textContent = words[ni];
        setP(0);
        var o = { p: 0 };
        gsap.to(o, {
          p: 1, duration: 0.75, ease: "power3.inOut",
          onUpdate: function () { setP(o.p); },
          onComplete: function () {
            cur.textContent = words[ni];
            cur.style.clipPath = "none";
            inc.style.clipPath = "inset(0 100% 0 0)";
            bar.style.opacity = "0";
            i = ni;
            gsap.delayedCall(1.7, cycle); // 정지(hold) 후 다음 단어
          }
        });
      };
      cur.textContent = words[0];
      gsap.delayedCall(1.7, cycle);
    });

    document.querySelectorAll(".svc-tab").forEach(function (t) {
      var run = function () { countUp(document.querySelector("#svp-" + t.getAttribute("data-svc") + " .sp-no"), true); };
      t.addEventListener("click", run);
      t.addEventListener("mouseenter", function () { if (window.matchMedia("(hover:hover) and (min-width:901px)").matches) run(); });
    });
    var firstSp = document.querySelector(".svc-panel.is-active .sp-no");
    if (firstSp) ScrollTrigger.create({ trigger: "#services", start: "top 82%", once: true, onEnter: function () { countUp(firstSp, true); } });

    // 버튼 마그네틱 hover (데스크톱 포인터 전용; reduced-motion 경로는 이미 제외됨)
    if (window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
      document.querySelectorAll(".btn-lg, .nav-cta").forEach(function (btn) {
        btn.classList.add("magnetic");
        var s = 0.28;
        btn.addEventListener("mousemove", function (e) {
          var r = btn.getBoundingClientRect();
          gsap.to(btn, { x: (e.clientX - (r.left + r.width / 2)) * s, y: (e.clientY - (r.top + r.height / 2)) * s, duration: 0.3, ease: "power3.out", overwrite: "auto" });
        });
        btn.addEventListener("mouseleave", function () {
          gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)", overwrite: "auto" });
        });
      });
    }

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
    document.querySelectorAll("[data-wordlight] .wl").forEach(function (w) { w.classList.add("lit"); });
    document.querySelectorAll(".reveal-cur").forEach(function (el) { el.classList.add("in"); });
    document.querySelectorAll(".rl-i").forEach(function (el) { el.style.transform = "none"; }); // 제목 라인리빌 강제 표시
  }
})();
