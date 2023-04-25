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
  customId: true,
  properties: {
    bgImagePath: buildProperty({
      name: 'bgImagePath',
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
      name: 'businessFields',
      dataType: 'array',
      of: buildProperty({
        dataType: 'string',
        validation: { required: true },
      }),
    },
    careers: {
      name: 'careers',
      description: '',
      validation: { required: true },
      dataType: 'array',
      of: buildProperty({
        dataType: 'map',
        properties: {
          time: {
            name: 'time',
            description: '',
            validation: { required: true },
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
      name: 'description',
      description: '',
      validation: { required: true },
      dataType: 'string',
    },
    educations: {
      name: 'educations',
      description: '',
      validation: { required: true },
      dataType: 'array',
      of: buildProperty({
        dataType: 'map',
        properties: {
          value: {
            name: 'value',
            description: '',
            validation: { required: true },
            dataType: 'string',
          },
        },
      }),
    },
    email: {
      name: 'email',
      description: '',
      validation: { required: true },
      dataType: 'string',
    },
    id: {
      name: 'id',
      description: '',
      validation: { required: true },
      dataType: 'number',
    },
    imagePath: buildProperty({
      name: 'imagePath',
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
    language: {
      name: 'language',
      description: '',
      validation: { required: true },
      dataType: 'string',
    },
    name: {
      name: 'name',
      description: '',
      validation: { required: true },
      dataType: 'string',
    },
    position: {
      name: 'position',
      description: '',
      validation: { required: true },
      dataType: 'string',
    },
  },
});

export default Members;
