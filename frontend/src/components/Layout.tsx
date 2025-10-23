import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { 
  Upload, 
  Settings, 
  Play, 
  LayoutGrid, 
  FileDown, 
  LogOut,
  Home
} from 'lucide-react'
import { Button } from './ui/button'

interface LayoutProps {
  children: React.ReactNode
  showNav?: boolean
}

export function Layout({ children, showNav = true }: LayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('admin_email')
    navigate('/signin')
  }

  const navItems = [
    { path: '/upload', label: 'Upload', icon: Upload },
    { path: '/setup', label: 'Setup', icon: Settings },
    { path: '/run', label: 'Run', icon: Play },
    { path: '/blueprint', label: 'Blueprint', icon: LayoutGrid },
    { path: '/export', label: 'Export', icon: FileDown },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {showNav && (
        <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-8">
                <Link to="/upload" className="flex items-center space-x-2">
                  <Home className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    Room Wizard
                  </span>
                </Link>
                <div className="hidden md:flex items-center space-x-1">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = location.pathname === item.path
                    return (
                      <Link key={item.path} to={item.path}>
                        <Button
                          variant={isActive ? 'default' : 'ghost'}
                          size="sm"
                          className="space-x-2"
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Button>
                      </Link>
                    )
                  })}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
          {/* Mobile navigation */}
          <div className="md:hidden border-t px-4 py-2 flex overflow-x-auto space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    className="space-x-2 whitespace-nowrap"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              )
            })}
          </div>
        </nav>
      )}
      <main className={cn(
        "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
        showNav ? "py-8" : ""
      )}>
        {children}
      </main>
    </div>
  )
}
