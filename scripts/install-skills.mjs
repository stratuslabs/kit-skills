import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { loadSkills, validateSkills, ensureDir, copyDirectory, resolveHomePath } from './shared.mjs';

const args = process.argv.slice(2);
const options = parseArgs(args);
const skills = loadSkills();
const validationErrors = validateSkills(skills);
if (validationErrors.length > 0) {
  console.error('Install failed — skill validation errors:\n');
  for (const err of validationErrors) console.error(`  - ${err}`);
  process.exit(1);
}

if (!options.target) {
  fail('Missing --target. Supported targets: codex-global, codex-project, compat-local, compat-dir.');
}

switch (options.target) {
  case 'codex-global': {
    const destination = resolveHomePath(options.dest ?? path.join(os.homedir(), '.codex', 'skills'));
    installSkillDirectories(destination);
    console.log(`Installed ${skills.length} skills into ${destination}`);
    break;
  }

  case 'codex-project': {
    const destination = resolveHomePath(options.dest ?? path.join(process.cwd(), '.codex', 'skills'));
    installSkillDirectories(destination);
    console.log(`Installed ${skills.length} skills into ${destination}`);
    break;
  }

  case 'compat-local': {
    const destination = resolveHomePath(options.dest ?? path.join(process.cwd(), '.kit-skills'));
    installCompatBundle(destination);
    console.log(`Installed compatibility bundle into ${destination}`);
    break;
  }

  case 'compat-dir': {
    if (!options.dest) {
      fail('compat-dir requires --dest <directory>.');
    }
    const destination = resolveHomePath(options.dest);
    installCompatBundle(destination);
    console.log(`Installed compatibility bundle into ${destination}`);
    break;
  }

  default:
    fail(`Unsupported target: ${options.target}`);
}

function installSkillDirectories(destinationRoot) {
  ensureDir(destinationRoot);
  for (const skill of skills) {
    const destination = path.join(destinationRoot, skill.slug);
    fs.rmSync(destination, { recursive: true, force: true });
    copyDirectory(skill.dir, destination);
  }
}

function installCompatBundle(destinationRoot) {
  const destination = path.join(destinationRoot, 'compat');
  fs.rmSync(destination, { recursive: true, force: true });
  ensureDir(destination);

  const manifest = {
    name: 'kit-ai-toolkit',
    installedAt: new Date().toISOString(),
    note: 'Compatibility export for manual Claude/Cursor wiring or project-local reference. Not asserted as vendor-native auto-install support.',
    skills: skills.map((skill) => ({
      slug: skill.slug,
      source: `skills/${skill.slug}/SKILL.md`,
    })),
  };

  fs.writeFileSync(path.join(destination, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

  for (const skill of skills) {
    copyDirectory(skill.dir, path.join(destination, 'skills', skill.slug));
  }
}

function parseArgs(rawArgs) {
  const parsed = {};
  for (let index = 0; index < rawArgs.length; index += 1) {
    const value = rawArgs[index];
    if (value === '--target') {
      parsed.target = rawArgs[index + 1];
      index += 1;
    } else if (value === '--dest') {
      parsed.dest = rawArgs[index + 1];
      index += 1;
    }
  }
  return parsed;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
