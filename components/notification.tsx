import { CheckCircle, XCircle } from 'lucide-react'

type NotificationProps = {
  type: 'success' | 'error'
  message: string
}

export function Notification({ type, message }: NotificationProps) {
  const icon = type === 'success' ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />
  const bgColor = type === 'success' ? 'bg-green-100 dark:bg-green-800' : 'bg-red-100 dark:bg-red-800'
  const textColor = type === 'success' ? 'text-green-800 dark:text-green-100' : 'text-red-800 dark:text-red-100'

  return (
    <div className={`flex items-center p-4 mb-4 rounded-lg ${bgColor}`} role="alert">
      <div className={`flex-shrink-0 ${textColor}`}>{icon}</div>
      <div className={`ml-3 text-sm font-medium ${textColor}`}>{message}</div>
    </div>
  )
}

