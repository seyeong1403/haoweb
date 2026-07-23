/* HAOWEB · site-config.js — 실제 사실 정보 단일 소스
   여기 값만 채우면 전 페이지(Footer·개인정보처리방침·문의 폼)에 반영된다.
   빈 값이면 화면에서 해당 항목을 표시하지 않는다(가짜 정보 노출 방지).
   상세: docs/current/PENDING_FACTS_ONLY.md */
window.HAOWEB_CONFIG = {
  company: {
    brand: "하오웹",
    legalName: "",      // 사업자등록증상 상호
    ceo: "",            // 대표자명
    bizNo: "",          // 사업자등록번호
    address: "",        // 사업장 주소
    established: ""     // 설립일
  },
  contact: {
    tel: "",            // 대표 전화번호
    email: "",          // 대표 이메일
    kakao: "",          // 카카오톡 채널 주소
    hours: "평일 09:00 – 18:00"
  },
  privacy: {
    officer: "",        // 개인정보 보호 담당자
    officerEmail: "",
    effectiveDate: "",  // 시행일 (YYYY-MM-DD)
    analytics: false    // 분석 도구 사용 여부
  },
  form: {
    endpoint: "",       // 접수 API 주소. 비어 있으면 전송하지 않고 확인 화면까지만 동작
    recipient: ""       // 접수 알림 수신 이메일
  }
};
