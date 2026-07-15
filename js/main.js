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

  /* ---------- 1a) 페이지 내비 스크롤 스파이 — 현재 섹션으로 포인트 컬러 라인 이동 ---------- */
  document.querySelectorAll(".page-nav-in").forEach(function (nav) {
    var links = [].slice.call(nav.querySelectorAll('a[href^="#"]'));
    if (links.length < 2) return;
    var marker = document.createElement("span");
    marker.className = "page-nav-marker";
    nav.appendChild(marker);
    var targets = links.map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); });
    var cur = -1;
    var place = function (a) { marker.style.transform = "translateX(" + a.offsetLeft + "px)"; marker.style.width = a.offsetWidth + "px"; };
    var update = function () {
      var pad = (parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 120) + 14;
      var idx = 0;
      for (var i = 0; i < targets.length; i++) { if (targets[i] && targets[i].getBoundingClientRect().top <= pad) idx = i; }
      if (idx === cur) return;
      cur = idx;
      links.forEach(function (a, i) { a.classList.toggle("active", i === idx); });
      var a = links[idx]; place(a);
      nav.scrollTo({ left: Math.max(0, a.offsetLeft - nav.clientWidth / 2 + a.offsetWidth / 2), behavior: reduce ? "auto" : "smooth" }); // 활성 링크가 가로 스크롤 안에 보이게(창 스크롤 영향 없음)
    };
    var ticking = false;
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(function () { update(); ticking = false; }); } }, { passive: true });
    window.addEventListener("resize", function () { if (links[cur]) place(links[cur]); });
    update();
  });

  /* ---------- 1b) 히어로 — 영상 2개 레이어 크로스페이드 + 영상별 카피 전환 ---------- */
  // 영상·카피를 하나의 데이터로 관리(영상 추가 시 slide 객체만 추가하면 됨)
  var heroSlides = [
    {
      video: "assets/hero-1.mp4",
      eyebrow: "AI SEARCH READY",
      title: "AI는 당신의 홈페이지를<br>이해하고 있습니까?",
      lead: "하오웹은 업종 분석과 콘텐츠 기획부터 브랜딩·촬영·편집디자인·웹·앱까지 연결해, 고객이 이해하고 신뢰한 뒤 문의하는 홈페이지를 제작합니다. 검색엔진과 생성형 AI가 정보의 의미와 관계를 이해하기 쉬운 구조까지 제작 과정에 함께 반영합니다."
    },
    {
      video: "assets/hero-3.mp4",
      eyebrow: "BRAND INTEGRATION",
      title: "홈페이지를 넘어,<br>브랜드의 모든 접점을<br>연결합니다.",
      lead: "브랜딩, 촬영, 카탈로그, 편집디자인, 홈페이지와 앱을 각각 따로 제작하지 않고 하나의 브랜드 기준으로 연결합니다."
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
      // 제목: 줄마다 마스크(rl/rl-i) 래핑 → 전환 시 아래에서 부드럽게 상승(갑자기 뜨지 않게)
      if (hTitle) hTitle.innerHTML = s.title.split(/<br\s*\/?>/i).map(function (seg) { return '<span class="rl"><span class="rl-i">' + seg + "</span></span>"; }).join("");
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
      setCopy(0); // 첫 제목도 마스크 래핑(로드 시 즉시 표시, 이후 전환은 마스크 상승)

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
      // 영상 길이를 기다리지 않고 3.8초마다 다음 영상+카피로 전환(전환 자체는 1.2s 크로스페이드)
      setInterval(advance, 3800);
    }
  }

  /* ---------- 1c) 히어로 워터마크 — 포인트 컬러 라인이 글자 획을 따라 그려지는 모션 ----------
     .hero-watermark 텍스트를 SVG 두 겹(고스트 밑선 + 그려지는 라인)으로 교체하고
     stroke-dasharray/dashoffset 로 획을 순차적으로 '쓰는' 느낌. (reduce 모션이면 폴백 텍스트 유지) */
  var wmEls = [].slice.call(document.querySelectorAll(".hero-watermark"));
  if (wmEls.length && !reduce) {
    var SVGNS = "http://www.w3.org/2000/svg";
    var mkText = function (cls, text, cs, fs, ls) {
      var t = document.createElementNS(SVGNS, "text");
      t.setAttribute("x", "0"); t.setAttribute("y", "0");
      t.setAttribute("dominant-baseline", "text-before-edge");
      t.setAttribute("class", cls);
      t.style.fontFamily = cs.fontFamily; t.style.fontWeight = cs.fontWeight;
      t.style.fontSize = fs + "px"; t.style.letterSpacing = ls;
      t.textContent = text;
      return t;
    };
    var buildWM = function (el) {
      var text = (el.getAttribute("data-wm") || el.textContent || "").trim().toUpperCase();
      if (!text) return;
      el.setAttribute("data-wm", text); // 원본 보존(리사이즈 재빌드용)
      var cs = getComputedStyle(el);
      var fs = parseFloat(cs.fontSize) || 160;
      var ls = cs.letterSpacing === "normal" ? "0px" : cs.letterSpacing;
      var svg = document.createElementNS(SVGNS, "svg");
      // 아래→위: 회색 밑선 → 포인트 컬러 라인 → 다시 덮는 회색 라인
      var base = mkText("wm-base", text, cs, fs, ls);
      var color = mkText("wm-color", text, cs, fs, ls);
      var gray = mkText("wm-gray", text, cs, fs, ls);
      svg.appendChild(base); svg.appendChild(color); svg.appendChild(gray);
      svg.style.position = "absolute"; svg.style.visibility = "hidden"; // 측정용
      el.textContent = ""; el.appendChild(svg);
      var bb = color.getBBox();
      var padX = fs * 0.09, padY = fs * 0.16;
      var vbW = bb.width + padX * 2, vbH = bb.height + padY * 2;
      svg.setAttribute("viewBox", (bb.x - padX) + " " + (bb.y - padY) + " " + vbW + " " + vbH);
      svg.setAttribute("width", vbW + "px"); svg.setAttribute("height", vbH + "px");
      svg.style.position = ""; svg.style.visibility = "";
      // 획 둘레 근사 → dash 길이. 글자 아웃라인 둘레는 가로 진행폭의 약 6배(카운터 포함).
      // 부족하면 끝 글자가 안 그려지므로 넉넉히(6배) 잡는다. 두 애니메이션 레이어에 각각 지정.
      var len = Math.round((color.getComputedTextLength() || bb.width) * 6);
      [color, gray].forEach(function (t) {
        t.style.setProperty("--wm-len", String(len));
        t.style.strokeDasharray = String(len);
        t.style.strokeDashoffset = String(len);
      });
    };
    wmEls.forEach(buildWM);
    var wmT;
    window.addEventListener("resize", function () {
      clearTimeout(wmT);
      wmT = setTimeout(function () { wmEls.forEach(buildWM); }, 220);
    });
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

  /* ---------- 3c) 전환 측정 훅 (dataLayer + 공통 track 함수) ----------
     실제 분석 도구 미연결 상태 — 외부 스크립트 없이 이벤트만 쌓아 둔다. 추후 GA/GTM 연결 시 dataLayer 소비. */
  window.dataLayer = window.dataLayer || [];
  function track(ev, data) {
    if (!ev) return;
    try { window.dataLayer.push(Object.assign({ event: ev, ts: undefined }, data || {})); } catch (e) {}
    if (typeof window.haowebTrack === "function") { try { window.haowebTrack(ev, data || {}); } catch (e2) {} }
  }
  window.haowebEmit = track; // 외부에서도 호출 가능
  if (/portfolio-detail\.html/i.test(location.pathname)) track("portfolio_detail_view", {}); // 페이지뷰 훅
  // data-ev 속성이 있는 요소 클릭 → 자동 트래킹
  document.addEventListener("click", function (e) {
    var t = e.target.closest("a[data-ev], button[data-ev]"); // 폼(submit는 별도 처리)은 제외해 중복 방지
    if (t && !t.disabled) track(t.getAttribute("data-ev"), { label: (t.textContent || "").trim().slice(0, 40) });
  });

  /* ---------- 3d) 빠른 상담 FAB (전 페이지 공통 · JS 주입) ----------
     기본 '상담하기' → 클릭 시 경로 분기. 카카오/전화는 실제 채널 확인 전이라 '준비 중'(링크 비공개). */
  (function initQuickContact() {
    if (document.querySelector(".qc-fab")) return;
    var fab = document.createElement("div");
    fab.className = "qc-fab";
    fab.innerHTML =
      '<div class="qc-menu" id="qc-menu" role="menu" hidden>' +
        '<a role="menuitem" href="diagnosis.html" data-ev="diagnosis_start"><b>홈페이지 진단</b><span>현재 홈페이지에서 우선 확인할 부분</span></a>' +
        '<a role="menuitem" href="site-plan.html" data-ev="siteplan_start"><b>구조안 신청</b><span>우리 업종에 맞는 기본 구조 안내</span></a>' +
        '<a role="menuitem" href="inquiry.html" data-ev="inquiry_start"><b>제작 상담</b><span>프로젝트를 구체적으로 논의</span></a>' +
        '<button type="button" role="menuitem" class="qc-soon" data-ev="kakao_contact_click" disabled><b>카카오톡 상담</b><span>채널 준비 중</span></button>' +
        '<button type="button" role="menuitem" class="qc-soon" data-ev="phone_contact_click" disabled><b>전화 문의</b><span>번호 준비 중</span></button>' +
      '</div>' +
      '<button class="qc-btn" type="button" aria-expanded="false" aria-controls="qc-menu"><span class="qc-btn-t">상담하기</span></button>';
    document.body.appendChild(fab);
    var btn = fab.querySelector(".qc-btn");
    var menu = fab.querySelector(".qc-menu");
    var setOpen = function (open) {
      fab.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
      if (open) { menu.hidden = false; track("quick_contact_open", {}); }
      else { menu.hidden = true; }
    };
    btn.addEventListener("click", function () { setOpen(!fab.classList.contains("is-open")); });
    document.addEventListener("click", function (e) { if (!fab.contains(e.target)) setOpen(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
    // 하단 CTA·푸터가 보이면 FAB 숨김(본문/동의/하단 버튼을 가리지 않게)
    var tails = [document.querySelector(".final-cta"), document.querySelector(".site-footer")].filter(Boolean);
    if (tails.length && "IntersectionObserver" in window) {
      var visible = {};
      var io = new IntersectionObserver(function (ents) {
        ents.forEach(function (ent) { visible[ent.target.className] = ent.isIntersecting; });
        var anyVisible = Object.keys(visible).some(function (k) { return visible[k]; });
        fab.classList.toggle("qc-hide", anyVisible);
        if (anyVisible) setOpen(false);
      }, { threshold: 0.01 });
      tails.forEach(function (t) { io.observe(t); });
    }
    // TODO(내부 확인): 카카오톡 채널 URL·대표 전화번호 확정 후 .qc-soon → 실제 링크로 교체
  })();

  /* ---------- 3e) 폼 전송 안내 (백엔드 미연결) ----------
     data-noserver 폼은 실제 전송 대신 안내만 노출. '접수 완료' 문구 사용하지 않음. */
  document.querySelectorAll("form[data-noserver]").forEach(function (form) {
    var notice = form.querySelector(".form-notice");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      track(form.getAttribute("data-ev") || "form_submit", { form: form.getAttribute("name") || "" });
      if (notice) {
        notice.hidden = false;
        notice.setAttribute("role", "status");
        notice.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
        form.querySelector('[type="submit"]').disabled = true;
      }
    });
    // 입력 시작 시 1회 start 이벤트
    var started = false;
    form.addEventListener("input", function () {
      if (started) return; started = true;
      track((form.getAttribute("data-ev-start")) || "form_start", { form: form.getAttribute("name") || "" });
    });
  });

  /* ---------- 3f) 홈페이지 진단 — 주소 프리필 + 점검 항목 순차 활성화 ---------- */
  (function initDiagnosis() {
    // diagnosis.html: 메인에서 넘어온 ?url= 를 주소 입력에 채움
    try {
      var q = new URLSearchParams(window.location.search);
      var url = q.get("url");
      var input = document.getElementById("d-url");
      if (url && input && !input.value) { input.value = url; }
    } catch (e) {}
    // 점검 항목 리스트가 화면에 들어오면 순서대로 체크 표시
    var lists = document.querySelectorAll("[data-diag-checklist]");
    if (!lists.length) return;
    if (reduce) { lists.forEach(function (ul) { [].forEach.call(ul.children, function (li) { li.classList.add("on"); }); }); return; }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (ent) {
        if (ent.isIntersecting) {
          var items = [].slice.call(ent.target.children);
          items.forEach(function (li, i) { setTimeout(function () { li.classList.add("on"); }, 140 * i); });
        } else {
          [].forEach.call(ent.target.children, function (li) { li.classList.remove("on"); }); // 재진입 시 다시 재생
        }
      });
    }, { threshold: 0.35 });
    lists.forEach(function (ul) { io.observe(ul); });
  })();

  /* ---------- 3g) 30초 프로젝트 체크 (단계형 → 결과 → 문의/구조안 전달) ---------- */
  (function initProjectCheck() {
    var root = document.querySelector("[data-pcheck]");
    if (!root) return;
    var steps = [].slice.call(root.querySelectorAll(".pc-step:not(.pc-result)"));
    var result = root.querySelector(".pc-result");
    var bar = root.querySelector(".pc-bar");
    var curEl = root.querySelector(".pc-cur");
    var prevBtn = root.querySelector(".pc-prev");
    var nextBtn = root.querySelector(".pc-next");
    var total = steps.length;
    var idx = 0, started = false;

    var answers = function () {
      var a = {};
      for (var i = 0; i < total; i++) {
        var checked = [].slice.call(root.querySelectorAll('input[name="q' + i + '"]:checked')).map(function (n) { return n.value; });
        a["q" + i] = checked;
      }
      return a;
    };
    var stepAnswered = function (i) { return root.querySelectorAll('input[name="q' + i + '"]:checked').length > 0; };

    var render = function () {
      steps.forEach(function (s, i) { s.hidden = i !== idx; });
      result.hidden = true;
      bar.style.width = ((idx) / total * 100) + "%";
      curEl.textContent = String(idx + 1).padStart(2, "0");
      prevBtn.disabled = idx === 0;
      nextBtn.disabled = !stepAnswered(idx);
      nextBtn.textContent = idx === total - 1 ? "결과 보기" : "다음";
    };

    // 라벨/검토항목 산출 (확정 견적·기간 없음)
    var buildResult = function () {
      var a = answers();
      var goal = (a.q0[0] || "");
      var assets = a.q2, needs = a.q3;
      var has = function (arr, v) { return arr.indexOf(v) >= 0; };
      var baseMap = {
        "회사 소개와 문의": ["기업 홈페이지", "사업과 서비스 정보구조"],
        "예약과 상담": ["예약·상담 중심 홈페이지", "예약·상담 동선과 신뢰 정보"],
        "상품 판매": ["쇼핑몰", "상품 분류와 구매 동선"],
        "가맹 모집": ["프랜차이즈 홈페이지", "브랜드 경쟁력과 가맹 문의 동선"],
        "광고 전환": ["랜딩페이지", "핵심 메시지와 전환 동선"],
        "모바일 앱 운영": ["앱 서비스", "사용자 흐름과 화면 설계"]
      };
      var base = baseMap[goal] || ["홈페이지", "핵심 정보구조"];
      var mods = [], items = [base[1]];
      var contentNeeded = has(needs, "웹 원고") || has(assets, "거의 준비되지 않음") || !has(assets, "웹 원고");
      if (contentNeeded) { mods.push("콘텐츠 기획"); items.push("웹 원고와 콘텐츠 구성"); }
      if (has(assets, "회사소개서") || has(assets, "카탈로그")) items.push("회사소개서·카탈로그 자료 정리");
      if (has(needs, "촬영") || !has(assets, "사진")) { mods.push("촬영 검토"); items.push("기업·제품 촬영 범위"); }
      if (has(needs, "브랜딩") || !has(assets, "로고와 브랜드 가이드")) { mods.push("브랜딩 정리"); }
      if (has(needs, "카탈로그·편집디자인")) items.push("카탈로그·편집디자인 연계");
      if (needs.filter(function (n) { return n !== "아직 잘 모르겠음"; }).length >= 3) items.push("서비스별 전문 페이지");
      items.push("문의 동선");
      items.push("검색·AI 대응 구조(SEO·AEO·GEO)");
      // 중복 제거
      items = items.filter(function (v, i, arr) { return arr.indexOf(v) === i; });
      var label = mods.length ? (base[0] + "＋" + mods.slice(0, 2).join("＋") + "형") : (base[0] + " 제작형");
      return { label: label, items: items, answers: a };
    };

    var showResult = function () {
      var r = buildResult();
      result.querySelector(".pc-rtype").textContent = r.label;
      var ul = result.querySelector(".pc-rlist");
      ul.innerHTML = "";
      r.items.forEach(function (it) { var li = document.createElement("li"); li.textContent = it; ul.appendChild(li); });
      // 결과·선택 전달 (query string + sessionStorage). JS-off여도 CTA 기본 링크는 동작.
      var a = r.answers;
      var qp = function (obj) { return Object.keys(obj).map(function (k) { return k + "=" + encodeURIComponent(obj[k]); }).join("&"); };
      var common = { goal: a.q0[0] || "", mode: a.q1[0] || "", assets: a.q2.join("·"), needs: a.q3.join("·"), timing: a.q4[0] || "", summary: r.label };
      try { sessionStorage.setItem("haoweb_pcheck", JSON.stringify({ label: r.label, items: r.items, answers: a })); } catch (e) {}
      var inq = root.querySelector(".pc-cta-inquiry");
      var sp = root.querySelector(".pc-cta-siteplan");
      if (inq) inq.href = "inquiry.html?topic=build&" + qp(common);
      if (sp) sp.href = "site-plan.html?" + qp({ goal: common.goal, needs: common.needs, summary: r.label });
      steps.forEach(function (s) { s.hidden = true; });
      result.hidden = false;
      bar.style.width = "100%";
      curEl.textContent = String(total).padStart(2, "0");
      prevBtn.disabled = false;
      nextBtn.disabled = true;
      nextBtn.style.visibility = "hidden";
      track("project_check_complete", { summary: r.label });
    };

    root.addEventListener("change", function (e) {
      if (e.target.name && /^q\d$/.test(e.target.name)) {
        if (!started) { started = true; track("project_check_start", {}); }
        nextBtn.disabled = !stepAnswered(idx);
      }
    });
    nextBtn.addEventListener("click", function () {
      if (idx < total - 1) { idx++; render(); }
      else { showResult(); }
    });
    prevBtn.addEventListener("click", function () {
      if (!result.hidden) { result.hidden = true; nextBtn.style.visibility = ""; idx = total - 1; render(); return; }
      if (idx > 0) { idx--; render(); }
    });
    var restart = root.querySelector(".pc-restart");
    if (restart) restart.addEventListener("click", function () {
      root.querySelectorAll("input:checked").forEach(function (n) { n.checked = false; });
      idx = 0; started = false; nextBtn.style.visibility = ""; result.hidden = true; render();
      root.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    });
    render();
  })();

  /* ---------- 3h) 제작 유형 카드 — 터치/클릭 선택 강조(hover는 CSS) ---------- */
  (function initPtypes() {
    var cards = [].slice.call(document.querySelectorAll(".ptype"));
    if (!cards.length) return;
    cards.forEach(function (c) {
      c.addEventListener("click", function () {
        var on = c.classList.contains("is-active");
        cards.forEach(function (x) { x.classList.remove("is-active"); });
        if (!on) c.classList.add("is-active");
      });
      c.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); c.click(); } });
    });
  })();

  /* ---------- 3i) 폼 프리필 — 30초 체크/진단 결과를 문의·구조안으로 이어받기 ---------- */
  (function initPrefill() {
    var params;
    try { params = new URLSearchParams(window.location.search); } catch (e) { return; }
    if (![].slice.call(params.keys()).length) return;
    var get = function (k) { return params.get(k) || ""; };
    // 1) 요약 배너
    var summary = get("summary");
    document.querySelectorAll("[data-prefill-summary]").forEach(function (el) {
      if (summary) { el.textContent = "30초 프로젝트 체크 결과 · " + summary; el.hidden = false; }
    });
    // 2) 이름이 일치하는 필드 자동 채움(텍스트/셀렉트/라디오). 비어 있을 때만.
    var fill = function (name, value) {
      if (!value) return;
      var els = document.querySelectorAll('[name="' + name + '"]');
      if (!els.length) return;
      var first = els[0];
      if (first.type === "radio") {
        [].forEach.call(els, function (r) { if (r.value === value) r.checked = true; });
      } else if (first.tagName === "SELECT") {
        [].forEach.call(first.options, function (o) { if (o.value === value) first.value = value; });
      } else if (!first.value) { first.value = value; }
    };
    fill("industry", get("industry"));
    fill("goal", get("goal"));
    fill("mode", get("mode"));
    fill("timing", get("timing"));
    // 3) 상세 textarea 가 있으면 체크 결과 요약을 앞에 넣어 전달되게
    var detail = document.querySelector('textarea[name="detail"], textarea[name="message"]');
    if (detail && !detail.value && (summary || get("goal"))) {
      var lines = ["[30초 프로젝트 체크 결과]"];
      if (summary) lines.push("유형: " + summary);
      if (get("goal")) lines.push("목표: " + get("goal"));
      if (get("mode")) lines.push("구분: " + get("mode"));
      if (get("needs")) lines.push("필요 업무: " + get("needs"));
      if (get("assets")) lines.push("보유 자료: " + get("assets"));
      if (get("timing")) lines.push("희망 일정: " + get("timing"));
      detail.value = lines.join("\n") + "\n\n";
    }
  })();

  /* ---------- 3j) 문의 조건부 폼 — 유형 선택 시 해당 항목만 노출 ---------- */
  (function initInquiryForm() {
    var form = document.querySelector('form[name="inquiry"]');
    if (!form) return;
    var panels = [].slice.call(form.querySelectorAll("[data-inq-panel]"));
    if (!panels.length) return;
    var radios = [].slice.call(form.querySelectorAll('input[name="topic"]'));
    var showPanel = function (topic) {
      panels.forEach(function (p) {
        var on = p.getAttribute("data-inq-panel") === topic;
        p.hidden = !on;
        // 숨김 패널 입력은 비활성화 → 검증·전송에서 제외(보이는 항목만 필수 처리)
        [].forEach.call(p.querySelectorAll("input, select, textarea"), function (el) { el.disabled = !on; });
      });
    };
    radios.forEach(function (r) { r.addEventListener("change", function () { if (r.checked) showPanel(r.value); }); });
    // 초기 유형: ?topic= 우선, 없으면 checked 라디오
    var initial = "";
    try { initial = new URLSearchParams(window.location.search).get("topic") || ""; } catch (e) {}
    var target = initial && radios.filter(function (r) { return r.value === initial; })[0];
    if (target) { target.checked = true; }
    var current = radios.filter(function (r) { return r.checked; })[0];
    showPanel(current ? current.value : (panels[0].getAttribute("data-inq-panel")));
  })();

  /* ---------- 3k) 제작 원칙 — 스크롤 시 우측 스티키 이미지 전환 ---------- */
  (function initWhyScroll() {
    var root = document.querySelector("[data-why-scroll]");
    if (!root) return;
    var items = [].slice.call(root.querySelectorAll(".why-item"));
    var figs = [].slice.call(root.querySelectorAll(".why-fig"));
    if (!items.length || !figs.length) return;
    root.classList.add("is-live");
    var setActive = function (i) {
      items.forEach(function (it, k) { it.classList.toggle("is-current", k === i); });
      figs.forEach(function (f, k) { f.classList.toggle("is-active", k === i); });
    };
    // 화면 세로 중앙 밴드를 지나는 항목을 활성화
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (ent) {
        if (ent.isIntersecting) {
          var i = parseInt(ent.target.getAttribute("data-i"), 10) || 0;
          setActive(i);
        }
      });
    }, { rootMargin: "-48% 0px -48% 0px", threshold: 0 });
    items.forEach(function (it) { io.observe(it); });
    setActive(0);
  })();

  /* ---------- 3l) 문의 성공 화면 — 운영용(백엔드 연결 후). ?view=success 로 노출 ---------- */
  (function initSuccessView() {
    var success = document.getElementById("inq-success");
    if (!success) return;
    var params;
    try { params = new URLSearchParams(window.location.search); } catch (e) { return; }
    if (params.get("view") !== "success") return; // 개발 상태에선 기본 숨김
    // 폼 섹션 숨기고 성공 화면 노출
    var formSec = document.getElementById("form");
    if (formSec) formSec.hidden = true;
    success.hidden = false;
    // 요약 채우기(전달된 값이 있으면)
    var topicMap = { diagnosis: "홈페이지 진단", siteplan: "업종 구조안", build: "제작 상담", maintenance: "유지관리 문의", government: "정부지원사업 문의" };
    var set = function (key, val) { var el = success.querySelector('[data-sc="' + key + '"]'); if (el && val) el.textContent = val; };
    set("topic", topicMap[params.get("topic")] || (params.get("topic") ? params.get("topic") : "제작 상담"));
    var who = [params.get("company"), params.get("name")].filter(Boolean).join(" · ");
    if (who) set("who", who);
    var contact = params.get("phone") || params.get("email");
    if (contact) set("contact", contact);
    window.scrollTo(0, 0);
    track("inquiry_success_view", { topic: params.get("topic") || "" });
  })();

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
      }, { threshold: 0, rootMargin: "0px 0px -10% 0px" }); // 화면에서 완전히 벗어났을 때만 리셋(부분 노출 중 닫힘 방지)
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

    // 스크롤 리빌 — IntersectionObserver로 .in 토글(CSS 트랜지션이 페이드/상승 처리).
    // 화면에서 '완전히' 벗어났을 때만 숨김 → 재진입마다 재생하면서도 화면 안 콘텐츠는 절대 숨기지 않음(빈 화면 버그 방지).
    gsap.set(reveals, { clearProps: "opacity,transform" }); // 혹시 남은 GSAP 인라인 제거 → CSS(.reveal/.reveal.in)가 담당
    var revIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.target.classList.toggle("in", e.isIntersecting); });
    }, { threshold: 0, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { revIO.observe(el); });

    // 제목 라인 마스크 리빌 (SplitText 대체: <br> 기준 라인 분할 → 순차 상승) — 108 Creativemore·004 Primora·105 Towards 시그니처
    gsap.utils.toArray(".section-title, .bi-title, .page-hero-title, .final-cta h2, .dfx-title").forEach(function (h) {
      if (h.dataset.split || !h.innerHTML.trim()) return;
      h.dataset.split = "1";
      h.innerHTML = h.innerHTML.split(/<br\s*\/?>/i).map(function (seg) {
        return '<span class="rl"><span class="rl-i">' + seg + "</span></span>";
      }).join("");
      gsap.set(h, { clearProps: "transform,scale" }); // 컨테이너 인라인 초기화(라인 상승은 CSS + .in 이 담당)
      h.style.opacity = "1"; // 컨테이너는 항상 보이게(마스크 안에서 라인만 상승)
      h.classList.add("reveal"); // .reveal.in .rl-i 선택자 매칭(원래 reveal 아닌 제목도 포함)
      revIO.observe(h);          // 뷰포트 진입 시 .in 토글 → CSS 라인 상승(재진입마다 재생)
    });

    // 안전장치: IO가 늦거나 실패해도 '화면 안'의 리빌은 반드시 표시(화면 밖은 안 건드림 → 재진입 재생 유지)
    setTimeout(function () {
      document.querySelectorAll(".reveal").forEach(function (el) {
        if (el.classList.contains("in")) return;
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.95 && r.bottom > 0) el.classList.add("in");
      });
    }, 2200);

    // 히어로 패럴랙스 (미묘하게)
    if (document.querySelector(".hero-demo")) {
      gsap.to(".hero-demo", { yPercent: 14, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    }
    if (document.querySelector(".hero-copy")) {
      gsap.to(".hero-copy", { yPercent: -5, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    }

    // 핵심 3축 — 섹션 진입 시 상단 레드라인이 좌→우로 그려지며 01→02→03 순차 활성화(관계 유지, 재진입 재생)
    var axes3 = document.querySelector(".axes3");
    if (axes3 && "IntersectionObserver" in window) {
      var a3items = [].slice.call(axes3.querySelectorAll(".axis3"));
      var a3on = function () { axes3.classList.add("drawn"); a3items.forEach(function (it, i) { clearTimeout(it._t); it._t = setTimeout(function () { it.classList.add("on"); }, 160 + i * 300); }); };
      var a3off = function () { axes3.classList.remove("drawn"); a3items.forEach(function (it) { clearTimeout(it._t); it.classList.remove("on"); }); };
      var a3io = new IntersectionObserver(function (es) { es.forEach(function (e) { e.isIntersecting ? a3on() : a3off(); }); }, { threshold: 0, rootMargin: "0px 0px -14% 0px" });
      a3io.observe(axes3); // threshold 0 → 완전히 화면 밖일 때만 리셋(안전)
    }

    // 방문자 여정(.jrny) — 진입 시 01→N 순서로 단계 활성화(연결선 레드 진행). 전 페이지 공통, 재진입 재생
    if ("IntersectionObserver" in window) {
      document.querySelectorAll(".jrny").forEach(function (jr) {
        var steps = [].slice.call(jr.querySelectorAll("li"));
        var jon = function () { steps.forEach(function (li, i) { clearTimeout(li._t); li._t = setTimeout(function () { li.classList.add("on"); }, i * 240); }); };
        var joff = function () { steps.forEach(function (li) { clearTimeout(li._t); li.classList.remove("on"); }); };
        var jio = new IntersectionObserver(function (es) { es.forEach(function (e) { e.isIntersecting ? jon() : joff(); }); }, { threshold: 0, rootMargin: "0px 0px -12% 0px" });
        jio.observe(jr);
      });
    }

    // SEARCH & AI (.saeg) — SEO→AEO→GEO 순차 활성화(누적) + 진행선. main·search-ai 공통
    var saeg = document.querySelector(".saeg");
    if (saeg && "IntersectionObserver" in window) {
      var saegItems = [].slice.call(saeg.querySelectorAll(".saeg-item"));
      var saegIO = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) e.target.classList.add("on"); }); }, { threshold: 0.4, rootMargin: "0px 0px -12% 0px" });
      saegItems.forEach(function (it) { saegIO.observe(it); });
      var saegFill = saeg.querySelector(".saeg-rail span");
      if (saegFill) {
        ScrollTrigger.create({ trigger: saeg, start: "top 62%", end: "bottom 55%", scrub: true, onUpdate: function (self) { saegFill.style.height = (self.progress * 100).toFixed(1) + "%"; } });
      }
      new IntersectionObserver(function (es) { es.forEach(function (e) { if (!e.isIntersecting) saegItems.forEach(function (it) { it.classList.remove("on"); }); }); }, { threshold: 0 }).observe(saeg);
    }

    // 브랜드 통합 4단계 — 스크롤에 따라 현재 단계 활성화 + 연결선 진행
    var biSteps = gsap.utils.toArray(".bi-step");
    if (biSteps.length) {
      // 누적 방식: 지나온 단계는 계속 포인트 컬러로 채워진 채 유지 → 다 보이는 화면에선 전부 채워짐
      if ("IntersectionObserver" in window) {
        var biStepIO = new IntersectionObserver(function (es) {
          es.forEach(function (e) { if (e.isIntersecting) e.target.classList.add("on"); });
        }, { threshold: 0.3, rootMargin: "0px 0px -8% 0px" });
        biSteps.forEach(function (s) { biStepIO.observe(s); });
      } else {
        biSteps.forEach(function (s) { s.classList.add("on"); });
      }
      var biFill = document.querySelector(".bi-rail-fill");
      var biList = document.querySelector(".bi-steps");
      if (biFill && biList) {
        ScrollTrigger.create({
          trigger: biList, start: "top 60%", end: "bottom 46%", scrub: true,
          onUpdate: function (self) { biFill.style.height = (self.progress * 100).toFixed(1) + "%"; }
        });
        // 섹션이 완전히 화면 밖이면 리셋(재진입 시 다시 차례로 점등)
        if ("IntersectionObserver" in window) {
          new IntersectionObserver(function (es) {
            es.forEach(function (e) { if (!e.isIntersecting) biSteps.forEach(function (s) { s.classList.remove("on"); }); });
          }, { threshold: 0 }).observe(biList);
        }
      }
    }

    // 제작 프로세스 7단계 — 스크롤에 따라 좌측 대형 표시 전환 + hover 시 해당 단계 미리보기 (IO 스크롤스파이)
    var procItems = [].slice.call(document.querySelectorAll(".proc-item"));
    if (procItems.length) {
      var pCurNo = document.querySelector(".proc-cur-no");
      var pCurTitle = document.querySelector(".proc-cur-title");
      var pCount = document.querySelector(".proc-count b");
      var pFill = document.querySelector(".proc-track-fill");
      var pTotal = procItems.length;
      var procCur = 0;
      var setProc = function (i) {
        if (i < 0 || i >= pTotal) return;
        procItems.forEach(function (it, idx) { it.classList.toggle("on", idx === i); });
        var el = procItems[i];
        if (pCurNo) pCurNo.textContent = el.getAttribute("data-no");
        if (pCurTitle) pCurTitle.textContent = el.getAttribute("data-title");
        if (pCount) pCount.textContent = el.getAttribute("data-no");
        if (pFill) pFill.style.width = (((i + 1) / pTotal) * 100).toFixed(1) + "%";
      };
      if ("IntersectionObserver" in window) {
        // 화면 중앙 얇은 밴드에 들어온 단계를 현재로(순차 전환)
        var procIO = new IntersectionObserver(function (es) {
          es.forEach(function (e) { if (e.isIntersecting) { procCur = procItems.indexOf(e.target); setProc(procCur); } });
        }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
        procItems.forEach(function (it) { procIO.observe(it); });
      }
      // hover: 오른쪽 단계에 커서 → 왼쪽 큰 숫자·제목이 그 단계로. 떠나면 스크롤 현재로 복귀
      procItems.forEach(function (it, i) {
        it.addEventListener("mouseenter", function () { setProc(i); });
        it.addEventListener("mouseleave", function () { setProc(procCur); });
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
    gsap.utils.toArray(".step-no, .pj-no, .bc-no, .bi-no").forEach(function (el) {
      ScrollTrigger.create({ trigger: el, start: "top 92%", once: true, onEnter: function () { countUp(el); el.classList.add("num-pop"); } });
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
      // 라인·클립을 동일한 px 기준으로 구동 → 라인과 글자 전환이 정확히 일치. 실제 글자 폭까지만 쓸어 지나감(빈 공간 X)
      var setP = function (p, curW, incW, extent) {
        var b = p * extent;                                                          // 경계 위치(px, 글자 왼쪽 기준)
        inc.style.clipPath = "inset(0 " + Math.max(0, incW - b).toFixed(1) + "px 0 0)"; // 새 글자: 좌→우로 드러남
        cur.style.clipPath = "inset(0 0 0 " + b.toFixed(1) + "px)";                     // 옛 글자: 좌→우로 지워짐
        bar.style.left = b.toFixed(1) + "px";                                          // 라인: 정확히 경계에
        bar.style.opacity = (p > 0.015 && p < 0.985) ? "1" : "0";
      };
      var cycle = function () {
        var ni = (i + 1) % words.length;
        inc.textContent = words[ni];
        var curW = cur.offsetWidth, incW = inc.offsetWidth, extent = Math.max(curW, incW); // 두 단어를 모두 덮는 실제 폭
        setP(0, curW, incW, extent);
        var o = { p: 0 };
        gsap.to(o, {
          p: 1, duration: 0.9, ease: "power2.inOut", // 조금 느리고 균일한 감속(너무 빨리 지나가지 않게)
          onUpdate: function () { setP(o.p, curW, incW, extent); },
          onComplete: function () {
            cur.textContent = words[ni];
            cur.style.clipPath = "none";
            inc.style.clipPath = "inset(0 100% 0 0)";
            bar.style.opacity = "0";
            i = ni;
            gsap.delayedCall(1.9, cycle); // 정지(hold) 후 다음 단어
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
