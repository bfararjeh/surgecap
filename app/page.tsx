"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
	const [holdProgress, setHoldProgress] = useState(0)
	const holdInterval = useRef<NodeJS.Timeout | null>(null)

  const [sparks, setSparks] = useState<{
      id: number
      left: string
      top: string
      duration: string
      delay: string
      size: string
  }[]>([])

  useEffect(() => {
      setSparks(Array.from({ length: 30 }, (_, i) => ({
          id: i,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          duration: `${2 + Math.random() * 3}s`,
          delay: `-${Math.random() * 3}s`,
          size: `${2 + Math.random() * 3}px`
      })))
  }, [])

	useEffect(() => {
    if (holdProgress >= 100) {
        router.push("/game")
    }
	}, [holdProgress])

	function handleHoldStart() {
			holdInterval.current = setInterval(() => {
					setHoldProgress(prev => {
							if (prev >= 100) {
									clearInterval(holdInterval.current!)
									return 100
							}
							return prev + 2
					})
			}, 20)
	}

	function handleHoldEnd() {
			if (holdInterval.current) {
					clearInterval(holdInterval.current)
					holdInterval.current = null
			}
			setHoldProgress(0)
	}

  return (
    <main>
      <div className="hero">
          SurgeCap
					<button
							className="play-button"
							onMouseDown={handleHoldStart}
							onMouseUp={handleHoldEnd}
							onMouseLeave={handleHoldEnd}
							onTouchStart={handleHoldStart}
							onTouchEnd={handleHoldEnd}
							style={{
									background: `linear-gradient(to right, rgba(0, 212, 255, 0.2) ${holdProgress}%, transparent ${holdProgress}%)`
							}}
					>
							PLAY
					</button>
      </div>
      <div className="spark-container">
          {sparks.map(spark => (
              <div
                  key={spark.id}
                  className="spark"
                  style={{
                      left: spark.left,
                      top: spark.top,
                      width: spark.size,
                      height: spark.size,
                      animationDuration: spark.duration,
                      animationDelay: spark.delay
                  }}
              />
          ))}
      </div>
    </main>
  )
}