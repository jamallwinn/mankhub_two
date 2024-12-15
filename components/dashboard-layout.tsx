import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MountainIcon, LogOut, Settings, User, MessageSquare, Calendar, Activity } from 'lucide-react'
import { supabase } from '@/lib/supabase-client'

interface DashboardLayoutProps {
  children: React.ReactNode
  user: any
  onProfileClick: () => void
  onSettingsClick: () => void
}

export function DashboardLayout({ children, user, onProfileClick, onSettingsClick }: DashboardLayoutProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true'
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await supabase.auth.signOut()
      router.push('/signin')
    } catch (error) {
      console.error('Error logging out:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <MountainIcon className="h-6 w-6 text-primary" />
            <span className="font-bold">Maven North Star</span>
          </Link>
          <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
            <Button asChild variant="ghost">
              <Link href="/dashboard">
                <Activity className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/dashboard/appointments">
                <Calendar className="h-4 w-4 mr-2" />
                Appointments
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/dashboard/messages">
                <MessageSquare className="h-4 w-4 mr-2" />
                Messages
              </Link>
            </Button>
          </nav>
          <div className="ml-auto flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.user_metadata?.full_name} />
                    <AvatarFallback>{user?.user_metadata?.first_name?.[0]}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onProfileClick}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onSettingsClick}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={handleLogout}
                  disabled={isLoading}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {isLoading ? "Logging out..." : "Log out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="container py-6">{children}</main>
    </div>
  )
}

//export { DashboardLayout }

