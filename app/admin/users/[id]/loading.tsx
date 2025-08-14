export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-8 bg-muted animate-pulse rounded" />
      <div className="h-32 bg-muted animate-pulse rounded" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="h-24 bg-muted animate-pulse rounded" />
        <div className="h-24 bg-muted animate-pulse rounded" />
        <div className="h-24 bg-muted animate-pulse rounded" />
        <div className="h-24 bg-muted animate-pulse rounded" />
      </div>
      <div className="h-96 bg-muted animate-pulse rounded" />
    </div>
  )
}
