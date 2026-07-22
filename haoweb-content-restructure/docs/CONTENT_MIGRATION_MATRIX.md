# CONTENT_MIGRATION_MATRIX

> 기존 haoweb(루트) 전 페이지·섹션의 처리 계획. 분류: 유지 / 수정 / 이동 / 통합 / 분리 / 신규 작성 / 삭제 검토.
> 원본은 보존하고, 새 폴더(haoweb-content-restructure)에서 재구성한다.

## A. index.html (기존 16섹션 → 새 14흐름)

| 기존 섹션 | 처리 | 이동 대상 | 이유 |
|---|---|---|---|
| Hero("AI는 당신의 홈페이지를 이해하고 있습니까?") | **수정** | index 01 Hero | AI를 첫 메시지로 쓰지 않도록 교체 → "문의로 이어질 수 있도록, 홈페이지의 메시지와 구조부터 설계합니다." |
| #strength 차별점(3축+5원칙) | **이동+통합** | index 04(원고 배치가 아님 철학) + website(제작 방식) | 철학 섹션으로 재편, 상세는 허브로 |
| #project-check 30초 체크 | **이동** | diagnosis.html | 자가 점검은 진단 페이지의 도입부가 적합 |
| #services 제작서비스 7종 | **수정** | index 03 제작센터 요약 + website.html 본문 | 메인은 허브 요약, 상세는 website로 |
| #ptypes 세 가지 제작 방식 | **이동** | plan.html(베이직/프리미엄/엔터프라이즈 매핑) | 제작 방식=플랜 체계로 흡수 |
| #cost 제작비 기준 | **분리** | price-guide.html | 독립 페이지 승격(§6) |
| #no-assets 자료 부족 지원 | **이동** | index 08 요약 + content-production.html 본문 | 콘텐츠 제작 사업의 도입 논리 |
| #portfolio | **유지·수정** | index 10 요약 + portfolio.html | 구조 유지, 가짜 데이터 금지 원칙 유지 |
| #reviews 인터뷰 | **유지·수정** | index 10(포폴과 결합) + interview.html | 동일 |
| #plans 프로세스 | **분리** | index 12 요약 + process.html | 과정 독립 페이지 승격 |
| #gov 정부지원 | **이동** | government.html로 위임(메인에서 제거) | 메인 밀도 축소, 고객지원 하위로 |
| #search-ai | **수정** | index 06 + search-ai.html 허브 | SEO/AEO/GEO 3개념 요약으로 재작성 |
| #diagnosis | **수정** | index 05(리뉴얼 섹션 내 CTA) + diagnosis.html | 리뉴얼 축으로 편입 |
| #columns | **이동** | index 13(운영 섹션에서 언급) + columns.html | 메인 별도 섹션 제거, 운영 스토리로 |
| #support | **통합** | index 14 Final CTA로 흡수 | 중복 CTA 정리 |
| #contact Final CTA | **수정** | index 14 | 고객 상태별 4 CTA(신규/리뉴얼 진단/무료 제안/유지보수) |

## B. 서비스 페이지 7종 (company/hospital/lawyer/shop/franchise/landing/app)

| 콘텐츠 블록(공통 패턴) | 처리 | 이동 대상 | 이유 |
|---|---|---|---|
| 업종 Hero·도입 | 유지·수정 | 각 페이지 | 5문(누구/문제/신뢰/왜/다음) 기준으로 카피 정비 |
| 이런 곳에(대상) | 유지 | 각 페이지 | 업종 고유 |
| 고객 탐색 과정(journey) | 유지 | 각 페이지 | 업종 고유(기업 vs 병원 순서 다름) |
| 권장 정보구조·화면 구조 데모 | 유지 | 각 페이지 | 업종 고유 |
| 자료 전환(assets→web) | **이동** | website.html 공통 | 전 업종 중복 → 허브 1회 |
| 브랜드 통합(브랜딩·촬영·카탈로그) | **이동** | content-production.html | 전 업종 중복 |
| 제작 프로세스 7단계 | **이동** | process.html | 전 업종 중복 |
| 주요 기능(features) | 유지 | 각 페이지 | 업종 고유 |
| 제작 방식(method) | **이동** | website.html | 공통 |
| 랜딩 활용/다국어 등 부가 | 유지 | 각 페이지 | 업종 고유 |
| 비용·기간(guide) | **이동** | price-guide.html (업종 페이지엔 "달라지는 요인" 2~3줄+링크) | 중복 |
| 검색·AI 적용(search-ai-ex) | **이동** | search-ai.html + 업종 페이지엔 1문단 요약 | 중복 |
| 업종 FAQ | 유지 | 각 페이지 | 업종 특화 질문만 남기고 공통 질문은 faq.html로 |
| 업종 내 포폴 슬롯·인터뷰 슬롯 | **통합** | portfolio.html/interview.html 링크로 대체 | 페이지 비대 해소 |
| 관련 칼럼 | 유지 | 각 페이지 | 내부 링크 자산 |
| Final CTA | 수정 | 각 페이지 | 업종 특화 CTA(예: 병원=진료과 구조 상담) |

## C. 그 외 기존 페이지

| 페이지 | 처리 | 이동/통합 대상 | 이유 |
|---|---|---|---|
| search-ai.html | **수정(허브 재편)** | + seo/aeo/geo/content-operation 4분리 | 사업 허브 승격(§11) |
| diagnosis.html | **수정** | 리뉴얼 축(2뎁스) 편입, 30초 체크 흡수 | B고객 진입점 |
| site-plan.html | **통합** | free-proposal.html | 업종 구조안 질문=제안서 검토 항목과 동일 기능. 삭제 아님, 리다이렉트 유지 |
| plan.html | **수정** | 베이직/프리미엄/엔터프라이즈 3플랜 체계 + free-proposal/price-guide/process 연결 | §6 |
| maintenance.html | 유지·수정 | 고객지원 하위 + 운영(콘텐츠 관리) 관점 보강 | E고객 |
| government.html | 유지 | 고객지원 하위 | 변경 최소 |
| faq.html | 유지·수정 | 공통 질문 집약(업종 질문은 업종 페이지에) | 중복 정리 |
| columns.html / column-detail.html | 유지 | 고객지원 하위 + content-operation과 상호 링크 | 운영 자산 |
| notice.html | 유지 · **통합 후보** | 콘텐츠 적으면 faq 하단 섹션으로 | 밀도 낮음 |
| inquiry.html | **수정** | 유형 선택 확장(신규/리뉴얼/글로벌/콘텐츠/유지보수/무료제안) | CTA 체계 정합 |
| about.html | 유지·수정 | 고객지원 하위 | 팀원 임의 생성 금지 유지 |
| privacy.html | 유지 | 고객지원 하위 | 그대로 |
| portfolio(+detail)/interview(+detail) | 유지·수정 | 포트폴리오 메뉴 | 구조 유지, 문구 정비 |

## D. 신규 작성 페이지 (12)

website / renewal / renewal-proposal / seo / aeo / geo / content-operation / global / content-production / ai-content / graphic-design / studio / free-proposal / process / price-guide
(상세 사양은 PAGE_CONTENT_SPEC.md)

## E. 재사용 콘텐츠 소스 맵

| 재사용 항목 | 원본 위치 | 새 위치 |
|---|---|---|
| 업종별 콘텐츠 5종+랜딩+앱 | 각 서비스 페이지 | 동일 페이지(정리 후) |
| 업종별 탐색 과정/필수 콘텐츠·기능 | 서비스 페이지 | 동일 + website 요약 |
| 제작 과정 | index #plans·서비스페이지 | process.html |
| 제작비·기간 기준 | index #cost·plan·서비스 guide | price-guide.html |
| 브랜딩·촬영·카탈로그 연계 | index·서비스 #brand | content-production.html |
| SEO·AEO·GEO 설명 | search-ai.html·index | search-ai 허브+seo/aeo/geo |
| 진단 항목 | diagnosis + index #project-check | diagnosis.html |
| 업종 구조안 질문 | site-plan.html | free-proposal.html 폼 |
| 유지보수 | maintenance.html | 동일(운영 보강) |
| FAQ / 칼럼 | faq/columns | 동일(중복 정리) |
| 포폴·인터뷰 구조 | portfolio/interview | 동일 |
