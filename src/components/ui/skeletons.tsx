import { Card, CardContent } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export function BookingSkeleton() {
  return (
    <Card className="w-full mb-4 animate-pulse">
      <CardContent className="p-6">
        <div className="space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex space-x-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Base skeleton animation class
const skeletonBaseClass = 'animate-pulse bg-muted rounded-md'

// Gallery item skeleton
export function GalleryItemSkeleton() {
  return (
    <div className={cn(skeletonBaseClass, 'aspect-square w-full')} />
  )
}

// Gallery grid skeleton
export function GalleryGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {Array(count).fill(0).map((_, i) => (
        <GalleryItemSkeleton key={i} />
      ))}
    </div>
  )
}

// Empty state placeholder
export function EmptyStateSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className={cn(skeletonBaseClass, 'w-16 h-16 rounded-full')} />
      <div className={cn(skeletonBaseClass, 'w-48 h-6')} />
      <div className={cn(skeletonBaseClass, 'w-64 h-4')} />
    </div>
  )
}

// Upload progress skeleton
export function UploadProgressSkeleton() {
  return (
    <div className="space-y-2">
      <div className={cn(skeletonBaseClass, 'w-full h-2')} />
      <div className="flex justify-between">
        <div className={cn(skeletonBaseClass, 'w-20 h-4')} />
        <div className={cn(skeletonBaseClass, 'w-12 h-4')} />
      </div>
    </div>
  )
} 