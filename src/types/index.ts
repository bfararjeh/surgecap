export type TileType = 
  | "drain"
  | "negate_next"
  | "double_next"
  | "halve_next"
  | "double_global"
  | "halve_global"
  | "blocked"

export interface Tile {
  type: TileType
  value?: number // for drain and drain_x tiles
  next_amp?: number // for scaling tiles
  global_amp?: number // for global scaling tiles
}

export interface Puzzle {
  id: number
  drain_target: number
  grid_size: 3,
  grid: Tile[][] // 3x3 for now
}