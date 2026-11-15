#!/usr/bin/env node
import { manageSkill } from '../lib/skill-management.js';

const [action, target, name, source, ...extra] = process.argv.slice(2);
if (extra.length || (action === 'install' ? !source : action !== 'uninstall' || source)) {
  console.error('Usage: manage-skill install <qoder-global|qoder-cn> <name> <source-dir>\n       manage-skill uninstall <qoder-global|qoder-cn> <name>');
  process.exitCode = 2;
} else {
  try {
    console.log(JSON.stringify(await manageSkill({ action, target, name, source })));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
