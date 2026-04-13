import fs from 'node:fs';
import path from 'node:path';
import { loadSkills } from './shared.mjs';

const errors = [];
const skills = loadSkills();

if (skills.length === 0) {
  errors.push('No skills were found under skills/.');
}

for (const skill of skills) {
  if (!fs.existsSync(skill.skillFile)) {
    errors.push(`${skill.slug}: missing SKILL.md`);
    continue;
  }

  if (!skill.parsed) {
    errors.push(`${skill.slug}: SKILL.md is missing YAML frontmatter`);
    continue;
  }

  const { attributes, body } = skill.parsed;
  if (!attributes.name) {
    errors.push(`${skill.slug}: frontmatter is missing name`);
  }

  if (attributes.name !== skill.slug) {
    errors.push(`${skill.slug}: frontmatter name must match directory name`);
  }

  if (!attributes.description) {
    errors.push(`${skill.slug}: frontmatter is missing description`);
  }

  if (!body.trim()) {
    errors.push(`${skill.slug}: SKILL.md body is empty`);
  }

  if (!/^#\s+/m.test(body)) {
    errors.push(`${skill.slug}: SKILL.md body should include a top-level heading`);
  }
}

if (errors.length > 0) {
  console.error('Skill validation failed:\n');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Validated ${skills.length} skills.`);
for (const skill of skills) {
  console.log(`- ${path.relative(process.cwd(), skill.skillFile)}`);
}
