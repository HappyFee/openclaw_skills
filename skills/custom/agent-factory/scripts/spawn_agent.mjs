/**
 * Agent Factory - 自动化脱敏版 (V1.3)
 * 功能：路径动态化、配置模板化、安全发布就绪
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import os from 'os';

const args = process.argv.slice(2);
const params = {};
for (let i = 0; i < args.length; i += 2) {
  params[args[i].replace('--', '')] = args[i + 1];
}

const { id, name, theme } = params;

if (!id || !name || !theme) {
  console.error('❌ 缺少参数！用法: node spawn_agent.mjs --id <id> --name <name> --theme <theme>');
  process.exit(1);
}

// --- 动态路径解析 (脱敏核心) ---
const HOME = os.homedir();
const CONFIG_PATH = path.join(HOME, '.openclaw/openclaw.json');
const WORKSPACE_BASE = path.join(HOME, '.openclaw/workspace');
const SKILL_ROOT = path.join(WORKSPACE_BASE, 'skills/custom/agent-factory');
const TEMPLATE_DIR = path.join(SKILL_ROOT, 'templates');
const agentPath = path.join(WORKSPACE_BASE, id);

console.log(`🚀 正在启动脱敏入职流程 (V1.3)...`);

// 1. 创建工作目录
if (!fs.existsSync(agentPath)) fs.mkdirSync(agentPath, { recursive: true });

// 2. 注入灵魂 (从模板动态填充)
const dateStr = new Date().toISOString().split('T')[0];
const fillTemplate = (fileName, replacements) => {
  let content = fs.readFileSync(path.join(TEMPLATE_DIR, `${fileName}.template`), 'utf8');
  for (const [key, val] of Object.entries(replacements)) {
    content = content.replace(new RegExp(`{{${key}}}`, 'g'), val);
  }
  fs.writeFileSync(path.join(agentPath, fileName), content);
};

fillTemplate('IDENTITY.md', { name, id, theme, date: dateStr });
fillTemplate('SOUL.md', { theme });
fillTemplate('USER.md', {});

console.log(`✅ 脱敏灵魂注入完毕: ${id}`);

// 3. 自动配置并授权 (逻辑脱敏)
try {
  const timestamp = Date.now();
  fs.copyFileSync(CONFIG_PATH, `${CONFIG_PATH}.bak_${timestamp}`);

  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  
  if (!config.agents) config.agents = {};
  if (!config.agents.list) config.agents.list = [];
  if (!config.agents.list.some(a => a.id === id)) {
    config.agents.list.push({ id, name, workspace: agentPath, identity: { name, theme } });
  }

  if (!config.tools) config.tools = {};
  if (!config.tools.agentToAgent) {
    config.tools.agentToAgent = { enabled: true, allow: ["main"] };
  }
  if (!config.tools.agentToAgent.allow.includes(id)) {
    config.tools.agentToAgent.allow.push(id);
  }

  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));

  // 4. 重启
  execSync('openclaw gateway restart');
  console.log(`✨ 新 Agent [${name}] 已上线！`);

} catch (err) {
  console.error(`❌ 自动配置失败: ${err.message}`);
}
