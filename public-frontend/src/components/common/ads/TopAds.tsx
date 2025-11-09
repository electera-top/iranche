import Image from 'next/image'

export default function TopAds() {
  return (
    <div className="w-full bg-primary flex justify-center">
      <div className="relative w-full">
        <Image
          src="/images/ads.webp"
          alt="تبلیغات"
          width={1440}
          height={80}
          className="w-full object-cover"
          priority
          quality={100}
          sizes="100vw"
        />
      </div>
    </div>
  )
}