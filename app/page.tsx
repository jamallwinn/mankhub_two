import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MountainIcon, ActivityIcon, MessageSquareIcon, CalendarIcon, UserPlusIcon, BrainCircuitIcon } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="/">
          <MountainIcon className="h-6 w-6" />
          <span className="ml-2 text-lg font-semibold">Maven North Star</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/how-it-works">
            How It Works
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/about">
            About
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome to Maven North Star
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Your personalized, AI-driven health coach tailored specifically for men's holistic well-being.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild>
                  <Link href="/signup">Join Now</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/signin">Login</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Features</h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 mt-8">
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <ActivityIcon className="h-10 w-10 mb-2" />
                <h3 className="text-xl font-bold">Activity Tracking</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">Monitor your daily activities and health metrics.</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <MessageSquareIcon className="h-10 w-10 mb-2" />
                <h3 className="text-xl font-bold">AI Chat Support</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">Get instant answers to your health questions.</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <CalendarIcon className="h-10 w-10 mb-2" />
                <h3 className="text-xl font-bold">Appointment Management</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">Schedule and manage your doctor appointments.</p>
              </div>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 mt-8">
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <UserPlusIcon className="h-10 w-10 mb-2" />
                <h3 className="text-xl font-bold">1. Sign Up</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">Create your account and complete your health profile.</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <ActivityIcon className="h-10 w-10 mb-2" />
                <h3 className="text-xl font-bold">2. Track Your Health</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">Connect your devices and start tracking your activities.</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <BrainCircuitIcon className="h-10 w-10 mb-2" />
                <h3 className="text-xl font-bold">3. Get AI Insights</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">Receive personalized recommendations and chat with our AI.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 Maven North Star. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

