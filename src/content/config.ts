import { defineCollection, z } from 'astro:content'

const experiencia = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    company: z.string(),
    companyDetail: z.string().optional(),
    blockquote: z.string().optional(),
    descriptions: z.array(z.string()).optional(),
    descriptionList: z.array(z.string()).optional(),
    impact: z
      .array(
        z.union([
          z.string(),
          z.object({
            texto: z.string(),
            openDialogId: z.string().optional(),
            externalUrl: z.string().url().optional(),
            subitems: z.array(z.union([z.string(), z.object({ texto: z.string() })])).optional(),
          }),
        ])
      )
      .optional(),
    links: z
      .array(
        z.object({
          url: z.string().url().optional(),
          galeria: z
            .union([
              z.string(),
              z.object({
                carpeta: z.string(),
                items: z
                  .array(
                    z.object({
                      nombre: z.string(),
                      alt: z.string(),
                      fit: z.enum(['recortar', 'encajar']).default('encajar'),
                    })
                  )
                  .min(1),
              }),
            ])
            .optional(),
        })
      )
      .optional(),
    date: z.string(),
    order: z.number(),
    extra: z.boolean().default(false),
  }),
})

const formacion = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    company: z.string(),
    url: z.string().url().optional(),
    date: z.string(),
    description: z.string(),
    files: z.array(z.string()).optional(),
    order: z.number(),
  }),
})

const proyectos = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.enum(['corporativos', 'pruebas-tecnicas', 'personales']),
    status: z.enum(['publicado', 'en-desarrollo']).default('publicado'),
    link: z.string().url().optional(),
    repository: z.string().url().optional(),
    descriptions: z.array(z.string()),
    resource: z.union([
      z.object({
        type: z.literal('imagen'),
        alt: z.string(),
        fit: z.enum(['recortar', 'encajar']),
      }),
      z.object({
        type: z.literal('video'),
        accessibleLabel: z.string(),
        fit: z.enum(['recortar', 'encajar']),
        width: z.number(),
        height: z.number(),
      }),
      z.object({
        type: z.literal('galeria'),
        items: z
          .array(
            z.object({
              type: z.literal('imagen'),
              nombre: z.string(),
              alt: z.string(),
              fit: z.enum(['recortar', 'encajar']),
            })
          )
          .min(1),
      }),
    ]),
    tags: z.array(
      z.enum([
        'HTML5',
        'CSS3',
        'TAILWIND',
        'JS',
        'JQUERY',
        'GIT',
        'PHP',
        'WORDPRESS',
        'NODEJS',
        'POSTMAN',
        'EXPRESSJS',
        'SEQUELIZE',
        'PRISMA',
        'TURSO',
        'VERCEL',
        'REACT',
        'MATERIALUI',
        'CHROME',
        'DOCKER',
        'PYTHON',
        'FLASK',
        'MONGODB',
        'STRIPE',
        'VUE',
        'TYPESCRIPT',
        'ASTRO',
        'SQLITE',
        'GOOGLECALENDAR',
        'TODOIST',
        'PLAYWRIGHT',
        'SUPABASE',
        'POSTGRESQL',
        'RESEND',
        'OPENCODE',
        'GOOGLEKEEP',
        'GOOGLETAKEOUT',
      ])
    ),
  }),
})

export const collections = { experiencia, formacion, proyectos }
