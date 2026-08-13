const DEFAULT_ITEMS = [
  '知 AI · ZHIAI.ARCADE',
  'AGENT 知识电子书',
  '交互知识树',
  '95+ 人格 SKILL',
  'PROMPT 弹药库',
  '数据源自 GITHUB 开源仓库',
]

const SQUARE_COLORS = ['#FFC53D', '#22B07D', '#F04438']

/**
 * 跑马灯条（design.md §6.2）：蓝底黑边，30s 线性无限滚动，hover 暂停。
 */
export default function Marquee({ items = DEFAULT_ITEMS }: { items?: string[] }) {
  const row = (key: string) => (
    <div key={key} className="flex shrink-0 items-center">
      {items.map((text, i) => (
        <span key={`${key}-${i}`} className="flex items-center">
          <span className="mx-4 font-kuaile text-[15px] text-white">★</span>
          <span className="font-kuaile text-[15px] text-white">{text}</span>
          <span
            className="mx-4 inline-block h-3 w-3 border-2 border-ink"
            style={{ backgroundColor: SQUARE_COLORS[i % SQUARE_COLORS.length] }}
          />
        </span>
      ))}
    </div>
  )

  return (
    <div className="marquee-hover-pause overflow-hidden border-y-[3px] border-ink bg-arcade-blue py-2.5">
      <div className="marquee-track">
        {row('a')}
        {row('b')}
      </div>
    </div>
  )
}
