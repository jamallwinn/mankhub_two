import Link from 'next/link'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MountainIcon, ActivityIcon, MessageSquareIcon, CalendarIcon, BrainCircuitIcon, HeartPulseIcon } from 'lucide-react'

export default function FeaturesPage() {
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
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/how-it-works">
            How It Works
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/about">
            About
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center">Our Features</h2>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ActivityIcon className="mr-2 h-5 w-5" />
                    Activity Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Monitor your daily activities, steps, and health metrics with our advanced tracking system.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquareIcon className="mr-2 h-5 w-5" />
                    AI Chat Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Get instant answers to your health questions from our AI-powered chat assistant.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    Appointment Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Easily schedule and manage your doctor appointments through our intuitive interface.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BrainCircuitIcon className="mr-2 h-5 w-5" />
                    Personalized Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Receive tailored health recommendations based on your unique profile and activity data.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HeartPulseIcon className="mr-2 h-5 w-5" />
                    Health Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Get a comprehensive evaluation of your health risks and actionable steps to mitigate them.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ActivityIcon className="mr-2 h-5 w-5" />
                    Progress Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Visualize your health journey with detailed progress reports and achievement milestones.</p>
                </CardContent>
              </Card>
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

