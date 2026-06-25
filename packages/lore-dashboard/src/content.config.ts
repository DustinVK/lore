import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Full schema (status enum, hyphenated superseded-by/-date keys, null handling,
// transforms) comes from the build-tool plan in a later pass.

const SRC = process.env.LORE_SRC;
if (!SRC) throw new Error('LORE_SRC environment variable is required');

// YAML parses unquoted YYYY-MM-DD as a Date object; coerce back to ISO string.
const yamlDate = z.union([z.string(), z.date()]).transform(d =>
  d instanceof Date ? d.toISOString().slice(0, 10) : d
);

const log = defineCollection({
  loader: glob({ pattern: '*.md', base: `${SRC}/log` }),
  schema: z.object({
    date: yamlDate,
    title: z.string(),
    status: z.string().default('active'),
  }),
});

const questions = defineCollection({
  loader: glob({ pattern: '*.md', base: `${SRC}/questions` }),
  schema: z.object({
    id: z.string(),
    question: z.string(),
    status: z.string().default('open'),
    areas: z.array(z.string()).default([]),
    asked_date: yamlDate,
    asked_slug: z.string(),
  }),
});

export const collections = { log, questions };
