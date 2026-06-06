import { Puzzle } from "@/src/types"

const puzzle1: Puzzle = {
    charge_target: 400,
    grid: [
        [{type: "charge", value: 80}, {type: "blocked"}, {type: "charge", value: 80}, {type: "blocked"}],
        [{type: "amp_next", value: 2}, {type: "charge", value: 80}, {type: "charge", value: 80}, {type: "blocked"}],
        [{type: "charge", value: 40}, {type: "charge", value: 20}, {type: "charge", value: 100}, {type: "blocked"}],
        [{type: "charge", value: 40}, {type: "amp_global", value: 3}, {type: "charge", value: 100}, {type: "blocked"}]
  ]
}

const puzzle2: Puzzle = {
    charge_target: 150,
    grid: [
        [{type: "blocked"}, {type: "blocked"}, {type: "charge", value: 50}],
        [{type: "charge", value: 50}, {type: "charge", value: 50}, {type: "charge", value: 50}],
        [{type: "blocked"}, {type: "charge", value: 100}, {type: "blocked"}]
    ]
}

const puzzle3: Puzzle = {
    charge_target: 400,
    grid: [
        [{type: "charge", value: 50}, {type: "charge", value: 100}, {type: "charge", value: 120}],
        [{type: "blocked"}, {type: "charge", value: 80}, {type: "blocked"}],
        [{type: "charge", value: 150}, {type: "charge", value: 50}, {type: "charge", value: 120}]
    ]
}

const puzzle4: Puzzle = {
    charge_target: 400,
    grid: [
        [{type: "charge", value: 80}, {type: "blocked"}, {type: "charge", value: 80}],
        [{type: "charge", value: 80}, {type: "charge", value: 80}, {type: "charge", value: 80}],
        [{type: "charge", value: 40}, {type: "charge", value: 20}, {type: "charge", value: 100}]
  ]
}

const puzzle5: Puzzle = {
    charge_target: 400,
    grid: [
        [{type: "charge", value: 80}, {type: "blocked"}, {type: "charge", value: 80}, {type: "blocked"}],
        [{type: "charge", value: 80}, {type: "charge", value: 80}, {type: "charge", value: 80}, {type: "blocked"}],
        [{type: "charge", value: 40}, {type: "charge", value: 20}, {type: "charge", value: 100}, {type: "blocked"}],
        [{type: "charge", value: 40}, {type: "charge", value: 20}, {type: "charge", value: 100}, {type: "blocked"}]
  ]
}

export const puzzles: Puzzle[] = [puzzle1, puzzle2, puzzle3, puzzle4, puzzle5]