import { buildCollection, buildProperty } from 'firecms';

type TMember = {
  main: string[];
  sub: string[];
};

type TWork = {
  categoryInfo: string[];
  description: string[];
  imagePath: string;
  member: TMember;
  language: string;
  categoryId: string;
};

const Work = buildCollection<TWork>({
  name: 'work',
  singularName: 'work',
  path: 'work',
  permissions: ({ authController }: { authController: any }) => ({
    edit: true,
    create: true,
    delete: true,
  }),
  customId: false,
  properties: {
    categoryInfo: buildProperty({
      name: '업무분야',
      dataType: 'array',
      of: buildProperty({
        dataType: 'string',
        validation: { required: true },
      }),
    }),
    description: {
      name: '설명',
      description: '',
      validation: { required: true },
      dataType: 'array',
      of: buildProperty({
        dataType: 'string',
        validation: { required: true },
      }),
    },
    imagePath: buildProperty({
      name: '배경이미지',
      dataType: 'string',
      description: '',
      storage: {
        storagePath: 'work',
        acceptedFiles: ['work/*'],
        metadata: {
          cacheControl: 'max-age=1000000',
        },
      },
    }),
    member: {
      name: '구성원',
      description: '',
      validation: { required: true },
      dataType: 'map',
      properties: {
        main: {
          name: 'main',
          description: '',
          validation: { required: true },
          dataType: 'array',
          of: buildProperty({
            dataType: 'string',
            validation: { required: true },
            description: '',
          }),
        },
        sub: {
          name: 'sub',
          description: '',
          validation: { required: true },
          dataType: 'array',
          of: buildProperty({
            dataType: 'string',
            validation: { required: true },
            description: '',
          }),
        },
      },
    },
    language: {
      name: '언어',
      description: '',
      validation: { required: true },
      dataType: 'string',
    },
    categoryId: {
      name: '카테고리아이디',
      description: '',
      validation: { required: true },
      dataType: 'string',
    },
  },
});

export default Work;
