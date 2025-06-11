import { Signin } from './components/pages/Signin'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Signup } from './components/pages/Signup'
import Dashboard from './components/pages/Dashboard'
import SharedContent from './components/pages/SharedContent'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/share/:shareId" element={<SharedContent />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
