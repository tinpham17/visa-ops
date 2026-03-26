export function AppContent({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={`p-4 overflow-auto ${className || ""}`}>{children}</div>
}
