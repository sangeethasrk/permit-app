import { useState } from 'react'
import './App.css'
import AdminDashboardPage from './pages/AdminDashboardPage'
import CreatePermitPage from './pages/CreatePermitPage'

function App() {
  const [view, setView] = useState<'citizen' | 'admin'>('citizen')

  return (
    <>
      <header className="app-nav">
        <button
          type="button"
          className={view === 'citizen' ? 'nav-button nav-button-active' : 'nav-button'}
          onClick={() => setView('citizen')}
        >
          Citizen
        </button>
        <button
          type="button"
          className={view === 'admin' ? 'nav-button nav-button-active' : 'nav-button'}
          onClick={() => setView('admin')}
        >
          Admin
        </button>
      </header>
      {view === 'citizen' ? <CreatePermitPage /> : <AdminDashboardPage />}
    </>
  )
}

export default App
