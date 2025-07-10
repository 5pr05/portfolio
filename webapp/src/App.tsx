import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { CodeProjectsPage } from './pages/CodeProjectsPage'
import { ArtProjectsPage } from './pages/ArtProjectsPage'

export const App = () => {
  return (
    <BrowserRouter basename='/portfolio/'>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/code" element={<CodeProjectsPage />} />
        <Route path="/art" element={<ArtProjectsPage />} />
      </Routes>
    </BrowserRouter>
  )
}
