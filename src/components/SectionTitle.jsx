
export default function SectionTitle({title, extra}){
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold">{title}</h1>
      {extra}
    </div>
  )
}
