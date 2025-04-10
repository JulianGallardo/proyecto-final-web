export function TableSkeleton() {
    return (
      <div className="animate-pulse flex flex-col w-full h-full space-y-4">
        {/* View Selector Skeleton */}
        <div className="flex items-center gap-2">
          <div className="hidden md:block w-16 h-5 bg-gray-200 rounded"></div>
          <div className="w-20 h-8 bg-gray-200 rounded-md"></div>
          <div className="w-20 h-8 bg-gray-200 rounded-md"></div>
        </div>
        
        {/* Action Buttons Skeleton */}
        <div className="flex flex-col md:flex-row md:justify-between gap-4 w-full">
          <div className="w-40 h-10 bg-gray-200 rounded-md"></div>
          <div className="w-48 h-10 bg-gray-200 rounded-md"></div>
        </div>
        
        {/* Table Header Skeleton - Full Width */}
        <div className="w-full overflow-x-auto flex-1">
          <div className="w-full h-full border rounded-md">
            {/* Header row */}
            <div className="flex w-full bg-gray-100 h-10 border-b">
              {/* Column headers with adjusted widths */}
              <div className="w-1/6 px-2 py-3 bg-gray-200 animate-pulse"></div>
              <div className="w-1/12 px-2 py-3 bg-gray-200 animate-pulse"></div>
              <div className="w-1/12 px-2 py-3 bg-gray-200 animate-pulse"></div>
              <div className="w-1/12 px-2 py-3 bg-gray-200 animate-pulse"></div>
              <div className="w-1/6 px-2 py-3 bg-gray-200 animate-pulse"></div>
              <div className="w-1/12 px-2 py-3 bg-gray-200 animate-pulse"></div>
              <div className="w-1/12 px-2 py-3 bg-gray-200 animate-pulse"></div>
              <div className="w-1/6 px-2 py-3 bg-gray-200 animate-pulse"></div>
              <div className="w-1/12 px-2 py-3 bg-gray-200 animate-pulse"></div>
            </div>
            
            {/* Table Rows Skeleton */}
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="flex w-full border-b h-16">
                <div className="w-1/6 px-2 py-4 bg-gray-200 m-1 rounded animate-pulse"></div>
                <div className="w-1/12 px-2 py-4 bg-gray-200 m-1 rounded animate-pulse"></div>
                <div className="w-1/12 px-2 py-4 bg-gray-200 m-1 rounded animate-pulse"></div>
                <div className="w-1/12 px-2 py-4 bg-gray-200 m-1 rounded animate-pulse"></div>
                <div className="w-1/6 px-2 py-4 bg-gray-200 m-1 rounded animate-pulse"></div>
                <div className="w-1/12 px-2 py-4 bg-gray-200 m-1 rounded animate-pulse"></div>
                <div className="w-1/12 px-2 py-4 bg-gray-200 m-1 rounded animate-pulse"></div>
                <div className="w-1/6 px-2 py-4 bg-gray-200 m-1 rounded animate-pulse"></div>
                <div className="w-1/12 px-2 py-4 flex justify-center items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-md"></div>
                  <div className="w-8 h-8 bg-gray-300 rounded-md"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Pagination Skeleton */}
        <div className="flex items-center justify-center w-full space-x-2 mt-4">
          <div className="w-10 h-10 bg-gray-200 rounded-md"></div>
          <div className="w-10 h-10 bg-gray-200 rounded-md"></div>
          <div className="w-10 h-10 bg-gray-200 rounded-md"></div>
          <div className="w-10 h-10 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    );
  }
  
  // Use this version if you want to place the skeleton in a layout that already controls the height
  export function TableSkeletonInContainer() {
    return (
      <div className="animate-pulse flex flex-col w-full h-full space-y-4">
        {/* View Selector and Action Buttons */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="hidden md:block w-16 h-5 bg-gray-200 rounded"></div>
            <div className="w-20 h-8 bg-gray-200 rounded-md"></div>
            <div className="w-20 h-8 bg-gray-200 rounded-md"></div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-40 h-10 bg-gray-200 rounded-md"></div>
            <div className="w-48 h-10 bg-gray-200 rounded-md"></div>
          </div>
        </div>
        
        {/* Table Content - Taking all available space */}
        <div className="flex-grow w-full overflow-auto">
          <div className="min-w-full h-full border rounded-md">
            {/* Header row */}
            <div className="sticky top-0 flex w-full bg-gray-100 h-10 border-b">
              <div className="w-1/6 px-2 py-3 bg-gray-200 animate-pulse"></div>
              <div className="w-1/12 px-2 py-3 bg-gray-200 animate-pulse"></div>
              <div className="w-1/12 px-2 py-3 bg-gray-200 animate-pulse"></div>
              <div className="w-1/12 px-2 py-3 bg-gray-200 animate-pulse"></div>
              <div className="w-1/6 px-2 py-3 bg-gray-200 animate-pulse"></div>
              <div className="w-1/12 px-2 py-3 bg-gray-200 animate-pulse"></div>
              <div className="w-1/12 px-2 py-3 bg-gray-200 animate-pulse"></div>
              <div className="w-1/6 px-2 py-3 bg-gray-200 animate-pulse"></div>
              <div className="w-1/12 px-2 py-3 bg-gray-200 animate-pulse"></div>
            </div>
            
            {/* Data rows - Fill available space */}
            <div className="flex-1">
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} className="flex w-full border-b h-12">
                  <div className="w-1/6 px-2 py-2 bg-gray-200 m-0.5 rounded animate-pulse"></div>
                  <div className="w-1/12 px-2 py-2 bg-gray-200 m-0.5 rounded animate-pulse"></div>
                  <div className="w-1/12 px-2 py-2 bg-gray-200 m-0.5 rounded animate-pulse"></div>
                  <div className="w-1/12 px-2 py-2 bg-gray-200 m-0.5 rounded animate-pulse"></div>
                  <div className="w-1/6 px-2 py-2 bg-gray-200 m-0.5 rounded animate-pulse"></div>
                  <div className="w-1/12 px-2 py-2 bg-gray-200 m-0.5 rounded animate-pulse"></div>
                  <div className="w-1/12 px-2 py-2 bg-gray-200 m-0.5 rounded animate-pulse"></div>
                  <div className="w-1/6 px-2 py-2 bg-gray-200 m-0.5 rounded animate-pulse"></div>
                  <div className="w-1/12 px-2 py-2 flex justify-center items-center space-x-1">
                    <div className="w-7 h-7 bg-gray-300 rounded-md"></div>
                    <div className="w-7 h-7 bg-gray-300 rounded-md"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Pagination Skeleton */}
        <div className="flex items-center justify-center w-full space-x-2">
          <div className="w-10 h-10 bg-gray-200 rounded-md"></div>
          <div className="w-10 h-10 bg-gray-200 rounded-md"></div>
          <div className="w-10 h-10 bg-gray-200 rounded-md"></div>
          <div className="w-10 h-10 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    );
  }