import Image from 'next/image'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
  tone?: 'light' | 'dark'
}

export function Logo({
  size = 'md',
  showText = true,
  className = '',
  tone = 'light',
}: LogoProps) {
  const frameClasses = {
    sm: 'h-11 w-11 rounded-[1rem] p-1',
    md: 'h-14 w-14 rounded-[1.2rem] p-1.5',
    lg: 'h-[4.5rem] w-[4.5rem] rounded-[1.45rem] p-1.5',
  }

  const innerClasses = {
    sm: 'rounded-[0.8rem]',
    md: 'rounded-[1rem]',
    lg: 'rounded-[1.2rem]',
  }

  const titleClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }

  const copyTone =
    tone === 'light'
      ? {
          title: 'text-white',
          subtitle: 'text-[#e7c77d]',
        }
      : {
          title: 'text-[#0f0f0f]',
          subtitle: 'text-[#8f6d2d]',
        }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`gold-ring relative flex shrink-0 items-center justify-center border border-[#d9b15f]/30 bg-[linear-gradient(145deg,rgba(217,177,95,0.32),rgba(255,255,255,0.08))] ${frameClasses[size]}`}
      >
        <div
          className={`relative h-full w-full overflow-hidden bg-[#f8f2e6] ${innerClasses[size]}`}
        >
          <Image
            src="/kk-logo.png"
            alt="KK Real Estate Logo"
            fill
            sizes="(max-width: 768px) 56px, 72px"
            className="object-contain scale-[1.26]"
            priority
          />
        </div>
      </div>

      {showText && (
        <div className="leading-none">
          <p className={`font-display font-semibold tracking-[0.16em] uppercase ${copyTone.title} ${titleClasses[size]}`}>
            KK Real Estate
          </p>
          <p className={`mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.34em] ${copyTone.subtitle}`}>
            Verified Prestige
          </p>
        </div>
      )}
    </div>
  )
}
