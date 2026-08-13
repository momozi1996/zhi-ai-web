import type { ReactNode } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

/**
 * 全站共享布局（Children pattern）：
 * App.tsx 必须以 <Layout><Routes>…</Routes></Layout> 方式使用。
 * Navbar 为 sticky（文档流内），页面无需补偿导航高度。
 */
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-grid-hall">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
