import Logo from "@/components/common/logo"

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <section className="h-screen bg-muted">
      <div className="flex h-full items-center justify-center">
        {/* Logo */}
        <div className="flex flex-col items-center gap-6 lg:justify-start">
          <Logo />

          {children}
        </div>
      </div>
    </section>
  )
}
