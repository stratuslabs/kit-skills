import path from 'node:path';
import { assetsDir, distDir, loadSkills, resetDir, copyDirectory, copyFile, writeJson } from './shared.mjs';

const packageJson = JSON.parse(await BunOrNodeRead(path.join(path.resolve(import.meta.dirname, '..'), 'package.json')));
const allSkills = loadSkills();
const invalid = allSkills.filter((s) => !s.parsed || !s.parsed.attributes);
if (invalid.length > 0) {
  console.error(`Build failed: ${invalid.length} skill(s) have missing or invalid frontmatter:`);
  for (const s of invalid) console.error(`  - ${s.slug}`);
  console.error('Run `npm run validate` for details.');
  process.exit(1);
}
const skills = allSkills;

resetDir(distDir);

const distSkillsDir = path.join(distDir, 'skills');
for (const skill of skills) {
  copyDirectory(skill.dir, path.join(distSkillsDir, skill.slug));
}

copyDirectory(assetsDir, path.join(distDir, 'assets'));
copyFile(path.join(path.resolve(import.meta.dirname, '..'), 'README.md'), path.join(distDir, 'README.md'));

const compatTargets = [
  {
    key: 'codex',
    description: 'Generated Codex compatibility bundle. Use install-skills.mjs for direct installs into Codex skill paths.',
  },
  {
    key: 'claude',
    description: 'Generated Claude compatibility bundle. This is a labeled export, not a claim of native auto-discovery support.',
  },
  {
    key: 'cursor',
    description: 'Generated Cursor compatibility bundle. This is a labeled export, not a claim of native auto-discovery support.',
  },
];

for (const target of compatTargets) {
  const targetDir = path.join(distDir, 'compat', target.key);
  const manifest = {
    name: packageJson.name,
    version: packageJson.version,
    description: target.description,
    generatedAt: new Date().toISOString(),
    sourceOfTruth: '../../skills',
    assets: '../../assets',
    skills: skills.map((skill) => ({
      name: skill.parsed.attributes.name,
      description: skill.parsed.attributes.description,
      source: `../../skills/${skill.slug}/SKILL.md`,
      bundled: `./skills/${skill.slug}/SKILL.md`,
    })),
    limitations: target.key === 'codex'
      ? [
          'Use the install script for direct installation into supported Codex directories.',
          'This bundle is primarily for inspection and manual syncing.',
        ]
      : [
          'Generated for compatibility review and manual wiring.',
          'Exact vendor-native install semantics are intentionally not assumed by this repo.',
        ],
  };

  writeJson(path.join(targetDir, 'manifest.json'), manifest);
  for (const skill of skills) {
    copyDirectory(skill.dir, path.join(targetDir, 'skills', skill.slug));
  }
}

console.log(`Built dist/ with ${skills.length} skills and ${compatTargets.length} compatibility bundles.`);

async function BunOrNodeRead(filePath) {
  const fs = await import('node:fs/promises');
  return fs.readFile(filePath, 'utf8');
}
