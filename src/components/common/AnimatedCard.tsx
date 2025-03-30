import type { FC, ReactNode } from "react"

interface AnimatedCardProps {
  children: ReactNode
  className?: string
  delay?: number
}

const AnimatedCard: FC<AnimatedCardProps> = ({ children, className = "", delay = 0 }) => {
  const delayStyle = delay ? { animationDelay: `${delay}ms` } : {}

  return (
    <div className={`card-hover fade-in slide-in ${className}`} style={delayStyle}>
      {children}
    </div>
  )
}

export default AnimatedCard

