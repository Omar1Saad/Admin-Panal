import React, { useState, useEffect } from 'react'
import { Shield, Users, Key, Activity, Settings, LogOut } from 'lucide-react'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import LicensesPage from './pages/LicensesPage'
import StatsPage from './pages/StatsPage'
import { apiService } from './services/api'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // التحقق من حالة المصادقة
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('admin_token')
        if (token) {
          // التحقق من صحة الرمز المميز
          const response = await apiService.getStats()
          if (response.success) {
            setIsAuthenticated(true)
          } else {
            localStorage.removeItem('admin_token')
          }
        }
      } catch (error) {
        localStorage.removeItem('admin_token')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleLogin = (token) => {
    localStorage.setItem('admin_token', token)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    setIsAuthenticated(false)
    setCurrentPage('dashboard')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />
  }

  const navigation = [
    { id: 'dashboard', name: 'لوحة التحكم', icon: Activity },
    { id: 'licenses', name: 'إدارة التراخيص', icon: Key },
    { id: 'stats', name: 'الإحصائيات', icon: Users },
  ]

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'licenses':
        return <LicensesPage />
      case 'stats':
        return <StatsPage />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-primary-600" />
              <h1 className="mr-3 text-xl font-semibold text-gray-900">
                لوحة إدارة التراخيص
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
            >
              <LogOut className="h-5 w-5 ml-2" />
              تسجيل الخروج
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <nav className="lg:w-64">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <ul className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => setCurrentPage(item.id)}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          currentPage === item.id
                            ? 'bg-primary-100 text-primary-700'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="h-5 w-5 ml-3" />
                        {item.name}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1">
            {renderPage()}
          </main>
        </div>
      </div>
    </div>
  )
}

export default App
