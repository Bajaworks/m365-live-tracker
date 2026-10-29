/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T14:30:00Z
 * @agent_roles IDE Agent + engineering-devops-automator
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id T-014
 *
 * Fails (exit 1) if the public project mentions a real brand or the author's
 * tenant. Run before every commit / publish:
 *
 *   node tools/check-branding.js [extra paths...]
 */
'use strict';

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..');
const FORBIDDEN = /konica|minolta|kmbs|skna|bajaworks/i;
const SKIP_DIRS = new Set([
  'node_modules', 'lib', 'lib-commonjs', 'lib-dts', 'lib-esm', 'temp', 'dist', 'release',
  'jest-output', '.heft', 'sharepoint', 'teams', '.git', 'coverage'
]);
const SKIP_FILES = new Set([path.join(__dirname, 'check-branding.js'), path.join(PROJECT_ROOT, 'package-lock.json')]);
const BINARY = /\.(png|jpe?g|gif|ico|zip|sppkg|woff2?|ttf|eot|mp4)$/i;

function isLocalConfig(file) {
  return /\.local\./i.test(path.basename(file));
}

function walk(target, out) {
  if (!fs.existsSync(target)) {
    return;
  }
  const stat = fs.statSync(target);
  if (stat.isFile()) {
    out.push(target);
    return;
  }
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) {
      continue;
    }
    walk(path.join(target, entry.name), out);
  }
}

const targets = [PROJECT_ROOT].concat(process.argv.slice(2).map((p) => path.resolve(p)));
const files = [];
targets.forEach((t) => walk(t, files));

const findings = [];
for (const file of files) {
  if (SKIP_FILES.has(file) || BINARY.test(file) || isLocalConfig(file)) {
    continue;
  }
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  lines.forEach((line, i) => {
    const match = FORBIDDEN.exec(line);
    if (match) {
      findings.push(`${path.relative(process.cwd(), file)}:${i + 1}: "${match[0]}"`);
    }
  });
}

if (findings.length > 0) {
  console.error('check-branding: real brand or tenant names found:\n  ' + findings.join('\n  '));
  process.exit(1);
}
console.log(`check-branding: OK (${files.length} files scanned).`);
