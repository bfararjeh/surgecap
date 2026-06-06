"use client"

import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { puzzles } from "@/src/puzzles"
import { Tile } from "@/src/types"
import { playPing, playWin, playLose, playButton, playReset, toggleMusic, toggleSfx, initAudio } from "@/src/audio"
import { saveProgress } from "@/src/progress"
import { useRouter } from "next/navigation"

export default function Game() {

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
      const level = searchParams.get("level")
      if (level === null) {
          router.push("/levels")
          return
      }
      setPuzzleIndex(parseInt(level))
  }, [searchParams])

  const initialLevel = parseInt(searchParams.get("level") ?? "0")
  const [puzzleIndex, setPuzzleIndex] = useState(initialLevel)

  const [playedTiles, setPlayedTiles] = useState<number[][]>([])
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">("playing")
  const [score, setScore] = useState<number | null>(null)

  const puzzle = puzzles[puzzleIndex]
  const grid = puzzle.grid
  const gridSize = puzzle.grid.length

  const [tileSize, setTileSize] = useState(100)
  const GAP = 25
  
  useEffect(() => { // constant check tilesie
    function calculate() {
        setTileSize(Math.min(100, Math.floor((window.innerWidth * 0.8) / gridSize)))
    }
    calculate()
    window.addEventListener("resize", calculate)
    return () => window.removeEventListener("resize", calculate)
  }, [gridSize])
  
  const svgSize = gridSize * tileSize + (gridSize - 1) * GAP

  const [currentStep, setCurrentStep] = useState<number | null>(null)
  const [displayTotal, setDisplayTotal] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animatedTotal, setAnimatedTotal] = useState(0)
  const animationRef = useRef<number | null>(null)

  const playground = grid.flatMap((row, rowIndex) =>
    row.map((tile, colIndex) =>
      <div
      key={`${rowIndex}-${colIndex}`}
      className={getTileClass(rowIndex, colIndex)}
      onClick={() => handleTileClick(rowIndex, colIndex)}
      >
        {getTileDisplay(tile)}
      </div>
    )
  )

  const [musicMuted, setMusicMuted] = useState(false)
  const [sfxMuted, setSfxMuted] = useState(false)

  // game logic

  function isAdjacent(a: number[], b: number[]): boolean {
    return (((Math.abs(a[0] - b[0]) == 1 && a[1] == b[1])) || 
      ((Math.abs(a[1] - b[1]) == 1) && a[0] == b[0]))
  }

  function handleTileClick(rowIndex: number, colIndex: number) {
    initAudio()
    const position = [rowIndex, colIndex]
    const currentTile = grid[rowIndex][colIndex]
    const lastPlayed = playedTiles[playedTiles.length - 1]

    if (gameStatus !== "playing") return

    // if clicking last played tile, unclick it
    if (lastPlayed && lastPlayed[0] === rowIndex && lastPlayed[1] === colIndex) {
        setPlayedTiles(playedTiles.slice(0, -1))
        return
    }

    // if clicking a played tile that isn't last, rewind to that point
    const clickedIndex = playedTiles.findIndex(p => p[0] === rowIndex && p[1] === colIndex)
    if (clickedIndex !== -1) {
        setPlayedTiles(playedTiles.slice(0, clickedIndex+1))
        return
    }

    let validClick = false

    // blocked check
    if (currentTile.type !== "blocked") {
      // already played check
      if (!(playedTiles.some(p => p[0] === position[0] && p[1] === position[1]))) {
        // first tile check
        if (playedTiles.length === 0) {
          validClick = true
        } else {
          // adjacency check
          if (isAdjacent(position, playedTiles[playedTiles.length - 1])) {
            validClick = true
          }
        }
      }
    }

    if (validClick) {
      playButton()
      setPlayedTiles([...playedTiles, [rowIndex, colIndex]])
    }
  }

  function isValidNextMove(rowIndex: number, colIndex: number): boolean {
      const tile = grid[rowIndex][colIndex]
      const lastPlayed = playedTiles[playedTiles.length - 1]
      
      if (!lastPlayed) return false
      if (tile.type === "blocked") return false
      if (playedTiles.some(p => p[0] === rowIndex && p[1] === colIndex)) return false
      if (!isAdjacent(lastPlayed, [rowIndex, colIndex])) return false
      
      return true
  }

  function checkSubmitValidity(): boolean {
      if (playedTiles.length === 0) return false
      for (let row = 0; row < gridSize; row++) {
          for (let col = 0; col < gridSize; col++) {
              if (isValidNextMove(row, col)) return true
          }
      }
      return false
  }

  function handleReset() {
    if (isAnimating) return
    playReset()
    setPlayedTiles([])
    setDisplayTotal(0)
    setAnimatedTotal(0)
    setScore(null)
    setGameStatus("playing")
  }

  function handleNext() {
    if (puzzleIndex < puzzles.length - 1) {
      saveProgress(puzzleIndex + 2)
      handleReset()
      router.push(`/game?level=${puzzleIndex + 1}`)
    } else {
      router.push("/levels")
    }
  }

  function getTileClass(rowIndex: number, colIndex: number): string {
      const tile = grid[rowIndex][colIndex]
      const lastPlayed = playedTiles[playedTiles.length - 1]

      let bgClass = ""
      if (tile.type === "blocked") return "tile-blocked"
      if (tile.type === "charge") bgClass = "tile-charge"
      if (tile.type === "amp_next") bgClass = "tile-next-amp"
      if (tile.type === "amp_global") bgClass = "tile-global-amp"

      let stateClass = ""

      if (currentStep !== null && playedTiles.slice(0, currentStep + 1).some(p => p[0] === rowIndex && p[1] === colIndex)) {
          // during animation — yellow up to current step
          stateClass = "tile-animating"
      } else if (gameStatus !== "playing" && playedTiles.some(p => p[0] === rowIndex && p[1] === colIndex)) {
          // after animation — keep whole path yellow
          stateClass = "tile-animating"
      } else if (!isAnimating && lastPlayed && lastPlayed[0] === rowIndex && lastPlayed[1] === colIndex) {
          // normal play — highlight last played
          stateClass = "tile-recent"
      } else if (playedTiles.some(p => p[0] === rowIndex && p[1] === colIndex)) {
          stateClass = "tile-played"
      } else if (isValidNextMove(rowIndex, colIndex)) {
          stateClass = "tile-valid"
      }

      return `${bgClass} ${stateClass}`.trim()
  }

  function getTileDisplay(tile: Tile): string {
      if (tile.type === "charge") return `${tile.value}`
      if (tile.type === "amp_next") return `x${tile.value} next`
      if (tile.type === "amp_global") return `x${tile.value} all`
      return ""
  }
  
  function getTileCenter(row: number, col: number) {
      return {
          x: col * (tileSize + GAP) + tileSize / 2,
          y: row * (tileSize + GAP) + tileSize / 2
      }
  }


  // submit + animation

  useEffect(() => {
      if (currentStep === null) return
      if (currentStep >= playedTiles.length) {
          const total = calculateTotal(playedTiles)
          setScore(total)
          if (total === puzzle.charge_target) {
              setGameStatus("won")
              playWin()
          } else {
              setGameStatus("lost")
              playLose()
          }
          setIsAnimating(false)
          setCurrentStep(null)
          return
      }
      setDisplayTotal(calculateTotal(playedTiles.slice(0, currentStep + 1)))
      playPing(currentStep)
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev !== null ? prev + 1 : null)
      }, 500)
      return () => clearTimeout(timer)
  }, [currentStep])

  useEffect(() => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      
      const startValue = animatedTotal
      const endValue = displayTotal
      const duration = 350
      const startTime = performance.now()

      function animate(now: number) {
          const elapsed = now - startTime
          const progress = Math.min(elapsed / duration, 1)
          // logarithmic easing — fast start, slow finish
          const eased = 1 - Math.pow(1 - progress, 3)
          const current = Math.round(startValue + (endValue - startValue) * eased)
          setAnimatedTotal(current)
          if (progress < 1) {
              animationRef.current = requestAnimationFrame(animate)
          }
      }

      animationRef.current = requestAnimationFrame(animate)
      return () => {
          if (animationRef.current) cancelAnimationFrame(animationRef.current)
      }
  }, [displayTotal])


  function calculateTotal(positions: number[][]): number {
      let total = 0
      let multiplier: number | undefined = undefined
      for (const position of positions) {
          const [row, col] = position
          const tile = grid[row][col]
          if (tile.type === "charge" && tile.value !== undefined) {
              if (multiplier !== undefined) {
                  total += tile.value * multiplier
                  multiplier = undefined
              } else {
                  total += tile.value
              }
          }
          if (tile.type === "amp_next" && tile.value !== undefined) {
              multiplier = tile.value
          }
          if (tile.type === "amp_global" && tile.value !== undefined) {
              total *= tile.value
          }
      }
      return total
  }

  function handleSubmit() {
      if (checkSubmitValidity()) return
      setIsAnimating(true)
      setCurrentStep(0)
      setDisplayTotal(0)
  }

  function Battery() {
      const percent = (animatedTotal / puzzle.charge_target) * 100
      const clampedPercent = Math.min(percent, 100)

      // 0% = yellow, 100% = cyan-green
      // beyond 100% shift toward red, capped at 200% 
      const hue = 60 + (clampedPercent / 100) * 60
      const overfullProgress = Math.min((percent - 50) / 100, 1)
      const overfullHue = percent > 100 ? Math.max(0, 120 - (overfullProgress * 120)) : hue
      const colour = `hsl(${overfullHue}, 90%, 65%)`

      const fillTransform = {
          transformOrigin: "6px center",
          transform: `scaleX(${Math.max(0, clampedPercent / 100)})`,
          transition: "transform 0.3s linear"
      }

      const colourTransition = { transition: "all 0.3s ease" }

      return (
          <svg width="200" height="60" viewBox="0 0 95 60">
              <rect x="2" y="10" width="88" height="40" rx="2" ry="2"
                  style={{ fill: "transparent", stroke: colour, strokeWidth: 3, ...colourTransition }} />
              <rect x="90" y="22" width="5" height="16" rx="1" ry="1"
                  style={{ fill: colour, ...colourTransition }} />
              <rect x="6" y="14" width="80" height="32" rx="1" ry="1"
                  style={{ fill: colour, opacity: 0.8, ...fillTransform, ...colourTransition }} />
          </svg>
      )
  }

  return (
    <main>
      <div className="title">SurgeCap</div>
      <button
      onClick={() => router.push("/levels")}
      className="game-button-option">
        Back
      </button>
        <div className="game-container">
          <div className="battery-wrapper">
            <p>{animatedTotal} / {puzzle.charge_target}</p>
            <Battery />
              {score !== null && (
                  <p>
                      {score === puzzle.charge_target
                          ? "Charged!"
                          : score > puzzle.charge_target
                          ? "Overcharged!"
                          : "Underpowered!"}
                  </p>
              )}
          </div>
          <div className="grid-wrapper" style={{ width: svgSize, height: svgSize }}>
          <div 
            className="grid"
            style={{ 
              gridTemplateColumns: `repeat(${gridSize}, ${tileSize}px)`,
              gridTemplateRows: `repeat(${gridSize}, ${tileSize}px)`,
              gap: `${GAP}px`
            }}
            >
            {playground}
          </div>

          <svg width={svgSize} height={svgSize} className="tube-layer">
            {/* lines showing played moves */}
            {playedTiles.slice(0, -1).map((pos, i) => {
              const from = getTileCenter(pos[0], pos[1])
              const to = getTileCenter(playedTiles[i + 1][0], playedTiles[i + 1][1])
              return (
                <line
                key={`played-${i}`}
                x1={from.x} y1={from.y}
                x2={to.x} y2={to.y}
                stroke="yellow"
                strokeWidth="3"
                className="tube-played"
                />
              )
            })}
            {/* lines showing valid moves */}
            {playedTiles.length > 0 && (() => {
              const lastPlayed = playedTiles[playedTiles.length - 1]
              const neighbours = [
                [lastPlayed[0]-1, lastPlayed[1]],
                [lastPlayed[0]+1, lastPlayed[1]],
                [lastPlayed[0], lastPlayed[1]-1],
                [lastPlayed[0], lastPlayed[1]+1]
              ]
              return neighbours
              .filter(([row, col]) => 
                row >= 0 && row < gridSize &&
              col >= 0 && col < gridSize &&
              isValidNextMove(row, col)
            )
            .map(([row, col], i) => {
              const from = getTileCenter(lastPlayed[0], lastPlayed[1])
              const to = getTileCenter(row, col)
              return (
                <line
                key={`valid-${i}`}
                x1={from.x} y1={from.y}
                x2={to.x} y2={to.y}
                stroke="cyan"
                strokeWidth="3"
                className="tube-valid"
                />
              )
            })
          })()}
          </svg>
          </div>
          <div style={{ flex: 1 }} />
          <div className="detail-buttons">
              <button 
              onClick={() => handleReset()} 
              className="game-button-reset" 
              disabled={isAnimating}>
                reset
              </button>
              {gameStatus === "won"
                  ? <button onClick={() => handleNext()} className="game-button-next">Next</button>
                  : <button
                      onClick={() => handleSubmit()}
                      disabled={playedTiles.length === 0 || checkSubmitValidity() || isAnimating || gameStatus !== "playing"}
                      className="game-button-charge"
                    >
                      Charge
                    </button>
              }
          </div>
          <div className="detail-buttons">
            <button
                onClick={() => setMusicMuted(toggleMusic())}
                className="game-button-option"
                >
                {musicMuted ? "♪ off" : "♪ on"}
            </button>
            <button
                onClick={() => setSfxMuted(toggleSfx())}
                className="game-button-option"
                >
                {sfxMuted ? "sfx off" : "sfx on"}
            </button>
          </div>
        </div>
    </main>
  )
}