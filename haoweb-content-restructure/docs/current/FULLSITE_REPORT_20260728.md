# 하오웹 전체 사이트 99% 완성본 — 완료 보고서 (2026-07-28)

index/renewal에서 확립한 새 다크 디자인을 **전 공개 페이지(45)로 확장 완료**. 실제 자료가 없는 항목(포트폴리오·인터뷰·회사 상세·문의 API)만 **완성도 있는 '준비중'**으로 처리하고, 나머지 콘텐츠·디자인·반응형·링크·배포를 완성했다.

## 1. 백업 위치
- git: 작업 전 `0acf403`, 단계별 커밋 → 최종 `edfbf78`(그 이후 커밋 포함)
- 물리: `_backup_20260728_structure/`, `_backup_20260728_content/`
- 데스크톱 zip 스냅샷: `haoweb-content-restructure.Zip`

## 2. 수정·생성 파일(요지)
- **디자인 시스템**: `css/hw.css`(기존, is-current 등 보강), **`css/hw-sub.css`(신규)**, **`js/hw-sub.js`(신규, 폼·config)**, `js/hw.js`(준비중 자동전환)
- **빌드**: **`_build/_chrome-x.html`(신규 신-디자인 공용 크롬)**, `_build/nav.json`(footer·상시노출 반영), `_build/gen-nav.ps1`(footer 생성), `_build/compose.ps1`(chrome-x로 전환), `_build/make_dist.ps1`(review 내부제외)
- **본문 프래그 43종 전부 재작성**: `_build/_src/*.frag.html`
- **자동 생성**: 루트 서브 43종, `dist/`, `review/`
- 상세 템플릿 3종 → `_build/_templates/`(격리)

## 3. 새 디자인이 적용된 전체 페이지(45)
index, renewal + website, company, hospital, franchise, shop, lawyer, landing, app, search-ai, seo, aeo, geo, ai-content, content-production, content-operation, global, global-vn/cn/th/jp/en, plan, process, price-guide, graphic-design, studio, maintenance, government, columns, column-prepare/renewal/search/after, portfolio, interview, free-proposal, diagnosis, inquiry, about, faq, notice, privacy.
→ **구 restructure.css/home.css 의존·구 크롬 클래스 잔존 = 0** (전수 grep 확인).

## 4. 페이지 유형별 공통 템플릿
- **A 허브**(website·search-ai·global·plan·columns·faq): page-hero + `.idx`(하위 인덱스) + 관련 서비스 + CTA.
- **B 업종·서비스 상세**(company·hospital·… seo·aeo·geo·ai-content·… graphic-design·studio·maintenance·government): 대상→문제→제공범위→진행→관련→CTA. `.feat`/`.flow`/`.steps`/`.trio`/`.p-check`/`.faq` 혼용(카드 남용 회피).
- **C 전환·문의**(free-proposal·diagnosis·inquiry): `.form-grid`(`.formx` + `.form-side`), 조건부 필드, 확인 화면.
- **D 콘텐츠**(칼럼): `.col-wrap`(`.prose` + `.col-aside`), 순환 링크.
- **E 회사·운영**(about·process·price-guide·notice·privacy): `.deflist`·`.steps`·`.prose`, 미확정 값 준비중.
- **F 사례 준비**(portfolio·interview): `.prep`(완성형 준비중) + 숨은 그리드(데이터 시 자동 전환).

## 5. 최종 GNB·Footer
- GNB 7(전 페이지 동일): 홈페이지 제작·리뉴얼·AI 가시성·글로벌·**사례·인사이트**·제작 플랜·고객지원. 단일 원본 `_build/nav.json`.
- **사례·인사이트 = 포트폴리오·고객 인터뷰·칼럼 상시 노출**(조건부 숨김 제거).
- Footer: `.hw-foot` 4열(제작/리뉴얼·AI/플랜·사례/회사·지원) + 브랜드 + 연락처(값 없으면 "오픈 시 안내") + 개인정보처리방침 + 사업자정보(준비중). 데스크톱·태블릿·모바일 동일 정보구조.

## 6·7·8. 포트폴리오·인터뷰·공지 준비중 화면
- **portfolio.html**: 제작 분야 안내 제거 → 히어로 + `.prep`("PROJECTS IN PREPARATION · 사례 준비중") + 향후 공개 정보(제작 배경·구조·Desktop/Mobile 화면·범위·인터뷰) + CTA. 데이터 입력 시 그리드 자동 노출·준비중 자동 숨김.
- **interview.html**: 질문 템플릿 설명 제거 → 히어로 + `.prep`("INTERVIEWS IN PREPARATION") + 인터뷰에서 다룰 내용(Before/Process/After) + CTA.
- **notice.html**: "공지사항 준비중" + FAQ·제작 문의 안내(가상 공지 없음).
- 빈 화면·스켈레톤·빈 카드·가짜 사례 **없음**.

## 9. 회사·연락처·개인정보 준비중 처리
- `src/site-config.js` 값이 있으면 실값, 없으면 준비중 표기(hw-sub.js). Footer 연락처는 "대표 연락처는 오픈 시 안내됩니다."로 빈 줄 방지. about `.deflist`는 `dd.pending`("준비중 · …"). privacy 담당자·시행일은 `[data-cfg-row]`로 값 없으면 행 숨김.

## 10. 폼 미연결 안내
- endpoint 없으면 제출 시: **"온라인 접수 기능을 준비하고 있습니다. 입력하신 내용은 현재 전송되지 않습니다…"**(사용자용). '검토용 화면'·TODO 문구 노출 없음. 검증→입력확인→(연결 시)자동 전송·성공 화면.

## 11. 공공기관 링크 수정
- index 업종의 `공공기관→government.html`(정부지원사업) 오연결 → **`website.html#public-sector`**. website에 "공공기관·협회" 유형 추가(기관 소개·사업 안내·공지/자료·문의). 정부지원사업은 government.html에서 별개 유지.

## 12. AI 콘텐츠·콘텐츠 제작·콘텐츠 운영 역할
- ai-content=전문 콘텐츠 제작 방식(AI 도구+사람 검토), content-production=오픈 전 원고·사진·그래픽·편집물, content-operation=오픈 후 지속 발행·갱신. 셋 다 AI 가시성 하위 실 페이지로 유지(리다이렉트·통합 지시 폐기). 유지보수와의 관계도 각 페이지·푸터에서 구분.

## 13·14. 빌드 구분 / 공개 제외
- **review/**: 고객용 전체 사이트(준비중 포함), robots 전체 차단, **내부 파일 제외**(_diag·haoweb-concept).
- **dist/**: 공개 후보(내부·상세 템플릿·renewal-proposal 제외, renewal-proposal→free-proposal?type=renewal 리다이렉트).
- **소스 전용(비배포)**: `_build/_templates/`(portfolio-detail·interview-detail·column-detail), `_diag.html`, `haoweb-concept.html`.

## 15. 최신 docs/current
- `SITE_SPEC_CURRENT.md`(최신 기준 헤더 추가), `PENDING_FACTS_ONLY.md`, `STRUCTURE_REPORT_20260728.md`, `PRE_LAUNCH_CHECKLIST.md`, 본 문서. 과거 상충 문서는 이미 `docs/archive/`.

## 16. 여전히 실제 값 입력이 필요한 항목
- 회사 상세(상호·대표·사업자번호·주소), 대표 연락처(전화·이메일), 개인정보 담당자·시행일, 문의 API endpoint, 실제 포트폴리오/인터뷰 데이터, 해외 사무실 상세, 실제 도메인·구조화 데이터. → `PRE_LAUNCH_CHECKLIST.md` 참조. **가짜로 채우지 않음.**

## 17·18·19. 링크·콘솔·가로넘침 검사
- **깨진 HTML 링크 0 / 깨진 앵커 0 / `#`·빈 href 0**(공개 45페이지 전수 grep).
- **콘솔 오류 0**(유형별 대표 페이지 라이브 확인: website·free-proposal·company·portfolio·about).
- **가로 넘침 0**(대표 페이지 확인 + body `overflow-x:clip`). `aria-current` 현재 메뉴 자동 표시(신·구 JS).

## 20·21. 컨택트시트 (1440 / 390)
- 전 공개 페이지 헤드리스 캡처 → `scratchpad/sheet/` + 조립 컨택트시트(별도 전송). ※ 헤드리스 콜드스타트가 느려 캡처는 순차 생성.

## 22. 대표님 검토용
- **`review/`** 폴더(모든 공개·준비중 페이지, 내부 도구 제외). 로컬 프리뷰: `scratchpad/serve.ps1`(localhost:8787).

---
### 남은 미세 보완(1% — 다음 패스 권장)
- 6폭(1440/1280/1024/768/390/360) 전 페이지 정밀 반응형 스팟(현재 대표 페이지·overflow-clip 기준 통과).
- 폼 실제 endpoint 연결 후 제출 테스트.
- 실제 자료·도메인 입력(위 16번).
