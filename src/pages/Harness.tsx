import { motion } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'
import { HARNESSES, HARNESS_STATS } from '../data/harness'
import type { HarnessItem, HarnessLicense } from '../data/harness'

const EASE = [0.2, 0.9, 0.3, 1] as [number, number, number, number]
const ORANGE = '#F26102'

/* ---------------- 像素小图示：大脑=大模型 / 手脚=Harness ---------------- */
const BRAIN_MAP = [
  '001110011100',
  '011111111110',
  '111211111111',
  '111111111111',
  '111111111111',
  '011111111110',
  '001111111100',
  '000111111000',
]

const WRENCH_MAP = [
  '110000011',
  '111001111',
  '011111110',
  '000111000',
  '000111000',
  '000111000',
  '000111000',
  '000111000',
]

function PixelGrid({
  map,
  fills,
  cell = 10,
}: {
  map: string[]
  fills: Record<string, string>
  cell?: number
}) {
  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${map[0].length}, ${cell}px)`,
        gridAutoRows: `${cell}px`,
      }}
      aria-hidden
    >
      {map.flatMap((row, y) =>
        row.split('').map((ch, x) => (
          <span
            key={`${y}-${x}`}
            style={{
              backgroundColor: fills[ch] ?? 'transparent',
              boxShadow: ch !== '0' ? 'inset 0 0 0 1px #0B0B0F' : 'none',
            }}
          />
        )),
      )}
    </div>
  )
}

function BrainHarnessDiagram() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-3 sm:gap-5">
        {/* 大脑 */}
        <div className="flex flex-col items-center gap-2">
          <div className="border-[3px] border-ink bg-paper p-2 shadow-hard-sm">
            <PixelGrid
              map={BRAIN_MAP}
              cell={9}
              fills={{ '1': ORANGE, '2': '#FFC53D' }}
            />
          </div>
          <p className="font-kuaile text-[13px] leading-tight text-ink">
            大脑 = 大模型
          </p>
          <p className="font-silk text-[8px] tracking-[2px] text-faint">BRAIN</p>
        </div>

        {/* 连接箭头 */}
        <div className="flex flex-col items-center gap-1">
          <span
            className="block h-[3px] w-8 bg-ink sm:w-12"
            aria-hidden
          />
          <span className="font-vt text-[18px] leading-none text-ink">⇄</span>
          <span
            className="block h-[3px] w-8 bg-ink sm:w-12"
            aria-hidden
          />
        </div>

        {/* 手脚/扳手 */}
        <div className="flex flex-col items-center gap-2">
          <div
            className="border-[3px] border-ink bg-paper p-2"
            style={{ boxShadow: `2px 2px 0 ${ORANGE}` }}
          >
            <PixelGrid
              map={WRENCH_MAP}
              cell={9}
              fills={{ '1': '#0B0B0F' }}
            />
          </div>
          <p className="font-kuaile text-[13px] leading-tight text-ink">
            手脚 = Harness
          </p>
          <p className="font-silk text-[8px] tracking-[2px] text-faint">
            HANDS & TOOLS
          </p>
        </div>
      </div>
      <p className="border-2 border-dashed border-ink bg-hall px-3 py-1 font-vt text-[15px] leading-snug text-body">
        LLM + HARNESS = 能自主干完整工程活的 CODE AGENT
      </p>
    </div>
  )
}

/* ---------------- S1 页头 ---------------- */
function HarnessHeader() {
  const stats = [
    {
      n: String(HARNESS_STATS.total).padStart(2, '0'),
      en: 'HARNESS',
      cn: '收录总数',
    },
    {
      n: String(HARNESS_STATS.open).padStart(2, '0'),
      en: 'OPEN SOURCE',
      cn: '开源',
    },
    {
      n: String(HARNESS_STATS.closed).padStart(2, '0'),
      en: 'CLOSED SOURCE',
      cn: '闭源',
    },
  ]

  return (
    <section className="mx-auto max-w-[1200px] px-4 pt-12 md:px-6 md:pt-16">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="relative flex flex-col gap-8 border-[3px] border-ink bg-paper p-6 md:flex-row md:items-center md:justify-between md:p-10"
        style={{ boxShadow: `8px 8px 0 ${ORANGE}` }}
      >
        {/* 左：楣板 + 标题 */}
        <div>
          <p className="font-silk text-[10px] tracking-[2px] text-[#F26102]">
            CODE AGENT HARNESS
          </p>
          <h1 className="mt-2 font-kuaile text-[30px] leading-[1.15] text-ink md:text-[34px]">
            Harness · <span className="hl-yellow px-1">给大脑装上手脚</span>
          </h1>
          <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-body">
            大模型是<span className="hl-yellow px-1">大脑</span>，Harness 是给大脑配的
            <span className="hl-yellow px-1">手脚、调度与安全管控</span>：
            让 Agent 读改多文件、跑终端、调工具，端到端干完软件工程任务。
          </p>
        </div>

        {/* 右：VT323 三联统计（动态计算） */}
        <div className="grid grid-cols-3 gap-4 border-t-2 border-dashed border-hairline pt-5 md:border-l-[3px] md:border-t-0 md:border-ink md:pl-8 md:pt-0">
          {stats.map((s) => (
            <div key={s.en} className="text-center md:text-left">
              <span className="font-vt text-[40px] leading-none text-ink">
                {s.n}
              </span>
              <p className="mt-1 font-silk text-[9px] tracking-[2px] text-[#F26102]">
                {s.en}
              </p>
              <p className="text-[11px] text-faint">{s.cn}</p>
            </div>
          ))}
        </div>

        {/* 装饰像素块 */}
        <span
          className="absolute -right-2 -top-2 hidden h-5 w-5 border-2 border-ink bg-arcade-yellow md:block"
          aria-hidden
        />
        <span
          className="absolute -left-2 -bottom-2 hidden h-4 w-4 border-2 border-ink md:block"
          style={{ backgroundColor: ORANGE }}
          aria-hidden
        />
      </motion.div>
    </section>
  )
}

/* ---------------- S2 概念介绍卡 ---------------- */
function ConceptCard() {
  return (
    <section className="mx-auto mt-16 max-w-[1200px] px-4 md:mt-24 md:px-6">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="relative border-[3px] border-ink bg-paper p-6 shadow-hard-lg md:p-10"
      >
        {/* 贴纸标签 */}
        <span className="sticker absolute -left-2 -top-4 rotate-[-3deg] bg-[#F26102] text-white">
          WHAT IS HARNESS
        </span>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
          <div className="flex-1">
            <h2 className="font-kuaile text-[24px] leading-[1.2] text-ink md:text-[28px]">
              什么是 Code Agent Harness？
            </h2>
            <p className="mt-4 text-[14px] leading-[1.9] text-body md:text-[15px]">
              <strong className="hl-yellow px-1 font-bold">Harness（代码 Agent Harness）</strong>
              ：是一套
              <strong className="hl-yellow px-1 font-bold">Agent 运行编排框架 / 载体环境</strong>
              ，它封装了大模型调用、文件读写、终端执行、工具调用、多轮规划、上下文管理、权限控制等能力，让大模型不再只做简单问答，能够
              <strong className="hl-yellow px-1 font-bold">自主完成完整软件工程任务</strong>
              ：读改多文件、运行调试代码、排查 BUG、生成完整项目。简单理解：
              <strong className="hl-yellow px-1 font-bold">大模型是大脑</strong>
              ，Harness 就是给大脑配的
              <strong className="hl-yellow px-1 font-bold">手脚、调度、安全管控系统</strong>
              。
            </p>
          </div>
          <div className="shrink-0 lg:w-[340px]">
            <BrainHarnessDiagram />
          </div>
        </div>
      </motion.div>
    </section>
  )
}

/* ---------------- 开源/闭源徽章 ---------------- */
const LICENSE_STYLE: Record<HarnessLicense, { label: string; cls: string }> = {
  open: { label: '开源', cls: 'bg-[#22B07D] text-white' },
  closed: { label: '闭源', cls: 'bg-ink text-white' },
  beta: { label: '内测', cls: 'bg-arcade-yellow text-ink' },
}

function LicenseBadge({ license }: { license: HarnessLicense }) {
  const s = LICENSE_STYLE[license]
  return (
    <span
      className={`inline-block whitespace-nowrap border-2 border-ink px-2 py-px font-kuaile text-[13px] leading-[1.5] shadow-hard-sm ${s.cls}`}
    >
      {s.label}
    </span>
  )
}

/* ---------------- S3 热门 Harness 清单 ---------------- */
function HarnessRow({ item, index }: { item: HarnessItem; index: number }) {
  return (
    <motion.tr
      variants={{
        hidden: { y: 24, opacity: 0 },
        show: { y: 0, opacity: 1, transition: { duration: 0.3, ease: EASE } },
      }}
      className={index % 2 === 0 ? 'bg-paper' : 'bg-hall'}
    >
      <td className="border-2 border-ink px-3 py-2 text-center font-vt text-[22px] leading-none text-ink">
        {String(item.id).padStart(2, '0')}
      </td>
      <td className="whitespace-nowrap border-2 border-ink px-3 py-2 font-kuaile text-[16px] font-bold text-ink">
        {item.name}
      </td>
      <td className="min-w-[280px] border-2 border-ink px-3 py-2 align-top text-[13px] leading-relaxed text-body">
        {item.desc}
      </td>
      <td className="border-2 border-ink px-3 py-2 text-center">
        <LicenseBadge license={item.license} />
      </td>
      <td className="whitespace-nowrap border-2 border-ink px-3 py-2">
        <div className="flex flex-col items-start gap-1">
          <a
            href={item.website}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1 font-kuaile text-[14px] text-arcade-blue underline decoration-2 underline-offset-2 transition-colors hover:text-ink"
          >
            官网
            <ExternalLink size={12} strokeWidth={2.5} />
          </a>
          {item.github && (
            <a
              href={item.github}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1 font-kuaile text-[14px] text-arcade-blue underline decoration-2 underline-offset-2 transition-colors hover:text-ink"
            >
              GitHub
              <Github size={12} strokeWidth={2.5} />
            </a>
          )}
        </div>
      </td>
    </motion.tr>
  )
}

function HarnessTable() {
  return (
    <section className="mx-auto mt-16 max-w-[1200px] px-4 md:mt-24 md:px-6">
      {/* 楣板 */}
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="flex items-center gap-3"
      >
        <span
          className="h-5 w-5 shrink-0 border-2 border-ink"
          style={{ backgroundColor: ORANGE }}
          aria-hidden
        />
        <h2 className="font-kuaile text-[24px] leading-none text-ink md:text-[28px]">
          热门 Harness 清单
        </h2>
        <span className="hidden font-silk text-[10px] tracking-[2px] text-[#F26102] sm:block">
          HOT HARNESS LIST
        </span>
        <span className="ml-auto font-vt text-[24px] leading-none text-faint">
          ×{String(HARNESSES.length).padStart(2, '0')}
        </span>
      </motion.div>

      {/* 街机风表格（移动端横向滚动） */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="mt-6 overflow-x-auto border-[3px] border-ink bg-paper shadow-hard-lg"
      >
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr>
              <th className="border-2 border-ink bg-ink px-3 py-2 text-center font-kuaile text-[14px] font-normal text-white">
                序号
              </th>
              <th className="border-2 border-ink bg-ink px-3 py-2 font-kuaile text-[14px] font-normal text-white">
                Harness 名
              </th>
              <th className="border-2 border-ink bg-ink px-3 py-2 font-kuaile text-[14px] font-normal text-white">
                一句话介绍
              </th>
              <th className="border-2 border-ink bg-ink px-3 py-2 text-center font-kuaile text-[14px] font-normal text-white">
                开源/闭源
              </th>
              <th className="border-2 border-ink bg-ink px-3 py-2 font-kuaile text-[14px] font-normal text-white">
                链接
              </th>
            </tr>
          </thead>
          <motion.tbody
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={{ show: { transition: { staggerChildren: 0.06 } } }}
          >
            {HARNESSES.map((h, i) => (
              <HarnessRow key={h.id} item={h} index={i} />
            ))}
          </motion.tbody>
        </table>
      </motion.div>

      <p className="mt-3 px-1 font-silk text-[9px] tracking-[2px] text-faint md:hidden">
        ← SWIPE TO SCROLL →
      </p>
    </section>
  )
}

/* ---------------- S4 页尾来源说明条 ---------------- */
function HarnessFooter() {
  return (
    <motion.section
      initial={{ y: 60, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="mt-16 border-y-[3px] border-ink bg-ink py-12 text-center md:mt-24"
    >
      <p className="px-4 font-kuaile text-[22px] leading-snug text-white md:text-[28px]">
        Harness 清单 <span className="hl-yellow px-2">持续更新</span> 中
      </p>
      <p className="mt-3 px-4 text-[13px] text-[#8A90A0]">
        收录开源与闭源的热门 Code Agent Harness，有新选手随时补位。
      </p>
      <p className="mt-8 px-4 font-silk text-[9px] tracking-[2px] text-[#8A90A0]">
        CURATED BY MOMOZI · UPDATING · POWERED BY ZHIAI.ARCADE
      </p>
    </motion.section>
  )
}

/* ---------------- 页面组装 ---------------- */
export default function Harness() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <HarnessHeader />
      <ConceptCard />
      <HarnessTable />
      <HarnessFooter />
    </motion.div>
  )
}
