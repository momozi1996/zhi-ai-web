/**
 * 知识树图谱数据 —— 从 public/data/agent-docs/index.json（34 篇文档）派生
 * 结构：2 大知识域 hub → 12 章节簇 → 65 个关键概念节点
 * 节点分类色：design.md 知识树专用调色板
 */

export interface GraphNode {
  id: string
  name: string
  level: 1 | 2 | 3
  domain: 'agent' | 'eng'
  /** 所属章节簇名（hub 节点为空串） */
  cluster: string
  color: string
  symbolSize: number
  desc: string
  docPath: string | null
  /** 关联节点 id 列表（详情抽屉用） */
  related: string[]
}

export interface GraphLink {
  source: string
  target: string
  width: number
}

export interface GraphCategory {
  name: string
  en: string
  color: string
  volume: 1 | 2
}

/* ---------------- 12 个章节簇分类 ---------------- */
export const categories: GraphCategory[] = [
  { name: '模型基本结构', en: 'MODEL STRUCTURE', color: '#1E5EFF', volume: 1 },
  { name: '开源模型清单', en: 'OPEN SOURCE', color: '#0864CE', volume: 1 },
  { name: '数据预训练与后训练', en: 'PRE & POST TRAINING', color: '#0CA5C0', volume: 1 },
  { name: '数据合成方法', en: 'DATA SYNTHESIS', color: '#75CE00', volume: 1 },
  { name: '模型训练', en: 'MODEL TRAINING', color: '#01B57C', volume: 1 },
  { name: '模型微调', en: 'FINE-TUNING', color: '#ABA7E5', volume: 1 },
  { name: '模型评估', en: 'EVALUATION', color: '#EFA50C', volume: 1 },
  { name: '开源与推广', en: 'OPEN & GROWTH', color: '#F26102', volume: 1 },
  { name: '工程规范与环境', en: 'ENGINEERING SPEC', color: '#CF3A33', volume: 2 },
  { name: '数据工程流水线', en: 'DATA PIPELINE', color: '#D007B7', volume: 2 },
  { name: '单卡多卡训练适配', en: 'GPU TRAINING', color: '#F26102', volume: 2 },
  { name: '进阶专题', en: 'ADVANCED TOPICS', color: '#0BB7F3', volume: 2 },
]

interface ConceptDef {
  name: string
  desc: string
  docPath?: string
}

interface ClusterDef {
  name: string
  desc: string
  docPath: string
  concepts: ConceptDef[]
}

/* ---------------- 卷一：AI Agent 智能体（8 章） ---------------- */
const V1_CLUSTERS: ClusterDef[] = [
  {
    name: '模型基本结构',
    desc: 'Agent 模型架构：基座、推理范式与工具/记忆模块。',
    docPath: '03/01-模型基本结构.md',
    concepts: [
      { name: 'LLM 基座', desc: 'Agent 的大模型内核，负责语义理解、推理与生成。' },
      { name: 'ReAct', desc: '推理 + 行动交替的 Agent 范式，边思考边调用工具。' },
      { name: 'CoT 思维链', desc: '将复杂任务分解为逐步推理链条，提升可解释性。' },
      { name: 'Planning 规划', desc: '任务拆解与子目标排序，Agent 的「大脑前额叶」。' },
      { name: 'Tool Use 工具调用', desc: 'Function Calling 与工具协议，连接模型与外部世界。' },
      { name: 'Memory 记忆', desc: '短期上下文与长期向量记忆，让 Agent 记住历史。' },
    ],
  },
  {
    name: '开源模型清单',
    desc: '2026 业界主流开源 Agent 框架与模型全景清单。',
    docPath: '03/02-业界开源模型清单.md',
    concepts: [
      { name: 'AutoGPT', desc: '最早出圈的自主 Agent 开源项目。' },
      { name: 'CrewAI', desc: '角色分工式多智能体协作框架。' },
      { name: 'LangGraph', desc: 'LangChain 生态的图式 Agent 编排框架。' },
      { name: 'MetaGPT', desc: '模拟软件公司 SOP 的多智能体框架。' },
      { name: 'Agent 框架选型', desc: '按任务复杂度、生态与工程成本选择框架。' },
    ],
  },
  {
    name: '数据预训练与后训练',
    desc: 'Agent 训练数据工程：指令、轨迹与工具调用数据。',
    docPath: '03/03-数据预训练与后训练.md',
    concepts: [
      { name: '指令数据', desc: '教会模型遵循任务指令的 SFT 语料。' },
      { name: '轨迹数据', desc: '记录 Agent 思考-行动-观察全链路的训练数据。' },
      { name: '工具调用数据', desc: '带函数调用标注的数据，训练 Tool Use 能力。' },
      { name: '预训练语料', desc: '通用知识与代码语料，奠定基座能力。' },
      { name: '后训练对齐', desc: 'RLHF / DPO 对齐人类偏好与安全边界。' },
    ],
  },
  {
    name: '数据合成方法',
    desc: '用模拟与自博弈批量合成高质量 Agent 训练数据。',
    docPath: '03/04-数据合成方法.md',
    concepts: [
      { name: '模拟环境', desc: '在沙盒环境中批量产生交互数据。' },
      { name: '合成交互', desc: '由模型扮演用户 / 环境生成多轮对话。' },
      { name: '轨迹合成', desc: '自动构造高质量 Agent 任务执行轨迹。' },
      { name: '质量过滤', desc: '规则 + 模型双重筛选，剔除脏数据。' },
    ],
  },
  {
    name: '模型训练',
    desc: 'SFT / RL / DPO：Agent 模型训练三大路线。',
    docPath: '03/05-模型训练.md',
    concepts: [
      { name: 'SFT 监督微调', desc: '用标注轨迹做监督训练，奠基 Agent 能力。' },
      { name: 'RL 强化学习', desc: '以任务奖励信号优化 Agent 策略。' },
      { name: 'DPO', desc: '直接偏好优化，无需奖励模型的对齐方法。' },
      { name: '拒绝采样', desc: '采样多条轨迹择优回灌训练（RFT）。' },
      { name: '奖励模型', desc: '为 RLHF 提供人类偏好的打分器。' },
    ],
  },
  {
    name: '模型微调',
    desc: '工具微调与领域适应，让通用模型长成本领域 Agent。',
    docPath: '03/06-模型微调.md',
    concepts: [
      { name: '工具微调', desc: '针对特定工具集微调调用准确率。' },
      { name: '领域适应', desc: '注入行业知识，适配垂直场景。' },
      { name: 'LoRA 高效微调', desc: '低秩矩阵微调，省显存快迭代。' },
      { name: '全参微调', desc: '全量参数更新，追求上限能力。' },
      { name: '个性化微调', desc: '面向用户习惯与偏好的定制微调。' },
    ],
  },
  {
    name: '模型评估',
    desc: '从 Benchmark 到红队：全方位度量 Agent 能力与安全。',
    docPath: '03/07-模型评估.md',
    concepts: [
      { name: 'Benchmark', desc: '标准化任务集，横向对比 Agent 能力。' },
      { name: '红队测试', desc: '对抗性攻击挖掘安全与越狱风险。' },
      { name: '幻觉检测', desc: '检测模型编造事实与虚假工具返回。' },
      { name: '工具调用评估', desc: '评估参数正确率与调用时机。' },
      { name: 'AgentBench', desc: '面向 LLM Agent 的综合评测基准。' },
    ],
  },
  {
    name: '开源与推广',
    desc: '开源发布、应用商店与商业化：让 Agent 走向用户。',
    docPath: '03/08-模型开源和推广方案.md',
    concepts: [
      { name: '开源平台', desc: 'GitHub / HuggingFace 发布与社区运营。' },
      { name: '应用商店', desc: 'GPTs 类 Agent 分发渠道。' },
      { name: 'SaaS 商业化', desc: '订阅制 Agent 服务的商业模式。' },
      { name: '开发者生态', desc: '文档、SDK 与社区驱动增长。' },
    ],
  },
]

/* ---------------- 卷二：Agent 工程与训练（4 章） ---------------- */
const V2_CLUSTERS: ClusterDef[] = [
  {
    name: '工程规范与环境',
    desc: '生产级 Agent 工程目录规范与训练环境搭建。',
    docPath: '04/01-Agent 工程目录规范.md',
    concepts: [
      { name: '目录规范', desc: '生产级 Agent 工程标准化目录结构。', docPath: '04/01-Agent 工程目录规范.md' },
      { name: '环境搭建', desc: '从零搭建生产级训练环境。', docPath: '04/02 - 训练环境工程搭建.md' },
      { name: '容器隔离', desc: 'Docker 容器化隔离训练 / 推理环境。', docPath: '04/02 - 训练环境工程搭建.md' },
      { name: '版本锁定', desc: '依赖锁版本，保证训练可复现。', docPath: '04/02 - 训练环境工程搭建.md' },
      { name: '工程总览', desc: 'Agent 工程体系全景与技术栈。', docPath: '04/00-Overview.md' },
    ],
  },
  {
    name: '数据工程流水线',
    desc: '工程落地的数据流水线：清洗、统一格式、token 统计。',
    docPath: '04/03 - 数据工程流水线.md',
    concepts: [
      { name: '数据清洗', desc: '去重去噪，洗掉脏数据。' },
      { name: '格式统一', desc: '统一多源数据为训练就绪格式。' },
      { name: 'Token 统计', desc: '统计 token 分布，控制训练成本。' },
      { name: '脏数据过滤', desc: '防止脏数据「炸训练」。' },
      { name: '指令标注', desc: '为指令数据补充高质量标注。', docPath: '04/进阶知识点/03-Agent-Data-Pipeline-Agent.md' },
    ],
  },
  {
    name: '单卡多卡训练适配',
    desc: '训练硬件层工程适配：单卡、多卡分布式与显存优化。',
    docPath: '04/04 - 单卡多卡训练工程适配.md',
    concepts: [
      { name: '单卡训练', desc: '消费级显卡上的训练适配方案。' },
      { name: '多卡分布式', desc: 'DDP / FSDP 多卡并行训练。' },
      { name: '显存优化', desc: '梯度检查点与 offload 省显存。' },
      { name: '混合精度', desc: 'BF16 / FP16 混合精度提速。' },
      { name: '推理部署', desc: '从训练到推理部署的工程链路。', docPath: '04/进阶知识点/02-Agent-Model-Training-Agent.md' },
    ],
  },
  {
    name: '进阶专题',
    desc: 'Agent 工程 11 个进阶专题：从核心概念到落地案例。',
    docPath: '04/进阶知识点/00-Overview.md',
    concepts: [
      { name: 'Core Concepts', desc: 'Agent 定义、ReAct、CoT 与 Multi-Agent 核心概念。', docPath: '04/进阶知识点/01-Core-Concepts.md' },
      { name: 'Agent Model Training', desc: 'SFT / RLHF / DPO 与工具调用训练。', docPath: '04/进阶知识点/02-Agent-Model-Training-Agent.md' },
      { name: 'Agent Data Pipeline', desc: '数据收集、合成、清洗、标注全流程。', docPath: '04/进阶知识点/03-Agent-Data-Pipeline-Agent.md' },
      { name: 'Infrastructure', desc: '部署架构、推理优化与监控告警。', docPath: '04/进阶知识点/04-Agent-Infrastructure-Agent.md' },
      { name: 'Harness Engineering', desc: 'MCP、A2A、Function Calling 工具接入层。', docPath: '04/进阶知识点/05-Harness-Engineering.md' },
      { name: 'Capability Engineering', desc: '规划、记忆、工具使用与自我反思能力。', docPath: '04/进阶知识点/06-Capability-Engineering.md' },
      { name: 'Knowledge Distillation', desc: '教师模型蒸馏与能力迁移。', docPath: '04/进阶知识点/07-Knowledge-Distillation.md' },
      { name: 'Evaluation Benchmarks', desc: 'AgentBench、SWE-bench 等评测基准。', docPath: '04/进阶知识点/08-Evaluation-Benchmarks.md' },
      { name: 'Code & Data Resources', desc: '开源代码、数据集与工具链资源。', docPath: '04/进阶知识点/09-Code-Data-Resources.md' },
      { name: 'Case Studies', desc: '编程助手、智能客服等落地案例。', docPath: '04/进阶知识点/10-Applications-Case-Studies.md' },
      { name: '2026 趋势总览', desc: 'Agent 工程发展历程与 2026 趋势。', docPath: '04/进阶知识点/00-Overview.md' },
    ],
  },
]

/* ---------------- 构建 nodes / links ---------------- */
const HUBS = [
  {
    id: 'hub-agent',
    name: 'AI Agent 智能体',
    color: '#1E5EFF',
    domain: 'agent' as const,
    desc: '卷一 · 智能体技术全景：从模型结构、数据建设到训练评估与开源推广的 8 大章节。',
    docPath: '03/00-导读和学习流程图.md',
  },
  {
    id: 'hub-eng',
    name: 'Agent 工程与训练',
    color: '#F04438',
    domain: 'eng' as const,
    desc: '卷二 · 生产级 Agent 工程实战：目录规范、环境搭建、数据流水线、多卡训练与 11 个进阶专题。',
    docPath: '04/00-Overview.md',
  },
]

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9一-鿿]+/g, '-')
    .replace(/^-+|-+$/g, '')

function build() {
  const ns: GraphNode[] = []
  const ls: GraphLink[] = []
  const volumes: [typeof HUBS[number], ClusterDef[]][] = [
    [HUBS[0], V1_CLUSTERS],
    [HUBS[1], V2_CLUSTERS],
  ]

  for (const [hub, defs] of volumes) {
    const clusterIds = defs.map((d) => `c-${slug(d.name)}`)
    ns.push({
      id: hub.id,
      name: hub.name,
      level: 1,
      domain: hub.domain,
      cluster: '',
      color: hub.color,
      symbolSize: 56,
      desc: hub.desc,
      docPath: hub.docPath,
      related: [HUBS[0].id === hub.id ? HUBS[1].id : HUBS[0].id, ...clusterIds],
    })

    for (const def of defs) {
      const cat = categories.find((c) => c.name === def.name)!
      const cid = `c-${slug(def.name)}`
      const conceptIds = def.concepts.map((_, i) => `${cid}-n${i}`)
      ns.push({
        id: cid,
        name: def.name,
        level: 2,
        domain: hub.domain,
        cluster: def.name,
        color: cat.color,
        symbolSize: 34,
        desc: def.desc,
        docPath: def.docPath,
        related: [hub.id, ...conceptIds],
      })
      ls.push({ source: hub.id, target: cid, width: 2 })

      def.concepts.forEach((c, i) => {
        const id = `${cid}-n${i}`
        ns.push({
          id,
          name: c.name,
          level: 3,
          domain: hub.domain,
          cluster: def.name,
          color: cat.color,
          symbolSize: 16,
          desc: c.desc,
          docPath: c.docPath ?? def.docPath,
          related: [cid, ...conceptIds.filter((x) => x !== id)],
        })
        ls.push({ source: cid, target: id, width: 1 })
      })
    }
  }

  // 两大知识域互联
  ls.push({ source: HUBS[0].id, target: HUBS[1].id, width: 2 })
  return { ns, ls }
}

const built = build()
export const nodes: GraphNode[] = built.ns
export const links: GraphLink[] = built.ls

export const NODE_COUNT = nodes.length
export const LINK_COUNT = links.length

/** 文档路径 → 路由地址（逐段编码，保留 / 分隔） */
export function toDocUrl(docPath: string): string {
  return '/agent/' + docPath.split('/').map(encodeURIComponent).join('/')
}
