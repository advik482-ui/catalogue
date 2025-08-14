export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-8 bg-muted animate-pulse rounded" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-64 bg-muted animate-pulse rounded" />
        <div className="h-64 bg-muted animate-pulse rounded" />
      </div>
      <div className="h-32 bg-muted animate-pulse rounded" />
    </div>
  )
}
