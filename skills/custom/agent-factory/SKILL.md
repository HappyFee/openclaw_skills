---
name: agent-factory
description: 自动化创建新 Agent 并避开飞书/多代理配置中的常见坑位。
version: 1.2.0
---

# Agent Factory (AI 员工工厂) - V1.2

## 核心能力
- **自动白名单**: 自动在 `tools.agentToAgent` 中授权，解决权限限制。
- **环境自适应**: 自动识别飞牛 NAS 路径。
- **灵魂注入**: 自动生成 `IDENTITY`, `SOUL`, `USER` 文件。

## ⚠️ 避坑指南（必看）

### 1. 飞书 ID 隔离坑
**现象**: 任务显示 Delivered 但收不到消息。
**真相**: 飞书同一个用户在不同 Bot 里的 ID (OpenID) 是不一样的！
**对策**: 必须在给新 Bot 发消息获取 `ou_` 开头的 ID 后，将其填入该 Agent 的推送配置中。

### 2. 跨 Agent 指挥坑
**现象**: 报错 `agentId is not allowed for sessions_spawn`。
**对策**: 本 Skill 已自动在 `openclaw.json` 的 `tools.agentToAgent` 中添加授权。

### 3. 长任务超时坑
**现象**: `Gateway timeout`。
**对策**: 对于复杂任务（如调研、写代码），请在 Cron 任务中将 `timeout` 设为 `300000` (5分钟)。

## 使用示例
```bash
node {baseDir}/scripts/spawn_agent.mjs --id researcher --name 研究员 --theme "寻找蓝海业务"
```
