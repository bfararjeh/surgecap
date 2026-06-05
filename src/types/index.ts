export type TileType = 
  | "charge"
  | "amp_next"
  | "amp_global"
  | "blocked"

export interface Tile {
  type: TileType
  value?: number
}

export interface Puzzle {
  charge_target: number
  grid: Tile[][]
}