"use client"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 pt-4 sm:pt-6 w-full max-w-[100vw] overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  )
} 