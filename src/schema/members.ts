import { buildCollection, buildProperty } from 'firecms';

type TEducations = {
  value: string;
}[];

type TCarrers = {
  time: string;
  value: string;
}[];

type TMembers = {
  bgImagePath: string;
  businessFields: string[];
  careers: TCarrers;
  description: string;
  educations: TEducations;
  email: string;
  id: string;
  imagePath: string;
  language: string;
  name: string;
  order: number;
  position: string;
};

const Members = buildCollection<TMembers>({
  name: 'members',
  singularName: 'members',
  path: 'members',
  permissions: ({ authController }: { authController: any }) => ({
    edit: true,
    create: true,
    delete: true,
  }),
  customId: false,
  properties: {
    name: {
      name: '이름',
      description: '',
      validation: { required: true },
      dataType: 'string',
    },
    email: {
      name: '이메일',
      description: '',
      validation: { required: true },
      dataType: 'string',
    },
    imagePath: buildProperty({
      name: '프로필이미지',
      dataType: 'string',
      description: '',
      storage: {
        storagePath: 'members',
        acceptedFiles: ['members/*'],
        metadata: {
          cacheControl: 'max-age=1000000',
        },
      },
    }),
    businessFields: {
      name: '업무분야',
      dataType: 'array',
      of: buildProperty({
        dataType: 'string',
        validation: { required: true },
      }),
    },

    bgImagePath: buildProperty({
      name: '배경이미지',
      dataType: 'string',
      description: '',
    }),
    careers: {
      name: '자격 및 경력',
      description: '',
      validation: { required: true },
      dataType: 'array',
      of: buildProperty({
        dataType: 'map',
        properties: {
          time: {
            name: 'time',
            description: '',
            validation: { required: false },
            dataType: 'string',
          },
          value: {
            name: 'value',
            description: '',
            validation: { required: true },
            dataType: 'string',
          },
        },
      }),
    },
    description: {
      name: '설명',
      description: '',
      validation: { required: true },
      dataType: 'string',
    },
    educations: {
      name: '학력',
      description: '',
      validation: { required: true },
      dataType: 'array',
      of: buildProperty({
        dataType: 'map',
        properties: {
          time: {
            name: 'time',
            description: '',
            validation: { required: false },
            dataType: 'string',
          },
          value: {
            name: 'value',
            description: '',
            validation: { required: true },
            dataType: 'string',
          },
        },
      }),
    },
    id: {
      name: '유니크아이디',
      description: '',
      validation: { required: true },
      dataType: 'string',
    },
    language: {
      name: '언어',
      description: '',
      validation: { required: true },
      dataType: 'string',
    },
    order: {
      name: '순서',
      description: '',
      validation: { required: true },
      dataType: 'number',
    },
    position: {
      name: '직책',
      description: '',
      validation: { required: true },
      dataType: 'string',
    },
  },
});

export default Members;
