/**
 * Build script to generate JSON Schema from Zod schemas.
 *
 * Outputs: public/schema.json
 *
 * Usage: pnpm run build:schema
 */

import { writeFileSync } from 'node:fs';
import { toJSONSchema } from 'zod/mini';

import { ProfileSchema } from '../src/validators/profile.ts';

const jsonSchema = toJSONSchema(ProfileSchema);

const schema = {
  $id: 'https://dotabout.me/schema.json',
  description: 'Schema for about.json profile configuration.',
  title: 'Dotabout Profile Schema',
  ...jsonSchema,
};

writeFileSync('./public/schema.json', JSON.stringify(schema, null, 2) + '\n');

console.log('✓ Generated public/schema.json');
