import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Play, X } from 'lucide-react'
import { RESOURCE_GROUPS } from '../data/resources'
import type { ResourceGroup, ResourceItem } from '../data/resources'

const EASE = [0.2, 0.9, 0.3, 1] as [number, number, number, number]
const PURPLE = '#8B7CF6'

/* ---------------- S1 页头 ---------------- */
function ResourcesHeader() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 pt-12 md:px-6 md:pt-16">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="relative flex flex-col gap-8 border-[3px] border-ink bg-paper p-6 md:flex-row md:items-center md:justify-between md:p-10"
        style={{ boxShadow: `8px 8px 0 ${PURPLE}` }}
      >
        {/* 左：楣板 + 标题 */}
        <div>
          <p className="font-silk text-[10px] tracking-[2px] text-[#8B7CF6]">
            GOOD RESOURCES
          </p>
          <h1 className="mt-2 font-kuaile text-[30px] leading-[1.15] text-ink md:text-[34px]">
            好资源 · <span className="hl-yellow px-1">弹药补给站</span>
          </h1>
          <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-body">
            外面世界的好东西也要搬回来：
            <span className="hl-yellow px-1">开源模型社区</span>、真实调用流量榜、
            业界热门 Leaderboard。站内一键预览，跳原站直达。
          </p>
        </div>

        {/* 右：VT323 三联统计 */}
        <div className="grid grid-cols-3 gap-4 border-t-2 border-dashed border-hairline pt-5 md:border-l-[3px] md:border-t-0 md:border-ink md:pl-8 md:pt-0">
          {[
            { n: '07', en: 'RESOURCES', cn: '资源' },
            { n: '03', en: 'CATEGORIES', cn: '分类' },
            { n: '100%', en: 'FREE & DIRECT', cn: '免费直达' },
          ].map((s) => (
            <div key={s.en} className="text-center md:text-left">
              <span className="font-vt text-[40px] leading-none text-ink">
                {s.n}
              </span>
              <p className="mt-1 font-silk text-[9px] tracking-[2px] text-[#8B7CF6]">
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
          style={{ backgroundColor: PURPLE }}
          aria-hidden
        />
      </motion.div>
    </section>
  )
}

/* ---------------- 资源卡片 ---------------- */
function ResourceCard({
  item,
  no,
  onPreview,
}: {
  item: ResourceItem
  no: string
  onPreview: (item: ResourceItem) => void
}) {
  return (
    <motion.article
      variants={{
        hidden: { y: 40, opacity: 0 },
        show: { y: 0, opacity: 1, transition: { duration: 0.4, ease: EASE } },
      }}
      className="group relative flex flex-col border-[3px] border-ink bg-paper p-5 shadow-hard transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_#8B7CF6]"
    >
      {/* 序号 + 资源名 */}
      <div className="flex items-start gap-3">
        <span className="font-vt text-[44px] leading-[0.9] text-ink/90">
          {no}
        </span>
        <h3 className="mt-1 font-kuaile text-[19px] leading-snug text-ink">
          {item.name}
        </h3>
      </div>

      {/* 简介 */}
      <p className="mt-3 flex-1 text-[13px] leading-relaxed text-body">
        {item.desc}
      </p>

      {/* tags */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {item.tags.map((t) => (
          <span
            key={t}
            className="border-2 border-ink bg-hall px-1.5 py-px font-sans text-[11px] leading-[1.6] text-body"
          >
            {t}
          </span>
        ))}
      </div>

      {/* 按钮 */}
      <div className="mt-4 flex gap-3">
        <button
          onClick={() => onPreview(item)}
          className="inline-flex flex-1 items-center justify-center gap-1.5 border-2 border-ink bg-arcade-blue px-3 py-2 font-kuaile text-sm tracking-[1px] text-white shadow-hard-sm transition-all duration-150 hover:bg-[#3D74FF] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          <Play size={13} strokeWidth={2.5} />
          站内预览
        </button>
        <a
          href={item.url}
          target="_blank"
          rel="noopener"
          className="inline-flex flex-1 items-center justify-center gap-1.5 border-2 border-ink bg-arcade-yellow px-3 py-2 font-kuaile text-sm tracking-[1px] text-ink shadow-hard-sm transition-all duration-150 hover:bg-arcade-yellow-soft active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          <ExternalLink size={13} strokeWidth={2.5} />
          跳原站
        </a>
      </div>
    </motion.article>
  )
}

/* ---------------- 分组区块 ---------------- */
function GroupSection({
  group,
  startIndex,
  onPreview,
}: {
  group: ResourceGroup
  startIndex: number
  onPreview: (item: ResourceItem) => void
}) {
  return (
    <section className="mx-auto mt-16 max-w-[1200px] px-4 md:mt-24 md:px-6">
      {/* 组标题 */}
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="flex items-center gap-3"
      >
        <span
          className="h-5 w-5 shrink-0 border-2 border-ink"
          style={{ backgroundColor: group.color }}
          aria-hidden
        />
        <h2 className="font-kuaile text-[24px] leading-none text-ink md:text-[28px]">
          {group.title}
        </h2>
        <span className="hidden font-silk text-[10px] tracking-[2px] text-faint sm:block">
          {group.titleEn}
        </span>
        <span className="ml-auto font-vt text-[24px] leading-none text-faint">
          ×{String(group.items.length).padStart(2, '0')}
        </span>
      </motion.div>

      {/* 卡片网格 */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        className={`mt-6 grid grid-cols-1 gap-6 ${
          group.items.length > 2 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2'
        }`}
      >
        {group.items.map((item, i) => (
          <ResourceCard
            key={item.id}
            item={item}
            no={String(startIndex + i + 1).padStart(2, '0')}
            onPreview={onPreview}
          />
        ))}
      </motion.div>
    </section>
  )
}

/* ---------------- S4 站内预览全屏模态 ---------------- */
function PreviewModal({
  item,
  onClose,
}: {
  item: ResourceItem | null
  onClose: () => void
}) {
  // Esc 关闭
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // body 滚动锁
  useEffect(() => {
    if (item) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [item])

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          key="resource-preview"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="fixed inset-0 z-[90] flex flex-col bg-paper"
        >
          {/* 顶部黑底工具栏 */}
          <div className="flex h-14 shrink-0 items-center gap-3 border-b-[3px] border-ink bg-ink px-4">
            <span
              className="hidden h-4 w-4 shrink-0 border-2 border-white sm:block"
              style={{ backgroundColor: PURPLE }}
              aria-hidden
            />
            <p className="min-w-0 flex-1 truncate font-kuaile text-base text-white">
              {item.name}
              <span className="ml-2 hidden font-vt text-sm text-[#8A90A0] md:inline">
                {item.url}
              </span>
            </p>
            <a
              href={item.url}
              target="_blank"
              rel="noopener"
              className="inline-flex shrink-0 items-center gap-1.5 border-2 border-ink bg-arcade-yellow px-3 py-1.5 font-kuaile text-sm tracking-[1px] text-ink transition-all duration-150 hover:bg-arcade-yellow-soft active:translate-x-[2px] active:translate-y-[2px]"
            >
              <ExternalLink size={13} strokeWidth={2.5} />
              跳原站
            </a>
            <button
              onClick={onClose}
              aria-label="关闭预览"
              className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-white bg-ink text-white transition-colors duration-150 hover:bg-arcade-red"
            >
              <X size={16} />
            </button>
          </div>

          {/* 常驻浅黄提示条 */}
          <div className="shrink-0 border-b-2 border-ink bg-[#FFF3D6] px-4 py-1.5 text-center text-[12px] text-ink">
            部分网站禁止内嵌显示（X-Frame-Options），若空白请点击
            <a
              href={item.url}
              target="_blank"
              rel="noopener"
              className="mx-1 border-b-2 border-ink font-kuaile text-arcade-blue hover:text-ink"
            >
              ↗ 跳原站
            </a>
            查看
          </div>

          {/* iframe 主体 */}
          <iframe
            key={item.id}
            src={item.url}
            title={`${item.name} 站内预览`}
            className="w-full flex-1 border-0 bg-white"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ---------------- S5 页尾来源说明条 ---------------- */
function ResourcesFooter() {
  return (
    <motion.section
      initial={{ y: 60, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="mt-16 border-y-[3px] border-ink bg-ink py-12 text-center md:mt-24"
    >
      <p className="px-4 font-kuaile text-[22px] leading-snug text-white md:text-[28px]">
        好资源 <span className="hl-yellow px-2">持续补给</span> 中
      </p>
      <p className="mt-3 px-4 text-[13px] text-[#8A90A0]">
        榜单会更新，弹药会补充，常回来看看。
      </p>
      <p className="mt-8 px-4 font-silk text-[9px] tracking-[2px] text-[#8A90A0]">
        CURATED BY MOMOZI · UPDATING · POWERED BY ZHIAI.ARCADE
      </p>
    </motion.section>
  )
}

/* ---------------- 页面组装 ---------------- */
export default function Resources() {
  const [preview, setPreview] = useState<ResourceItem | null>(null)

  // 每组起始序号（全局 01-07 连续编号）
  const starts: number[] = []
  let acc = 0
  for (const g of RESOURCE_GROUPS) {
    starts.push(acc)
    acc += g.items.length
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <ResourcesHeader />
      {RESOURCE_GROUPS.map((g, i) => (
        <GroupSection
          key={g.id}
          group={g}
          startIndex={starts[i]}
          onPreview={setPreview}
        />
      ))}
      <ResourcesFooter />
      <PreviewModal item={preview} onClose={() => setPreview(null)} />
    </motion.div>
  )
}
