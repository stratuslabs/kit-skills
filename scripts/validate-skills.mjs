import path from 'node:path';
import { loadSkills, validateSkills } from './shared.mjs';

const skills = loadSkills();
const errors = validateSkills(skills);

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
