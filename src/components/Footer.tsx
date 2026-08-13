import { Link } from 'react-router'
import { SocialButtons } from './Navbar'

const FOOTER_LINKS = [
  { to: '/', label: '首页' },
  { to: '/agent', label: 'Agent知识' },
  { to: '/tree', label: '知识树' },
  { to: '/skills', label: 'Skill精品' },
  { to: '/prompts', label: 'Prompt精品' },
]

export default function Footer() {
  return (
    <footer className="border-t-[3px] border-arcade-yellow bg-ink text-white">
      <div className="mx-auto grid max-w-[1200px] gap-8 px-4 py-12 md:grid-cols-3 md:px-6">
        {/* 左：品牌 */}
        <div>
          <div className="flex items-center gap-2.5">
            <img src="/logo-zhiai.svg" alt="知 AI" width={28} height={28} />
            <span className="font-kuaile text-[26px]">知 AI</span>
          </div>
          <p className="mt-3 text-sm text-[#8A90A0]">
            知 AI — MOMOZI 的 Agent 知识库
          </p>
          <p className="mt-1 font-silk text-[9px] tracking-[2px] text-[#8A90A0]">
            ZHIAI.ARCADE
          </p>
        </div>

        {/* 中：页面链接 */}
        <nav className="flex flex-col gap-2 md:items-center">
          {FOOTER_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="w-fit font-kuaile text-base text-white transition-colors hover:text-arcade-yellow"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* 右：社交图标 */}
        <div className="md:justify-self-end">
          <p className="mb-3 font-silk text-[10px] tracking-[2px] text-[#8A90A0]">
            FOLLOW MOMOZI
          </p>
          <SocialButtons />
        </div>
      </div>

      <div className="border-t border-[#23242C]">
        <p className="mx-auto max-w-[1200px] px-4 py-5 text-center text-xs text-[#8A90A0] md:px-6">
          © 2026 MOMOZI · 内容源自 awesome-ai-knowledge / awesome-ai-persona-skills
          · POWERED BY ZHIAI.ARCADE
        </p>
      </div>
    </footer>
  )
}
