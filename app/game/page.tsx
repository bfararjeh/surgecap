"use client"

import { useState } from "react"
import { puzzles } from "@/src/puzzles"

export default function Game() {

  const puzzle = puzzles[0]
  const grid = puzzle.grid

  const gui = grid.flatMap((row, rowIndex) =>
    row.map((tile, tileIndex) =>
      <div
      key={`${rowIndex}-${tileIndex}`}
      className="tile"
      onClick={() => setPlayedTiles([...playedTiles, [rowIndex, tileIndex]])}
      >
        {tile.type}
      </div>
    )
  )

  const [playedTiles, setPlayedTiles] = useState<number[][]>([])

  function handleSubmit() {
    let total = 0
    let multiplier = undefined

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
      console.log("Win")
    } else {
      console.log("Lose")
    }

  }


  return (
    <main>
      <h1>Game</h1>
      <a href="/" >Home</a>
      <br/><br/>

      <div className="grid">
        {gui}
      </div>

      <button onClick={() => handleSubmit()}>Submit</button>

      <p>{JSON.stringify(playedTiles)}</p>

    </main>
  )
}