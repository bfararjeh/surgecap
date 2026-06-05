import { Puzzle } from "@/src/types"

const puzzle1: Puzzle = {
    id:1,
    drain_target: 150,
    grid_size: 3,
    grid: [
        [{type: "blocked"}, {type: "blocked"}, {type: "blocked"}],
        [{type: "drain", value: 50}, {type: "drain", value: 50}, {type: "drain", value: 50}],
        [{type: "blocked"}, {type: "blocked"}, {type: "blocked"}]
    ]
}

const puzzle2: Puzzle = {
    id:2,
    drain_target: 150,
    grid_size: 3,
    grid: [
        [{type: "blocked"}, {type: "blocked"}, {type: "drain", value: 50}],
        [{type: "drain", value: 50}, {type: "drain", value: 50}, {type: "drain", value: 50}],
        [{type: "blocked"}, {type: "drain", value: 100}, {type: "blocked"}]
    ]
}

const puzzle3: Puzzle = {
    id:3,
    drain_target: 400,
    grid_size: 3,
    grid: [
        [{type: "drain", value: 50}, {type: "drain", value: 100}, {type: "drain", value: 120}],
        [{type: "blocked"}, {type: "drain", value: 80}, {type: "blocked"}],
        [{type: "drain", value: 150}, {type: "drain", value: 50}, {type: "drain", value: 120}]
    ]
}

const puzzle4: Puzzle = {
    id:3,
    drain_target: 400,
    grid_size: 3,
    grid: [
        [{type: "drain", value: 50}, {type: "drain", value: 100}, {type: "drain", value: 120}],
        [{type: "blocked"}, {type: "drain", value: 80}, {type: "blocked"}],
        [{type: "drain", value: 150}, {type: "drain", value: 50}, {type: "drain", value: 120}]
    ]
}

const puzzle5: Puzzle = {
    id:3,
    drain_target: 400,
    grid_size: 3,
    grid: [
        [{type: "drain", value: 50}, {type: "drain", value: 100}, {type: "drain", value: 120}],
        [{type: "blocked"}, {type: "drain", value: 80}, {type: "blocked"}],
        [{type: "drain", value: 150}, {type: "drain", value: 50}, {type: "drain", value: 120}]
    ]
}

export const puzzles: Puzzle[] = [puzzle1, puzzle2, puzzle3]