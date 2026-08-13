import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Copy, Check, ChevronDown, ChevronUp, Play } from 'lucide-react'
import { PROMPTS, CATEGORIES, CATEGORY_EN } from '../data/prompts'
import type { PromptItem } from '../data/prompts'

const EASE = [0.2, 0.9, 0.3, 1] as [number, number, number, number]
const GREEN = '#22B07D'

/* ---------------- 像素数字 count-up（复用首页节奏） ---------------- */
function CountUp({
  to,
  suffix = '',
  className = '',
}: {
  to: number
  suffix?: string
  className?: string
}) {
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
      const stepped = Math.round(p * 24) / 24
      setVal(Math.round(stepped * to))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to])
  return (
    <span ref={ref} className={`font-vt leading-none text-ink ${className}`}>
      {val}
      {suffix}
    </span>
  )
}

/* ---------------- S1 页头 ---------------- */
function PromptHeader() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 pt-12 md:px-6 md:pt-16">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="relative flex flex-col gap-8 border-[3px] border-ink bg-paper p-6 shadow-hard-green md:flex-row md:items-center md:justify-between md:p-10"
      >
        {/* 左：徽章 + 标题 */}
        <div className="flex items-start gap-5">
          <motion.img
            src="/badge-prompt.png"
            alt="Prompt 徽章"
            initial={{ scale: 0.6, rotate: -8, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.4, ease: EASE }}
            className="h-20 w-20 shrink-0 border-2 border-ink bg-paper md:h-24 md:w-24"
          />
          <div>
            <p className="font-silk text-[10px] tracking-[2px] text-arcade-green">
              PROMPT ARMORY
            </p>
            <h1 className="mt-2 font-kuaile text-[30px] leading-[1.15] text-ink md:text-[34px]">
              Prompt 精品 · 弹药库
            </h1>
            <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-body">
              12 发精选弹药，覆盖
              <span className="hl-yellow px-1">系统设计</span>、推理框架、
              多Agent协作、结构化输出与评估调试。复制即用。
            </p>
          </div>
        </div>

        {/* 右：VT323 三联统计 */}
        <div className="grid grid-cols-3 gap-4 border-t-2 border-dashed border-hairline pt-5 md:border-l-[3px] md:border-t-0 md:border-ink md:pl-8 md:pt-0">
          {[
            { n: 12, suffix: '', en: 'PROMPTS' },
            { n: 6, suffix: '', en: 'CATEGORIES' },
            { n: 100, suffix: '%', en: 'COPY-READY' },
          ].map((s) => (
            <div key={s.en} className="text-center md:text-left">
              <CountUp to={s.n} suffix={s.suffix} className="text-[40px]" />
              <p className="mt-1 font-silk text-[9px] tracking-[2px] text-arcade-green">
                {s.en}
              </p>
            </div>
          ))}
        </div>

        {/* 装饰像素块 */}
        <span
          className="sway absolute -right-2 -top-2 hidden h-5 w-5 border-2 border-ink bg-arcade-yellow md:block"
          aria-hidden
        />
      </motion.div>
    </section>
  )
}

/* ---------------- S2 分类 chips 条 ---------------- */
function CategoryBar({
  active,
  onChange,
  count,
}: {
  active: string
  onChange: (c: string) => void
  count: number
}) {
  return (
    <div className="sticky top-16 z-40 mx-auto mt-10 max-w-[1200px] px-4 md:px-6">
      <div className="flex flex-wrap items-center gap-2 border-[3px] border-ink bg-paper p-3 shadow-hard">
        {CATEGORIES.map((c) => {
          const isActive = c === active
          return (
            <button
              key={c}
              onClick={() => onChange(c)}
              className={`border-2 border-ink px-3 py-1.5 font-kuaile text-sm tracking-wide transition-all duration-150 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
                isActive
                  ? 'bg-arcade-green text-white shadow-hard-sm'
                  : 'bg-paper text-ink hover:bg-[#E4F7EF]'
              }`}
            >
              {c}
            </button>
          )
        })}
        <span className="ml-auto hidden font-vt text-xl text-ink sm:block">
          AMMO: {String(count).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}

/* ---------------- S3 Prompt 卡片 ---------------- */
function PromptCard({
  item,
  onCopied,
}: {
  item: PromptItem
  onCopied: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [showTips, setShowTips] = useState(false)
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(item.prompt)
    } catch {
      // 降级：隐藏 textarea 复制
      const ta = document.createElement('textarea')
      ta.value = item.prompt
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    onCopied(item.id)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <motion.article
      layout="position"
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="relative flex flex-col border-[3px] border-ink bg-paper p-6 shadow-hard transition-shadow duration-150 hover:-translate-y-1 hover:shadow-hard-green"
    >
      {/* 顶行：分类签 + 难度 */}
      <div className="flex items-center justify-between gap-3">
        <span className="sticker rotate-[-2deg] bg-arcade-green text-ink">
          {item.category}
          <span className="ml-2 text-white/90">{CATEGORY_EN[item.category]}</span>
        </span>
        <span
          className="font-vt text-[18px] leading-none tracking-[2px]"
          style={{ color: GREEN }}
          aria-label={`难度 ${item.difficulty.length} 星`}
        >
          {item.difficulty}
        </span>
      </div>

      <h3 className="mt-4 font-kuaile text-[22px] leading-tight text-ink">
        {item.title}
      </h3>

      {/* 场景 */}
      <p className="mt-2 text-[13px] text-body">
        <span className="mr-2 font-silk text-[10px] tracking-[2px] text-faint">
          SCENE
        </span>
        {item.scene}
      </p>

      {/* Prompt 代码框 */}
      <div className="relative mt-4 border-2 border-ink bg-ink shadow-[4px_4px_0_#22B07D]">
        <span className="absolute right-3 top-2 z-10 font-silk text-[9px] tracking-[2px] text-arcade-green">
          PROMPT
        </span>
        <motion.div
          animate={{ height: expanded ? 'auto' : 108 }}
          initial={false}
          transition={{ duration: 0.3, ease: EASE }}
          className="relative overflow-hidden"
        >
          <pre className="whitespace-pre-wrap break-words p-4 pt-6 font-mono text-[13px] leading-[1.7] text-[#E8EAF0]">
            {item.prompt}
          </pre>
          {!expanded && (
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-14"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(11,11,15,0), #0B0B0F)',
              }}
            />
          )}
        </motion.div>
      </div>

      {/* 按钮组 */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="inline-flex items-center gap-1.5 border-2 border-ink bg-paper px-3 py-1.5 font-kuaile text-sm text-ink shadow-hard-sm transition-all duration-150 hover:bg-[#E4F7EF] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          {expanded ? (
            <>
              收起 <ChevronUp size={14} />
            </>
          ) : (
            <>
              展开全文 <ChevronDown size={14} />
            </>
          )}
        </button>
        <button
          onClick={copy}
          className={`inline-flex items-center gap-1.5 border-2 border-ink px-3 py-1.5 font-kuaile text-sm shadow-hard-sm transition-all duration-150 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
            copied ? 'bg-arcade-green text-white' : 'bg-arcade-green text-white hover:bg-[#1B9468]'
          }`}
        >
          {copied ? (
            <>
              <Check size={14} /> 已复制
            </>
          ) : (
            <>
              <Copy size={14} /> 复制
            </>
          )}
        </button>
        <span className="ml-auto flex gap-2">
          {item.tags.slice(0, 2).map((t) => (
            <span
              key={t}
              className="border border-hairline bg-hall px-2 py-0.5 font-mono text-[10px] text-faint"
            >
              #{t}
            </span>
          ))}
        </span>
      </div>

      {/* 使用说明折叠区 */}
      <div className="mt-4 border-t-2 border-dashed border-hairline pt-3">
        <button
          onClick={() => setShowTips((v) => !v)}
          className="inline-flex items-center gap-1.5 font-silk text-[10px] tracking-[2px] text-arcade-green transition-colors hover:text-ink"
        >
          <Play
            size={10}
            className={`transition-transform duration-150 ${showTips ? 'rotate-90' : ''}`}
          />
          TIPS {showTips ? '▲' : '▶'}
        </button>
        <AnimatePresence initial={false}>
          {showTips && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="overflow-hidden"
            >
              <p className="pt-2 text-[13px] leading-relaxed text-body">
                {item.tips}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  )
}

/* ---------------- COPIED toast ---------------- */
function CopiedToast({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 10, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE }}
          className="fixed right-6 top-20 z-[70] border-2 border-ink bg-arcade-yellow px-4 py-2 shadow-hard"
        >
          <span className="font-silk text-[10px] tracking-[2px] text-ink">
            COPIED!
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ---------------- S3 卡片网格 ---------------- */
function PromptGrid({ category }: { category: string }) {
  const [toast, setToast] = useState(false)
  const toastTimer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(toastTimer.current), [])

  const list =
    category === '全部' ? PROMPTS : PROMPTS.filter((p) => p.category === category)

  const handleCopied = () => {
    setToast(true)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(false), 1500)
  }

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-12 md:px-6">
      <CopiedToast show={toast} />
      <motion.div layout className="grid gap-6 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {list.map((p) => (
            <PromptCard key={p.id} item={p} onCopied={handleCopied} />
          ))}
        </AnimatePresence>
      </motion.div>
      {list.length === 0 && (
        <p className="py-16 text-center font-vt text-2xl text-faint">
          NO AMMO IN THIS SLOT
        </p>
      )}
    </section>
  )
}

/* ---------------- S4 三步上膛 ---------------- */
function HowToUse() {
  const steps = [
    {
      no: '01',
      title: '选弹药',
      desc: '按场景挑分类，找到合用的 Prompt，一键复制全文。',
    },
    {
      no: '02',
      title: '装填',
      desc: '粘贴为你的 Agent 系统提示词或首轮指令，替换占位符。',
    },
    {
      no: '03',
      title: '开火',
      desc: '搭配 Skill 精品人格与 Agent 知识手册持续调优迭代。',
    },
  ]

  return (
    <section className="mx-auto max-w-[1200px] px-4 pb-12 md:px-6">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="border-[3px] border-ink bg-ink p-6 shadow-hard-yellow md:p-10"
      >
        <p className="font-silk text-[10px] tracking-[2px] text-arcade-yellow">
          HOW TO USE
        </p>
        <h2 className="mt-2 font-kuaile text-[26px] text-white">三步上膛</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.no}
              initial={{ x: 40, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: i * 0.15, ease: EASE }}
              className="border-2 border-[#23242C] bg-[#121218] p-5"
            >
              <motion.span
                initial={{ scale: 0.5 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.35,
                  delay: 0.2 + i * 0.15,
                  ease: EASE,
                }}
                className="block font-vt text-[40px] leading-none text-arcade-yellow"
              >
                {s.no}
              </motion.span>
              <h3 className="mt-3 font-kuaile text-[18px] text-white">
                {s.title}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-[#8A90A0]">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

/* ---------------- S5 页尾 CTA + 来源说明 ---------------- */
function PromptCta() {
  return (
    <motion.section
      initial={{ y: 60, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="border-y-[3px] border-ink bg-ink py-16 text-center"
    >
      <h2 className="mx-auto max-w-3xl px-4 font-kuaile text-[26px] leading-snug text-white md:text-[36px]">
        弹药有了，去给 AGENT
        <span className="hl-yellow px-2">升级大脑</span>
      </h2>
      <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Link to="/agent" className="btn-primary">
          去读 Agent 知识 →
        </Link>
        <Link to="/skills" className="btn-ghost">
          挑选 Skill 人格 →
        </Link>
      </div>
      <p className="mt-10 px-4 font-silk text-[9px] tracking-[2px] text-[#8A90A0]">
        CURATED &amp; EDITED BY MOMOZI · 12 ROUNDS HAND-PICKED · POWERED BY
        ZHIAI.ARCADE
      </p>
    </motion.section>
  )
}

/* ---------------- 页面组装 ---------------- */
export default function Prompts() {
  const [category, setCategory] = useState<string>('全部')
  const count =
    category === '全部'
      ? PROMPTS.length
      : PROMPTS.filter((p) => p.category === category).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <PromptHeader />
      <CategoryBar active={category} onChange={setCategory} count={count} />
      <PromptGrid category={category} />
      <HowToUse />
      <PromptCta />
    </motion.div>
  )
}
