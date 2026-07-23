# SITEMAP_NEW

> GNB 8 + Header CTA 2. 아이디어시트 GNB 초안(AI가시성 제작/리뉴얼/글로벌/무료제공/유지보수/포트폴리오/AI컨텐츠/그래픽디자인/스튜디오)을 지시서 §5 기준으로 정리한 결과.
> 아이디어시트의 'AI컨텐츠·그래픽디자인·스튜디오' 3개 대메뉴는 **콘텐츠 제작 1개 대메뉴의 2Depth로 통합**(대메뉴 과다 방지, 지시서 §5·§13과 일치).
> '무료제공서비스'는 대메뉴 대신 **Header 상시 CTA + 제작 플랜 하위 페이지**(전환 장치는 메뉴보다 버튼이 접근성 높음).
> '유지보수'의 GNB 위치는 미확정 → 현재 고객지원 하위 + Header 보조 노출(DECISIONS_NEEDED #6).

## GNB (1ST DEPTH)

1. 홈페이지 제작 — website.html
2. 홈페이지 리뉴얼 — renewal.html
3. AI 검색 대응 — search-ai.html
4. 글로벌 홈페이지 — global.html
5. 콘텐츠 제작 — content-production.html
6. 포트폴리오 — portfolio.html
7. 제작 플랜 — plan.html
8. 고객지원 — faq.html

**Header CTA**: [무료 시안·제안서 → free-proposal.html] [제작 문의 → inquiry.html]
**Header 보조**: 유지보수 바로가기(전체 메뉴 안 강조 노출)
Desktop은 Mega Menu/전체 메뉴로 2Depth 노출(정보 계층 우선, 디자인은 추후).

## 전체 사이트맵 (2·3 DEPTH)

```
HOME
└ index.html

1 홈페이지 제작
├ website.html            홈페이지 제작센터(허브) ★신규
├ company.html            기업 홈페이지 제작
├ hospital.html           병원 홈페이지 제작
├ lawyer.html             변호사 홈페이지 제작
├ shop.html               쇼핑몰 제작
├ franchise.html          프랜차이즈 홈페이지 제작
├ landing.html            랜딩페이지 제작
└ app.html                앱 제작

2 홈페이지 리뉴얼
├ renewal.html            리뉴얼 핵심 랜딩 ★신규 (광고·아웃바운드 겸용)
├ diagnosis.html          현재 홈페이지 진단 (기존 재편)
└ renewal-proposal.html   리뉴얼 개선안·제안서 신청 ★신규

3 AI 검색 대응
├ search-ai.html          허브 (기존 재편)
├ seo.html                SEO ★신규(분리)
├ aeo.html                AEO ★신규(분리)
├ geo.html                GEO ★신규(분리)
└ content-operation.html  칼럼·FAQ·사례 콘텐츠 운영 ★신규

4 글로벌 홈페이지
└ global.html             허브 ★신규 — 내부 섹션: 베트남/중국/태국/일본/영문(미국)
                          ※ 국가별 개별 HTML은 운영 확정 후 생성(금지: 임의 대량 생성)

5 콘텐츠 제작
├ content-production.html 허브 ★신규
├ ai-content.html         전문 콘텐츠·AI 활용 콘텐츠 ★신규
├ graphic-design.html     그래픽·편집디자인 ★신규
└ studio.html             기업·제품·공간·스튜디오 촬영 ★신규

6 포트폴리오
├ portfolio.html          (유지·정리)
├ portfolio-detail.html   (유지·정리)
├ interview.html          (유지·정리)
└ interview-detail.html   (유지·정리)

7 제작 플랜
├ plan.html               베이직/프리미엄/엔터프라이즈 (재편)
├ free-proposal.html      무료 시안·제안서 ★신규
├ process.html            제작 과정 ★신규(분리)
└ price-guide.html        제작비 결정 기준 ★신규(분리)

8 고객지원
├ maintenance.html        유지보수 (유지·재편)
├ government.html         정부지원사업 (유지)
├ faq.html                자주 묻는 질문 (유지)
├ columns.html            칼럼 (유지)
├ column-detail.html      칼럼 상세 (유지)
├ notice.html             공지 (유지 · 통합 후보)
├ inquiry.html            제작 문의 (재편: 유형 선택 확장)
├ about.html              회사소개 (유지·정리)
└ privacy.html            개인정보처리방침 (유지)

통합 후보(삭제 아님 · CONTENT_MIGRATION_MATRIX 참조)
└ site-plan.html          → free-proposal.html로 흡수(업종 구조안 질문 = 제안서 검토 항목)
└ notice.html             → 고객지원 내 유지하되 콘텐츠 적으면 faq 하단 섹션 통합 검토
```

## 페이지 연결 관계 (핵심 동선)

- index → website / renewal (상황 선택 2경로) · search-ai · global · content-production · plan · portfolio · free-proposal · inquiry
- website → company/hospital/lawyer/shop/franchise/landing/app · content-production · plan · process · free-proposal · inquiry
- 업종 7종 → website(공통 설명 위임) · 해당 업종 FAQ · portfolio · free-proposal · inquiry
- renewal → diagnosis · renewal-proposal · search-ai · plan · free-proposal · inquiry
- search-ai → seo/aeo/geo/content-operation · renewal · website · inquiry
- global → free-proposal · inquiry
- content-production → ai-content/graphic-design/studio · website · inquiry
- plan → free-proposal · price-guide · process · inquiry
- 전 페이지 공통 Final CTA: 신규 상담 / 리뉴얼 진단 / 무료 시안·제안서 / 유지보수 문의(맥락별 노출)
