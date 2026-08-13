import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { AnimatePresence, motion, useMotionValue } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { ChevronRight, ExternalLink, Github, Menu, Star, X } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'

/* ------------------------------------------------------------------ */
/* 常量                                                                */
/* ------------------------------------------------------------------ */

const EASE = [0.2, 0.9, 0.3, 1] as [number, number, number, number]

const GH_BASE = 'https://github.com/momozi1996/awesome-ai-knowledge'
const GH_VOL0 = `${GH_BASE}/tree/main/docs/0-%E8%BF%91%E6%9C%9F%E6%9C%80%E6%96%B0%E7%9F%A5%E8%AF%86%E7%82%B9`
const GH_VOL1 = `${GH_BASE}/tree/main/docs/03-AI%20Agent%E6%99%BA%E8%83%BD%E4%BD%93`
const GH_VOL2 = `${GH_BASE}/tree/main/docs/04-Agent%E5%B7%A5%E7%A8%8B%E4%B8%8E%E8%AE%AD%E7%BB%83`

interface DocMeta {
  file: string
  path: string
  title: string
  dir: string
  subdir: string
  size_bytes: number
  summary: string
}

/* ------------------------------------------------------------------ */
/* 工具函数                                                            */
/* ------------------------------------------------------------------ */

const pad = (n: number) => String(n).padStart(2, '0')

/** 去掉标题里的 .md 后缀与前缀编号，得到干净的展示标题 */
const cleanTitle = (t: string) =>
  t
    .replace(/\.md$/i, '')
    .replace(/^\d+\s*[-.、]?\s*/, '')
    .trim()

/** 摘要清洗：去掉 markdown 噪音字符，截 60 字 */
const cleanSummary = (s: string) => {
  const c = s
    .replace(/[#>*_`\[\](){}'"]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return c.length > 60 ? `${c.slice(0, 60)}…` : c
}

/** 路由段：去掉 .md 后逐段 URL 编码 */
const encodeDocPath = (path: string) =>
  path
    .replace(/\.md$/i, '')
    .split('/')
    .map(encodeURIComponent)
    .join('/')

/** fetch 地址：保留 .md，逐段编码 */
const encodeFetchPath = (path: string) =>
  path
    .split('/')
    .map(encodeURIComponent)
    .join('/')

/** 剥离 YAML frontmatter */
const stripFrontmatter = (md: string) => {
  if (md.startsWith('---')) {
    const end = md.indexOf('\n---', 3)
    if (end !== -1) {
      const after = md.indexOf('\n', end + 4)
      return after !== -1 ? md.slice(after + 1) : ''
    }
  }
  return md
}

const kb = (bytes: number) => `${(bytes / 1024).toFixed(1)} KB`

/* ------------------------------------------------------------------ */
/* Markdown 渲染样式映射（design.md §S2.2）                            */
/* ------------------------------------------------------------------ */

const mdComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mb-4 mt-10 flex items-start gap-3 font-kuaile text-[28px] leading-[1.3] text-ink">
      <span className="mt-2.5 h-2.5 w-2.5 shrink-0 border-2 border-ink bg-arcade-blue" />
      <span>{children}</span>
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-4 mt-10 flex items-start gap-3 font-kuaile text-[26px] leading-[1.3] text-ink">
      <span className="mt-2.5 h-2 w-2 shrink-0 border-2 border-ink bg-arcade-blue" />
      <span>{children}</span>
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-3 mt-8 font-kuaile text-[20px] leading-[1.35] text-ink">
      <span className="mr-2 text-arcade-blue">▸</span>
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="mb-2 mt-6 font-kuaile text-[17px] text-ink">{children}</h4>
  ),
  p: ({ children }) => (
    <p className="my-4 text-justify text-[15.5px] leading-[1.85] text-body">
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-ink">{children}</strong>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className="text-arcade-blue underline decoration-2 underline-offset-2 transition-colors duration-150 hover:bg-arcade-yellow hover:text-ink hover:no-underline"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="my-4 space-y-2">{children}</ul>,
  ol: ({ children }) => <ol className="my-4 space-y-2">{children}</ol>,
  li: ({ children }) => (
    <li className="flex items-start gap-2.5 text-[15.5px] leading-[1.85] text-body">
      <span className="mt-[9px] h-2 w-2 shrink-0 border border-ink bg-arcade-blue" />
      <span className="min-w-0 flex-1">{children}</span>
    </li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-5 border-2 border-ink border-l-[6px] border-l-arcade-yellow bg-[#FFF9E8] px-4 py-1 text-body [&>p]:my-3">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-8 border-t-[3px] border-ink" />,
  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt ?? ''}
      className="my-6 border-[3px] border-ink shadow-hard"
    />
  ),
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto border-2 border-ink shadow-hard">
      <table className="w-full border-collapse text-left text-[13.5px] leading-[1.7]">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => <thead>{children}</thead>,
  tr: ({ children }) => <tr className="bg-paper even:bg-hall">{children}</tr>,
  th: ({ children }) => (
    <th className="border-2 border-ink bg-ink px-3 py-2 font-kuaile text-[14px] font-normal text-white">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-2 border-ink px-3 py-2 align-top text-body">
      {children}
    </td>
  ),
  pre: ({ children }) => (
    <pre className="relative my-6 overflow-x-auto border-[3px] border-ink bg-ink px-4 pb-4 pt-8 font-mono text-[13.5px] leading-[1.7] text-[#E8EAF2] shadow-hard-blue">
      {children}
    </pre>
  ),
  code: ({ className, children }) => {
    const match = /language-([\w-]+)/.exec(className ?? '')
    if (match) {
      return (
        <code className={className}>
          <span className="absolute right-2 top-1.5 font-silk text-[9px] tracking-[2px] text-arcade-yellow">
            {match[1].toUpperCase()}
          </span>
          {children}
        </code>
      )
    }
    return (
      <code className="border border-ink bg-arcade-yellow px-1 py-px font-mono text-[0.85em] text-ink">
        {children}
      </code>
    )
  },
}

/* ------------------------------------------------------------------ */
/* S1 页头 BookHeader                                                  */
/* ------------------------------------------------------------------ */

function BookHeader() {
  return (
    <motion.section
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="border-[3px] border-ink bg-paper p-5 shadow-hard-blue md:p-6"
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <motion.img
            src="/badge-book.png"
            alt="电子书徽章"
            width={64}
            height={64}
            initial={{ rotate: -4 }}
            animate={{ rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 14 }}
            className="h-16 w-16 shrink-0"
          />
          <div>
            <p className="font-silk text-[10px] tracking-[2px] text-arcade-blue">
              AGENT KNOWLEDGE E-BOOK
            </p>
            <h1 className="mt-1 font-kuaile text-[28px] leading-none text-ink md:text-[34px]">
              Agent 知识 · 电子书
            </h1>
          </div>
        </div>
        <div className="flex flex-col items-start gap-2 md:items-end">
          <p className="text-[13px] text-body">
            内容源自开源仓库{' '}
            <span className="font-mono text-[12px]">awesome-ai-knowledge</span>
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href={GH_VOL0}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1.5 border-2 border-ink bg-paper px-3 py-1.5 text-[12px] text-ink transition-colors duration-150 hover:bg-arcade-yellow active:translate-x-[2px] active:translate-y-[2px]"
            >
              0 · 近期最新知识点
              <ExternalLink size={12} />
            </a>
            <a
              href={GH_VOL1}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1.5 border-2 border-ink bg-paper px-3 py-1.5 text-[12px] text-ink transition-colors duration-150 hover:bg-arcade-yellow active:translate-x-[2px] active:translate-y-[2px]"
            >
              03 · AI Agent智能体
              <ExternalLink size={12} />
            </a>
            <a
              href={GH_VOL2}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1.5 border-2 border-ink bg-paper px-3 py-1.5 text-[12px] text-ink transition-colors duration-150 hover:bg-arcade-yellow active:translate-x-[2px] active:translate-y-[2px]"
            >
              04 · Agent工程与训练
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

/* ------------------------------------------------------------------ */
/* S2.1 目录（双卷手风琴）                                              */
/* ------------------------------------------------------------------ */

interface TocProps {
  docs: DocMeta[]
  currentIndex: number
  onSelect: (index: number) => void
}

function TocChapterItem({
  doc,
  globalIndex,
  isCurrent,
  onSelect,
}: {
  doc: DocMeta
  globalIndex: number
  isCurrent: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      data-current={isCurrent || undefined}
      onClick={onSelect}
      className={`flex w-full items-baseline gap-2 border-2 px-2.5 py-2 text-left text-[14px] leading-snug transition-colors duration-150 ${
        isCurrent
          ? 'border-ink bg-arcade-yellow font-medium text-ink shadow-hard-sm'
          : 'border-transparent text-body hover:bg-[#FFF4D6] hover:text-ink'
      }`}
    >
      <span className={`font-vt text-[15px] leading-none ${isCurrent ? 'text-ink' : 'text-faint'}`}>
        {pad(globalIndex + 1)}
      </span>
      <span className="min-w-0 flex-1">{cleanTitle(doc.title)}</span>
    </button>
  )
}

function Volume({
  label,
  sub,
  open,
  onToggle,
  hot = false,
  children,
}: {
  label: string
  sub: string
  open: boolean
  onToggle: () => void
  hot?: boolean
  children: React.ReactNode
}) {
  return (
    <div className={`border-2 ${hot ? 'border-[#F04438] shadow-hard-sm' : 'border-ink'}`}>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-2.5 bg-paper px-3 py-2.5 text-left transition-colors duration-150 hover:bg-hall"
      >
        <span className={`h-5 w-1.5 shrink-0 ${hot ? 'bg-[#F04438]' : 'bg-arcade-blue'}`} />
        <span className="min-w-0 flex-1">
          <span
            className={`flex items-center gap-2 font-kuaile text-[17px] leading-tight ${
              hot ? 'text-[#F04438]' : 'text-ink'
            }`}
          >
            {label}
            {hot && (
              <span className="shrink-0 border-2 border-ink bg-arcade-yellow px-1.5 py-px font-silk text-[9px] leading-none tracking-[1.5px] text-ink">
                HOT
              </span>
            )}
          </span>
          <span className="block font-vt text-[13px] leading-none text-faint">
            {sub}
          </span>
        </span>
        <ChevronRight
          size={16}
          strokeWidth={2.5}
          className={`shrink-0 text-ink transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="overflow-hidden border-t-2 border-ink"
          >
            <div className="space-y-1 p-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function SubgroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-2.5 pb-1 pt-3 font-silk text-[10px] tracking-[1.5px] text-faint">
      {children}
    </p>
  )
}

function TableOfContents({ docs, currentIndex, onSelect }: TocProps) {
  const [openVol, setOpenVol] = useState({ vol0: true, vol1: true, vol2: true })
  const containerRef = useRef<HTMLDivElement>(null)

  const vol0 = useMemo(() => docs.filter((d) => d.dir === '00'), [docs])
  const vol1 = useMemo(() => docs.filter((d) => d.dir === '03'), [docs])
  const vol2Overview = useMemo(
    () => docs.filter((d) => d.dir === '04' && d.subdir === ''),
    [docs],
  )
  const vol2Advanced = useMemo(
    () => docs.filter((d) => d.dir === '04' && d.subdir === '进阶知识点'),
    [docs],
  )

  const indexOf = useCallback(
    (doc: DocMeta) => docs.findIndex((d) => d.path === doc.path),
    [docs],
  )

  /* 当前章所在卷自动展开 */
  useEffect(() => {
    const cur = docs[currentIndex]
    if (!cur) return
    setOpenVol((v) =>
      cur.dir === '00'
        ? { ...v, vol0: true }
        : cur.dir === '03'
          ? { ...v, vol1: true }
          : { ...v, vol2: true },
    )
  }, [currentIndex, docs])

  /* 当前章滚入可视区 */
  useEffect(() => {
    const el = containerRef.current?.querySelector('[data-current="true"]')
    el?.scrollIntoView({ block: 'nearest' })
  }, [currentIndex])

  const renderItems = (list: DocMeta[]) =>
    list.map((doc) => {
      const gi = indexOf(doc)
      return (
        <TocChapterItem
          key={doc.path}
          doc={doc}
          globalIndex={gi}
          isCurrent={gi === currentIndex}
          onSelect={() => onSelect(gi)}
        />
      )
    })

  return (
    <div ref={containerRef}>
      <div className="mb-4 flex items-baseline justify-between">
        <p className="font-silk text-[10px] tracking-[2px] text-faint">
          TABLE OF CONTENTS
        </p>
        <p className="font-vt text-[18px] leading-none text-ink">
          {docs.length} CHAPTERS
        </p>
      </div>
      <div className="space-y-3">
        {vol0.length > 0 && (
          <Volume
            label="近期最热知识点"
            sub={`VOL.0 · ${vol0.length} DOCS`}
            open={openVol.vol0}
            onToggle={() => setOpenVol((v) => ({ ...v, vol0: !v.vol0 }))}
            hot
          >
            {renderItems(vol0)}
          </Volume>
        )}
        <Volume
          label="卷一 · AI Agent 智能体"
          sub={`VOL.1 · ${vol1.length} DOCS`}
          open={openVol.vol1}
          onToggle={() => setOpenVol((v) => ({ ...v, vol1: !v.vol1 }))}
        >
          {renderItems(vol1)}
        </Volume>
        <Volume
          label="卷二 · Agent 工程与训练"
          sub={`VOL.2 · ${vol2Overview.length + vol2Advanced.length} DOCS`}
          open={openVol.vol2}
          onToggle={() => setOpenVol((v) => ({ ...v, vol2: !v.vol2 }))}
        >
          <SubgroupLabel>OVERVIEW</SubgroupLabel>
          {renderItems(vol2Overview)}
          <SubgroupLabel>ADVANCED 进阶知识点</SubgroupLabel>
          {renderItems(vol2Advanced)}
        </Volume>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* S2.3 移动端目录抽屉                                                  */
/* ------------------------------------------------------------------ */

function MobileTocDrawer({
  open,
  onClose,
  docs,
  currentIndex,
  onSelect,
}: TocProps & { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] bg-ink/60"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.25, ease: EASE }}
            className="fixed inset-y-0 left-0 z-[80] flex w-[80%] max-w-[340px] flex-col border-r-[3px] border-ink bg-paper"
          >
            <div className="flex items-center justify-between border-b-[3px] border-ink px-4 py-3">
              <span className="font-kuaile text-[18px] text-ink">章节目录</span>
              <button
                type="button"
                onClick={onClose}
                aria-label="关闭目录"
                className="flex h-8 w-8 items-center justify-center border-2 border-ink bg-paper active:translate-x-[2px] active:translate-y-[2px]"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <TableOfContents
                docs={docs}
                currentIndex={currentIndex}
                onSelect={(i) => {
                  onSelect(i)
                  onClose()
                }}
              />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

/* ------------------------------------------------------------------ */
/* 像素翻页器 Pager（design.md §6.7）                                   */
/* ------------------------------------------------------------------ */

function PagerButton({
  direction,
  label,
  disabled,
  onClick,
}: {
  direction: 'prev' | 'next'
  label: string
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center gap-2 border-2 border-ink px-3 py-2 font-kuaile text-[15px] transition-all duration-150 md:px-4 ${
        disabled
          ? 'cursor-not-allowed bg-hall text-faint'
          : 'bg-paper text-ink shadow-hard-sm hover:bg-arcade-yellow active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'
      }`}
    >
      {direction === 'prev' && (
        <img src="/pixel-arrow-left.svg" alt="" width={14} height={14} />
      )}
      {label}
      {direction === 'next' && (
        <img src="/pixel-arrow-right.svg" alt="" width={14} height={14} />
      )}
    </button>
  )
}

function Pager({
  currentIndex,
  total,
  onPrev,
  onNext,
}: {
  currentIndex: number
  total: number
  onPrev: () => void
  onNext: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <PagerButton
        direction="prev"
        label="上一章"
        disabled={currentIndex <= 0}
        onClick={onPrev}
      />
      <span className="whitespace-nowrap font-vt text-[20px] leading-none text-ink">
        PAGE {pad(currentIndex + 1)} / {total}
      </span>
      <PagerButton
        direction="next"
        label="下一章"
        disabled={currentIndex >= total - 1}
        onClick={onNext}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 章末下一章预告卡                                                     */
/* ------------------------------------------------------------------ */

function ChapterEndCard({
  nextDoc,
  nextIndex,
  total,
  onNext,
}: {
  nextDoc: DocMeta | null
  nextIndex: number
  total: number
  onNext: () => void
}) {
  if (!nextDoc) {
    return (
      <div className="mt-12 flex flex-col items-start gap-3 border-2 border-ink bg-hall p-5 shadow-hard-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-silk text-[10px] tracking-[2px] text-arcade-blue">
            GAME CLEAR
          </p>
          <p className="mt-1 font-kuaile text-[18px] text-ink">
            全卷完 · {total} 章通关达成
          </p>
        </div>
        <Link to="/tree" className="btn-primary px-4 py-2 text-[14px]">
          去知识树复盘 →
        </Link>
      </div>
    )
  }
  return (
    <div className="mt-12 flex flex-col items-start gap-3 border-2 border-ink bg-hall p-5 shadow-hard-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="font-silk text-[10px] tracking-[2px] text-arcade-blue">
          NEXT CHAPTER
        </p>
        <p className="mt-1 font-kuaile text-[18px] text-ink">下一章预告</p>
        <p className="mt-0.5 truncate text-[14px] text-body">
          <span className="mr-2 font-vt text-[15px] text-faint">
            {pad(nextIndex + 1)}
          </span>
          {cleanTitle(nextDoc.title)}
        </p>
      </div>
      <button
        type="button"
        onClick={onNext}
        className="btn-primary shrink-0 px-4 py-2 text-[14px]"
      >
        继续 →
      </button>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 加载 / 错误状态                                                      */
/* ------------------------------------------------------------------ */

function LoadingBlock() {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center gap-5">
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-3.5 w-3.5 border-2 border-ink bg-arcade-blue"
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.12,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
      <p className="blink-arcade font-vt text-[24px] leading-none text-ink">
        LOADING...
      </p>
    </div>
  )
}

function ErrorBlock({
  message,
  title = '章节加载失败',
  onHome,
}: {
  message: string
  title?: string
  onHome?: () => void
}) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 text-center">
      <p className="font-silk text-[10px] tracking-[2px] text-arcade-red">
        ERROR
      </p>
      <p className="font-kuaile text-[22px] text-ink">{title}</p>
      <p className="max-w-[420px] text-[13px] text-faint">{message}</p>
      {onHome && (
        <button type="button" onClick={onHome} className="btn-primary">
          ← 返回电子书主目录
        </button>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* S3 数据来源条                                                        */
/* ------------------------------------------------------------------ */

function DataSourceStrip() {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="border-y-[3px] border-ink bg-ink"
    >
      <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-white">
          <Github size={15} className="shrink-0" />
          <span>数据源：github.com/momozi1996/awesome-ai-knowledge</span>
          <a
            href={GH_VOL0}
            target="_blank"
            rel="noopener"
            className="underline decoration-2 underline-offset-2 transition-colors duration-150 hover:bg-arcade-yellow hover:text-ink hover:no-underline"
          >
            docs/0-近期最新知识点
          </a>
          <a
            href={GH_VOL1}
            target="_blank"
            rel="noopener"
            className="underline decoration-2 underline-offset-2 transition-colors duration-150 hover:bg-arcade-yellow hover:text-ink hover:no-underline"
          >
            docs/03-AI Agent智能体
          </a>
          <a
            href={GH_VOL2}
            target="_blank"
            rel="noopener"
            className="underline decoration-2 underline-offset-2 transition-colors duration-150 hover:bg-arcade-yellow hover:text-ink hover:no-underline"
          >
            docs/04-Agent工程与训练
          </a>
        </p>
        <a
          href={GH_BASE}
          target="_blank"
          rel="noopener"
          className="inline-flex shrink-0 items-center gap-1.5 border-2 border-ink bg-arcade-yellow px-3 py-1.5 font-kuaile text-[13px] text-ink shadow-hard-sm transition-all duration-150 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          <Star size={13} />
          STAR 仓库 ↗
        </a>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* 页面主体                                                             */
/* ------------------------------------------------------------------ */

const pageVariants: Variants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: 40 * dir,
    rotateY: 6 * dir,
  }),
  center: { opacity: 1, x: 0, rotateY: 0 },
  exit: (dir: number) => ({
    opacity: 0,
    x: -40 * dir,
    rotateY: -6 * dir,
  }),
}

export default function AgentBook() {
  const params = useParams()
  // 通配路由 /agent/*：文档路径含多级目录（如 04/基本知识点/01-模型基本结构），
  // React Router 会对每个段做解码，这里拿到的已是解码后的完整相对路径
  const docPath = params['*'] || ''
  const navigate = useNavigate()

  const [docs, setDocs] = useState<DocMeta[] | null>(null)
  const [indexError, setIndexError] = useState<string | null>(null)
  const [content, setContent] = useState<string | null>(null)
  const [contentError, setContentError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [direction, setDirection] = useState(1)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const contentCache = useRef(new Map<string, string>())
  const lastIndexRef = useRef(0)
  const paperRef = useRef<HTMLDivElement>(null)
  const progressMV = useMotionValue(0)
  const touchStartX = useRef<number | null>(null)

  /* 目录清单加载 */
  useEffect(() => {
    let cancelled = false
    fetch('/data/agent-docs/index.json')
      .then((r) => {
        if (!r.ok) throw new Error(`index.json HTTP ${r.status}`)
        return r.json() as Promise<DocMeta[]>
      })
      .then((data) => {
        if (!cancelled) setDocs(data)
      })
      .catch((e: Error) => {
        if (!cancelled) setIndexError(e.message)
      })
    return () => {
      cancelled = true
    }
  }, [])

  /* 当前章节序号：/agent 默认第一篇；/agent/* 深链定位 */
  const { currentIndex, docNotFound } = useMemo(() => {
    if (!docs || docs.length === 0)
      return { currentIndex: 0, docNotFound: false }
    if (!docPath) return { currentIndex: 0, docNotFound: false }
    const target = docPath.replace(/\.md$/i, '')
    const i = docs.findIndex(
      (d) =>
        d.path.replace(/\.md$/i, '') === target || d.path === docPath,
    )
    return i >= 0
      ? { currentIndex: i, docNotFound: false }
      : { currentIndex: 0, docNotFound: true }
  }, [docs, docPath])

  const total = docs?.length ?? 0
  const currentDoc = docs?.[currentIndex] ?? null
  const nextDoc = currentIndex < total - 1 ? docs![currentIndex + 1] : null

  /* 翻页方向记录 */
  useEffect(() => {
    if (currentIndex !== lastIndexRef.current) {
      setDirection(currentIndex > lastIndexRef.current ? 1 : -1)
      lastIndexRef.current = currentIndex
    }
  }, [currentIndex])

  const goTo = useCallback(
    (index: number) => {
      if (!docs || index < 0 || index >= docs.length) return
      navigate(`/agent/${encodeDocPath(docs[index].path)}`)
    },
    [docs, navigate],
  )
  const goPrev = useCallback(() => goTo(currentIndex - 1), [goTo, currentIndex])
  const goNext = useCallback(() => goTo(currentIndex + 1), [goTo, currentIndex])

  /* 章节正文加载（带缓存） */
  useEffect(() => {
    if (!currentDoc || docNotFound) {
      if (docNotFound) setLoading(false)
      return
    }
    const cached = contentCache.current.get(currentDoc.path)
    if (cached !== undefined) {
      setContent(cached)
      setContentError(null)
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setContentError(null)
    fetch(`/data/agent-docs/${encodeFetchPath(currentDoc.path)}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.text()
      })
      .then((text) => {
        if (cancelled) return
        const cleaned = stripFrontmatter(text)
        contentCache.current.set(currentDoc.path, cleaned)
        setContent(cleaned)
        setLoading(false)
      })
      .catch((e: Error) => {
        if (cancelled) return
        setContentError(e.message)
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [currentDoc])

  /* 翻页后书页滚回顶部 */
  useEffect(() => {
    if (!paperRef.current) return
    const top =
      paperRef.current.getBoundingClientRect().top + window.scrollY - 76
    window.scrollTo({ top: Math.max(top, 0), behavior: 'instant' as ScrollBehavior })
    progressMV.set(0)
  }, [currentIndex, progressMV])

  /* 阅读进度（章节内 scroll） */
  useEffect(() => {
    const onScroll = () => {
      const el = paperRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const scrollable = el.offsetHeight - window.innerHeight + 76
      if (scrollable <= 0) {
        progressMV.set(1)
        return
      }
      const passed = Math.min(Math.max(-rect.top + 76, 0), scrollable)
      progressMV.set(passed / scrollable)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [currentIndex, loading, progressMV])

  /* 键盘 ←/→ 翻页 */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === 'ArrowLeft') goPrev()
      else if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goPrev, goNext])

  /* 移动端左右滑动翻页 */
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(dx) < 80) return
    if (dx < 0) goNext()
    else goPrev()
  }

  /* ---------------- 渲染 ---------------- */

  if (indexError) {
    return (
      <div className="mx-auto max-w-[1200px] px-4 py-16 md:px-6">
        <BookHeader />
        <div className="mt-6 border-[3px] border-ink bg-paper shadow-hard-lg">
          <ErrorBlock
            message={`目录清单加载失败：${indexError}`}
            onHome={() => window.location.assign('/agent')}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="pb-0 pt-8 md:pt-12">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <BookHeader />

        {/* 阅读器主体 */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* 左侧目录（桌面） */}
          <motion.aside
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1, ease: EASE }}
            className="sticky top-[88px] hidden max-h-[calc(100vh-120px)] overflow-y-auto border-[3px] border-ink bg-paper p-4 shadow-hard lg:block"
          >
            {docs ? (
              <TableOfContents
                docs={docs}
                currentIndex={currentIndex}
                onSelect={goTo}
              />
            ) : (
              <p className="blink-arcade py-8 text-center font-vt text-[18px] text-faint">
                LOADING...
              </p>
            )}
          </motion.aside>

          {/* 右侧书页 */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2, ease: EASE }}
            className="min-w-0"
          >
            {/* 移动端目录按钮 */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="mb-4 flex w-full items-center gap-2 border-2 border-ink bg-paper px-3 py-2.5 text-left shadow-hard-sm active:translate-x-[2px] active:translate-y-[2px] lg:hidden"
            >
              <Menu size={16} className="shrink-0" />
              <span className="min-w-0 flex-1 truncate font-kuaile text-[15px] text-ink">
                目录 · {currentDoc ? cleanTitle(currentDoc.title) : '加载中'}
              </span>
            </button>

            {/* 阅读进度条 */}
            <div className="sticky top-16 z-10 mb-0 h-1 w-full border-2 border-b-0 border-ink bg-paper">
              <motion.div
                className="h-full origin-left bg-arcade-blue"
                style={{ scaleX: progressMV }}
              />
            </div>

            {/* 纸张容器 */}
            <div
              ref={paperRef}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              className="border-[3px] border-ink bg-grid-paper px-5 py-8 shadow-hard-lg md:px-12 md:py-10"
              style={{ perspective: 1200 }}
            >
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                <motion.div
                  key={currentDoc?.path ?? 'empty'}
                  custom={direction}
                  variants={pageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  {loading || !docs ? (
                    <LoadingBlock />
                  ) : docNotFound ? (
                    <ErrorBlock
                      title="章节未找到 · 404"
                      message={`没有找到「${docPath}」对应的章节，它可能已被移动或改名。你可以返回电子书主目录重新选择。`}
                      onHome={() => navigate('/agent')}
                    />
                  ) : contentError ? (
                    <ErrorBlock
                      message={contentError}
                      onHome={() => navigate('/agent')}
                    />
                  ) : currentDoc ? (
                    <>
                      {/* 书页楣 */}
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="font-silk text-[10px] tracking-[2px] text-arcade-blue">
                          CHAPTER {pad(currentIndex + 1)}
                        </span>
                        <span className="font-vt text-[20px] leading-none text-ink">
                          PAGE {pad(currentIndex + 1)} / {total}
                        </span>
                        <span className="text-[12px] text-faint">
                          {kb(currentDoc.size_bytes)} · MARKDOWN
                        </span>
                      </div>
                      <div className="relative mt-3 h-[3px] bg-ink">
                        <span className="absolute left-0 top-1/2 h-[6px] w-16 -translate-y-1/2 bg-arcade-blue" />
                      </div>

                      {/* 章节标题 + 摘要 */}
                      <motion.h2
                        key={`title-${currentDoc.path}`}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.35, ease: EASE }}
                        className="mt-6 font-kuaile text-[26px] leading-[1.25] text-ink md:text-[34px]"
                      >
                        {cleanTitle(currentDoc.title)}
                      </motion.h2>
                      <p className="mt-2 text-[14px] leading-relaxed text-faint">
                        {cleanSummary(currentDoc.summary)}
                      </p>

                      {/* Markdown 正文 */}
                      <div className="mx-auto mt-8 max-w-[720px]">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={mdComponents}
                        >
                          {content ?? ''}
                        </ReactMarkdown>

                        {/* 章末下一章预告 */}
                        <ChapterEndCard
                          nextDoc={nextDoc}
                          nextIndex={currentIndex + 1}
                          total={total}
                          onNext={goNext}
                        />
                      </div>
                    </>
                  ) : null}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* 底部像素翻页器 */}
            <div className="mt-6">
              <Pager
                currentIndex={currentIndex}
                total={total}
                onPrev={goPrev}
                onNext={goNext}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* S3 数据来源条 */}
      <div className="mt-12">
        <DataSourceStrip />
      </div>

      {/* 移动端目录抽屉 */}
      {docs && (
        <MobileTocDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          docs={docs}
          currentIndex={currentIndex}
          onSelect={goTo}
        />
      )}
    </div>
  )
}
