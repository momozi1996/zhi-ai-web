import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { ExternalLink, Play, X } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { SOCIALS, SocialButtons } from '../components/Navbar'

/* ------------------------------------------------------------------ */
/* 常量与类型                                                          */
/* ------------------------------------------------------------------ */

const EASE = [0.2, 0.9, 0.3, 1] as [number, number, number, number]

interface Article {
  id: number
  title: string
  account: string
  date: string
  summary: string
  original_url: string
  cover: string
  file: string
  word_count: number
}

interface Author {
  name: string
  bio: string
  tags: string[]
  github: string
  blog: string
  xiaohongshu: string
}

const TAG_CHIP_STYLES = [
  'bg-arcade-blue text-white',
  'bg-arcade-yellow text-ink',
  'bg-arcade-red text-white',
  'bg-arcade-green text-white',
]

const pad = (n: number) => String(n).padStart(2, '0')

/** 去掉 md 开头的一级标题（模态头部已展示标题） */
const stripLeadingH1 = (md: string) => md.replace(/^#\s+.*(\n+|$)/, '')

const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const staggerItem: Variants = {
  hidden: { y: 40, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5, ease: EASE } },
}

/* ------------------------------------------------------------------ */
/* Markdown 渲染样式（参照 AgentBook：黑底代码块 / 黄条引用 / 表格）   */
/* ------------------------------------------------------------------ */

const mdComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mb-4 mt-10 flex items-start gap-3 font-kuaile text-[28px] leading-[1.3] text-ink">
      <span className="mt-2.5 h-2.5 w-2.5 shrink-0 border-2 border-ink bg-arcade-red" />
      <span>{children}</span>
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-4 mt-10 flex items-start gap-3 font-kuaile text-[26px] leading-[1.3] text-ink">
      <span className="mt-2.5 h-2 w-2 shrink-0 border-2 border-ink bg-arcade-red" />
      <span>{children}</span>
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-3 mt-8 font-kuaile text-[20px] leading-[1.35] text-ink">
      <span className="mr-2 text-arcade-red">▸</span>
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
      <span className="mt-[9px] h-2 w-2 shrink-0 border border-ink bg-arcade-red" />
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
      className="my-6 max-w-full border-[3px] border-ink shadow-hard"
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
    <pre className="relative my-6 overflow-x-auto border-[3px] border-ink bg-ink px-4 pb-4 pt-8 font-mono text-[13.5px] leading-[1.7] text-[#E8EAF2] shadow-hard-red">
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
/* S1 页头 BlogHeader                                                  */
/* ------------------------------------------------------------------ */

function BlogHeader({ total }: { total: number }) {
  return (
    <motion.section
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="relative border-[3px] border-ink bg-paper p-5 shadow-hard-red md:p-8"
    >
      {/* 红底 NEW 贴纸 */}
      <span className="absolute -right-3 -top-3 inline-block -rotate-6">
        <span className="sticker sway bg-arcade-red text-white shadow-hard-sm">
          NEW
        </span>
      </span>

      <p className="font-silk text-[10px] tracking-[2px] text-arcade-red">
        MOMOZI&apos;S BLOG
      </p>
      <h1 className="mt-3 font-kuaile text-[30px] leading-[1.15] tracking-[2px] text-ink md:text-[42px]">
        MOMOZI 的<span className="hl-yellow">博客</span>
      </h1>
      <p className="mt-3 max-w-2xl text-[15.5px] leading-[1.85] text-body">
        公众号「momo子讲AI」精选长文搬运站：Agent 实战、开源项目、AI
        编程与行业观察，站内可直接预览全文。
      </p>

      {/* VT323 统计 */}
      <div className="mt-6 grid grid-cols-3 gap-3 md:max-w-xl">
        <div className="border-2 border-ink bg-hall px-3 py-2 shadow-hard-sm">
          <p className="font-vt text-[32px] leading-none text-ink md:text-[40px]">
            {pad(total)}
          </p>
          <p className="mt-1 font-silk text-[9px] tracking-[2px] text-faint">
            ARTICLES
          </p>
          <p className="text-[12px] text-faint">精选文章</p>
        </div>
        <div className="border-2 border-ink bg-hall px-3 py-2 shadow-hard-sm">
          <p className="font-vt text-[32px] leading-none text-ink md:text-[40px]">
            01
          </p>
          <p className="mt-1 font-silk text-[9px] tracking-[2px] text-faint">
            WECHAT
          </p>
          <p className="text-[12px] text-faint">公众号 momo子讲AI</p>
        </div>
        <div className="border-2 border-ink bg-hall px-3 py-2 shadow-hard-sm">
          <p className="font-vt text-[32px] leading-none text-arcade-red md:text-[40px]">
            ∞
          </p>
          <p className="mt-1 font-silk text-[9px] tracking-[2px] text-faint">
            STATUS
          </p>
          <p className="text-[12px] text-faint">持续更新中</p>
        </div>
      </div>
    </motion.section>
  )
}

/* ------------------------------------------------------------------ */
/* S2 作者简介卡 AuthorCard                                            */
/* ------------------------------------------------------------------ */

function AuthorCard({ author }: { author: Author }) {
  return (
    <motion.section
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="mt-12"
    >
      <div className="border-[3px] border-ink bg-paper p-5 shadow-hard md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-start">
          {/* 作者图标 */}
          <motion.div
            initial={{ rotate: -4 }}
            whileInView={{ rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 260, damping: 14 }}
            className="flex h-20 w-20 shrink-0 items-center justify-center border-[3px] border-ink bg-arcade-yellow shadow-hard"
          >
            <img src="/icon-author.svg" alt="MOMOZI" width={48} height={48} />
          </motion.div>

          <div className="min-w-0 flex-1">
            <p className="font-silk text-[10px] tracking-[2px] text-arcade-red">
              AUTHOR CARD · 作者简介
            </p>
            <h2 className="mt-1 font-kuaile text-[26px] leading-[1.25] text-ink">
              {author.name}
            </h2>
            <p className="mt-3 text-justify text-[14px] leading-[1.85] text-body">
              {author.bio}
            </p>

            {/* tags 彩色 chips */}
            <div className="mt-4 flex flex-wrap gap-2">
              {author.tags.map((t, i) => (
                <span
                  key={t}
                  className={`border-2 border-ink px-2 py-0.5 font-kuaile text-[12px] leading-[1.6] shadow-hard-sm ${TAG_CHIP_STYLES[i % TAG_CHIP_STYLES.length]}`}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 社交按钮：GitHub / 小红书 / 作者主页 */}
        <div className="mt-6 flex flex-wrap items-center gap-3 border-t-[3px] border-ink pt-5">
          <span className="font-silk text-[10px] tracking-[2px] text-faint">
            FOLLOW MOMOZI
          </span>
          <div className="flex flex-wrap gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.key}
                href={s.href}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 border-2 border-ink bg-paper px-3 py-1.5 font-kuaile text-[13px] text-ink shadow-hard-sm transition-all duration-150 hover:bg-arcade-yellow active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                {s.node}
                {s.label}
              </a>
            ))}
          </div>
          <SocialButtons className="ml-auto hidden sm:flex" />
        </div>
      </div>
    </motion.section>
  )
}

/* ------------------------------------------------------------------ */
/* S3 文章卡片 ArticleCard                                             */
/* ------------------------------------------------------------------ */

function ArticleCard({
  article,
  onPreview,
}: {
  article: Article
  onPreview: (a: Article) => void
}) {
  return (
    <motion.article
      variants={staggerItem}
      className="relative flex flex-col border-[3px] border-ink bg-paper p-5 shadow-hard transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg"
    >
      {/* 贴纸标签 */}
      <span className="absolute -left-2 -top-3 inline-block -rotate-3">
        <span className="sticker bg-arcade-red text-white shadow-hard-sm">
          WECHAT PICK
        </span>
      </span>

      <div className="flex items-start justify-between gap-3">
        <span className="font-vt text-[40px] leading-none text-ink">
          {pad(article.id)}
        </span>
        {/* 字数徽章 */}
        <span className="border-2 border-ink bg-arcade-yellow px-2 py-0.5 font-vt text-[16px] leading-none text-ink shadow-hard-sm">
          {article.word_count.toLocaleString()} 字
        </span>
      </div>

      <h3 className="mt-3 line-clamp-3 font-kuaile text-[18px] leading-[1.4] text-ink">
        {article.title}
      </h3>

      <p className="mt-2 text-[12px] text-faint">
        公众号 <span className="font-kuaile text-ink">「{article.account}」</span>
        <span className="mx-1.5">·</span>
        <span className="font-vt text-[14px]">{article.date}</span>
      </p>

      <p className="mt-3 line-clamp-4 flex-1 text-justify text-[13.5px] leading-[1.8] text-body">
        {article.summary}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onPreview(article)}
          className="inline-flex items-center justify-center gap-1.5 border-2 border-ink bg-arcade-blue px-2 py-2 font-kuaile text-[14px] tracking-[1px] text-white shadow-hard transition-all duration-150 active:translate-x-[3px] active:translate-y-[3px] active:shadow-hard-press"
        >
          <Play size={14} />
          站内预览
        </button>
        <a
          href={article.original_url}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center justify-center gap-1.5 border-2 border-ink bg-arcade-yellow px-2 py-2 font-kuaile text-[14px] tracking-[1px] text-ink shadow-hard transition-all duration-150 active:translate-x-[3px] active:translate-y-[3px] active:shadow-hard-press"
        >
          <ExternalLink size={14} />
          阅读原文
        </a>
      </div>
    </motion.article>
  )
}

/* ------------------------------------------------------------------ */
/* S4 站内预览模态 ReaderModal                                         */
/* ------------------------------------------------------------------ */

function ReaderModal({
  article,
  onClose,
}: {
  article: Article
  onClose: () => void
}) {
  const [content, setContent] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

  /* 拉取 markdown 全文 */
  useEffect(() => {
    let alive = true
    fetch(`/data/blog/${article.file}`)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.text()
      })
      .then((t) => {
        if (alive) setContent(stripLeadingH1(t))
      })
      .catch(() => {
        if (alive) setFailed(true)
      })
    return () => {
      alive = false
    }
  }, [article])

  /* Esc 关闭 + body 滚动锁 */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[70] flex items-stretch justify-center bg-ink/70 md:items-center md:p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="flex h-full w-full max-w-4xl flex-col border-[3px] border-ink bg-paper shadow-hard-red md:h-[85vh]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* 顶部信息栏 */}
        <div className="flex items-start gap-3 border-b-[3px] border-ink bg-paper p-4 md:p-5">
          <div className="min-w-0 flex-1">
            <p className="font-silk text-[9px] tracking-[2px] text-arcade-red">
              NOW READING · 站内预览
            </p>
            <h3 className="mt-1 line-clamp-2 font-kuaile text-[16px] leading-[1.4] text-ink md:text-[18px]">
              {article.title}
            </h3>
            <p className="mt-1.5 text-[12px] text-faint">
              公众号 <span className="font-kuaile text-ink">「{article.account}」</span>
              <span className="mx-1.5">·</span>
              <span className="font-vt text-[14px]">{article.date}</span>
            </p>
          </div>
          <a
            href={article.original_url}
            target="_blank"
            rel="noopener"
            className="hidden shrink-0 items-center gap-1.5 border-2 border-ink bg-arcade-yellow px-3 py-1.5 font-kuaile text-[13px] text-ink shadow-hard-sm transition-all duration-150 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none sm:inline-flex"
          >
            <ExternalLink size={13} />
            阅读原文
          </a>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭预览"
            className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-ink bg-paper text-ink shadow-hard-sm transition-all duration-150 hover:bg-arcade-red hover:text-white active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            <X size={16} />
          </button>
        </div>

        {/* 正文区 */}
        <div className="flex-1 overflow-y-auto bg-grid-paper px-4 py-6 md:px-8">
          {failed ? (
            <div className="border-2 border-ink bg-[#FFF0EE] p-4 text-[14px] text-body shadow-hard-sm">
              文章加载失败，请试试
              <a
                href={article.original_url}
                target="_blank"
                rel="noopener"
                className="mx-1 text-arcade-blue underline decoration-2 underline-offset-2"
              >
                阅读原文
              </a>
              。
            </div>
          ) : content === null ? (
            <p className="blink-arcade py-16 text-center font-vt text-[28px] text-ink">
              LOADING...
            </p>
          ) : (
            <div className="mx-auto max-w-[720px]">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                {content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* S5 页尾来源条 SourceStrip                                           */
/* ------------------------------------------------------------------ */

function SourceStrip() {
  return (
    <motion.section
      initial={{ y: 60, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="mt-16"
    >
      <div className="border-[3px] border-ink bg-ink p-6 text-white shadow-hard-yellow md:p-8">
        <p className="font-silk text-[10px] tracking-[2px] text-arcade-yellow">
          SOURCE · WECHAT OFFICIAL ACCOUNT
        </p>
        <h2 className="mt-2 font-kuaile text-[24px] leading-[1.3] md:text-[30px]">
          公众号<span className="hl-yellow">「momo子讲AI」</span>精选 · 持续更新
        </h2>
        <p className="mt-3 max-w-3xl text-[14px] leading-[1.85] text-[#C9CDD8]">
          以上文章均转载自 MOMOZI 的微信公众号「momo子讲AI」。微信搜索公众号
          <span className="font-kuaile text-white"> momo子讲AI </span>
          关注后第一时间获取 AI Agent 实战长文；小红书搜索
          <span className="font-kuaile text-white"> MOMOZI </span>
          解锁更多 AI 干货与开源项目动态。
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href="https://www.xiaohongshu.com/user/profile/5ae3553911be1017b6d62eaa"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 border-2 border-ink bg-arcade-yellow px-4 py-2 font-kuaile text-[15px] tracking-[1px] text-ink shadow-hard transition-all duration-150 active:translate-x-[3px] active:translate-y-[3px] active:shadow-hard-press"
          >
            <img src="/icon-xhs.svg" alt="小红书" width={16} height={16} />
            小红书关注 MOMOZI
          </a>
          <a
            href="https://momozi1996.github.io/"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 border-2 border-white bg-ink px-4 py-2 font-kuaile text-[15px] tracking-[1px] text-white shadow-hard transition-all duration-150 hover:bg-[#1A1B22] active:translate-x-[3px] active:translate-y-[3px] active:shadow-hard-press"
          >
            <img src="/icon-author.svg" alt="作者主页" width={16} height={16} />
            作者主页
          </a>
        </div>
      </div>
    </motion.section>
  )
}

/* ------------------------------------------------------------------ */
/* 页面主组件 Blog                                                     */
/* ------------------------------------------------------------------ */

export default function Blog() {
  const [articles, setArticles] = useState<Article[] | null>(null)
  const [author, setAuthor] = useState<Author | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [reading, setReading] = useState<Article | null>(null)

  useEffect(() => {
    let alive = true
    Promise.all([
      fetch('/data/blog/articles.json').then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<Article[]>
      }),
      fetch('/data/blog/author.json').then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<Author>
      }),
    ])
      .then(([arts, auth]) => {
        if (!alive) return
        setArticles(arts)
        setAuthor(auth)
      })
      .catch(() => {
        if (alive) setLoadError(true)
      })
    return () => {
      alive = false
    }
  }, [])

  const openReader = useCallback((a: Article) => setReading(a), [])
  const closeReader = useCallback(() => setReading(null), [])

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 md:px-6 md:py-16">
      {/* S1 页头 */}
      <BlogHeader total={articles?.length ?? 5} />

      {/* S2 作者简介卡 */}
      {author && <AuthorCard author={author} />}

      {/* S3 精选好文区 */}
      <section className="mt-16">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <p className="font-silk text-[10px] tracking-[2px] text-arcade-red">
            WECHAT PICKS · 微信公众号精选
          </p>
          <h2 className="mt-2 flex items-center gap-3 font-kuaile text-[30px] leading-[1.15] text-ink md:text-[42px]">
            <span className="h-3 w-3 shrink-0 border-2 border-ink bg-arcade-red" />
            精选好文
          </h2>
        </motion.div>

        {loadError ? (
          <div className="mt-6 border-2 border-ink bg-[#FFF0EE] p-4 text-[14px] text-body shadow-hard-sm">
            文章列表加载失败，请刷新重试。
          </div>
        ) : articles === null ? (
          <p className="blink-arcade mt-10 text-center font-vt text-[28px] text-ink">
            LOADING...
          </p>
        ) : (
          <motion.div
            variants={staggerParent}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="mt-8 grid gap-8 md:grid-cols-2 md:gap-6 lg:grid-cols-3"
          >
            {articles.map((a) => (
              <ArticleCard key={a.id} article={a} onPreview={openReader} />
            ))}
          </motion.div>
        )}
      </section>

      {/* S5 页尾来源条 */}
      <SourceStrip />

      {/* S4 站内预览模态 */}
      <AnimatePresence>
        {reading && <ReaderModal article={reading} onClose={closeReader} />}
      </AnimatePresence>
    </div>
  )
}
