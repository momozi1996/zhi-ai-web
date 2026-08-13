/* 「好资源」页面数据：分组 + 条目 */

export interface ResourceItem {
  id: string
  /** 资源名 */
  name: string
  /** 原站地址 */
  url: string
  /** 一句话简介 */
  desc: string
  /** 2-3 个 tag */
  tags: string[]
}

export interface ResourceGroup {
  id: string
  /** 中文组名 */
  title: string
  /** Silkscreen 英文楣板 */
  titleEn: string
  /** 分组标识色 */
  color: string
  items: ResourceItem[]
}

export const RESOURCE_GROUPS: ResourceGroup[] = [
  {
    id: 'models',
    title: '开源模型与数据集',
    titleEn: 'MODELS & DATASETS',
    color: '#1E5EFF',
    items: [
      {
        id: 'huggingface',
        name: 'Hugging Face · Models',
        url: 'https://huggingface.co/models',
        desc: '全球最大开源模型与数据集社区，70 万+ 模型免费下载',
        tags: ['开源模型', '数据集', '社区'],
      },
      {
        id: 'modelscope',
        name: 'ModelScope 魔搭 · Models',
        url: 'https://modelscope.cn/models',
        desc: '阿里达摩院开源模型社区，中文模型与数据集丰富',
        tags: ['中文模型', '数据集', '阿里'],
      },
    ],
  },
  {
    id: 'usage',
    title: '全球大模型真实使用流量',
    titleEn: 'REAL USAGE TRAFFIC',
    color: '#22B07D',
    items: [
      {
        id: 'openrouter',
        name: 'OpenRouter Rankings',
        url: 'https://openrouter.ai/rankings',
        desc: '全球大模型 API 真实调用量/市场份额排行，周更',
        tags: ['API 调用量', '市场份额', '周更'],
      },
    ],
  },
  {
    id: 'leaderboards',
    title: '业界热门 Leaderboard',
    titleEn: 'HOT LEADERBOARDS',
    color: '#F04438',
    items: [
      {
        id: 'artificial-analysis',
        name: 'Artificial Analysis（AA 榜单）',
        url: 'https://artificialanalysis.ai/#intelligence-tabs',
        desc: '智能指数/速度/价格/上下文多维度独立评测对比',
        tags: ['智能指数', '速度价格', '独立评测'],
      },
      {
        id: 'agent-arena',
        name: 'Agent Arena',
        url: 'https://arena.ai/leaderboard/agent',
        desc: 'Agent 能力真人盲测投票排行',
        tags: ['Agent 能力', '盲测投票'],
      },
      {
        id: 'design-arena',
        name: 'Design Arena',
        url: 'https://www.designarena.ai/leaderboard',
        desc: 'AI 设计/前端生成能力众包排行',
        tags: ['设计生成', '前端', '众包排行'],
      },
      {
        id: 'code-arena',
        name: 'Code Arena（WebDev）',
        url: 'https://arena.ai/leaderboard/code/webdev',
        desc: '代码/WebDev 能力盲测排行',
        tags: ['代码能力', 'WebDev', '盲测'],
      },
    ],
  },
]

export const TOTAL_RESOURCES = RESOURCE_GROUPS.reduce(
  (acc, g) => acc + g.items.length,
  0,
)
