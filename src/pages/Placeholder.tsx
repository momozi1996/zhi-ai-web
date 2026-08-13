export default function Placeholder({
  title,
  color = '#0B0B0F',
}: {
  title: string
  color?: string
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <h1
        className="border-[3px] border-ink bg-paper px-8 py-4 font-kuaile text-[42px] shadow-hard"
        style={{ color }}
      >
        {title}
      </h1>
    </div>
  )
}
