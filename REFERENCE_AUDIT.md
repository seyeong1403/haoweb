# 하오웹 — 레퍼런스 라이브 검토 기록 (REFERENCE_AUDIT)

> 캡처가 아니라 **실제 URL에 접속해** 확인한 기록입니다. 확인 도구: WebFetch(마크다운 변환 기반) — 라이브 DOM/모션 일부는 완전히 재현되지 않아, 그 항목은 **"라이브 확인 한계"**로 표시합니다.
> 확인일: 2026-07-14

---

## ID 082 — Digitalists (마스터, 적용 비중 ~60%)
- **확인 URL**: https://digitalists.at/ · 확인일 2026-07-14
- **Header/GNB**: 단일 레벨 메인 내비 + **메가 메뉴**(Lösungen/Leistungen 각 8개 카드 + "Aktuelle Cases" 4개 + 연락처). 우측에 강한 CTA 버튼("Jetzt anfragen").
- **Hero**: 좌측 정렬 **대형 스택 타이포**, 공격적인 줄바꿈(Wir / machen / Ideen / …). 보조 태그라인 별도.
- **섹션 흐름**: Hero → 서비스 개요(8카드) → 8개 서비스 심화 섹션(각 설명+CTA) → Cases 캐러셀(프로젝트 번호 CS 1920 + 제목 + 클라이언트 + 제작범위) → 협업 문의 → 블로그/인사이트 → FAQ+푸터 → 문의 폼(반복).
- **서비스 vs 솔루션 분리**: Leistungen(역량) = 동등 카드 8개 / Lösungen(솔루션) = "~하기" 문제-해결형. Cases는 별도 레퍼런스 섹션.
- **CTA 반복**: Hero / 서비스 카드 하단 / 중단 협업 폼 / 푸터 폼 / 메가메뉴 연락처 — 4~5회.
- **Footer**: 다중 컬럼(주소·연락처 / 뉴스레터+GDPR / 퀵링크 / SNS / 저작권).
- **폭/여백**: 최대 콘텐츠 ~1200–1400px, 섹션 간 80–120px.
- **Hover/Scroll**: 메가메뉴 hover 전개, Cases 가로 캐러셀 점진 노출. (정밀 이징은 라이브 확인 한계)
- **가져올 것**: 메가/2뎁스 GNB, 강한 Hero 타이포, 서비스↔솔루션 정보구조, 서비스→사례→인사이트→문의 흐름, 프로젝트 번호+제작범위 라벨, CTA 반복 배치, 다중 컬럼 푸터.
- **안 가져올 것**: 노랑(#F1E500)·검정 컬러 시스템, 한글 글자 해체, 과도한 커서/WebGL/3D, 하오웹에 불필요한 마케팅 서비스.
- **적용 파일/클래스**: `index.html`(GNB 그룹화, hero, `#strength` difference, `#portfolio` case), `css/style.css`(header/nav, hero grid, difference, portfolio).

## ID 008 — Blunarova (차별점·브랜드 통합·포트폴리오 상세)
- **확인 URL**: https://www.blunarova.com/ · 확인일 2026-07-14
- **핵심**: 한 프로젝트 안에서 **여러 결과물(브랜드·아트디렉션·웹·패키지·촬영)을 인라인으로 열거**해 "하나의 브랜드로 연결"됨을 표현. 텍스트-우선 스택 링크형(그리드 아님), 제목=내비, 메타(업종·범위)는 보조 카피.
- **스코프 라벨**: 딜리버러블을 직접 태깅(brand identity, strategy, web design…). 상태표시 [VIEW]/[coming soon]/(pw).
- **가져올 것**: 프로젝트별 **제작 범위 라벨**(BRANDING / PHOTOGRAPHY / CATALOG / EDITORIAL / WEB / APP)로 통합 제작 범위 표기.
- **안 가져올 것**: 개인 포트폴리오 말투, 자유로운 이미지 콜라주, 암호화폐·스타트업 분위기, 이미지 없는데 가짜 목업.
- **적용 파일/클래스**: `index.html`/세부페이지 `.port-alt`/`.pa-scope`(제작범위 태그), 차별점 BRAND INTEGRATION 축.

## ID 108 — Creativemore / CNM (모션)
- **확인 URL**: https://www.creativemore.co.kr/ · 확인일 2026-07-14
- **모션**: **점진적 노출**(스크롤로 다음 내용을 발견). Hover/Click 가능 요소를 **명시적으로 안내**("마우스를 대보세요!", "Click!"), +/- 확장 컨트롤. 텍스트·이미지 순차 전환. 미니멀(블랙/화이트/크림), 과장 없는 친근한 페이스.
- **가져올 것**: 스크롤 발견형 전개, hover/click 가능 요소의 명확한 시그널, 순차 전환 리듬, 온·오프라인 역량을 한 브랜드로 묶는 표현.
- **안 가져올 것**: 캐릭터, 레트로 그래픽, 크림·그린 컬러, 장식성 과잉.
- **적용 파일/클래스**: `js/main.js`(reveal, difference 단계 활성화·연결선, hover 시그널), `.svc-tab`/`.bi-step`/`.proc`.

## ID 043 — Blurr (포트폴리오)
- **확인 URL**: https://www.blurr.design/ · 확인일 2026-07-14
- **포트폴리오**: 프로젝트 **번호(/001–/010) + 클라이언트(대문자) + 서비스 카테고리**. 미니멀 내비 + "Book a call" CTA.
- **라이브 확인 한계**: 이미지 hover 인터랙션·정확한 타이포 스케일·컬러·상세 진입 방식은 마크다운 변환으로는 확인 못 함(코드/CSS 직접 확인 필요).
- **가져올 것**: 프로젝트 번호+이름, 업종·제작범위 라벨, 상세 진입, 이미지 hover 확대.
- **안 가져올 것**: 다크 Web3 분위기, 극단적 영문 자간, 같은 이미지 반복, 미검증 성과 수치.
- **적용 파일/클래스**: `index.html` `#portfolio` `.port-feat`/`.port-alt`, hover 1.02–1.04 확대.

## 하오커뮤니케이션 웹구축센터 (모션 속도)
- **확인 URL**: https://leegunhee010.github.io/haod-new/web/ · 확인일 2026-07-14
- **모션 톤**: Hero 텍스트는 비교적 정적, 서비스 피처 가로 마퀴, 번호 서비스 카드(01–04), 프로세스(01–05) 선형, **중간 속도 ease-in-out**, 명료성 우선(스펙터클 아님).
- **가져올 것**: Hero 텍스트 등장 속도감, 섹션 스크롤 리듬, 서비스 hover, 프로세스, FAQ 펼침, 버튼 hover의 자연스러운 연결.
- **안 가져올 것**: 문구·레이아웃 복제.
- **적용 파일/클래스**: `js/main.js`(GSAP 타임라인 속도·이징), `css/style.css` transition durations.

---
### 미확인/한계 항목 (후속 필요)
- Blurr·Digitalists의 정확한 hover 이징·스크롤 스크럽 타이밍, 반응형 브레이크포인트별 정확한 크기 — WebFetch로는 JS 렌더/모션 완전 확인 불가. 필요 시 실제 브라우저에서 재확인.

---
## 2026-07-15 — 모션 시스템 통일 패스 (라이브 재확인)

### 하오커뮤니케이션 웹구축센터 — https://leegunhee010.github.io/haod-new/web/ (재확인 2026-07-15)
- **엔진**: 외부 모션 라이브러리 없음(GSAP/Lenis 미사용). 순수 CSS transition + IntersectionObserver/scroll.
- **시그니처 easing**: `cubic-bezier(.16, 1, .3, 1)` (`--ease`) — 부드러운 감속. 브리프의 "cubic-bezier 감속"과 일치.
- **duration 실측**: 짧은 UI/hover `.3s` · 메뉴 열림 `.25s` · 큰 텍스트/이동 transform **`.85s`** · 진행바 `.1s linear` · 헤더 배경 `.4s`.
- **가져온 것(속도·연결 방식만)**: 감속 이징, 스크롤 단계 전환 `.85s` 리듬, hover `.3s`, 메뉴 `.25s`.
- **안 가져온 것**: 레이아웃·문구·keyframes(heroZoom/curtain/noPop 등 시각효과는 복제 안 함).

### 하오웹에 정의한 모션 토큰 (css/tokens.css)
- `--ease: cubic-bezier(.16,1,.3,1)` / `--dur-hover .22s` / `--dur-ui .3s` / `--dur-content .64s` / `--dur-step .85s` / `--motion-rise 22px` / `--motion-scale 1.03`.

### 적용 내역(이번 패스)
- **차별점 3축(.axes3)**: 섹션 진입 시 상단 레드라인 좌→우 그리기(`--dur-step`) + 01→02→03 순차 활성화(IO, 300ms 간격) + 흐름 아이템 좌→우 순차 리빌 + 설명은 흐름 완성 후 등장 + 03 순환 힌트(↻). `body.gsap-on` 게이트로 JS 미동작 시 전체 표시.
- **방문자 여정(.jrny, 8개 페이지 공통)**: 진입 시 01→N 순차로 단계 밝아짐 + 지나온 연결선 레드 진행(IO 130ms 간격). reduced-motion·no-JS 전체 표시.
- **적용 파일**: `css/tokens.css`, `css/style.css`(.axes3/.axis3/.jrny), `js/main.js`.

### 이번 세션 검증 한계
- 프리뷰 렌더러가 GSAP rAF·CSS transition·IO를 얼려(frame 0) **모션 재생을 화면으로 확인 불가**. 클래스·목표값·트리거 등록은 DOM 측정으로 검증. 실제 배포본에서 재생 확인 필요.
