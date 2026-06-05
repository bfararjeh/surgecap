"use client"

import { useEffect, useState } from "react"
import { puzzles } from "@/src/puzzles"
import { Tile } from "@/src/types"

export default function Game() {

  // const variabls

  const TILE_SIZE = 100
  const GAP = 25

  const [puzzleIndex, setPuzzleIndex] = useState(0)
  const [playedTiles, setPlayedTiles] = useState<number[][]>([])
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">("playing")
  const [score, setScore] = useState<number | null>(null)
  const puzzle = puzzles[puzzleIndex]
  const grid = puzzle.grid
  const gridSize = puzzle.grid.length

  const svgSize = gridSize * TILE_SIZE + (gridSize - 1) * GAP

  const [currentStep, setCurrentStep] = useState<number | null>(null)
  const [displayTotal, setDisplayTotal] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

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


  // game logic

  function isAdjacent(a: number[], b: number[]): boolean {
    return (((Math.abs(a[0] - b[0]) == 1 && a[1] == b[1])) || 
      ((Math.abs(a[1] - b[1]) == 1) && a[0] == b[0]))
  }

  function handleTileClick(rowIndex: number, colIndex: number) {
    const position = [rowIndex, colIndex]
    const currentTile = grid[rowIndex][colIndex]
    const lastPlayed = playedTiles[playedTiles.length - 1]

    if (gameStatus === "won") return

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
      setPlayedTiles([...playedTiles, [rowIndex, colIndex]])
    } else {
      console.log("Invalid click") // do something nicer later
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
    setPlayedTiles([])
    setGameStatus("playing")
  }

  function handleNext() {
    if (puzzleIndex < puzzles.length - 1) {
        setPuzzleIndex(puzzleIndex + 1)
        handleReset()
    } else {
        console.log("No more puzzles!")
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
          x: col * (TILE_SIZE + GAP) + TILE_SIZE / 2,
          y: row * (TILE_SIZE + GAP) + TILE_SIZE / 2
      }
  }


  // submit + animation

  useEffect(() => {
      if (currentStep === null) return
      if (currentStep >= playedTiles.length) {
          const total = calculateTotal(playedTiles)
          setScore(total)
          setGameStatus(total === puzzle.charge_target ? "won" : "lost")
          setIsAnimating(false)
          setCurrentStep(null)
          return
      }
      setDisplayTotal(calculateTotal(playedTiles.slice(0, currentStep + 1)))
      const timer = setTimeout(() => {
          setCurrentStep(prev => prev !== null ? prev + 1 : null)
      }, 500)
      return () => clearTimeout(timer)
  }, [currentStep])

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

  return (
    <main>
      <div className="title">SurgeCap</div>
        <div className="game-container">
          <div className="grid-wrapper" style={{ width: svgSize, height: svgSize }}>
          <div 
            className="grid"
            style={{ 
              gridTemplateColumns: `repeat(${gridSize}, ${TILE_SIZE}px)`,
              gridTemplateRows: `repeat(${gridSize}, ${TILE_SIZE}px)`,
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

          <div className="detail-wrapper">
            <p>Goal is {puzzle.charge_target}</p>
            <button 
              onClick={() => handleSubmit()} 
              disabled={playedTiles.length === 0 || checkSubmitValidity()}
              >
              Charge
            </button>
            <button onClick={() => handleReset()}>Reset</button>
            {gameStatus === "won" && (
              <button onClick={() => handleNext()}>Next</button>
            )}
            {gameStatus === "lost" && (
              <p>you scored {score} - target was {puzzle.charge_target}</p>
            )}
            <p>{gameStatus}</p>
            <p>Charge: {isAnimating ? displayTotal : score ?? 0}</p>
          </div>
        </div>
    </main>
  )
}