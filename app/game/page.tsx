"use client"

import { useState } from "react"
import { puzzles } from "@/src/puzzles"
import { Tile } from "@/src/types"

export default function Game() {

  const [puzzleIndex, setPuzzleIndex] = useState(0)
  const [playedTiles, setPlayedTiles] = useState<number[][]>([])
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">("playing")
  const puzzle = puzzles[puzzleIndex]
  const grid = puzzle.grid

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

  function isAdjacent(a: number[], b: number[]): boolean {
    return (((Math.abs(a[0] - b[0]) == 1 && a[1] == b[1])) || 
      ((Math.abs(a[1] - b[1]) == 1) && a[0] == b[0]))
  }

  function handleTileClick(rowIndex: number, colIndex: number) {
    const position = [rowIndex, colIndex]
    const currentTile = grid[rowIndex][colIndex]

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
      for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 3; col++) {
              if (isValidNextMove(row, col)) return true
          }
      }
      return false
  }
    
  function handleSubmit() {
    let total = 0
    let multiplier = undefined

    if (checkSubmitValidity()) {
      console.log("Valid moves still remain")
      return
    }

    for (const position of playedTiles) {
      const [row, col] = position
      const currentTile = grid[row][col]

      const tileVal = currentTile.value
      const tileNextAmp = currentTile.next_amp
      const tileGlobalAmp = currentTile.global_amp

      if (tileVal !== undefined) {
        if (multiplier !== undefined) {
          total += tileVal * multiplier
          multiplier = undefined
        } else {
          total += tileVal
        }
      }

      if (tileNextAmp !== undefined) {
        multiplier = tileNextAmp
      }

      if (tileGlobalAmp !== undefined) {
        total *= tileGlobalAmp
      }
    }

    if (total === puzzle.drain_target) {
      setGameStatus("won")
    } else {
      setGameStatus("lost")
    }

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

    if (tile.type === "blocked") {
      return "tile-blocked"
    } else if (lastPlayed && lastPlayed[0] === rowIndex && lastPlayed[1] === colIndex) {
      return "tile-recent"
    } else if (playedTiles.some(p => p[0] === rowIndex && p[1] === colIndex)) {
      return "tile-played"
    } else if (isValidNextMove(rowIndex, colIndex)) {
      return "tile-valid"
    }

    return "tile-default"
  }

  function getTileDisplay(tile: Tile): string {
      if (tile.value !== undefined) return `${tile.value}`
      if (tile.next_amp !== undefined) return `x${tile.next_amp} next`
      if (tile.global_amp !== undefined) return `x${tile.global_amp} all`
      return ""
  }

  return (
    <main>
      <h1>Game</h1>
      <a href="/" >Home</a>

      <div className="grid">{playground}</div>
      <p>Goal is {puzzle.drain_target}</p>

      <button 
        onClick={() => handleSubmit()} 
        disabled={playedTiles.length === 0 || checkSubmitValidity()}
      >
        Submit
      </button>
      <button onClick={() => handleReset()}>Reset</button>
      {gameStatus === "won" && (
          <button onClick={() => handleNext()}>Next</button>
      )}

      <p>{gameStatus}</p>

    </main>
  )
}