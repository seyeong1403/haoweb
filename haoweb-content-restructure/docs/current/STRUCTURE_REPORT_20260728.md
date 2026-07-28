# 하오웹 구조·공통 운영 정리 — 완료 보고서 (2026-07-28)

메인·리뉴얼 콘텐츠 흐름과 현재 디자인(대형 타이포·장면형 스크롤·모션·색상)은 **그대로 유지**했고,
사이트 전체의 **메뉴·링크·페이지 역할·배포 구조**만 통일·정리했다.

---

## 1. 백업 위치
- 물리 백업: `_backup_20260728_structure/` (index.html · renewal.html · _build/_chrome.html · compose.ps1 · make_dist.ps1)
- git 체크포인트: `0acf403` (작업 전), 작업 커밋 `73251ac`
- 세영님 zip: 데스크톱 `haoweb-content-restructure.Zip`(= 작업 시작 시점 v15 스냅샷)
- 기존 콘텐츠 백업: `_backup_20260728_content/` (이전 세션)

## 2. 수정·생성 파일
| 구분 | 파일 |
|---|---|
| **신규(원본)** | `_build/nav.json` (GNB 단일 원본), `_build/gen-nav.ps1` (생성기), 본 보고서 |
| 원본 편집 | `index.html`, `renewal.html`, `_build/_chrome.html`, `_build/compose.ps1`, `_build/make_dist.ps1`, `css/hw.css`, `js/hw.js`, `js/restructure.js` |
| 자동 생성(재조립) | 루트 서브 46종(`seo.html`, `plan.html` … = `_chrome.html` + `_src/*.frag.html`) |
| 배포본(재생성) | `dist/` 전체, `review/` 전체 |

## 3. 최종 GNB 구조 (7 대메뉴 · 순서·명칭 전 페이지 동일)
1. 홈페이지 제작 2. 리뉴얼 3. AI 가시성 4. 글로벌 5. 사례·인사이트 6. 제작 플랜 7. 고객지원

## 4. 각 대메뉴 2Depth (실제 존재 페이지에 매핑)
- **홈페이지 제작**(website): 제작센터·기업·병원·프랜차이즈·쇼핑몰·전문가/법률·랜딩페이지·앱 제작·제작 과정·제작비 안내
- **리뉴얼**(renewal): 홈페이지 리뉴얼·현재 홈페이지 진단·무료 시안/제안(?type=renewal)
- **AI 가시성**(search-ai): AI 가시성·SEO·AEO·GEO·AI 콘텐츠·콘텐츠 제작·콘텐츠 운영
- **글로벌**(global): 글로벌 홈페이지·베트남·중국·태국·일본·영문 홈페이지
- **사례·인사이트**(현재 대표링크=columns): 〔포트폴리오·고객 인터뷰=데이터 있을 때만〕·칼럼
- **제작 플랜**(plan): 제작 플랜·그래픽/편집디자인·사진/영상 촬영·유지보수·정부지원사업
- **고객지원**(faq): 무료 시안/제안·제작 문의·FAQ·공지사항·회사소개

> 조정 사항(구조 안에서 자연스러운 위치로): ①요청안의 **공공기관 홈페이지**는 전용 페이지가 없어 제외(index 업종 목록의 잘못된 government 링크는 별건 검토 필요 — 아래 11-c). ②**정부지원사업**은 실제 `government.html`이므로 제작 플랜에 배치.

## 5. 전 페이지 동일 GNB 적용 — 확인 결과 ✔
`index.html`(신)·`renewal.html`(신)·조립 서브 `seo.html`(구) 3계열 모두 상단 7메뉴 **순서·명칭·링크 동일**(스크립트로 대조 완료). 이전에 달랐던 점(메인=인사이트, 리뉴얼=없음, 서브=포트폴리오 대메뉴, 명칭 불일치)은 모두 해소.

## 6. 칼럼 노출 — 확인 결과 ✔
- GNB: 사례·인사이트 › **칼럼**(columns.html) 항상 노출.
- 메인: `index.html` 칼럼 섹션의 4개 링크(column-prepare/renewal/search/after) + 칼럼 전체(columns.html) 정상.
- `column-detail.html`은 **생성용 템플릿**으로 dist 제외(공개 링크 없음).

## 7. 포트폴리오·고객 인터뷰 조건부 처리 방식
- **단일 원본 판정**: `gen-nav.ps1`이 빌드 시 `src/data/portfolio.json`·`interview.json`을 검사 → 실데이터 있을 때만 해당 GNB 항목 생성. 현재 둘 다 `[]` → **GNB엔 칼럼만 노출**.
- **메인 섹션**: `#showcase`는 데이터 있을 때만 JS가 표시(가짜 카드 없음).
- **데이터 생기면 자동 노출**: json 채우고 `gen-nav.ps1`+`compose.ps1`+`make_dist.ps1` 재실행하면 메뉴·섹션·목록이 자동 등장.
- 파일/구조 삭제 없음. 가상의 프로젝트·고객명·인터뷰 **생성하지 않음**.
- `portfolio.html`은 "제작 분야 안내"를 실적처럼 표기하지 않도록 **noindex** 처리(빈 상태), 각 분야는 제작센터/업종 페이지로 연결. `portfolio-detail.html`·`interview-detail.html`도 noindex.

## 8. `renewal.html#scope` 수정 결과 ✔
리뉴얼이 다시 설계하는 범위 섹션에 `id="scope"` 추가(디자인만이 아니라 구조·콘텐츠를 다시 설계 = 정확히 그 의미의 섹션). 앵커 이동 정상. 전 파일 `renewal.html#scope` 참조 동작 확인.

## 9. 수정한 콘텐츠 문구
| 위치 | 이전 | 이후 |
|---|---|---|
| index 칼럼 섹션 H2 | 검색과 AI로 **유입되는** 콘텐츠 | 검색과 AI가 **이해하는** 콘텐츠 |

- 그 외 과장 표현(검색 1위/AI 추천/반드시 노출/유입·문의 증가 보장, 임의 성과율) 전수 검색 → **해당 없음**. 기존 "보장" 문구는 전부 "**보장하지 않습니다**" 형태의 면책 문구라 유지.

## 10. 제작 플랜 분류 수정
- **오분류 교정**: 프리미엄 `검색·AI: 기본 + 촬영 기획` → `검색·AI: SEO·AEO·GEO 기본 구조` + `촬영 기획`은 디자인·콘텐츠로 이동. (index.html, _chrome.html 템플릿)
- `plan.html`(plan.frag)은 이미 항목이 분리돼 있어 수정 불필요.
- 가격은 **임의 금액 추가하지 않음**(현행 "상담에서 안내" 유지).

## 11. 대표님 최종 확인 필요 — 운영 약속 (사이트 문구는 현행 유지)
> 아래는 **삭제하지 않고 현행 유지**하되, 확정 사실인지 대표님 확인이 필요한 항목. 새 수치·기간은 추가하지 않았다.
- **a. 무료 시안·제안 처리 기간** — 사이트에 영업일 3~5일 표기가 있는지/실제 가능한지 확인 필요.
- **b. 페이지 수 기준** — 베이직 5~8 / 프리미엄 10~15 / 엔터프라이즈 20+ 의 실제 운영 기준 확인.
- **b2. 무료 제안 산출물** — 메인 첫 화면 시안 1종·권장 사이트맵·핵심 콘텐츠 방향·견적 방향·칼럼 주제안: 실제 제공 범위 확인.
- **c. 플랜별 지원 범위** — 관리자·촬영·오픈 후 지원 범위가 플랜별로 확정인지.
- **d. 현지 사무실** — 베트남·중국·태국 사무실 **운영 사실은 확인됨**(PENDING 7). 주소·전화·담당자·인원은 미확인 → 표기 금지.
- **e. government 링크 정합성** — index 업종 목록의 "공공기관→government.html"은 실제 정부지원사업 페이지. 라벨/링크 정리 방향 확인 필요.
- **f. content-production/operation** — "콘텐츠 제작/운영"을 AI 가시성 하위 **실 메뉴로 복원**(기존 리다이렉트 해제). 유지가 맞는지 확인.
- 회사·연락처·개인정보·폼 등 사실 정보: `docs/current/PENDING_FACTS_ONLY.md` 참조.

## 12·13. 공통 헤더·푸터 원본 위치 / 생성-원본 구분
| 역할 | 파일 | 성격 |
|---|---|---|
| **GNB 데이터 원본(단일)** | `_build/nav.json` | 진짜 원본 — 메뉴 수정은 여기만 |
| **GNB 생성기** | `_build/gen-nav.ps1` | 템플릿/생성 스크립트 |
| 서브 공용 크롬(구 디자인 헤더·푸터) | `_build/_chrome.html` | 원본(마커 안 GNB는 생성기가 주입) |
| 서브 본문 원본 | `_build/_src/*.frag.html` | 원본 |
| 신 디자인 헤더 주입 대상 | `index.html`·`renewal.html`의 `<!--GNB/MNAV-->` 마커 | 마커 안=생성물, 밖=원본 |
| 서브 조립 스크립트 | `_build/compose.ps1` | 빌드 |
| 배포 생성 | `_build/make_dist.ps1` | 빌드 |
| **생성 파일(직접 수정 금지)** | 루트 서브 46종, `dist/`, `review/` | 재빌드 시 덮어써짐 |

**GNB 변경 절차(한 곳만 수정)**: `nav.json` 편집 → `gen-nav.ps1` → `compose.ps1` → `make_dist.ps1`.
→ 신·구 디자인 전 페이지에 동일 반영. (두 디자인이 공존하는 과도기라 헤더 마크업은 2종이지만 **메뉴 데이터 원본은 nav.json 하나**.)

## 14. 루트 ↔ dist 동기화 결과 ✔
- 최신 원본으로 `dist` 재생성. `diff index.html dist/index.html` = **동일**.
- 확인: index(H1·4축·제작방식·AI가시성·칼럼·플랜·무료제안), renewal(H1·진단리포트·범위·과정·FAQ·CTA·`id="scope"`) 모두 루트=dist 일치. 문구·플랜 수정도 dist 반영.

## 15. 배포 제외 파일
`renewal-proposal.html`(→free-proposal?type=renewal 리다이렉트) · `column-detail.html`(템플릿) · `_diag.html`(내부 진단) · `haoweb-concept.html`(내부 디자인 참조). 소스는 유지, 공개 dist에서만 제외.

## 16. 문의 폼 연결 상태
`site-config.js › form.endpoint` **공란** → 폼은 검증·입력확인까지만 동작, **실제 전송·접수 완료 표시 안 함**("접수 기능 미연결" 안내). 운영 배포 전 endpoint 연결 후 실제 테스트 필요.

## 17. 회사 정보 미입력 항목
상호·대표자·사업자번호·주소·전화·이메일·개인정보 담당자 = 전부 공란. **빈 값은 화면에 노출되지 않음**(조건부 렌더). 상세 목록: `PENDING_FACTS_ONLY.md`.

## 18~20. 링크 점검 결과 ✔ (공개 48페이지)
- 존재하지 않는 로컬 `.html` 링크: **0**
- 깨진 앵커: `renewal.html#scope` 수정으로 해소, 그 외 이상 없음
- `href="#"`/빈 href: **0** (skip-link `#main` 제외)
- 이전 GNB 잔재: **0** · `aria-current`/active: 신·구 JS가 현재 페이지 대메뉴 자동 표시(확인 완료)

## 21. 콘솔 오류
index·서브(seo) **오류 0**.

## 22~25. 캡처
1440 index/renewal, 390 index/renewal 4종 첨부(별도 전송). 통일 GNB·현재 디자인 유지 확인.

---

### 공개 전 남은 체크리스트 (콘텐츠 확정 후)
- [ ] `site-config.js`: company 전체·contact.tel/email·privacy.officer/effectiveDate·form.endpoint 입력
- [ ] 실제 도메인 확정 후: `robots.txt`(스테이징=Disallow / 공개=허용) · `sitemap.xml` · `canonical` · Open Graph · favicon
- [ ] 구조화 데이터(JSON-LD): Organization/LocalBusiness · Service · FAQ · Breadcrumb · 칼럼 Article — **회사·도메인 확정 후** 생성(빈 정보로 생성 금지)
- [ ] portfolio.json/interview.json 1건 이상 → 사례·인사이트/포트폴리오 자동 공개
- [ ] form.endpoint 연결 후 실제 테스트 제출
- [ ] 11번 운영 약속 항목 대표님 확정
