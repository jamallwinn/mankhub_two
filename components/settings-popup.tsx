import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

interface SettingsPopupProps {
  onClose: () => void
}

export function SettingsPopup({ onClose }: SettingsPopupProps) {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true'
    }
    return false
  })
  const [notifications, setNotifications] = useState(false)
  const [language, setLanguage] = useState('en')

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', darkMode.toString())
  }, [darkMode])

  const handleDarkModeChange = (checked: boolean) => {
    setDarkMode(checked)
  }

  const handleNotificationsChange = (checked: boolean) => {
    setNotifications(checked)
  }

  const handleLanguageChange = (value: string) => {
    setLanguage(value)
  }

  const handleSave = () => {
    localStorage.setItem('settings', JSON.stringify({ notifications, language }))
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode">Dark Mode</Label>
            <Switch
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={handleDarkModeChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">Notifications</Label>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={handleNotificationsChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="language">Language</Label>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SettingsPopup

