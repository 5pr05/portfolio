import { useEffect, useState, useRef } from 'react'

export const useScrollAnimation = (totalFrames: number = 36) => {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const [isLastFrame, setIsLastFrame] = useState(false)
  const [isStaticFrame, setIsStaticFrame] = useState(true)

  const isAnimatingRef = useRef(false)
  const directionRef = useRef<'forward' | 'backward' | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (isAnimatingRef.current) return

      const delta = e.deltaY
      if (delta > 0 && currentFrame < totalFrames - 1) {
        setHasStarted(true)
        directionRef.current = 'forward'
        playToEnd()
      } else if (delta < 0 && currentFrame > 0) {
        setHasStarted(true)
        directionRef.current = 'backward'
        playToStart()
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [currentFrame, totalFrames])

  const playToEnd = () => {
    isAnimatingRef.current = true

    const step = () => {
      setCurrentFrame((prev) => {
        if (prev < totalFrames - 1) {
          return prev + 1
        } else {
          isAnimatingRef.current = false
          directionRef.current = null
          return prev
        }
      })

      animationFrameRef.current = requestAnimationFrame(() => {
        if (directionRef.current === 'forward' && currentFrame < totalFrames - 1) {
          setTimeout(step, 50)
        }
      })
    }

    step()
  }

  const playToStart = () => {
    isAnimatingRef.current = true

    const step = () => {
      setCurrentFrame((prev) => {
        if (prev > 0) {
          return prev - 1
        } else {
          isAnimatingRef.current = false
          directionRef.current = null
          return prev
        }
      })

      animationFrameRef.current = requestAnimationFrame(() => {
        if (directionRef.current === 'backward' && currentFrame > 0) {
          setTimeout(step, 50)
        }
      })
    }

    step()
  }

  useEffect(() => {
    setIsLastFrame(currentFrame === totalFrames - 1)
    setIsStaticFrame(currentFrame <= 18)
  }, [currentFrame, totalFrames])

  return {
    currentFrame,
    hasStarted,
    isLastFrame,
    isStaticFrame,
  }
}
