import { buildCollection, buildProperty } from 'firecms';

type TNews = {
  agency: string;
  content: string;
  date: Date;
  newsType: string;
  originalLink: string;
  title: string;
  imagePath: string;
};

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
  properties: {
    objectID: {
      name: 'objectID',
      description: '',
      validation: { required: false },
      dataType: 'string',
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
      validation: { required: true },
      dataType: 'string',
      markdown: true,
    },
    newsType: {
      name: '뉴스타입',
      description: '',
      validation: { required: true },
      dataType: 'string',
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
      validation: { required: true },
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
      validation: { required: true },
      dataType: 'string',
      markdown: true,
    },
    order: {
      name: '순서',
      description: '',
      validation: { required: true },
      dataType: 'number',
    },
    memberId: {
      name: '멤버아이디',
      description: '',
      path: 'members',
      previewProperties: ['id'],
      dataType: 'reference',
    },
  },
});

export default News;
