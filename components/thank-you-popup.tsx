import { Button } from '@/components/ui/button'

interface ThankYouPopupProps {
  onClose: () => void
}

export default function ThankYouPopup({ onClose }: ThankYouPopupProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Thank You!</h2>
        <p className="text-center mb-6">
          We appreciate you taking the time to complete your profile. Your information will help us provide you with the best possible health recommendations and support.
        </p>
        <p className="text-center mb-6">
          Your journey to better health starts now!
        </p>
        <div className="flex justify-center">
          <Button onClick={onClose}>Go to Dashboard</Button>
        </div>
      </div>
    </div>
  )
}

