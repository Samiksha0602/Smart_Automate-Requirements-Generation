export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#002A5C] border-t-transparent"></div>
        <p className="mt-4 text-[#002A5C]">Loading...</p>
      </div>
    </div>
  )
}
