import { Routes, Route } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'
import Blog from './pages/Blog'
import AgentBook from './pages/AgentBook'
import KnowledgeTree from './pages/KnowledgeTree'
import Skills from './pages/Skills'
import Prompts from './pages/Prompts'
import Resources from './pages/Resources'
import Harness from './pages/Harness'
import Placeholder from './pages/Placeholder'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/agent" element={<AgentBook />} />
        <Route path="/agent/*" element={<AgentBook />} />
        <Route path="/tree" element={<KnowledgeTree />} />
        <Route path="/harness" element={<Harness />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/prompts" element={<Prompts />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="*" element={<Placeholder title="404 · GAME OVER" />} />
      </Routes>
    </Layout>
  )
}
