'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Step 1: Account info
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Step 2: Organization info
  const [orgName, setOrgName] = useState('')
  const [billingEmail, setBillingEmail] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (step === 1) {
      if (!name || !email || !password) {
        toast({
          variant: 'destructive',
          title: 'Missing information',
          description: 'Please fill in all fields',
        })
        return
      }
      if (password.length < 8) {
        toast({
          variant: 'destructive',
          title: 'Password too short',
          description: 'Password must be at least 8 characters',
        })
        return
      }
      setBillingEmail(email)
      setStep(2)
      return
    }

    // Step 2: Create account
    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, orgName, billingEmail }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create account')
      }

      toast({
        title: 'Account created!',
        description: 'You can now sign in with your credentials.',
      })

      router.push('/login')
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Registration failed',
        description: error.message || 'An error occurred during registration',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Start your free trial</CardTitle>
        <CardDescription>
          {step === 1
            ? 'Create your account to get started'
            : 'Tell us about your practice'}
        </CardDescription>
        <div className="flex gap-2 mt-4">
          <div
            className={`h-1 flex-1 rounded ${
              step >= 1 ? 'bg-primary' : 'bg-muted'
            }`}
          />
          <div
            className={`h-1 flex-1 rounded ${
              step >= 2 ? 'bg-primary' : 'bg-muted'
            }`}
          />
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {step === 1 ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Your name</Label>
                <Input
                  id="name"
                  placeholder="Dr. Jane Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jane@smithdental.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="orgName">Practice/Organization name</Label>
                <Input
                  id="orgName"
                  placeholder="Smith Family Dentistry"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingEmail">Billing email</Label>
                <Input
                  id="billingEmail"
                  type="email"
                  placeholder="billing@smithdental.com"
                  value={billingEmail}
                  onChange={(e) => setBillingEmail(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  We&apos;ll send invoices and billing updates here
                </p>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="flex gap-2 w-full">
            {step === 2 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                disabled={isLoading}
              >
                Back
              </Button>
            )}
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading
                ? 'Creating account...'
                : step === 1
                ? 'Continue'
                : 'Start free trial'}
            </Button>
          </div>

          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              14-day free trial. No credit card required.
            </p>
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
