import type { FC } from "react"

interface LogoProps {
  className?: string
}

const Logo: FC<LogoProps> = ({ className = "w-10 h-10" }) => {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#16a34a" />
      <path
        d="M30 70C30 57.85 39.85 48 52 48C64.15 48 74 57.85 74 70"
        stroke="white"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path d="M52 48C52 48 52 30 52 30C52 30 70 30 70 30" stroke="white" strokeWidth="6" strokeLinecap="round" />
      <path d="M52 48C52 48 52 30 52 30C52 30 34 30 34 30" stroke="white" strokeWidth="6" strokeLinecap="round" />
      <circle cx="52" cy="30" r="6" fill="white" />
    </svg>
  )
}

export default Logo

