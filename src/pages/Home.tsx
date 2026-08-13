import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Marquee from '../components/Marquee'

const EASE = [0.2, 0.9, 0.3, 1] as [number, number, number, number]

/* ---------------- 像素数字 count-up ---------------- */
function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    const dur = 1200
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur)
      // steps 感：量化到 24 格
      const stepped = Math.round(p * 24) / 24
      setVal(Math.round(stepped * to))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to])
  return (
    <span ref={ref} className="font-vt text-[56px] leading-none text-ink">
      {val}
      {suffix}
    </span>
  )
}

/* ---------------- 楣板（像素英文标签 + H2） ---------------- */
function SectionHeader({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div>
      <p className="font-silk text-[10px] tracking-[2px] text-faint">{kicker}</p>
      <h2 className="mt-2 flex items-center gap-3 font-kuaile text-[30px] leading-[1.15] md:text-[42px]">
        <span className="inline-block h-2.5 w-2.5 bg-arcade-blue border-2 border-ink" />
        {title}
      </h2>
    </div>
  )
}

/* ---------------- S1 Hero ---------------- */
const PLAYING_FRAMES = [
  { tag: 'Agent知识 · 电子书', desc: '38 篇工业级 Agent 工程手册', to: '/agent' },
  { tag: '知识树 · 图谱', desc: '一图看懂 Agent 知识宇宙', to: '/tree' },
  { tag: 'Skill 精品 · 人格库', desc: '31 位导演 + 18 位作家 + 大V 智囊团', to: '/skills' },
  { tag: 'Prompt 精品 · 弹药库', desc: '即取即用的 Agent 提示词', to: '/prompts' },
]

function NowPlayingCard() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % PLAYING_FRAMES.length), 4000)
    return () => clearInterval(t)
  }, [])
  const frame = PLAYING_FRAMES[idx]

  return (
    <motion.div
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5, ease: EASE }}
      className="relative w-full max-w-[440px] border-[3px] border-ink bg-paper p-4 shadow-hard-blue"
    >
      <span className="sticker absolute -left-2 -top-3 z-10 rotate-[-3deg] bg-arcade-yellow text-ink">
        NOW PLAYING
      </span>
      <img
        src="/hero-arcade-illustration.png"
        alt="街机插画"
        className="w-full border-[3px] border-ink"
      />
      <div className="mt-4 h-[104px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 60, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <h3 className="font-kuaile text-[22px] leading-tight">{frame.tag}</h3>
            <p className="mt-1 text-sm text-body">{frame.desc}</p>
            <Link
              to={frame.to}
              className="mt-3 inline-flex items-center border-2 border-ink bg-arcade-yellow px-3 py-1 font-kuaile text-sm text-ink shadow-hard-sm transition-all duration-150 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
            >
              GO →
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
      {/* 像素方块指示器 */}
      <div className="mt-2 flex justify-center gap-2">
        {PLAYING_FRAMES.map((_, i) => (
          <button
            key={i}
            aria-label={`第 ${i + 1} 帧`}
            onClick={() => setIdx(i)}
            className={`h-3 w-3 border-2 border-ink transition-colors ${
              i === idx ? 'bg-arcade-yellow' : 'bg-paper'
            }`}
          />
        ))}
      </div>
    </motion.div>
  )
}

function Hero() {
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  }
  const item = {
    hidden: { y: 40, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5, ease: EASE } },
  }

  return (
    <section className="relative">
      {/* 装饰像素星星 */}
      <motion.img
        src="/pixel-arrow-right.svg"
        alt=""
        aria-hidden
        className="sway absolute right-6 top-8 hidden h-8 w-8 rotate-45 lg:block"
      />
      <div className="mx-auto grid max-w-[1200px] gap-12 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-[7fr_5fr] lg:items-center">
        {/* 左栏 */}
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="inline-flex items-center gap-2 border-2 border-ink bg-ink px-3 py-1.5 font-silk text-[10px] tracking-[2px] text-white outline outline-1 outline-white"
          >
            <span className="inline-block h-2 w-2 bg-arcade-yellow" />
            MOMOZI · AGENT KNOWLEDGE BASE
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-6 font-kuaile text-[44px] leading-[1.05] tracking-[2px] text-ink md:text-[74px]"
          >
            知 AI
            <br />
            把 <span className="hl-yellow px-3">AGENT</span> 知识
            <br />
            装进你的口袋
          </motion.h1>

          <motion.p variants={item} className="mt-6 max-w-xl text-body">
            MOMOZI 的 Agent 知识库：38 篇工程文档电子书 · 交互知识树 · 95
            个人格 Skill · 精品 Prompt 弹药库，一站通关。
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link to="/agent" className="btn-primary btn-lg">
              开始阅读 →
            </Link>
            <Link to="/tree" className="btn-yellow btn-lg">
              探索知识树
            </Link>
            <Link to="/skills" className="btn-ghost btn-lg">
              Skill 精品
            </Link>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-12 grid grid-cols-3 gap-4 border-t border-hairline pt-8"
          >
            {[
              { n: 38, suffix: '', en: 'ENGINEERING DOCS', zh: '工程文档' },
              { n: 95, suffix: '+', en: 'PERSONA SKILLS', zh: '人格技能' },
              { n: 12, suffix: '', en: 'PROMPT PICKS', zh: '精品提示词' },
            ].map((s) => (
              <div key={s.en}>
                <CountUp to={s.n} suffix={s.suffix} />
                <p className="mt-2 font-silk text-[10px] tracking-[2px] text-ink">{s.en}</p>
                <p className="text-[13px] text-faint">{s.zh}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* 右栏：NOW PLAYING 轮播卡 */}
        <div className="flex justify-center lg:justify-end">
          <NowPlayingCard />
        </div>
      </div>
    </section>
  )
}

/* ---------------- S3 领奖台三卡 ---------------- */
function Podium() {
  const cards = [
    {
      rank: 'RANK 02',
      tagBg: 'bg-arcade-green',
      title: '交互知识树',
      desc: 'BAAI 同款力导向图谱，拖拽缩放探索 Agent 知识宇宙。',
      stat: '70+ NODES',
      btn: '进入图谱 →',
      to: '/tree',
      btnCls: 'btn-ghost',
      btnBorder: '#22B07D',
      baseCls: 'bg-arcade-green',
    },
    {
      rank: 'RANK 01',
      tagBg: 'bg-arcade-yellow',
      title: 'Agent 知识电子书',
      desc: '从模型结构、数据工程到训练评估的 38 篇全链路手册，可翻页沉浸阅读。',
      stat: '38 CHAPTERS',
      btn: '翻开第一页 →',
      to: '/agent',
      btnCls: 'btn-primary',
      btnBorder: undefined,
      baseCls: 'podium-stripe',
      first: true,
    },
    {
      rank: 'RANK 03',
      tagBg: 'bg-arcade-red',
      title: 'Skill 人格精品',
      desc: '导演天团、作家宇宙、天涯大神与自媒体大V，一键附体你的 Agent。',
      stat: '95+ SKILLS',
      btn: '挑选人格 →',
      to: '/skills',
      btnCls: 'btn-ghost',
      btnBorder: '#F04438',
      baseCls: 'bg-arcade-red',
    },
  ]

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16 md:px-6 md:py-24">
      <SectionHeader kicker="FEATURED STAGES" title="三大镇馆之宝" />
      <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-6 lg:gap-8">
        {cards.map((c, i) => (
          <motion.div
            key={c.rank}
            initial={{ y: 80, opacity: 0, scale: c.first ? 1.1 : 1 }}
            whileInView={{ y: 0, opacity: 1, scale: c.first ? 1.05 : 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: i * 0.15, ease: EASE }}
            className={`flex flex-col ${c.first ? 'md:-mt-6' : ''}`}
          >
            <div className="relative flex-1 border-[3px] border-ink bg-paper p-6 shadow-hard transition-all duration-150 hover:-translate-y-1 hover:shadow-hard-lg">
              {c.first && (
                <motion.img
                  src="/sticker-ribbon.png"
                  alt="NO.1 绶带"
                  initial={{ scale: 0.6, rotate: -16, opacity: 0 }}
                  whileInView={{ scale: 1, rotate: -8, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.4, ease: EASE }}
                  className="absolute -right-4 -top-5 z-10 w-[120px]"
                />
              )}
              <span className={`sticker ${c.tagBg} text-ink`}>{c.rank}</span>
              <h3 className="mt-4 font-kuaile text-[26px] leading-[1.25]">{c.title}</h3>
              <p className="mt-3 text-body">{c.desc}</p>
              <p className="mt-4 font-vt text-[40px] leading-none text-ink">{c.stat}</p>
              <Link
                to={c.to}
                className={`${c.btnCls} mt-5`}
                style={c.btnBorder ? { borderColor: c.btnBorder } : undefined}
              >
                {c.btn}
              </Link>
            </div>
            {/* 底座 */}
            <div className={`mx-3 h-12 border-[3px] border-t-0 border-ink ${c.baseCls}`} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ---------------- S4 NEW ARRIVALS ---------------- */
const ARRIVALS = [
  { title: '07-模型评估', tag: 'Agent知识', tagEn: 'AGENT DOCS', color: '#1E5EFF', desc: 'Benchmark、红队与幻觉检测全清单', meta: '18KB · MD' },
  { title: '10-Applications-Case-Studies', tag: '进阶知识', tagEn: 'CASE STUDY', color: '#1E5EFF', desc: '工业级 Agent 落地案例', meta: '22KB · MD' },
  { title: '刘慈欣 Skill', tag: '作家小说家', tagEn: 'NOVELIST', color: '#FFC53D', desc: '科幻巨匠的叙事与想象力附体', meta: '6KB · MD' },
  { title: '导演多Agent系统', tag: '导演天团', tagEn: 'DIRECTOR', color: '#FFC53D', desc: '31 位世界级导演子人格协同创作', meta: '9KB · MD' },
  { title: 'ReAct 推理提示词', tag: 'Prompt', tagEn: 'PROMPT', color: '#22B07D', desc: '思考-行动-观察闭环模板', meta: '2KB · TXT' },
]

function Arrivals() {
  const scroller = useRef<HTMLDivElement>(null)
  const scrollBy = (dir: number) =>
    scroller.current?.scrollBy({ left: dir * 344, behavior: 'smooth' })

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16 md:px-6 md:py-24">
      <div className="flex items-end justify-between gap-4">
        <SectionHeader kicker="NEW ARRIVALS" title="本周新上架" />
        <div className="flex gap-2">
          <button
            onClick={() => scrollBy(-1)}
            aria-label="上一页"
            className="flex h-9 w-9 items-center justify-center border-2 border-ink bg-paper shadow-hard-sm transition-all duration-150 hover:bg-arcade-yellow active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            <img src="/pixel-arrow-left.svg" alt="" width={16} height={16} />
          </button>
          <button
            onClick={() => scrollBy(1)}
            aria-label="下一页"
            className="flex h-9 w-9 items-center justify-center border-2 border-ink bg-paper shadow-hard-sm transition-all duration-150 hover:bg-arcade-yellow active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            <img src="/pixel-arrow-right.svg" alt="" width={16} height={16} />
          </button>
        </div>
      </div>

      <motion.div
        initial={{ x: 80, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: EASE }}
        ref={scroller}
        className="no-scrollbar mt-10 flex gap-6 overflow-x-auto pb-4"
      >
        {ARRIVALS.map((a) => (
          <article
            key={a.title}
            className="w-[320px] shrink-0 border-[3px] border-ink bg-paper shadow-hard transition-all duration-150 hover:-translate-y-1 hover:shadow-hard-lg"
          >
            <div className="h-1.5 border-b-[3px] border-ink" style={{ backgroundColor: a.color }} />
            <div className="p-5">
              <div className="flex items-center gap-2">
                <span
                  className="sticker border-ink text-ink"
                  style={{ backgroundColor: a.color }}
                >
                  {a.tag}
                </span>
                <span className="font-silk text-[9px] tracking-[2px] text-faint">
                  {a.tagEn}
                </span>
              </div>
              <h3 className="mt-3 font-kuaile text-[22px] leading-tight">{a.title}</h3>
              <p className="mt-2 text-sm text-body">{a.desc}</p>
              <p className="mt-4 font-vt text-sm text-faint">{a.meta}</p>
            </div>
          </article>
        ))}
      </motion.div>
    </section>
  )
}

/* ---------------- S5 SELECT YOUR GAME ---------------- */
const MODULES = [
  { no: '01', title: 'Agent知识', badge: '/badge-book.png', desc: '38 篇文档 · 3 大知识域 · 可翻页电子书', to: '/agent', hoverShadow: 'hover:shadow-hard-blue', linkCls: 'text-arcade-blue' },
  { no: '02', title: '知识树', badge: '/badge-tree.png', desc: '力导向图谱 · 缩放拖拽 · 邻居聚焦', to: '/tree', hoverShadow: 'hover:shadow-hard-red', linkCls: 'text-arcade-red' },
  { no: '03', title: 'Skill精品', badge: '/badge-skill.png', desc: '5 大分类 · 34 本尊 + 61 外链 · 子人格档案', to: '/skills', hoverShadow: 'hover:shadow-hard-yellow', linkCls: 'text-[#B8860B]' },
  { no: '04', title: 'Prompt精品', badge: '/badge-prompt.png', desc: '12 精选 · 一键复制 · 场景说明', to: '/prompts', hoverShadow: 'hover:shadow-hard-green', linkCls: 'text-arcade-green' },
]

function ModuleGrid() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16 md:px-6 md:py-24">
      <SectionHeader kicker="SELECT YOUR GAME" title="选择你的关卡" />
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {MODULES.map((m, i) => (
          <motion.div
            key={m.no}
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
          >
            <Link
              to={m.to}
              className={`group relative flex h-full gap-6 border-[3px] border-ink bg-paper p-6 shadow-hard transition-all duration-150 hover:-translate-y-1 ${m.hoverShadow}`}
            >
              <img
                src={m.badge}
                alt={`${m.title}徽章`}
                className="h-20 w-20 shrink-0 border-2 border-ink bg-paper transition-transform duration-300 group-hover:rotate-[-4deg] md:h-24 md:w-24"
              />
              <div className="min-w-0">
                <h3 className="font-kuaile text-[26px]">{m.title}</h3>
                <p className="mt-2 text-sm text-body">{m.desc}</p>
                <span className={`mt-4 inline-block font-kuaile text-base ${m.linkCls}`}>
                  INSERT COIN →
                </span>
              </div>
              <span
                className="absolute bottom-2 right-4 font-vt text-[64px] leading-none text-hairline"
                aria-hidden
              >
                {m.no}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ---------------- S6 页尾 CTA ---------------- */
function Cta() {
  return (
    <motion.section
      initial={{ y: 60, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="border-y-[3px] border-ink bg-ink py-20 text-center"
    >
      <h2 className="mx-auto max-w-3xl px-4 font-kuaile text-[30px] leading-snug text-white md:text-[42px]">
        投币开始，把 AGENT 练到<span className="hl-yellow px-2">满级</span>
      </h2>
      <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <span className="blink-arcade font-vt text-xl text-arcade-yellow">
          PRESS START
        </span>
        <Link to="/agent" className="btn-yellow btn-lg">
          开始修炼 →
        </Link>
      </div>
    </motion.section>
  )
}

/* ---------------- 页面组装 ---------------- */
export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Hero />
      <Marquee />
      <Podium />
      <Arrivals />
      <ModuleGrid />
      <Cta />
    </motion.div>
  )
}
