/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T16:30:00Z
 * @agent_roles IDE Agent + engineering-devops-automator
 * @vision_command start_sprint --sprint 2
 * @sprint_number 2
 * @task_id T-010
 *
 * Bumps the SharePoint package version shown as "App version" in the App Catalog
 * (config/package-solution.json → solution.version and every feature version).
 *
 *   node tools/bump-version.js            → 1.0.0.3 → 1.0.0.4
 *   node tools/bump-version.js 1.1.0.0    → sets an explicit version
 *
 * The Copilot agent version (teams/.copilot-agent-hotfix.json) is bumped by the
 * SPFx build on its own; this script only handles the SharePoint package.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'config', 'package-solution.json');
const VERSION = /^\d+\.\d+\.\d+\.\d+$/;

const json = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const current = json.solution.version;
let next = process.argv[2];

if (next) {
  if (!VERSION.test(next)) {
    console.error(`Invalid version "${next}". Use four numbers, e.g. 1.0.0.4`);
    process.exit(1);
  }
} else {
  const parts = current.split('.').map(Number);
  parts[3] += 1;
  next = parts.join('.');
}

json.solution.version = next;
(json.solution.features || []).forEach((feature) => {
  feature.version = next;
});
fs.writeFileSync(FILE, JSON.stringify(json, null, 2) + '\n', 'utf8');
console.log(`package-solution version: ${current} → ${next}`);
