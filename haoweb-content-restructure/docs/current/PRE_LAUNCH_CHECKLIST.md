# 공개 전 체크리스트 (2026-07-28)

> 콘텐츠·디자인은 99% 완료. 아래는 **실제 값·도메인 확정 후** 처리할 항목. 확정 전에는 임의 도메인·가짜 정보로 생성하지 않는다.

## 1. 사실 값 입력(`src/site-config.js` 한 곳)
- [ ] company: legalName / ceo / bizNo / address / established
- [ ] contact: tel / email / kakao / hours
- [ ] privacy: officer / officerEmail / effectiveDate / analytics
- [ ] form: endpoint / recipient
- 입력하면 Footer·개인정보·문의 폼에 자동 반영(hw-sub.js). 비면 '준비중' 표기 유지.

## 2. 검색·AI 파일(도메인 확정 후)
- [ ] robots.txt — 스테이징(review)=Disallow / 공개(dist)=허용
- [ ] sitemap.xml — 실제 절대 URL로 생성(현재 미생성: 도메인 미정)
- [ ] canonical 링크 — 각 페이지 실제 URL 기준
- [ ] Open Graph / Twitter 메타 — 대표 이미지·설명
- [ ] favicon — 실제 파비콘 세트

## 3. 구조화 데이터(JSON-LD, 회사·도메인 확정 후)
- [ ] Organization 또는 LocalBusiness (회사 실제 정보)
- [ ] Service (제작·리뉴얼·AI 가시성·글로벌)
- [ ] FAQ (faq.html·각 상세 FAQ)
- [ ] Breadcrumb (crumbs 기반)
- [ ] Article (칼럼 4편)
- 빈 정보로 구조화 데이터 생성 금지.

## 4. 사례·인터뷰
- [ ] `src/data/portfolio.json` 1건 이상 입력 → 포트폴리오 목록 자동 노출(준비중 자동 숨김)
- [ ] `src/data/interview.json` 입력 → 인터뷰 목록 자동 노출
- 실제 프로젝트/고객 공개 동의 확보 후에만.

## 5. 폼
- [ ] form.endpoint 연결 후 실제 테스트 제출(신규·리뉴얼·진단·문의)
- 연결 시 문구 변경 없이 자동 전송·성공 화면 활성화됨.

## 6. 운영 약속(대표 확인 — 아래 확정되면 문구 강화 가능)
- [ ] 무료 시안·제안 처리 기간 · 산출물 범위
- [ ] 플랜별 페이지 수·지원 범위
- [ ] 해외 사무실 상세(주소·담당자·인원) — 확정 시에만 기재

## 7. 배포
- [ ] `_build/gen-nav.ps1` → `compose.ps1` → `make_dist.ps1` 순으로 재빌드
- [ ] 공개는 `dist/`(내부파일·상세템플릿 제외). 대표 검토는 `review/`(robots 전체 차단).
- [ ] GitHub Pages 반영 확인(.nojekyll 유지)
