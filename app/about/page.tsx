import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MountainIcon, Users2Icon, ShieldCheckIcon, HeartHandshakeIcon } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="/">
          <MountainIcon className="h-6 w-6" />
          <span className="ml-2 text-lg font-semibold">Man Cave Health Hub</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/">
            Home
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/how-it-works">
            How It Works
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center">About Man Cave Health Hub</h2>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <p className="text-lg text-gray-500 dark:text-gray-400">
                Man Cave Health Hub is dedicated to empowering men to take control of their health through innovative technology and personalized guidance. We believe that by combining cutting-edge AI with a user-friendly platform, we can make health management more accessible, engaging, and effective for men of all ages.
              </p>
            </div>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users2Icon className="mr-2 h-5 w-5" />
                    Our Mission
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>To revolutionize men's health care by providing a comprehensive, easy-to-use platform that encourages proactive health management and fosters a supportive community.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShieldCheckIcon className="mr-2 h-5 w-5" />
                    Our Values
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>We prioritize privacy, accuracy, and user empowerment. Our platform is built on trust, transparency, and a commitment to delivering evidence-based health insights.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HeartHandshakeIcon className="mr-2 h-5 w-5" />
                    Our Commitment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>We're dedicated to continuous improvement, staying at the forefront of health technology, and adapting to the evolving needs of our users to provide the best possible care.</p>
                </CardContent>
              </Card>
            </div>
            <div className="mt-12 text-center">
              <h3 className="text-2xl font-bold mb-4">Join Us in Revolutionizing Men's Health</h3>
              <Button asChild size="lg">
                <Link href="/signup">Become a Member</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 Man Cave Health Hub. All rights reserved.</p>
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

