# 서브페이지 새 디자인 이식 지침 (2026-07-28)

목표: 구 디자인(restructure.css/home.css) 프래그를 **index.html·renewal.html과 동일한 새 디자인 언어**로 다시 씀.
반드시 `css/hw.css`와 `css/hw-sub.css`의 클래스만 사용(구 클래스 x-*, hd-*, mth-*, col-block 등 금지).

## 프래그 형식(절대 규칙)
`_build/_src/<name>.frag.html` 각 파일:
- **1행 = <title> 내용** (예: `기업 홈페이지 | 거래처가 신뢰하는 구조 — 하오웹`)
- **2행 = meta description 내용** (1문장, 140자 내외)
- **3행 이후 = <main id="main"> 안에 들어갈 본문 HTML만** (header/footer/`<main>`/`<html>` 태그 쓰지 않음 — compose가 감쌈)
- 3행은 보통 빈 줄, 4행부터 `<section ...>` 시작.

## 콘텐츠 원칙(엄수)
- **기존 프래그의 실제 문구·정보·링크를 최대한 보존**하고 새 마크업으로 재배치. 의미를 바꾸거나 축소하지 말 것.
- 가상의 수치·기간·고객·프로젝트·실적·연락처 **생성 금지**. 확정 안 된 수치는 비수치 문장으로("범위에 따라 안내합니다").
- "검색 순위/AI 노출/성과 보장" 표현 금지. 기존의 "보장하지 않습니다" 면책 문구는 유지.
- 영문 장식은 라벨(p-eye/kick) 정도만. 의미 없는 대형 영문 금지.
- **카드 남용 금지**: 모든 섹션을 동일 카드로 만들지 말 것. feat(리스트)·flow·steps·trio·idx·psplit 등을 콘텐츠에 맞게 섞어 사용.
- 회색 스켈레톤·빈 목업 금지.

## 페이지 뼈대(공통)
1. `<section class="page-hero page-hero--tight">` → `.wrap` 안에 `.crumbs`(홈 › 상위 › 현재) + `.eyebrow`(영문 라벨) + `<h1>`(대형, `<span class="r">` 포인트) + `.lead`.
2. 본문 `<section class="psec">` / `<section class="psec psec--off">`(교대 배경). 각 섹션 `.wrap` 안에 `.p-eye` + `.p-h2`(+`.r`) + `.p-lead` + 콘텐츠 컴포넌트.
3. 마지막 `<section class="cta"><div>...<h2>...</h2> + 버튼들</div></section>`(CTA). 버튼: `<a class="cta__btn" href="free-proposal.html" style="background:var(--red);border-color:var(--red);color:#fff">무료 시안·제안받기 →</a>` + `<a class="cta__btn" href="inquiry.html">제작 문의</a>`.
4. 관련 페이지 링크는 `.rel`(a들, 화살표 자동).

## 사용 가능한 컴포넌트(요지) — 자세한 스펙은 css/hw.css, css/hw-sub.css 참고
- `.page-hero` `.crumbs` `.eyebrow` `.lead` `.p-actions` `.p-btn(.p-btn--ghost)` `.cue`
- `.psec(.psec--off)` `.p-eye` `.p-h2` `.p-lead` `.psplit`
- `.feat > li`(feat__k + feat__b: h3/p/ul) — 대상·문제·범위 등 편집형 리스트
- `.flow`(flow__row: flow__no + flow__b) — 대형 번호 과정
- `.steps > li` — 절차 요약(자동 번호)
- `.trio(.trio--off) > div`(n/h3/p) — 3열 개념
- `.idx > a`(n/t/go) — 하위 페이지 인덱스(허브에서 유용)
- `.p-cols` + `.p-check`(✓ 리스트)
- `.faq`(details/summary + .a) — FAQ 아코디언
- `.dreport` — 진단 표(renewal 참고)
- `.plans2` — 플랜 3열(plan에서)
- `.deflist` — 정의 리스트(회사/운영 안내). 미확정 값은 `<dd class="pending">`
- `.prep`(prep__label/h2/p/prep__list/p-actions) — 준비중 완성 상태
- `.prose` + `.col-wrap`/`.col-aside` — 칼럼 본문
- `.formx`(field/label/.req/row2/radios/consent/form-msg) + `.form-grid`/`.form-side` — 폼
- `.rel` `.sec-note` `.two-col` `.anchor`(앵커 대상엔 id + class="anchor")
- 섹션 제목 대형: `.s-h2`(+`.r`/`.dim`), `.kick`

## 골드 예시
`_build/_src/portfolio.frag.html` 를 그대로 참고(구조·톤·클래스 사용법). renewal.html(루트)도 psec/flow/dreport/faq/prep 실제 사용 예.

## 접근성·반응형
- h1 1개 / h2 여러 개 / h3 위계 지킬 것. `.r` 강조는 span으로.
- 폼 label은 for/id 연결, 필수엔 `<span class="req">*</span>`.
- 가로 스크롤 유발 금지(넓은 표/코드 없음). 긴 리스트는 feat/steps 사용.
- 모션은 CSS 리빌(`data-rv` 속성을 섹션 헤더나 블록에 부여 가능 — hw.js가 처리). 과한 핀/모션 추가 금지.

## 링크 규칙
- 모든 href는 존재하는 파일. 앵커(#scope 등)는 대상 페이지에 실제 id 있을 때만.
- CTA는 free-proposal.html / inquiry.html / diagnosis.html 중심.
- 폼 있는 페이지는 `<form data-hao-form="...">` 유지(hw-sub.js가 처리). 필드 그룹 조건부는 `.fp-grp[data-for="new|renewal"]`, 대표필드 `[data-fp-primary]`.
