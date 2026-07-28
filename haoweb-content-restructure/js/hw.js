(function(){
  /* 네비 + 모바일 메뉴 · 모션과 무관하게 항상 동작 */
  var nav=document.getElementById("nav"),burger=document.getElementById("burger"),mnav=document.getElementById("mnav");
  if(nav) addEventListener("scroll",function(){nav.classList.toggle("nav--solid",(window.scrollY||0)>30);},{passive:true});
  if(burger&&mnav){
    var setMenu=function(o){
      mnav.classList.toggle("open",o); mnav.hidden=!o;
      burger.setAttribute("aria-expanded",o); burger.textContent=o?"CLOSE":"MENU";
      document.documentElement.style.overflow=o?"hidden":"";
      if(o){ var f=mnav.querySelector("summary"); if(f) f.focus(); }
    };
    burger.addEventListener("click",function(){ setMenu(!mnav.classList.contains("open")); });
    mnav.querySelectorAll(".mnav__sub a,.mnav__cta").forEach(function(a){a.addEventListener("click",function(){ setMenu(false); });});
    document.addEventListener("keydown",function(e){ if(e.key==="Escape"&&mnav.classList.contains("open")){ setMenu(false); burger.focus(); }});
  }

  /* 현재 페이지 표시(aria-current) · GNB 대메뉴 + 모바일 아코디언에서 현재 파일 포함 항목 활성 */
  (function(){
    var here=(location.pathname.split("/").pop()||"index.html").toLowerCase();
    var norm=function(h){return (h||"").split("#")[0].split("?")[0].split("/").pop().toLowerCase();};
    document.querySelectorAll(".gnb__i,.mnav__g").forEach(function(it){
      var on=false;
      it.querySelectorAll("a[href]").forEach(function(a){ if(norm(a.getAttribute("href"))===here){ on=true; a.setAttribute("aria-current","page"); }});
      if(on){ it.classList.add("is-current"); if(it.tagName==="DETAILS") it.open=true; var top=it.querySelector(":scope>a"); if(top&&!top.hasAttribute("aria-current")) top.setAttribute("aria-current","page"); }
    });
  })();

  /* 포트폴리오·인터뷰: 실데이터 있을 때만 노출(모션과 무관, 항상 실행) */
  (function(){
    var grid=document.getElementById("showcase-grid"), sec=document.getElementById("showcase");
    if(!grid||!sec) return;
    function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
    function load(u){return u?fetch(u).then(function(r){return r.ok?r.json():[];}).catch(function(){return[];}):Promise.resolve([]);}
    function card(href,t,s){return '<a href="'+esc(href)+'"><b>'+esc(t)+'</b>'+(s?'<span>'+esc(s)+'</span>':'')+'</a>';}
    Promise.all([load(grid.getAttribute("data-portfolio")),load(grid.getAttribute("data-interview"))]).then(function(r){
      var pf=Array.isArray(r[0])?r[0]:[], iv=Array.isArray(r[1])?r[1]:[];
      if(!pf.length&&!iv.length) return; /* 데이터 없음 → 섹션 숨김 유지 */
      var h="";
      pf.slice(0,2).forEach(function(p){h+=card(p.url||"portfolio.html",p.title||p.name||"프로젝트",p.summary||p.client||"");});
      iv.slice(0,2).forEach(function(v){h+=card(v.url||"interview.html",v.company||v.name||"고객 인터뷰",v.summary||v.quote||"");});
      grid.innerHTML=h; sec.hidden=false; sec.removeAttribute("aria-hidden");
      document.querySelectorAll("[data-hide-when-data]").forEach(function(el){el.hidden=true;}); /* 실데이터 들어오면 준비중 블록 자동 숨김 */
    });
  })();

  var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 몰입 문장 배경 · 커서 반발 파티클 필드(데스크톱·모션 허용 시에만, GSAP과 무관) */
  (function(){
    if(reduce || !matchMedia("(pointer:fine)").matches) return;
    var cv=document.querySelector(".imm__field");
    if(!cv || !cv.getContext) return;
    var ctx=cv.getContext("2d"); if(!ctx) return;
    var stage=cv.parentElement, imm=stage.closest(".imm")||stage;
    var W=0,H=0,DPR=Math.min(2, window.devicePixelRatio||1);
    var PAL=[
      {hi:"#ff9166",base:"#E83817",edge:"#7c1a0b"},   /* red */
      {hi:"#ffffff",base:"#e7e5dc",edge:"#8d8a80"},   /* white */
      {hi:"#34343d",base:"#1a1a21",edge:"#0b0b0f"},   /* dark(깊이) */
      {hi:"#34343d",base:"#1a1a21",edge:"#0b0b0f"}
    ];
    var ps=[], mx=null, my=null, raf=0, active=false, t0=0;
    function build(){
      ps=[];
      var count=Math.min(52, Math.max(22, Math.round(W/28)));
      for(var i=0;i<count;i++){
        var r=6+Math.pow(Math.random(),1.7)*26, bx=Math.random()*W, by=Math.random()*H;
        ps.push({bx:bx,by:by,x:bx,y:by,vx:0,vy:0,r:r,
          amp:14+Math.random()*28, ph:Math.random()*6.28, sp:.3+Math.random()*.5,
          col:PAL[(Math.random()*PAL.length)|0], a:.4+Math.random()*.42});
      }
    }
    function size(){
      var rc=stage.getBoundingClientRect(); W=rc.width; H=rc.height;
      cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); build();
    }
    function ball(p){
      var g=ctx.createRadialGradient(p.x-p.r*.35,p.y-p.r*.42,p.r*.1,p.x,p.y,p.r);
      g.addColorStop(0,p.col.hi); g.addColorStop(.5,p.col.base); g.addColorStop(1,p.col.edge);
      ctx.globalAlpha=p.a; ctx.fillStyle=g;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,6.2832); ctx.fill();
    }
    function frame(t){
      if(!t0)t0=t; var tt=t-t0; ctx.clearRect(0,0,W,H); var R=150;
      for(var i=0;i<ps.length;i++){
        var p=ps[i];
        var hx=p.bx+Math.sin(tt*.0004*p.sp+p.ph)*p.amp, hy=p.by+Math.cos(tt*.0005*p.sp+p.ph)*p.amp;
        var ax=(hx-p.x)*.012, ay=(hy-p.y)*.012;
        if(mx!==null){
          var dx=p.x-mx, dy=p.y-my, d2=dx*dx+dy*dy;
          if(d2<R*R){ var d=Math.sqrt(d2)||1, f=(1-d/R)*3.2; ax+=(dx/d)*f; ay+=(dy/d)*f; }
        }
        p.vx=(p.vx+ax)*.86; p.vy=(p.vy+ay)*.86; p.x+=p.vx; p.y+=p.vy; ball(p);
      }
      ctx.globalAlpha=1; raf=requestAnimationFrame(frame);
    }
    function start(){ if(active)return; active=true; t0=0; raf=requestAnimationFrame(frame); }
    function stop(){ active=false; cancelAnimationFrame(raf); }
    stage.addEventListener("mousemove",function(e){ var rc=cv.getBoundingClientRect(); mx=e.clientX-rc.left; my=e.clientY-rc.top; },{passive:true});
    stage.addEventListener("mouseleave",function(){ mx=my=null; });
    addEventListener("resize",size,{passive:true});
    size();
    if("IntersectionObserver" in window){
      new IntersectionObserver(function(es){ es.forEach(function(en){ en.isIntersecting?start():stop(); }); },{threshold:.01}).observe(imm);
    } else start();
  })();

  /* CDN(gsap/ScrollTrigger) 로드 실패나 reduced-motion이면 모션 미적용 —
     콘텐츠는 무JS 기준 CSS로 전부 표시되므로 숨겨지지 않음 */
  if(reduce||!window.gsap||!window.ScrollTrigger) return;
  document.documentElement.classList.add("anim");
  gsap.registerPlugin(ScrollTrigger);

  /* smooth scroll (원리는 동일하나 lerp 등 세팅은 다르게) */
  if(window.Lenis){
    var lenis=new Lenis({lerp:.11,wheelMultiplier:1});
    lenis.on("scroll",ScrollTrigger.update);
    gsap.ticker.add(function(t){lenis.raf(t*1000);});
    gsap.ticker.lagSmoothing(0);
  }

  /* 1 · 히어로 — 가로 클립 와이프(L→R), Narnia 세로 마스크와 다른 방향 */
  gsap.set(".hero h1 .ln>i",{clipPath:"inset(0 100% 0 0)"});
  gsap.to(".hero h1 .ln>i",{clipPath:"inset(0 0% 0 0)",duration:1.1,ease:"power4.out",stagger:.12,delay:.2});
  gsap.from(".hero__meta,.hero__sub,.cue,.hero__motif",{opacity:0,y:16,duration:.9,ease:"power3.out",stagger:.08,delay:.7});
  /* 히어로 라인 모티프 도트 패럴럭스 */
  gsap.to(".hero__motif",{"--p":"78%",ease:"none",scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:.6}});

  /* 2 · 몰입 — 스케일 스크럽 */
  gsap.fromTo(".imm__t",{scale:.82,opacity:.4},{scale:1,opacity:1,ease:"none",
    scrollTrigger:{trigger:".imm",start:"top bottom",end:"top top",scrub:.6}});

  /* 공통 리빌 */
  gsap.utils.toArray("[data-rv]").forEach(function(el){
    gsap.to(el,{opacity:1,y:0,duration:1,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 88%"}});
  });

  /* 3 · 가로 핀 (데스크톱만 · 모바일은 세로 스택) */
  var mm=gsap.matchMedia();
  mm.add("(min-width:821px)",function(){
    var track=document.getElementById("htrack");
    if(!track) return; /* 서브페이지엔 가로핀 없음 — 가드 */
    var hpin=track.closest(".hpin");
    var dist=function(){return Math.max(0, track.scrollWidth - track.parentElement.clientWidth);};
    if(dist()<=0) return; /* 넘칠 게 없으면 핀 불필요(가로 스크롤도 발생 안 함) */
    if(hpin) hpin.classList.add("is-pinned"); /* 핀 활성일 때만 overflow 숨김(콘텐츠 갇힘 방지) */
    var htween=gsap.to(track,{x:function(){return -dist();},ease:"none",
      scrollTrigger:{trigger:".hpin",start:"top top",end:function(){return "+="+dist();},scrub:1,pin:true,invalidateOnRefresh:true,anticipatePin:1}});
    /* 활성 패널 토글 — 가로 스크롤로 뷰포트 중앙에 온 패널의 숫자만 레드(모션 따라 이동) */
    var panels=gsap.utils.toArray(".hpanel");
    panels.forEach(function(panel){
      ScrollTrigger.create({trigger:panel,containerAnimation:htween,start:"left center",end:"right center",
        onToggle:function(self){panel.classList.toggle("is-active",self.isActive);}});
    });
    if(panels[0]) panels[0].classList.add("is-active"); /* 초기 활성 */
    return function(){ if(hpin) hpin.classList.remove("is-pinned"); }; /* 미디어 이탈 시 정리 */
  });

  /* 6 · 문장 단어 순차 밝아짐 */
  gsap.to("#stmt .w",{opacity:1,duration:.6,stagger:.12,ease:"none",
    scrollTrigger:{trigger:"#stmt",start:"top 78%",end:"top 40%",scrub:true}});

  addEventListener("load",function(){ScrollTrigger.refresh();});
})();
