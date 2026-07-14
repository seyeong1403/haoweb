# 하오웹 — 사이트맵 & 페이지 구조 (2026-07-14, 1차 구조)

> 이번 단계: **디자인 미변경**, 사이트 전체 구조·기본 콘텐츠·공통 컴포넌트·링크 연결 완성.
> 실제 자료가 없는 영역은 플레이스홀더/‘등록 예정’, 확정 필요 문구는 HTML 주석 `TODO`.

## 전체 페이지 (21)
```
index.html                  메인
│
├─ 제작 서비스 (7)
│   company.html · hospital.html · lawyer.html · shop.html
│   franchise.html · landing.html · app.html
│
├─ portfolio.html ─ portfolio-detail.html      포트폴리오
├─ interview.html ─ interview-detail.html      고객 인터뷰
├─ plan.html                                   제작 플랜
├─ maintenance.html                            유지보수
├─ government.html                             정부지원사업
├─ columns.html ─ column-detail.html           칼럼
└─ 고객지원
    faq.html · inquiry.html · notice.html · privacy.html
```

## GNB (공용, 전 페이지 동일)
- 제작 서비스 ▸ 7개 서비스 페이지
- 포트폴리오 → portfolio.html
- 제작안내 ▸ 고객 인터뷰(interview.html) · 제작 플랜(plan.html) · 유지보수(maintenance.html)
- 인사이트 ▸ 칼럼(columns.html) · FAQ(faq.html)
- 지원사업 → government.html
- 고객지원 ▸ 제작 문의(inquiry.html) · 상담 신청(inquiry.html) · 공지사항(notice.html)
- 상담 신청 버튼(nav-cta) → inquiry.html
- 푸터: 개인정보처리방침 → privacy.html

## 신규 페이지 섹션 구성
| 페이지 | 섹션 |
|--------|------|
| portfolio.html | Hero · 업종 필터+전체 프로젝트(#all) · 제작 범위(#scope) · CTA |
| portfolio-detail.html | Hero · 개요 · 문제·목표 · 기획·디자인 · 주요기능 · 제작과정 · 구축화면 · 제작범위 · 관련 프로젝트 · CTA |
| interview.html | Hero · 인터뷰 목록 · CTA |
| interview-detail.html | Hero · 배경 · 제작과정 · 결과 · 고객의 말 · 관련 포트폴리오 · CTA |
| plan.html | Hero · 제작과정(10) · 비용·기간 기준 · 준비 자료 · FAQ · CTA |
| maintenance.html | Hero · 필요 이유 · 유지관리 항목 · 범위 · CTA |
| government.html | Hero · 활용 가능 기업 · 활용 방식 · 진행 절차 · 준비 자료 · FAQ · CTA |
| columns.html | Hero · 최신 칼럼+카테고리 · 업종별 콘텐츠 · CTA |
| column-detail.html | Hero · 목차 · 본문 · 관련 서비스·포트폴리오·칼럼 · CTA |
| faq.html | Hero · 제작 전 · 비용·기간 · 디자인·개발 · 콘텐츠·촬영 · 유지관리 · 검색·AI · 정부지원 · CTA |
| inquiry.html | Hero · 문의 폼(분야·회사·담당자·연락처·이메일·일정·자료·설명·동의) · 문의 후 진행 |
| notice.html | Hero · 공지 목록(확장형) · CTA |
| privacy.html | Hero · 처리방침 7항목(수집·목적·기간·제3자·위탁·권리·담당자) |

## 공통 컴포넌트 (전 페이지 동일 표시 확인)
Header(공용 크롬) · 공용 Footer(4컬럼+저작권) · page-hero · section-head-row · FAQ(faq-item) · 최종 CTA(final-cta) · 문의 폼(iform).
