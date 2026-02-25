---
name: agent-factory
description: 企业级 AI 团队自动化入职系统。集成权限解锁、身份脱敏、配置自动同步及避坑指南。
version: 1.5.0
---

# Agent Factory (AI 员工工厂) - V1.5

## 🚀 自动化入职流程
本 Skill 旨在实现真正的“一键入职”，自动完成以下动作：
- **基础设施**: 建立隔离的工作空间。
- **灵魂注入**: 基于模板生成 IDENTITY, SOUL, USER 文档。
- **权限打通**: 自动配置 `agentToAgent` 白名单及 `sessions.visibility`。
- **系统热重载**: 自动修改主配置并重启网关。

## ⚠️ 核心坑位总结（已固化逻辑）

### 1. 通信锁 (Visibility)
**痛点**: `sessions_send` 提示权限拒绝。
**对策**: V1.4 已自动开启全局会话可见性。

### 2. 身份隔离 (Feishu OpenID)
**痛点**: 任务显示 Delivered 但老板收不到。
**事实**: 每个 Bot 眼里的老板 ID 是不同的。
**操作**: 必须先给新 Bot 发消息，获取其专有的 `ou_` 开头的 ID。

### 3. 长任务超时 (Cron Timeout)
**痛点**: 复杂调研任务报 Timeout。
**对策**: 建议在 Cron 任务配置中手动添加 `--timeout 300000` (5分钟)。

### 4. 长连接唤醒 (WebSocket Heartbeat)
**痛点**: 凌晨任务推送提示 `Message failed` 或 `Target required`。
**事实**: 隔离环境下子代理无法推导上下文。
**对策**: 在推送前显式执行唤醒逻辑：`openclaw message send --target "user:<专属OpenID>" --message " " --silent`。

## 使用命令
```bash
node {baseDir}/scripts/spawn_agent.mjs --id <id> --name <姓名> --theme <职责>
```
