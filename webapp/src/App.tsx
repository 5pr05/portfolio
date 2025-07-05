import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { CodeProjectsPage } from './pages/CodeProjectsPage'

export const App = () => {
	return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/code" element={<CodeProjectsPage />} />
      </Routes>
    </BrowserRouter>
	)
}