import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

export const repoRoot = path.resolve(import.meta.dirname, '..');
export const skillsDir = path.join(repoRoot, 'skills');


export function getSkillDirectories() {
  return fs
    .readdirSync(skillsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({
      slug: entry.name,
      dir: path.join(skillsDir, entry.name),
      skillFile: path.join(skillsDir, entry.name, 'SKILL.md'),
    }))
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

export function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) {
    return null;
  }

  const frontmatter = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (field) {
      frontmatter[field[1]] = field[2].trim();
    }
  }

  return {
    attributes: frontmatter,
    body: content.slice(match[0].length),
  };
}

export function loadSkills() {
  return getSkillDirectories().map((entry) => {
    if (!fs.existsSync(entry.skillFile)) {
      return { ...entry, content: null, parsed: null };
    }
    const content = fs.readFileSync(entry.skillFile, 'utf8');
    const parsed = parseFrontmatter(content);

    return {
      ...entry,
      content,
      parsed,
    };
  });
}

export function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

export function resetDir(dirPath) {
  fs.rmSync(dirPath, { recursive: true, force: true });
  ensureDir(dirPath);
}

export function copyFile(sourcePath, destinationPath) {
  ensureDir(path.dirname(destinationPath));
  fs.copyFileSync(sourcePath, destinationPath);
}

export function copyDirectory(sourceDir, destinationDir) {
  ensureDir(destinationDir);
  fs.cpSync(sourceDir, destinationDir, { recursive: true });
}

export function writeJson(filePath, value) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

/**
 * Validate all loaded skills and return an array of error strings.
 * An empty array means everything is valid.
 */
export function validateSkills(skills) {
  const errors = [];

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

    if (attributes.name && attributes.name !== skill.slug) {
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

  return errors;
}

export function resolveHomePath(targetPath) {
  if (!targetPath.startsWith('~/')) {
    return targetPath;
  }

  return path.join(os.homedir(), targetPath.slice(2));
}
