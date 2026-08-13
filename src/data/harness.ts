export type HarnessLicense = 'open' | 'closed' | 'beta'

export interface HarnessItem {
  id: number
  name: string
  desc: string
  license: HarnessLicense
  website: string
  github?: string
}

export const HARNESSES: HarnessItem[] = [
  {
    id: 1,
    name: 'OpenCode',
    desc: '高热度开源代码 Agent Harness，支持上百种模型后端，端到端完成软件工程任务，内置 TUI 控制台',
    license: 'open',
    website: 'https://opencodeai.cn',
    github: 'https://github.com/opencodeai/opencode',
  },
  {
    id: 2,
    name: 'Cline',
    desc: 'VS Code 插件形态开源 Agent Harness（原 Claude-Dev），支持读写文件、执行终端命令、规划式执行',
    license: 'open',
    website: 'https://cline.bot',
    github: 'https://github.com/cline/cline',
  },
  {
    id: 3,
    name: 'Cursor Agent',
    desc: 'Cursor 内置 IDE + 云端代码 Agent Harness，支持沙盒环境、自主编码、生成 PR，支持 Web/CLI/桌面端',
    license: 'closed',
    website: 'https://cursor.com',
  },
  {
    id: 4,
    name: 'Claude Code',
    desc: 'Anthropic 推出的闭源工程级代码 Agent Harness，可处理大型复杂代码库工程任务',
    license: 'closed',
    website: 'https://claude.ai/code',
  },
  {
    id: 5,
    name: 'Qwen Code',
    desc: '阿里云通义千问开源终端代码 Agent Harness，面向 Qwen3-Coder 深度优化，支持多模型后端',
    license: 'open',
    website: 'https://help.aliyun.com/en/model-studio/qwen-code',
    github: 'https://github.com/QwenLM/qwen-code',
  },
  {
    id: 6,
    name: 'Hermes',
    desc: 'NousResearch 出品，面向 Agent 的指令数据集 + Agent Harness 框架，主打函数调用、工具调用、自进化技能',
    license: 'open',
    website: 'https://www.akashic.co',
    github: 'https://github.com/NousResearch/Hermes',
  },
  {
    id: 7,
    name: 'Kilo Code',
    desc: 'VS Code 插件开源代码 Agent Harness，自主做多文件项目编码重构',
    license: 'open',
    website: 'https://kilocode.ai',
    github: 'https://github.com/KiloAI/kilo-code',
  },
  {
    id: 8,
    name: 'Kimi Code',
    desc: '月之暗面推出闭源代码 Agent Harness，擅长超大代码库解析与工程编码',
    license: 'closed',
    website: 'https://kimi.cn/code',
  },
  {
    id: 9,
    name: 'Codex',
    desc: 'OpenAI 早期代码 Agent 体系，旧版代码模型配套 Harness，已停止独立维护',
    license: 'closed',
    website: 'https://platform.openai.com/docs/legacy/code-completions',
  },
  {
    id: 10,
    name: 'PI',
    desc: 'Inflection AI 旗下具备完整代码 Agent 能力的对话式 Harness',
    license: 'closed',
    website: 'https://pi.ai',
  },
  {
    id: 11,
    name: 'workbuddy CLI',
    desc: '腾讯推出命令行形态闭源代码 Agent Harness，终端完成编码调试',
    license: 'closed',
    website: 'https://www.workbuddy.ai',
  },
  {
    id: 12,
    name: 'code buddy CLI',
    desc: '腾讯 CodeBuddy 终端运行闭源代码助手 Agent Harness，面向开发者命令行编码辅助',
    license: 'closed',
    website: 'https://www.workbuddy.ai',
  },
  {
    id: 13,
    name: 'Zcode',
    desc: 'Z.AI 推出大模型驱动全流程软件开发 Agent Harness',
    license: 'closed',
    website: 'https://z.ai',
  },
  {
    id: 14,
    name: 'Deepseek-harness',
    desc: 'DeepSeek 内测阶段官方代码 Agent Harness 产品，期待正式上线',
    license: 'beta',
    website: 'https://deepseek-code.com',
  },
]

export const HARNESS_STATS = {
  total: HARNESSES.length,
  open: HARNESSES.filter((h) => h.license === 'open').length,
  closed: HARNESSES.filter((h) => h.license !== 'open').length,
}
