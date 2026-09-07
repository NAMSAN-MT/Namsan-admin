import { buildCollection, buildEntityCallbacks, buildProperty } from 'firecms';
import { db } from '../api/firebase';
import { NEW_DOC, rankByDate } from './newsOrder';
import type { NewsOrderRow } from './newsOrder';

type TNews = {
  agency: string;
  content: string;
  date: Date;
  newsType: string;
  originalLink: string;
  title: string;
  imagePath: string;
  order: number;
};

/** 폼에서는 Date, Firestore 문서에서는 Timestamp 로 들어온다 */
type TDateLike = Date | { toMillis: () => number };

const toMillis = (date?: TDateLike | null): number => {
  if (!date) return 0; // date 없는 레거시 문서는 가장 오래된 글로
  return 'toMillis' in date ? date.toMillis() : date.getTime();
};

const news = () => db.collection('news');

/**
 * news 전체를 date 오름차순으로 훑어 order 를 1..N 으로 다시 매긴다.
 * @param selfId 저장/삭제 중인 문서 id
 * @param selfDate 저장될 날짜. 넘기면 이 문서도 정렬에 반영하고 배정된 order 를 리턴
 */
const renumberByDate = async (selfId?: string, selfDate?: TDateLike) => {
  const snap = await news().get();
  const rows: NewsOrderRow[] = snap.docs
    .filter(doc => doc.id !== selfId)
    .map(doc => ({
      id: doc.id,
      ms: toMillis(doc.data().date),
      order: doc.data().order,
    }));

  if (selfDate !== undefined) {
    rows.push({ id: selfId ?? NEW_DOC, ms: toMillis(selfDate) });
  }

  const { updates, self } = rankByDate(rows, selfId ?? NEW_DOC);

  // ponytail: 배치 500건 제한. news 가 500건을 넘으면 나눠서 커밋.
  const batch = db.batch();
  updates.forEach(({ id, order }) => batch.update(news().doc(id), { order }));
  await batch.commit();

  return self;
};

const callbacks = buildEntityCallbacks<TNews>({
  // 저장할 때마다 전체를 다시 매긴다 — 날짜를 바꿔 끼워 넣어도 구멍이 안 생긴다
  onPreSave: async ({
    values,
    entityId,
  }: {
    values: TNews;
    entityId?: string;
  }) => ({ ...values, order: await renumberByDate(entityId, values.date) }),
  // 삭제하면 order 에 구멍이 나서 홈페이지 이전/다음이 끊긴다
  onDelete: ({ entityId }: { entityId?: string }) => {
    renumberByDate(entityId);
  },
});

const News = buildCollection<TNews>({
  name: 'news',
  singularName: 'news',
  path: 'news',
  permissions: ({ authController }: { authController: any }) => ({
    edit: true,
    create: true,
    delete: true,
  }),
  customId: false,
  initialSort: ['date', 'desc'],
  callbacks,
  properties: {
    objectID: {
      name: 'objectID',
      description: '',
      validation: { required: false },
      dataType: 'string',
      disabled: { hidden: true },
    },
    title: {
      name: '제목',
      description: '',
      validation: { required: true },
      dataType: 'string',
    },
    content: {
      name: '내용',
      description: '',
      dataType: 'string',
      markdown: true,
    },
    newsType: {
      name: '뉴스타입',
      description: '',
      validation: { required: true },
      dataType: 'string',
      enumValues: {
        media: 'media',
        recent: 'recent',
      },
    },
    agency: {
      name: '기관',
      description: '',
      validation: { required: true },
      dataType: 'string',
    },
    date: buildProperty({
      name: '생성날짜',
      description: '',
      validation: { required: true },
      dataType: 'date',
      mode: 'date',
    }),
    originalLink: {
      name: '원본링크',
      description: '',
      dataType: 'string',
    },
    imagePath: buildProperty({
      name: '이미지',
      dataType: 'string',
      description: '',
      storage: {
        storagePath: 'news',
        acceptedFiles: ['news/*'],
        metadata: {
          cacheControl: 'max-age=1000000',
        },
      },
    }),
    summary: {
      name: '요약',
      description: '',
      dataType: 'string',
      markdown: true,
    },
    order: {
      name: '순서',
      description: '날짜순으로 자동 계산됩니다. 직접 입력하지 않아도 됩니다.',
      dataType: 'number',
      disabled: {
        clearOnDisabled: false,
        disabledMessage: '날짜순으로 자동 계산됩니다.',
      },
    },
    memberId: {
      name: '멤버아이디',
      description: '',
      dataType: 'array',
      of: buildProperty({
        dataType: 'reference',
        description: '',
        path: 'members',
        previewProperties: ['id'],
      }),
    },
  },
});

export default News;
