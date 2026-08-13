import { memo, useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Copy, Github, Mail, Menu, MessageSquare, X } from 'lucide-react'

type NavBadgeKind = 'NEW' | 'HOT'

const NAV_LINKS: { to: string; label: string; color: string; badge?: NavBadgeKind }[] = [
  { to: '/', label: '首页', color: '#0B0B0F' },
  { to: '/blog', label: 'MOMOZI的博客', color: '#F04438', badge: 'NEW' },
  { to: '/agent', label: 'Agent知识', color: '#1E5EFF', badge: 'HOT' },
  { to: '/tree', label: '知识树', color: '#F04438' },
  { to: '/harness', label: 'Harness', color: '#F26102' },
  { to: '/skills', label: 'Skill精品', color: '#FFC53D' },
  { to: '/prompts', label: 'Prompt精品', color: '#22B07D' },
  { to: '/resources', label: '好资源', color: '#8B7CF6' },
]

const BADGE_STYLE: Record<NavBadgeKind, string> = {
  NEW: 'bg-arcade-red text-white',
  HOT: 'bg-arcade-yellow text-ink',
}

/** 导航角标：10px Silkscreen、2px 黑边、-6° 倾斜 + 1.5s 摇摆 */
const NavBadge = memo(function NavBadge({ text }: { text: NavBadgeKind }) {
  return (
    <motion.span
      animate={{ rotate: [-6, -2, -6] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      className={`pointer-events-none absolute -top-2.5 left-full z-20 -ml-2.5 inline-block whitespace-nowrap border-2 border-ink px-1 py-px font-silk text-[10px] leading-none shadow-hard-sm ${BADGE_STYLE[text]}`}
    >
      {text}
    </motion.span>
  )
})

export const SOCIALS = [
  {
    key: 'github',
    href: 'https://github.com/momozi1996',
    label: 'GitHub',
    node: <Github size={16} strokeWidth={2.2} />,
  },
  {
    key: 'xhs',
    href: 'https://www.xiaohongshu.com/user/profile/5ae3553911be1017b6d62eaa',
    label: '小红书',
    node: <img src="/icon-xhs.svg" alt="小红书" width={16} height={16} />,
  },
  {
    key: 'author',
    href: 'https://momozi1996.github.io/',
    label: '作者主页',
    node: <img src="/icon-author.svg" alt="作者" width={16} height={16} />,
  },
]

export function SocialButtons({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {SOCIALS.map((s) => (
        <a
          key={s.key}
          href={s.href}
          target="_blank"
          rel="noopener"
          aria-label={s.label}
          title={s.label}
          className="flex h-7 w-7 items-center justify-center border-2 border-ink bg-paper text-ink transition-all duration-150 hover:bg-arcade-yellow active:translate-x-[2px] active:translate-y-[2px]"
        >
          {s.node}
        </a>
      ))}
    </div>
  )
}

const CONTACT_EMAIL = '523887518@qq.com'
const CONTACT_WECHAT = 'moyan-JQK'

/** 「交流」联系弹窗：白底 3px 黑边 + 8px 硬阴影，黑半透明遮罩，Esc/点遮罩关闭 */
function ContactModal({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState<'email' | 'wechat' | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const copy = async (key: 'email' | 'wechat', text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(key)
    window.setTimeout(() => setCopied(null), 1600)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/70 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="交流联系方式"
    >
      <motion.div
        initial={{ scale: 0.8, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.85, y: 20, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        className="relative max-h-[90vh] w-full max-w-[420px] overflow-y-auto border-[3px] border-ink bg-paper p-6 shadow-[8px_8px_0_#0B0B0F]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="关闭"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center border-2 border-ink bg-paper text-ink transition-colors hover:bg-arcade-yellow active:translate-x-[2px] active:translate-y-[2px]"
        >
          <X size={16} />
        </button>

        {/* 楣板 + 标题 */}
        <p className="font-silk text-[10px] tracking-[2px] text-arcade-red">
          LET&apos;S TALK
        </p>
        <h2 className="mt-2 font-kuaile text-[28px] leading-[1.15] tracking-[2px] text-ink">
          一起交流 <span className="hl-yellow">AI Agent</span>
        </h2>

        {/* 微信群二维码 */}
        <div className="mt-5 flex flex-col items-center">
          <img
            src="/wechat-qr.jpg"
            alt="微信群二维码"
            className="w-[280px] max-w-full border-2 border-ink"
          />
          <p className="mt-3 text-center text-[12px] leading-[1.7] text-faint">
            微信扫码进群 · 二维码定期更新，失效请加微信
          </p>
        </div>

        {/* 联系方式 */}
        <div className="mt-5 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2 border-2 border-ink bg-paper px-3 py-2.5 shadow-hard-sm">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="flex min-w-0 items-center gap-2.5 text-ink transition-colors hover:text-arcade-blue"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-ink bg-arcade-blue text-white">
                <Mail size={15} />
              </span>
              <span className="min-w-0">
                <span className="block font-silk text-[9px] tracking-[2px] text-faint">
                  EMAIL · 邮箱
                </span>
                <span className="block truncate font-mono text-[13px]">
                  {CONTACT_EMAIL}
                </span>
              </span>
            </a>
            <button
              onClick={() => copy('email', CONTACT_EMAIL)}
              className="flex shrink-0 items-center gap-1 border-2 border-ink bg-arcade-yellow px-2 py-1 font-kuaile text-[12px] text-ink shadow-hard-sm transition-transform active:translate-x-[2px] active:translate-y-[2px]"
            >
              {copied === 'email' ? <Check size={13} /> : <Copy size={13} />}
              {copied === 'email' ? '已复制' : '复制'}
            </button>
          </div>

          <div className="flex items-center justify-between gap-2 border-2 border-ink bg-paper px-3 py-2.5 shadow-hard-sm">
            <div className="flex min-w-0 items-center gap-2.5 text-ink">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-ink bg-arcade-green text-white">
                <MessageSquare size={15} />
              </span>
              <span className="min-w-0">
                <span className="block font-silk text-[9px] tracking-[2px] text-faint">
                  WECHAT · 微信号
                </span>
                <span className="block truncate font-mono text-[13px]">
                  {CONTACT_WECHAT}
                </span>
              </span>
            </div>
            <button
              onClick={() => copy('wechat', CONTACT_WECHAT)}
              className="flex shrink-0 items-center gap-1 border-2 border-ink bg-arcade-yellow px-2 py-1 font-kuaile text-[12px] text-ink shadow-hard-sm transition-transform active:translate-x-[2px] active:translate-y-[2px]"
            >
              {copied === 'wechat' ? <Check size={13} /> : <Copy size={13} />}
              {copied === 'wechat' ? '已复制' : '复制'}
            </button>
          </div>
        </div>

        {/* 社交入口 */}
        <div className="mt-5 flex items-center justify-center gap-3 border-t-2 border-ink pt-4">
          <span className="font-silk text-[9px] tracking-[2px] text-faint">
            FOLLOW
          </span>
          <SocialButtons />
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)

  return (
    <motion.header
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: [0.2, 0.9, 0.3, 1] }}
      className="sticky top-0 z-50 h-16 border-b-[3px] border-ink bg-paper"
    >
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-4 md:px-6">
        {/* 左侧 logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/logo-zhiai.svg" alt="知 AI" width={28} height={28} />
          <span className="font-kuaile text-[26px] leading-none">知 AI</span>
          <span className="hidden font-silk text-[9px] tracking-[2px] text-faint sm:block">
            ZHIAI.ARCADE
          </span>
        </Link>

        {/* 桌面导航链接 */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l, i) => (
            <motion.div
              key={l.to}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.05 }}
            >
              <NavLink
                to={l.to}
                end={l.to === '/'}
                className="group relative block px-3 py-2"
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`relative z-10 font-kuaile text-base tracking-wide transition-colors ${
                        isActive ? 'text-ink' : 'text-ink group-hover:text-ink'
                      }`}
                    >
                      {l.label}
                      {l.badge && <NavBadge text={l.badge} />}
                    </span>
                    {/* hover 黄底高亮条 */}
                    <span
                      className={`absolute inset-x-2 bottom-1 top-2 -z-0 origin-left bg-arcade-yellow transition-transform duration-150 ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                    {/* 当前页 3px 模块色短横条 */}
                    {isActive && (
                      <span
                        className="absolute inset-x-3 -bottom-[3px] h-[3px]"
                        style={{ backgroundColor: l.color }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </motion.div>
          ))}
          {/* 「交流」弹窗按钮 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 + NAV_LINKS.length * 0.05 }}
          >
            <button
              onClick={() => setContactOpen(true)}
              className="group relative block px-3 py-2"
            >
              <span className="relative z-10 font-kuaile text-base tracking-wide text-ink">
                交流
              </span>
              <span className="absolute inset-x-2 bottom-1 top-2 -z-0 origin-left scale-x-0 bg-arcade-yellow transition-transform duration-150 group-hover:scale-x-100" />
            </button>
          </motion.div>
        </nav>

        {/* 右端社交图标 + 汉堡 */}
        <div className="flex items-center gap-3">
          <SocialButtons className="hidden sm:flex" />
          <button
            className="flex h-8 w-8 items-center justify-center border-2 border-ink bg-paper lg:hidden active:translate-x-[2px] active:translate-y-[2px]"
            onClick={() => setOpen(true)}
            aria-label="打开菜单"
          >
            <Menu size={16} />
          </button>
        </div>
      </div>

      {/* 移动端全屏菜单 */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex flex-col bg-ink px-8 pb-10 pt-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img src="/logo-zhiai.svg" alt="知 AI" width={28} height={28} />
                <span className="font-kuaile text-[26px] text-white">知 AI</span>
              </div>
              <button
                className="flex h-8 w-8 items-center justify-center border-2 border-white bg-ink text-white"
                onClick={() => setOpen(false)}
                aria-label="关闭菜单"
              >
                <X size={16} />
              </button>
            </div>
            <nav className="mt-12 flex flex-col gap-5">
              {NAV_LINKS.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.25 }}
                >
                  <NavLink
                    to={l.to}
                    end={l.to === '/'}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `font-kuaile text-[32px] leading-none ${
                        isActive ? 'text-arcade-yellow' : 'text-white'
                      }`
                    }
                  >
                    <span className="relative inline-block">
                      {l.label}
                      {l.badge && <NavBadge text={l.badge} />}
                    </span>
                  </NavLink>
                </motion.div>
              ))}
              {/* 「交流」弹窗按钮：先收起菜单再弹窗 */}
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + NAV_LINKS.length * 0.06, duration: 0.25 }}
              >
                <button
                  onClick={() => {
                    setOpen(false)
                    setContactOpen(true)
                  }}
                  className="font-kuaile text-[32px] leading-none text-arcade-yellow"
                >
                  交流
                </button>
              </motion.div>
            </nav>
            <div className="mt-auto">
              <SocialButtons />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 「交流」联系弹窗 */}
      <AnimatePresence>
        {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
      </AnimatePresence>
    </motion.header>
  )
}
