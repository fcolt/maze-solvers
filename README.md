Maze Solver
==============

A simple maze solver/vizualizer for different searching algorithms, built with React, based on [this repo](https://github.com/primaryobjects/maze-generator). View the [demo](https://fcolt.github.io/maze-solvers/).

```
_____________________
|_ _ _ _ _  |  _  | |
|    _ _  |_ _| | | |
| |_  |_  |  _  |_  |
|_  |_  |_|_  |_  | |
| | | | |   | | | | |
| | | | | | | | | | |
| |_  |_ _|_ _| | | |
|  _| |_   _ _  | | |
|   |_  | |  _ _| | |
|_|_ _ _ _|_ _ _|_ _|
```

## How does the generator work?

The generator uses [recursive backtracking](http://weblog.jamisbuck.org/2010/12/27/maze-generation-recursive-backtracking) to generate a maze. The algorithm can be described as listed below.

1. Start at position 0,0 or any random position on the grid.
2. Choose a random wall (north, south, east, or west) to open a passage to the adjacent cell, only if the adjacent cell has not yet been visited and the cell is within the bounds of the grid. This becomes the new current cell.
3. If all adjacent cells have been visited, move back to the last cell that has uncarved walls and repeat.
4. Repeat steps 1-3 until no further cells remain.

## What is it built with?

The maze generator UI is built with Javascript, [React](https://facebook.github.io/react/), and [Milligram](https://milligram.github.io/).

## License

MIT