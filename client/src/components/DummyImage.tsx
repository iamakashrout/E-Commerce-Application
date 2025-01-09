import Image from 'next/image'

export default function DummyImage() {
  return (
    <div className="w-40 h-40 bg-gray-200 flex items-center justify-center rounded-lg">
      <Image
        src="/placeholder.svg"
        alt="no image available"
        width={100}
        height={100}
      />
    </div>
  )
}

