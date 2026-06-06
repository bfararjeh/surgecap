"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { initAudio } from "@/src/audio"

export default function Home() {
	const router = useRouter()
	const [holdProgress, setHoldProgress] = useState(0)
	const holdInterval = useRef<NodeJS.Timeout | null>(null)

	useEffect(() => {
    if (holdProgress >= 100) {
        router.push("/levels")
		initAudio()
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
								background: `linear-gradient(to right, rgba(229, 255, 0, 0.2) ${holdProgress}%, transparent ${holdProgress}%)`
						}}
				>
						Hold to play
				</button>
      </div>
    </main>
  )
}