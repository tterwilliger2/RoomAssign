import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from './ui/button'
import { LayoutDashboard, Upload, Settings, PlayCircle, FileImage, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('admin_email')
    navigate('/signin')
  }

  const isActive = (path: string) => location.pathname === path

  const navItems = [
    { path: '/upload', label: 'Upload', icon: Upload },
    { path: '/setup', label: 'Setup', icon: Settings },
    { path: '/run', label: 'Run', icon: PlayCircle },
    { path: '/blueprint', label: 'Blueprint', icon: FileImage },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg">
                <LayoutDashboard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Room Wizard
                </h1>
                <p className="text-xs text-muted-foreground">Room Assignment Optimizer</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-2">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Button
                  key={path}
                  variant={isActive(path) ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => navigate(path)}
                  className={cn(
                    "gap-2",
                    isActive(path) && "shadow-md"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{label}</span>
                </Button>
              ))}
              <div className="ml-4 pl-4 border-l">
                <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  <span className="hidden lg:inline">Logout</span>
                </Button>
              </div>
            </nav>

            <div className="md:hidden">
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile navigation */}
          <nav className="md:hidden flex items-center gap-2 mt-4 overflow-x-auto pb-2">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Button
                key={path}
                variant={isActive(path) ? 'default' : 'outline'}
                size="sm"
                onClick={() => navigate(path)}
                className="gap-2 flex-shrink-0"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            ))}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-8">
        {children}
      </main>

      <footer className="border-t bg-white/50 backdrop-blur-sm mt-auto py-6">
        <div className="container mx-auto px-4 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 Room Wizard. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
