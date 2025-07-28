// import dynamic from "next/dynamic";

import MainNavbar from "@/components/layout/nav-bar"

// const MainFooter = dynamic(() => import('@/components/layout/footer'));

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Nav */}
      <MainNavbar />

      {/* Main content */}
      {children}

      {/* Footer */}
      {/* <MainFooter /> */}
    </div>
  )
}
