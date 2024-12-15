import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MountainIcon, UserPlusIcon, ActivityIcon, BrainCircuitIcon, ArrowRightIcon } from 'lucide-react'

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="/">
          <MountainIcon className="h-6 w-6" />
          <span className="ml-2 text-lg font-semibold">Maven North Star</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/">
            Home
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/about">
            About
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center">How It Works</h2>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserPlusIcon className="mr-2 h-5 w-5" />
                    1. Sign Up
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Create your account and complete your health profile. We'll use this information to personalize your experience.</p>
                </CardContent>
              </Card>
              <Card className="relative">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ActivityIcon className="mr-2 h-5 w-5" />
                    2. Track Your Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Connect your devices and start tracking your activities. Our system will monitor your progress and health metrics.</p>
                </CardContent>
                <ArrowRightIcon className="absolute top-1/2 -right-5 transform -translate-y-1/2 h-10 w-10 text-gray-300 hidden lg:block" />
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BrainCircuitIcon className="mr-2 h-5 w-5" />
                    3. Get AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Receive personalized recommendations and chat with our AI. We'll help you make informed decisions about your health.</p>
                </CardContent>
              </Card>
            </div>
            <div className="mt-12 text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Take Control of Your Health?</h3>
              <Button asChild size="lg">
                <Link href="/signup">Get Started Now</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 Maven Northstar. All rights reserved.</p>
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

