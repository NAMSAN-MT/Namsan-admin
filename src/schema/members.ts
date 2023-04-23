import { buildCollection, buildProperty } from 'firecms';

type TSubCategory = {
  categoryId: string;
  name: string;
}[];

type TCategoryInfo = {
  categoryId: string;
  name: string;
  subCategory: TSubCategory;
};

type TDescription = {
  key: string;
  value: string;
}[];

type TMember = {
  main: string[];
  sub: string[];
};

type TWork = {
  categoryInfo: TCategoryInfo;
  description: TDescription;
  imagePath: string;
  member: TMember;
};

const members = buildCollection<TWork>({
  name: 'members',
  singularName: 'members',
  path: 'members',
  permissions: ({ authController }: { authController: any }) => ({
    edit: true,
    create: true,
    delete: false,
  }),
  customId: true,
  properties: {
    categoryInfo: buildProperty({
      name: 'CategoryInfo',
      dataType: 'map',
      properties: {
        categoryId: {
          name: 'categoryId',
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
        subCategory: {
          name: 'subCategory',
          description: '',
          validation: { required: true },
          dataType: 'array',
          of: buildProperty({
            dataType: 'map',
            properties: {
              categoryId: {
                name: 'categoryId',
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
            },
          }),
        },
      },
    }),
    description: {
      name: 'description',
      description: '',
      validation: { required: true },
      dataType: 'array',
      of: buildProperty({
        dataType: 'map',
        properties: {
          key: {
            name: 'key',
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
    imagePath: buildProperty({
      name: 'Images',
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
      name: 'member',
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
  },
});

export default Work;
