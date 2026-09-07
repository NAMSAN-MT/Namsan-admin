/** node --experimental-strip-types src/schema/newsOrder.test.ts */
import assert from 'node:assert/strict';
import { NEW_DOC, rankByDate } from './newsOrder.ts';
import type { NewsOrderRow } from './newsOrder.ts';

const day = (d: number) => Date.UTC(2026, 0, d);

/** 이미 날짜순으로 맞아 있는 3건 */
const clean: NewsOrderRow[] = [
  { id: 'a', ms: day(1), order: 1 },
  { id: 'b', ms: day(2), order: 2 },
  { id: 'c', ms: day(3), order: 3 },
];

// 1) 최신 날짜로 새 글 추가 — 본인만 N 을 받고 나머지는 건드리지 않는다
{
  const { updates, self } = rankByDate([...clean, { id: NEW_DOC, ms: day(9) }]);
  assert.equal(self, 4);
  assert.deepEqual(updates, []);
}

// 2) 중간 날짜로 끼워 넣기 — 그보다 최신인 글만 한 칸씩 밀린다
{
  const { updates, self } = rankByDate([
    ...clean,
    { id: NEW_DOC, ms: day(2) + 1 },
  ]);
  assert.equal(self, 3);
  assert.deepEqual(updates, [{ id: 'c', order: 4 }]);
}

// 3) 기존 글의 날짜를 가장 오래된 날로 수정 — 본인 제외 전부 재배정
{
  const { updates, self } = rankByDate(
    [...clean.filter(row => row.id !== 'c'), { id: 'c', ms: day(0) }],
    'c',
  );
  assert.equal(self, 1);
  assert.deepEqual(updates, [
    { id: 'a', order: 2 },
    { id: 'b', order: 3 },
  ]);
}

// 4) 삭제 — 남은 글이 구멍 없이 1..N 으로 다시 메워진다
{
  const { updates, self } = rankByDate(
    clean.filter(row => row.id !== 'a'),
    'a',
  );
  assert.equal(self, 0);
  assert.deepEqual(updates, [
    { id: 'b', order: 1 },
    { id: 'c', order: 2 },
  ]);
}

// 5) 날짜가 같으면 id 순으로 고정 — 입력 순서가 바뀌어도 결과가 같다
{
  const tied: NewsOrderRow[] = [
    { id: 'z', ms: day(5) },
    { id: 'y', ms: day(5) },
  ];
  const expected = [
    { id: 'y', order: 1 },
    { id: 'z', order: 2 },
  ];
  assert.deepEqual(rankByDate(tied).updates, expected);
  assert.deepEqual(rankByDate([...tied].reverse()).updates, expected);
}

console.log('newsOrder: 5 checks passed');
