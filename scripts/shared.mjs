import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

export const repoRoot = path.resolve(import.meta.dirname, '..');
export const skillsDir = path.join(repoRoot, 'skills');
export const assetsDir = path.join(repoRoot, 'assets');
export const distDir = path.join(repoRoot, 'dist');

export const supportedCompatTargets = ['claude', 'cursor', 'codex'];

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
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    return null;
  }

  const frontmatter = {};
  for (const line of match[1].split('\n')) {
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

export function resolveHomePath(targetPath) {
  if (!targetPath.startsWith('~/')) {
    return targetPath;
  }

  return path.join(os.homedir(), targetPath.slice(2));
}
