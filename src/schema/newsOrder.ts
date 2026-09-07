/**
 * news.order 계산. 홈페이지는 order 를 1..N 연속 정수로 가정한다
 * (1 = 가장 오래된 글, N = 최신 글). 목록은 order desc 로 정렬하고,
 * 상세 페이지 이전/다음은 order±1 로 문서를 찾는다.
 */

export type NewsOrderRow = { id: string; ms: number; order?: number };

/** 아직 문서 id 가 없는 신규 엔티티용 임시 id (Firestore 예약 형식이라 충돌 없음) */
export const NEW_DOC = '__new__';

/**
 * date 오름차순으로 order = 1..N 을 다시 배정한다.
 * @param rows 전체 news (저장 중인 엔티티도 포함시켜 넘긴다)
 * @param selfId 저장/삭제 중인 문서 id — 배치 대상에서 빼고 배정값만 리턴
 * @returns updates 값이 실제로 바뀌는 문서만 / self selfId 에 배정된 order (없으면 0)
 */
export const rankByDate = (rows: NewsOrderRow[], selfId: string = NEW_DOC) => {
  // 같은 날짜면 id 순으로 고정 — 저장할 때마다 순서가 흔들리지 않게
  const sorted = [...rows].sort(
    (a, b) => a.ms - b.ms || a.id.localeCompare(b.id),
  );

  const updates: { id: string; order: number }[] = [];
  let self = 0;

  sorted.forEach((row, index) => {
    const order = index + 1;
    if (row.id === selfId) self = order;
    else if (row.order !== order) updates.push({ id: row.id, order });
  });

  return { updates, self };
};
