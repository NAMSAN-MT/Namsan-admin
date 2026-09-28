/** node --experimental-strip-types src/schema/memberId.test.ts */
import assert from 'node:assert/strict';
import { withMemberId } from './memberId.ts';

// 1) 신규 등록 — 숨겨진 id 가 비어 있어도 문서 ID 로 채워진다
assert.deepEqual(withMemberId({ name: '홍길동' }, 'abc123'), { name: '홍길동', id: 'abc123' });

// 2) 기존 값이 문서 ID 와 다르면 (복사 등) 문서 ID 로 덮어쓴다
assert.deepEqual(withMemberId({ id: 'old', name: '홍길동' }, 'new'), { id: 'new', name: '홍길동' });

// 3) 수정 — 이미 같은 값이면 그대로
assert.deepEqual(withMemberId({ id: 'same', name: 'a' }, 'same'), { id: 'same', name: 'a' });

// 4) entityId 가 없으면 values 를 건드리지 않는다
const v = { name: 'a' };
assert.equal(withMemberId(v, undefined), v);

// 5) 원본 객체를 변경하지 않는다
const orig = { name: 'a' };
withMemberId(orig, 'x');
assert.deepEqual(orig, { name: 'a' });

console.log('memberId: 5 passed');
