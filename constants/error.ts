export const ERROR_CODE = {
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED', // 할당량 초과 (가장 중요)
  AUTH_ERROR: 'AUTH_ERROR', // API 키 미설정 또는 만료
  RATE_LIMIT: 'RATE_LIMIT', // 단시간 너무 많은 요청
  INVALID_REQUEST: 'INVALID_REQUEST', // 파라미터 오류 등
  SERVER_ERROR: 'SERVER_ERROR', // 기타 500 에러
  NOT_FOUND: 'NOT_FOUND', // 영상/채널 없음
} as const;

export type ErrorCode = (typeof ERROR_CODE)[keyof typeof ERROR_CODE];
