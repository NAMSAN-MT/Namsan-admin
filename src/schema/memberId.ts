/**
 * members.id 는 홈페이지에서 문서 ID 와 같은 값으로 조회한다.
 * 입력란을 숨겼으므로 저장 직전에 문서 ID 로 채워 넣는다.
 * (복사로 만든 문서가 원본 id 를 그대로 들고 가는 것도 여기서 바로잡힌다)
 */
export const withMemberId = <T extends Record<string, unknown>>(
  values: T,
  entityId: string | undefined,
): T & { id?: string } => {
  if (!entityId) return values;
  return { ...values, id: entityId };
};
