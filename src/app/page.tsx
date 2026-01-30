import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Shield,
  CheckCircle,
  Clock,
  FileText,
  Users,
  Award,
  ArrowRight,
  Zap,
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">DentalGuard</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Start free trial</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Zap className="h-4 w-4" />
          Compliance Autopilot for Dental Practices
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Never worry about
          <br />
          <span className="text-primary">OSHA/HIPAA compliance</span>
          <br />
          again.
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          We automate everything, so you can&apos;t get fined. Training, documentation,
          tracking - all handled automatically while you focus on patients.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/signup">
              Start 14-day free trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#features">See how it works</Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          No credit card required. Setup in under 5 minutes.
        </p>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Everything you need for compliance
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From automatic training reminders to instant inspection packets,
            DentalGuard handles it all.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Users,
              title: 'Automated Training',
              description:
                'Training auto-assigned based on hire dates. Reminders sent automatically. Certificates generated on completion.',
            },
            {
              icon: Clock,
              title: 'Compliance Dashboard',
              description:
                'See your entire practice compliance status at a glance. Know who is due, overdue, and compliant.',
            },
            {
              icon: FileText,
              title: 'Document Management',
              description:
                'AI-generated Exposure Control Plans. Pre-built forms for vaccinations, incidents, and more.',
            },
            {
              icon: Shield,
              title: 'Inspection Ready',
              description:
                'Generate a complete inspection packet in seconds. Everything an OSHA inspector needs, organized and ready.',
            },
            {
              icon: Award,
              title: 'Employee Engagement',
              description:
                'Gamification with badges and streaks. Make compliance training something employees actually complete.',
            },
            {
              icon: CheckCircle,
              title: 'State-Specific',
              description:
                'Requirements auto-adjusted based on your state. CA, TX, NY, FL specific rules built in.',
            },
          ].map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <feature.icon className="h-10 w-10 text-primary mb-2" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-muted-foreground">
              All features included. Price based on team size.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Solo', employees: '1-5', price: 99 },
              { name: 'Small', employees: '6-15', price: 129 },
              { name: 'Medium', employees: '16-30', price: 169 },
              { name: 'Large', employees: '31+', price: 219 },
            ].map((plan) => (
              <Card key={plan.name}>
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.employees} employees</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/mo</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      All training modules
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Unlimited documents
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Inspection packets
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Email reminders
                    </li>
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            DSO? Get 20% off each additional practice.{' '}
            <Link href="/contact" className="text-primary hover:underline">
              Contact us
            </Link>
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to automate your compliance?
        </h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          Join hundreds of dental practices who never worry about OSHA fines.
          Start your free trial today.
        </p>
        <Button size="lg" asChild>
          <Link href="/signup">
            Start free 14-day trial
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold text-primary">DentalGuard</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} DentalGuard. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
