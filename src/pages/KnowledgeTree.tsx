import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { RotateCcw, Maximize, X, BookOpen, ArrowRight } from 'lucide-react'
import * as echarts from 'echarts/core'
import { GraphChart } from 'echarts/charts'
import { LegendComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsCoreOption } from 'echarts/core'
import {
  categories,
  nodes,
  links,
  NODE_COUNT,
  LINK_COUNT,
  toDocUrl,
} from '../data/knowledge-graph'
import type { GraphNode } from '../data/knowledge-graph'

echarts.use([GraphChart, LegendComponent, TooltipComponent, CanvasRenderer])

const EASE = [0.2, 0.9, 0.3, 1] as [number, number, number, number]
const INK = '#0B0B0F'
const HUB_AGENT_CAT = '知识域 · 卷一'
const HUB_ENG_CAT = '知识域 · 卷二'
const ALL_CAT_NAMES = [...categories.map((c) => c.name), HUB_AGENT_CAT, HUB_ENG_CAT]

/** L1 hub 双层圆：白底 + 黑边圆环 + 内实心彩圆（SVG data URI 模拟） */
function hubSymbol(inner: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><circle cx="32" cy="32" r="28" fill="#FFFFFF" stroke="${INK}" stroke-width="4"/><circle cx="32" cy="32" r="17" fill="${inner}"/></svg>`
  return 'image://data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
}

const NODE_MAP = new Map(nodes.map((n) => [n.id, n]))

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
      const stepped = Math.round(p * 24) / 24
      setVal(Math.round(stepped * to))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to])
  return (
    <span ref={ref} className="font-vt text-[40px] leading-none text-ink md:text-[48px]">
      {val}
      {suffix}
    </span>
  )
}

/* ---------------- 图谱 ECharts option ---------------- */
function buildOption(): EChartsCoreOption {
  const data = nodes.map((n) => {
    const catIndex =
      n.level === 1
        ? n.domain === 'agent'
          ? categories.length
          : categories.length + 1
        : categories.findIndex((c) => c.name === n.cluster)

    const label =
      n.level === 1
        ? {
            show: true,
            position: 'bottom' as const,
            distance: 8,
            fontSize: 16,
            fontFamily: '"ZCOOL KuaiLe", "Noto Sans SC", sans-serif',
            color: INK,
            textBorderColor: '#FFFFFF',
            textBorderWidth: 3,
          }
        : n.level === 2
          ? {
              show: true,
              position: 'bottom' as const,
              distance: 5,
              fontSize: 13,
              fontFamily: '"ZCOOL KuaiLe", "Noto Sans SC", sans-serif',
              color: INK,
              textBorderColor: '#FFFFFF',
              textBorderWidth: 2,
            }
          : {
              show: true,
              position: 'right' as const,
              distance: 4,
              fontSize: 10,
              color: '#4A5164',
              textBorderColor: '#FFFFFF',
              textBorderWidth: 2,
            }

    return {
      id: n.id,
      name: n.name,
      category: catIndex,
      symbol: n.level === 1 ? hubSymbol(n.color) : 'circle',
      symbolSize: n.symbolSize,
      itemStyle:
        n.level === 1
          ? undefined
          : {
              color: n.color,
              borderColor: INK,
              borderWidth: n.level === 2 ? 3 : 2,
            },
      label,
      labelLayout: n.level === 3 ? { hideOverlap: true } : undefined,
      desc: n.desc,
      docPath: n.docPath,
    }
  })

  const edgeData = links.map((l) => ({
    source: l.source,
    target: l.target,
    lineStyle: { width: l.width },
  }))

  return {
    tooltip: {
      backgroundColor: '#FFFFFF',
      borderColor: INK,
      borderWidth: 2,
      padding: [8, 12],
      textStyle: { color: INK, fontSize: 12 },
      extraCssText: 'box-shadow:4px 4px 0 #0B0B0F;border-radius:0;',
      formatter: (p: unknown) => {
        const d = (p as { dataType?: string; data?: { name?: string; desc?: string } })
        if (d.dataType !== 'node' || !d.data) return ''
        return `<div style="font-family:'ZCOOL KuaiLe',sans-serif;font-size:14px">${d.data.name}</div><div style="color:#8A90A0;font-size:11px;margin-top:2px">单击查看详情 · 双击跳原文</div>`
      },
    },
    legend: { show: false, data: ALL_CAT_NAMES },
    series: [
      {
        type: 'graph',
        layout: 'force',
        roam: true,
        draggable: true,
        scaleLimit: { min: 0.2, max: 8 },
        categories: [
          ...categories.map((c) => ({ name: c.name, itemStyle: { color: c.color } })),
          { name: HUB_AGENT_CAT, itemStyle: { color: '#1E5EFF' } },
          { name: HUB_ENG_CAT, itemStyle: { color: '#F04438' } },
        ],
        data,
        links: edgeData,
        force: {
          repulsion: 220,
          gravity: 0.06,
          edgeLength: [40, 130],
          friction: 0.25,
          layoutAnimation: true,
        },
        lineStyle: {
          color: 'rgba(11,11,15,0.18)',
          width: 1,
          curveness: 0,
        },
        emphasis: {
          focus: 'adjacency',
          scale: 1.3,
          itemStyle: { borderWidth: 4 },
          lineStyle: { width: 2, color: 'source', opacity: 0.9 },
        },
        blur: {
          itemStyle: { opacity: 0.05 },
          lineStyle: { opacity: 0.05 },
          label: { opacity: 0.05 },
        },
        animationDuration: 1200,
        animationEasingUpdate: 'quinticInOut',
      },
    ],
  }
}

/* ---------------- S1 页头 ---------------- */
function TreeHeader() {
  return (
    <motion.section
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="relative border-[3px] border-ink bg-paper p-6 shadow-hard-red md:p-8"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <img
          src="/badge-tree.png"
          alt="知识树徽章"
          width={160}
          height={160}
          className="h-24 w-24 shrink-0 border-[3px] border-ink object-cover md:h-32 md:w-32"
        />
        <div className="min-w-0 flex-1">
          <p className="font-silk text-[10px] tracking-[2px] text-arcade-red">
            KNOWLEDGE GRAPH
          </p>
          <h2 className="mt-2 font-kuaile text-[28px] leading-[1.15] md:text-[34px]">
            知识树 · Agent 知识宇宙
          </h2>
          <p className="mt-3 max-w-[560px] text-sm leading-[1.85] text-body">
            仿 BAAI hub
            力导向图谱：2 大知识域、12 个章节簇、65+ 关键概念，全部派生自 34
            篇 Agent 工程文档。拖拽平移、滚轮缩放、悬停聚焦邻居，点击节点看详情，双击直达原文。
          </p>
        </div>
        <div className="flex shrink-0 gap-6 md:flex-col md:gap-3 md:border-l-[3px] md:border-ink md:pl-6">
          <div>
            <CountUp to={2} />
            <p className="font-silk text-[10px] tracking-[2px] text-faint">DOMAINS</p>
          </div>
          <div>
            <CountUp to={12} />
            <p className="font-silk text-[10px] tracking-[2px] text-faint">CLUSTERS</p>
          </div>
          <div>
            <CountUp to={NODE_COUNT} />
            <p className="font-silk text-[10px] tracking-[2px] text-faint">NODES</p>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

/* ---------------- S2.3 详情抽屉 ---------------- */
function NodeDrawer({
  node,
  onClose,
  onJumpNode,
}: {
  node: GraphNode
  onClose: () => void
  onJumpNode: (id: string) => void
}) {
  const navigate = useNavigate()
  const cat = categories.find((c) => c.name === node.cluster)
  const relatedNodes = node.related
    .map((id) => NODE_MAP.get(id))
    .filter((n): n is GraphNode => Boolean(n))

  return (
    <motion.div
      initial={{ x: 320 }}
      animate={{ x: 0 }}
      exit={{ x: 320 }}
      transition={{ duration: 0.25, ease: EASE }}
      className="absolute bottom-0 right-0 top-0 z-20 flex w-[86vw] max-w-[320px] flex-col border-l-[3px] border-ink bg-paper"
      style={{ boxShadow: '-8px 0 0 rgba(11,11,15,0.1)' }}
    >
      <div className="h-1.5 w-full shrink-0" style={{ backgroundColor: node.color }} />
      <div className="flex items-start justify-between gap-3 px-5 pt-4">
        <div>
          <p className="font-silk text-[10px] tracking-[2px] text-faint">
            {node.level === 1
              ? 'KNOWLEDGE DOMAIN'
              : `${cat?.en ?? ''} · L${node.level}`}
          </p>
          <h3 className="mt-1.5 font-kuaile text-[22px] leading-[1.25]">{node.name}</h3>
        </div>
        <button
          onClick={onClose}
          aria-label="关闭详情"
          className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-ink bg-paper transition-colors hover:bg-arcade-yellow active:translate-x-[2px] active:translate-y-[2px]"
        >
          <X size={16} />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-3">
        <p className="text-sm leading-[1.85] text-body">{node.desc}</p>

        {relatedNodes.length > 0 && (
          <div className="mt-5">
            <p className="font-silk text-[10px] tracking-[2px] text-faint">
              RELATED NODES
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {relatedNodes.map((r) => (
                <button
                  key={r.id}
                  onClick={() => onJumpNode(r.id)}
                  className="flex items-center gap-1.5 border-2 border-ink bg-paper px-2 py-1 text-xs transition-colors hover:bg-arcade-yellow"
                >
                  <span
                    className="inline-block h-2 w-2 border border-ink"
                    style={{ backgroundColor: r.color }}
                  />
                  {r.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {node.docPath && (
        <div className="shrink-0 border-t-2 border-ink p-4">
          <button
            onClick={() => navigate(toDocUrl(node.docPath!))}
            className="btn-primary w-full"
          >
            <BookOpen size={16} />
            阅读原文
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </motion.div>
  )
}

/* ---------------- 主页面 ---------------- */
export default function KnowledgeTree() {
  const navigate = useNavigate()
  const chartBoxRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<echarts.ECharts | null>(null)
  const [hidden, setHidden] = useState<Set<string>>(new Set())
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selected = selectedId ? NODE_MAP.get(selectedId) ?? null : null

  /* 初始化图谱 */
  useEffect(() => {
    const box = chartBoxRef.current
    if (!box) return
    const chart = echarts.init(box)
    chartRef.current = chart
    chart.setOption(buildOption())

    chart.on('click', (p) => {
      const d = p as { dataType?: string; data?: { id?: string } }
      if (d.dataType === 'node' && d.data?.id) setSelectedId(d.data.id)
    })
    chart.on('dblclick', (p) => {
      const d = p as { dataType?: string; data?: { id?: string } }
      if (d.dataType === 'node' && d.data?.id) {
        const n = NODE_MAP.get(d.data.id)
        if (n?.docPath) navigate(toDocUrl(n.docPath))
      }
    })

    const ro = new ResizeObserver(() => chart.resize())
    ro.observe(box)
    const onFs = () => chart.resize()
    document.addEventListener('fullscreenchange', onFs)

    return () => {
      ro.disconnect()
      document.removeEventListener('fullscreenchange', onFs)
      chart.dispose()
      chartRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* 分类 chip 开关 */
  const toggleCategory = (name: string) => {
    const chart = chartRef.current
    setHidden((prev) => {
      const next = new Set(prev)
      if (next.has(name)) {
        next.delete(name)
        chart?.dispatchAction({ type: 'legendSelect', name })
      } else {
        next.add(name)
        chart?.dispatchAction({ type: 'legendUnSelect', name })
      }
      return next
    })
  }

  const resetView = () => {
    chartRef.current?.dispatchAction({ type: 'restore' })
    setHidden(new Set())
    setSelectedId(null)
  }

  const toggleFullscreen = () => {
    const card = cardRef.current
    if (!card) return
    if (document.fullscreenElement) {
      void document.exitFullscreen()
    } else {
      void card.requestFullscreen()
    }
  }

  /* 抽屉内关联节点跳转：画布聚焦 + 切换选中 */
  const jumpNode = (id: string) => {
    setSelectedId(id)
    const chart = chartRef.current
    if (!chart) return
    const idx = nodes.findIndex((n) => n.id === id)
    chart.dispatchAction({ type: 'unfocusNodeAdjacency', seriesIndex: 0 })
    if (idx >= 0) {
      chart.dispatchAction({ type: 'focusNodeAdjacency', seriesIndex: 0, dataIndex: idx })
    }
  }

  const closeDrawer = () => {
    setSelectedId(null)
    chartRef.current?.dispatchAction({ type: 'unfocusNodeAdjacency', seriesIndex: 0 })
  }

  const stats = useMemo(
    () => ({ nodes: NODE_COUNT, links: LINK_COUNT }),
    [],
  )

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 md:px-6 md:py-14">
      <TreeHeader />

      {/* S2 图谱主区 */}
      <motion.section
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
        className="mt-8"
      >
        <div
          ref={cardRef}
          className="relative flex flex-col border-[3px] border-ink bg-paper shadow-hard-lg"
        >
          {/* S2.1 工具条 */}
          <div className="flex flex-wrap items-center gap-2 border-b-[2px] border-ink bg-paper px-3 py-2.5">
            {categories.map((c) => {
              const off = hidden.has(c.name)
              return (
                <button
                  key={c.name}
                  onClick={() => toggleCategory(c.name)}
                  title={c.en}
                  className={`flex items-center gap-1.5 border-2 border-ink px-2 py-1 text-xs transition-colors ${
                    off ? 'bg-hairline text-faint' : 'bg-paper hover:bg-arcade-yellow'
                  }`}
                >
                  <span
                    className="inline-block h-2.5 w-2.5 border border-ink"
                    style={{ backgroundColor: off ? '#8A90A0' : c.color }}
                  />
                  <span className={off ? 'line-through' : ''}>{c.name}</span>
                </button>
              )
            })}
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={resetView}
                className="flex h-8 items-center gap-1.5 border-2 border-ink bg-paper px-2.5 text-xs transition-colors hover:bg-arcade-yellow active:translate-x-[2px] active:translate-y-[2px]"
              >
                <RotateCcw size={14} />
                重置视图
              </button>
              <button
                onClick={toggleFullscreen}
                aria-label="全屏"
                className="flex h-8 w-8 items-center justify-center border-2 border-ink bg-paper transition-colors hover:bg-arcade-yellow active:translate-x-[2px] active:translate-y-[2px]"
              >
                <Maximize size={14} />
              </button>
            </div>
          </div>

          {/* S2.2 画布 */}
          <div className="bg-grid-paper relative h-[78vh] min-h-[560px]">
            <div
              ref={chartBoxRef}
              style={{ position: 'absolute', inset: 0, cursor: 'grab' }}
            />
            <p className="pointer-events-none absolute bottom-3 left-4 z-10 font-vt text-[16px] tracking-[1px] text-faint">
              DRAG · ZOOM · CLICK
            </p>
            <p className="pointer-events-none absolute right-4 top-3 z-10 font-vt text-[14px] tracking-[1px] text-faint">
              {stats.nodes} NODES / {stats.links} EDGES
            </p>

            {/* S2.3 详情抽屉 */}
            <AnimatePresence>
              {selected && (
                <NodeDrawer
                  key={selected.id}
                  node={selected}
                  onClose={closeDrawer}
                  onJumpNode={jumpNode}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.section>

      {/* S3 图例与说明 */}
      <motion.section
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="mt-8 grid gap-6 md:grid-cols-2"
      >
        {/* 左卡：图例 */}
        <div className="card-arcade">
          <span className="sticker bg-arcade-yellow text-ink">LEGEND</span>
          <div className="mt-5 space-y-4">
            <div className="flex items-center gap-3">
              <span className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[3px] border-ink bg-paper">
                <span className="h-4 w-4 rounded-full bg-arcade-blue" />
              </span>
              <p className="text-sm text-body">
                <span className="font-kuaile text-ink">知识域 hub</span>
                （大圆）— 2 大卷：AI Agent 智能体 / Agent 工程与训练
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-[3px] border-ink bg-arcade-red" />
              <p className="text-sm text-body">
                <span className="font-kuaile text-ink">章节簇</span>
                （中圆）— 12 章，每章一色，对应电子书目录
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="ml-1 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-arcade-green" />
              <p className="text-sm text-body">
                <span className="font-kuaile text-ink">关键概念</span>
                （小圆）— 从文档标题与摘要提炼的 65 个知识点
              </p>
            </div>
          </div>
          <ul className="mt-5 space-y-1.5 border-t-2 border-hairline pt-4 text-sm text-body">
            <li>· 拖拽空白处平移画布，节点也可拖拽</li>
            <li>· 滚轮缩放（0.2x – 8x）</li>
            <li>· 悬停节点：聚焦高亮邻居，其余淡出</li>
            <li>· 单击节点：右侧滑出详情抽屉</li>
            <li>· 双击节点：直达电子书对应章节</li>
            <li>· 顶部彩色 chips：点击开关对应章节簇显隐</li>
          </ul>
        </div>

        {/* 右卡：黑卡 CTA */}
        <div className="flex flex-col justify-between border-[3px] border-ink bg-ink p-6 text-white shadow-hard-yellow">
          <div>
            <p className="font-silk text-[10px] tracking-[2px] text-faint">READ THE BOOK</p>
            <h3 className="mt-3 font-kuaile text-[22px] leading-[1.3]">
              看不懂图谱？去读电子书
            </h3>
            <p className="mt-3 text-[13px] leading-[1.85] text-[#8A90A0]">
              图谱上的每个节点都对应电子书里的一个章节。34
              篇工业级文档，从基础认知到工程落地，逐页翻开慢慢修炼。
            </p>
          </div>
          <div className="mt-6">
            <Link to="/agent" className="btn-yellow">
              <BookOpen size={16} />
              翻开电子书
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  )
}
