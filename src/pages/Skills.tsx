import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ExternalLink, ChevronDown } from 'lucide-react'

/* ------------------------------------------------------------------ */
/* 数据类型                                                            */
/* ------------------------------------------------------------------ */
interface SubPersona {
  name: string
  title: string
  path: string
}
interface Skill {
  id: string
  name: string
  one_line: string
  description: string
  triggers: string[]
  category: string
  category_id: string
  version: string
  path: string
  github_url: string
  sub_personas?: SubPersona[]
}
interface ExternalItem {
  name: string
  description: string
  url: string
  category: string
}
interface SkillsData {
  source: string
  license: string
  stats: {
    skill_count: number
    by_category: Record<string, number>
    director_sub_personas: number
    tianya_god_sub_personas: number
    external_catalog_count: number
  }
  categories: { id: string; name: string }[]
  skills: Skill[]
  external_catalog: ExternalItem[]
}

/* 分类色签：导演红 / 情商绿 / 作家黄 / 天涯紫 / 大V 蓝 */
const CAT_COLORS: Record<string, string> = {
  'director-agents': '#F04438',
  eq: '#22B07D',
  novelists: '#FFC53D',
  tianya: '#ABA7E5',
  zimeiti: '#1E5EFF',
}
const catColor = (id: string) => CAT_COLORS[id] ?? '#FFC53D'

const EASE: [number, number, number, number] = [0.2, 0.9, 0.3, 1]

/* ------------------------------------------------------------------ */
/* VT323 count-up 数字                                                 */
/* ------------------------------------------------------------------ */
function CountUp({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const dur = 1200
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur)
      // steps 阶梯感：按 1/12 量化进度
      const stepped = Math.floor(p * 12) / 12
      setN(Math.round(value * stepped))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value])
  return (
    <>
      {n}
      {suffix}
    </>
  )
}

/* ------------------------------------------------------------------ */
/* 详情抽屉                                                            */
/* ------------------------------------------------------------------ */
function SkillDrawer({
  skill,
  onClose,
}: {
  skill: Skill | null
  onClose: () => void
}) {
  const [subsOpen, setSubsOpen] = useState(false)

  useEffect(() => {
    setSubsOpen(false)
  }, [skill?.id])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    if (skill) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [skill])

  const color = skill ? catColor(skill.category_id) : '#FFC53D'

  return (
    <AnimatePresence>
      {skill && (
        <>
          <motion.div
            key="skill-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] bg-ink/60"
            onClick={onClose}
          />
          <motion.aside
            key="skill-drawer"
            initial={{ x: 380 }}
            animate={{ x: 0 }}
            exit={{ x: 380 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="fixed right-0 top-0 z-[80] flex h-full w-full max-w-[380px] flex-col border-l-[3px] border-ink bg-paper"
          >
            {/* 分类色 6px 顶条 */}
            <div className="h-1.5 w-full shrink-0" style={{ backgroundColor: color }} />

            <div className="flex items-start justify-between gap-3 border-b-[3px] border-ink px-5 py-4">
              <div>
                <span
                  className="sticker"
                  style={{ backgroundColor: color, color: '#0B0B0F' }}
                >
                  {skill.category}
                </span>
                <h3 className="mt-2 font-kuaile text-[24px] leading-tight">
                  {skill.name}
                </h3>
              </div>
              <button
                onClick={onClose}
                aria-label="关闭详情"
                className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-ink bg-paper shadow-hard-sm transition-all duration-150 hover:bg-arcade-yellow active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {/* 元信息 */}
              <div className="mb-4 grid grid-cols-2 gap-2">
                <div className="border-2 border-ink bg-hall px-3 py-2">
                  <p className="font-silk text-[9px] tracking-[2px] text-faint">VERSION</p>
                  <p className="font-vt text-xl leading-none">
                    v{skill.version || '—'}
                  </p>
                </div>
                <div className="border-2 border-ink bg-hall px-3 py-2">
                  <p className="font-silk text-[9px] tracking-[2px] text-faint">TRIGGERS</p>
                  <p className="font-vt text-xl leading-none">{skill.triggers.length}</p>
                </div>
              </div>
              <p className="mb-4 break-all font-mono text-[11px] text-faint">
                {skill.path}
              </p>

              {/* 完整描述 */}
              <p className="mb-5 whitespace-pre-line text-[13.5px] leading-[1.85] text-body">
                {skill.description}
              </p>

              {/* 触发词全列 */}
              <p className="mb-2 font-silk text-[10px] tracking-[2px] text-faint">
                TRIGGER WORDS
              </p>
              <div className="mb-5 flex flex-wrap gap-1.5">
                {skill.triggers.map((t) => (
                  <span
                    key={t}
                    className="border border-ink bg-hall px-2 py-0.5 text-[10px]"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* 子人格折叠列表 */}
              {skill.sub_personas && skill.sub_personas.length > 0 && (
                <div className="mb-5 border-2 border-ink">
                  <button
                    onClick={() => setSubsOpen((v) => !v)}
                    className="flex w-full items-center justify-between bg-arcade-yellow px-3 py-2 font-kuaile text-sm"
                  >
                    <span>子人格档案 × {skill.sub_personas.length}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${subsOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {subsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <ul className="divide-y divide-hairline bg-paper">
                          {skill.sub_personas.map((p) => (
                            <li key={p.path} className="px-3 py-2">
                              <p className="font-kuaile text-[13px]">{p.name}</p>
                              <p className="text-[11px] leading-snug text-faint">
                                {p.title}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            <div className="shrink-0 border-t-[3px] border-ink p-4">
              <a
                href={skill.github_url}
                target="_blank"
                rel="noopener"
                className="btn-yellow w-full"
              >
                在 GitHub 打开 <ExternalLink size={16} />
              </a>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

/* ------------------------------------------------------------------ */
/* 镇馆双雄：导演多Agent系统卡                                         */
/* ------------------------------------------------------------------ */
function DirectorCard({
  skill,
  onOpenDrawer,
}: {
  skill: Skill
  onOpenDrawer: (s: Skill) => void
}) {
  const subs = skill.sub_personas ?? []
  const stripItems = [...subs, ...subs] // 复制一份供漂移循环

  return (
    <motion.div
      initial={{ opacity: 0, x: -60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="relative flex flex-col border-[3px] border-ink bg-paper p-6 shadow-hard-yellow"
    >
      <span className="sticker absolute -left-2 -top-3 rotate-[-3deg] bg-arcade-red text-white">
        FLAGSHIP
      </span>

      <h3 className="mt-2 font-kuaile text-[26px] leading-tight">{skill.name}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-body">{skill.one_line}</p>
      <p className="mt-3 font-vt text-[40px] leading-none">
        {subs.length} <span className="text-[24px]">DIRECTORS</span>
      </p>

      {/* 子人格横向滚动带（自动漂移，hover 暂停） */}
      <div className="drift-pause mt-4 overflow-hidden border-2 border-ink bg-hall py-3">
        <div className="drift-track flex w-max gap-3 px-3">
          {stripItems.map((p, i) => (
            <div
              key={`${p.path}-${i}`}
              className="w-[120px] shrink-0 cursor-pointer border-2 border-ink bg-paper px-2.5 py-2 transition-all duration-150 hover:-translate-y-1 hover:bg-arcade-yellow"
              onClick={() => onOpenDrawer(skill)}
            >
              <p className="truncate font-kuaile text-sm leading-tight">{p.name}</p>
              <p className="mt-1 font-silk text-[9px] tracking-[1px] text-faint">
                DIRECTOR FILE
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button className="btn-yellow !px-5 !py-2.5 text-sm" onClick={() => onOpenDrawer(skill)}>
          查看子人格档案 →
        </button>
        <a
          href={skill.github_url}
          target="_blank"
          rel="noopener"
          className="btn-ghost !px-5 !py-2.5 text-sm"
        >
          GitHub 源码 <ExternalLink size={14} />
        </a>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* 镇馆双雄：天涯大神智囊团卡（黑底）                                   */
/* ------------------------------------------------------------------ */
function TianyaCard({
  skill,
  onOpenDrawer,
}: {
  skill: Skill
  onOpenDrawer: (s: Skill) => void
}) {
  const subs = skill.sub_personas ?? []

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="relative flex flex-col border-[3px] border-ink bg-ink p-6 text-white shadow-hard-yellow"
    >
      <span className="sticker absolute -left-2 -top-3 rotate-[-3deg] bg-arcade-yellow text-ink">
        FLAGSHIP
      </span>

      <h3 className="mt-2 font-kuaile text-[26px] leading-tight">{skill.name}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-[#C8CCDA]">{skill.one_line}</p>
      <p className="mt-3 font-vt text-[40px] leading-none text-arcade-yellow">
        {subs.length} <span className="text-[24px]">PROFILES</span>
      </p>

      {/* 5 人格白底 mini 卡 */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {subs.map((p) => {
          const [cn, style] = p.title.split('·').map((s) => s.trim())
          return (
            <div
              key={p.path}
              className="cursor-pointer border-2 border-ink bg-paper px-2.5 py-2 text-ink transition-all duration-150 hover:-translate-y-1 hover:bg-arcade-yellow"
              onClick={() => onOpenDrawer(skill)}
            >
              <p className="truncate font-kuaile text-sm leading-tight">
                {cn || p.name}
              </p>
              <p className="mt-0.5 truncate text-[10px] text-faint">
                {style || p.name}
              </p>
            </div>
          )
        })}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button className="btn-yellow !px-5 !py-2.5 text-sm" onClick={() => onOpenDrawer(skill)}>
          查看子人格档案 →
        </button>
        <a
          href={skill.github_url}
          target="_blank"
          rel="noopener"
          className="btn-ghost !px-5 !py-2.5 text-sm"
        >
          GitHub 源码 <ExternalLink size={14} />
        </a>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* Skill 网格卡片                                                      */
/* ------------------------------------------------------------------ */
function SkillCard({
  skill,
  index,
  onOpenDrawer,
}: {
  skill: Skill
  index: number
  onOpenDrawer: (s: Skill) => void
}) {
  const color = catColor(skill.category_id)
  const shownTriggers = skill.triggers.slice(0, 3)
  const extra = skill.triggers.length - shownTriggers.length

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
      }}
      transition={{ delay: index * 0.06 }}
      className="flex flex-col border-[3px] border-ink bg-paper p-5 shadow-hard transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-yellow"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span
          className="border border-ink px-1.5 py-0.5 font-silk text-[9px] tracking-[1px]"
          style={{ backgroundColor: color, color: '#0B0B0F' }}
        >
          {skill.category}
        </span>
        <span className="font-vt text-xs text-faint">v{skill.version || '—'}</span>
      </div>

      <h4 className="font-kuaile text-xl leading-tight">{skill.name}</h4>
      <p className="mt-1.5 line-clamp-2 min-h-[3.4em] text-[13px] leading-[1.7] text-body">
        {skill.one_line || skill.description}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {shownTriggers.map((t) => (
          <span key={t} className="border border-ink bg-hall px-1.5 py-0.5 text-[10px]">
            {t}
          </span>
        ))}
        {extra > 0 && (
          <span className="border border-ink bg-arcade-yellow px-1.5 py-0.5 font-vt text-[10px]">
            +{extra}
          </span>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between pt-4">
        <span className="font-vt text-sm text-faint">v{skill.version || '—'}</span>
        <div className="flex gap-2">
          <button
            onClick={() => onOpenDrawer(skill)}
            className="border-2 border-ink bg-paper px-2.5 py-1 font-kuaile text-xs shadow-hard-sm transition-all duration-150 hover:bg-arcade-yellow active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            详情
          </button>
          <a
            href={skill.github_url}
            target="_blank"
            rel="noopener"
            aria-label={`${skill.name} GitHub`}
            className="flex items-center gap-1 border-2 border-ink bg-paper px-2.5 py-1 font-kuaile text-xs shadow-hard-sm transition-all duration-150 hover:bg-arcade-yellow active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            <ExternalLink size={12} /> GitHub
          </a>
        </div>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* 主页面                                                              */
/* ------------------------------------------------------------------ */
export default function Skills() {
  const [data, setData] = useState<SkillsData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeCat, setActiveCat] = useState('all')
  const [query, setQuery] = useState('')
  const [drawerSkill, setDrawerSkill] = useState<Skill | null>(null)
  const [showAllExt, setShowAllExt] = useState(false)

  useEffect(() => {
    fetch('/data/skills/index.json')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json() as Promise<SkillsData>
      })
      .then(setData)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'LOAD ERROR'))
  }, [])

  const q = query.trim().toLowerCase()

  const matchesQuery = (s: Skill) =>
    !q ||
    s.name.toLowerCase().includes(q) ||
    s.one_line.toLowerCase().includes(q) ||
    s.triggers.some((t) => t.toLowerCase().includes(q))

  const filtered = useMemo(() => {
    if (!data) return []
    return data.skills.filter(
      (s) => (activeCat === 'all' || s.category_id === activeCat) && matchesQuery(s),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, activeCat, q])

  const groups = useMemo(() => {
    if (!data) return []
    return data.categories
      .filter((c) => activeCat === 'all' || c.id === activeCat)
      .map((c) => ({ cat: c, skills: filtered.filter((s) => s.category_id === c.id) }))
      .filter((g) => g.skills.length > 0)
  }, [data, filtered, activeCat])

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <p className="border-[3px] border-ink bg-paper px-8 py-4 font-vt text-2xl shadow-hard">
          LOAD ERROR: {error}
        </p>
      </div>
    )
  }
  if (!data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <p className="blink-arcade border-[3px] border-ink bg-paper px-8 py-4 font-vt text-2xl shadow-hard">
          NOW LOADING...
        </p>
      </div>
    )
  }

  const directorSkill = data.skills.find((s) => s.category_id === 'director-agents')
  const tianyaSkill = data.skills.find((s) => s.category_id === 'tianya')
  const showDirector =
    directorSkill &&
    (activeCat === 'all' || activeCat === 'director-agents') &&
    matchesQuery(directorSkill)
  const showTianya =
    tianyaSkill && (activeCat === 'all' || activeCat === 'tianya') && matchesQuery(tianyaSkill)

  const extShown = showAllExt
    ? data.external_catalog
    : data.external_catalog.slice(0, 12)

  const headerStats = [
    { value: data.stats.skill_count, label: 'SKILLS', suffix: '' },
    {
      value: data.stats.director_sub_personas + data.stats.tianya_god_sub_personas,
      label: 'SUB-PERSONAS',
      suffix: '',
    },
    { value: data.stats.external_catalog_count, label: 'EXTERNAL', suffix: '' },
    { value: 564, label: 'STARS', suffix: '+' },
  ]

  return (
    <div className="pb-24">
      {/* 漂移滚动带 keyframes（组件内局部样式） */}
      <style>{`
        .drift-track { animation: skill-drift 40s linear infinite alternate; }
        .drift-pause:hover .drift-track { animation-play-state: paused; }
        @keyframes skill-drift {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>

      {/* ================= S1 页头 ================= */}
      <section className="mx-auto max-w-[1200px] px-4 pt-12 md:px-6 md:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="flex flex-col gap-6 border-[3px] border-ink bg-paper p-6 shadow-hard-yellow md:flex-row md:items-center md:p-8"
        >
          <div className="flex items-center gap-5">
            <img
              src="/badge-skill.png"
              alt="Skill 徽章"
              width={120}
              height={120}
              className="sway h-20 w-20 shrink-0 md:h-[120px] md:w-[120px]"
            />
            <div>
              <span className="sticker bg-arcade-yellow text-ink">
                PERSONA SKILL SELECT
              </span>
              <h1 className="mt-3 font-kuaile text-[30px] leading-tight md:text-[34px]">
                Skill 精品 · <span className="hl-yellow">人格卡带墙</span>
              </h1>
              <p className="mt-2 max-w-[420px] text-[13px] leading-relaxed text-body">
                源自 awesome-ai-persona-skills 的人格蒸馏 Skill 陈列厅：导演智囊团、
                天涯大神、作家名家、自媒体大V，全部可一键插入你的 Agent。
              </p>
            </div>
          </div>

          {/* VT323 统计四联 */}
          <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4 md:max-w-[460px]">
            {headerStats.map((s) => (
              <div key={s.label} className="border-2 border-ink bg-hall px-3 py-3 text-center">
                <p className="font-vt text-[40px] leading-none">
                  <CountUp value={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-1 font-silk text-[9px] tracking-[2px] text-faint">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ================= S2 筛选工具条 ================= */}
      <div className="sticky top-16 z-40 mx-auto mt-8 max-w-[1200px] px-4 md:px-6">
        <div className="flex flex-col gap-3 border-[3px] border-ink bg-paper p-3 shadow-hard lg:flex-row lg:items-center lg:justify-between">
          {/* 分类 chips */}
          <div className="flex flex-wrap gap-2">
            {[{ id: 'all', name: '全部' }, ...data.categories].map((c) => {
              const active = activeCat === c.id
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCat(c.id)}
                  className={`border-2 border-ink px-3 py-1.5 text-[13px] transition-all duration-150 ${
                    active
                      ? 'bg-arcade-yellow font-kuaile text-ink shadow-hard-sm'
                      : 'bg-paper text-body hover:bg-[#FFF3D6]'
                  }`}
                >
                  {c.name}
                </button>
              )
            })}
          </div>

          {/* 搜索框 + 计数 */}
          <div className="flex items-center gap-3">
            <div className="flex flex-1 items-center gap-2 border-2 border-ink bg-paper px-3 py-2 lg:w-[240px]">
              <Search size={14} className="shrink-0 text-faint" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="SEARCH SKILLS..."
                className="w-full bg-transparent font-silk text-[10px] tracking-[2px] outline-none placeholder:text-faint"
              />
              {query && (
                <button onClick={() => setQuery('')} aria-label="清空搜索">
                  <X size={12} className="text-faint" />
                </button>
              )}
            </div>
            <span className="shrink-0 font-vt text-base">
              HITS: {filtered.length}
            </span>
          </div>
        </div>
      </div>

      {/* ================= S3 镇馆双雄 ================= */}
      {(showDirector || showTianya) && (
        <section className="mx-auto mt-12 max-w-[1200px] px-4 md:px-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-2.5 w-2.5 bg-arcade-yellow" />
            <span className="font-silk text-[10px] tracking-[2px] text-faint">
              FLAGSHIP SYSTEMS
            </span>
            <h2 className="font-kuaile text-[26px]">镇馆双雄</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {showDirector && directorSkill && (
              <DirectorCard skill={directorSkill} onOpenDrawer={setDrawerSkill} />
            )}
            {showTianya && tianyaSkill && (
              <TianyaCard skill={tianyaSkill} onOpenDrawer={setDrawerSkill} />
            )}
          </div>
        </section>
      )}

      {/* ================= S4 Skill 分组网格 ================= */}
      <section className="mx-auto mt-16 max-w-[1200px] px-4 md:px-6">
        {groups.length === 0 && (
          <p className="border-[3px] border-ink bg-paper px-8 py-6 text-center font-vt text-2xl shadow-hard">
            NO HITS · 换个关键词试试
          </p>
        )}
        {groups.map((g) => (
          <div key={g.cat.id} className="mb-14">
            <div className="mb-6 flex items-end gap-3">
              <span
                className="h-2.5 w-2.5"
                style={{ backgroundColor: catColor(g.cat.id) }}
              />
              <h3 className="font-kuaile text-[26px] leading-none">{g.cat.name}</h3>
              <span className="font-vt text-xl text-faint">
                × {g.skills.length}
              </span>
            </div>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.06 } },
              }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {g.skills.map((s, i) => (
                <SkillCard
                  key={s.id}
                  skill={s}
                  index={i}
                  onOpenDrawer={setDrawerSkill}
                />
              ))}
            </motion.div>
          </div>
        ))}
      </section>

      {/* ================= S5 外链目录墙 ================= */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="mx-auto mt-8 max-w-[1200px] px-4 md:px-6"
      >
        <div className="mb-2">
          <span className="font-silk text-[10px] tracking-[2px] text-faint">
            EXTERNAL ARSENAL
          </span>
        </div>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-kuaile text-[30px] leading-none md:text-[42px]">
            外部精品目录
          </h2>
          <p className="text-[13px] text-faint">
            收录社区 {data.external_catalog.length} 个优质 Skill，点击直达源仓库
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.05 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.02 } },
          }}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          {extShown.map((e) => (
            <motion.a
              key={e.url}
              href={e.url}
              target="_blank"
              rel="noopener"
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } },
              }}
              className="group relative flex flex-col border-2 border-ink bg-paper p-3 pb-6 transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-arcade-yellow"
            >
              <p className="truncate font-kuaile text-[13px]">{e.name}</p>
              <p className="mt-1 truncate text-[11px] text-faint group-hover:text-ink/70">
                {e.description}
              </p>
              <span className="absolute bottom-1.5 right-2 font-silk text-[9px] tracking-[1px] text-faint">
                {e.category}
              </span>
            </motion.a>
          ))}
        </motion.div>

        {data.external_catalog.length > 12 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowAllExt((v) => !v)}
              className="btn-ghost !px-6 !py-2.5 text-sm"
            >
              {showAllExt
                ? '收起 ↑'
                : `显示全部 ${data.external_catalog.length} 条 ↓`}
            </button>
          </div>
        )}
      </motion.section>

      {/* ================= S6 数据来源条 ================= */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="mx-auto mt-16 max-w-[1200px] px-4 md:px-6"
      >
        <div className="flex flex-col items-center justify-between gap-4 border-[3px] border-ink bg-ink px-6 py-6 text-white shadow-hard-yellow md:flex-row">
          <p className="text-center text-sm md:text-left">
            数据源：
            <span className="font-vt text-lg text-arcade-yellow">
              github.com/momozi1996/awesome-ai-persona-skills
            </span>
            <span className="ml-2 border border-arcade-yellow px-1.5 py-0.5 font-silk text-[9px] tracking-[1px] text-arcade-yellow">
              {data.license} LICENSE
            </span>
          </p>
          <a
            href={data.source}
            target="_blank"
            rel="noopener"
            className="btn-yellow shrink-0 !px-6 !py-2.5 text-sm"
          >
            STAR 仓库 <ExternalLink size={14} />
          </a>
        </div>
      </motion.section>

      {/* 详情抽屉 */}
      <SkillDrawer skill={drawerSkill} onClose={() => setDrawerSkill(null)} />
    </div>
  )
}
