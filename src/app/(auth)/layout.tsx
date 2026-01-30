export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">DentalGuard</h1>
          <p className="text-muted-foreground mt-2">
            Compliance Autopilot for Dental Practices
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
