"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getProgress } from "@/src/progress"
import { puzzles } from "@/src/puzzles"
import { initAudio } from "@/src/audio"

export default function Levels() {
    const router = useRouter()
    const [unlockedLevel, setUnlockedLevel] = useState(1)

    useEffect(() => {
        setUnlockedLevel(getProgress())
    }, [])

    function handleLevelClick(index: number) {
        initAudio()
        if (index + 1 > unlockedLevel) return
        router.push(`/game?level=${index}`)
    }

    return (
        <main>
            <div className="levels-content">
                <h1>Select Level</h1>
                <div className="levels-grid">
                    {puzzles.map((_, index) => {
                        const levelNumber = index + 1
                        const isUnlocked = levelNumber <= unlockedLevel
                        const isCompleted = levelNumber < unlockedLevel
                        return (
                            <div
                                key={index}
                                className={`level-node ${isCompleted ? "level-completed" : isUnlocked ? "level-unlocked" : "level-locked"}`}
                                onClick={() => handleLevelClick(index)}
                            >
                                {isUnlocked ? levelNumber : ""}
                            </div>
                        )
                    })}
                </div>
            </div>
        </main>
    )
}