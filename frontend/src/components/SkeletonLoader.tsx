"use client"

interface SkeletonLoaderProps {
  height?: string
  width?: string
  count?: number
  className?: string
}

export default function SkeletonLoader({
  height = "h-4",
  width = "w-full",
  count = 1,
  className = "",
}: SkeletonLoaderProps) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${width} ${height} bg-gradient-to-r from-[#fefae0] via-[#f5f1e8] to-[#fefae0] rounded animate-pulse ${
            i < count - 1 ? "mb-3" : ""
          }`}
          style={{
            backgroundSize: "200% 100%",
            animation: "shimmer 2s infinite",
          }}
        ></div>
      ))}

      <style>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  )
}
