import MazeGenerator from "./mazeGenerator";

const MazeSolver = {
  solveDfs: function() {
    // Find the start and end points.
    const start = { x: 0, y: 0 };
    const end = { x: MazeGenerator.grid[0].length - 1, y: MazeGenerator.grid.length - 1 };

    // Initialize visited array to keep track of visited cells.
    const visited = [];
    for (let y = 0; y < MazeGenerator.grid.length; y++) {
      visited[y] = [];
      for (let x = 0; x < MazeGenerator.grid[0].length; x++) {
        visited[y][x] = false;
      }
    }

    const path = [];
    MazeSolver.dfs(start, end, visited, path);
    return path;
  },

  dfs: function(current, end, visited, path) {
    // Base case: if current cell is the end point, return true.
    if (current.x === end.x && current.y === end.y) {
      path.push(current);
      return true;
    }

    // Mark current cell as visited.
    visited[current.y][current.x] = true;

    // Define the possible directions.
    const directions = [
      { dx: 0, dy: -1, bit: MazeGenerator.DIRECTION.TOP }, // Top
      { dx: 1, dy: 0, bit: MazeGenerator.DIRECTION.RIGHT },  // Right
      { dx: 0, dy: 1, bit: MazeGenerator.DIRECTION.BOTTOM },  // Bottom
      { dx: -1, dy: 0, bit: MazeGenerator.DIRECTION.LEFT }  // Left
    ];

    // Explore each direction.
    for (let i = 0; i < directions.length; i++) {
      const nextX = current.x + directions[i].dx;
      const nextY = current.y + directions[i].dy;

      // Check if next cell is within the bounds of the maze and not visited.
      if (
        nextX >= 0 && nextX < MazeGenerator.grid[0].length &&
        nextY >= 0 && nextY < MazeGenerator.grid.length &&
        !visited[nextY][nextX] &&
        (MazeGenerator.grid[current.y][current.x] & directions[i].bit) !== 0
      ) {
        // Recursive call for the next cell.
        if (MazeSolver.dfs({ x: nextX, y: nextY }, end, visited, path)) {
          path.push(current); // Add current cell to the path.
          return true;
        }
      }
    }

    // If no path found from this cell, backtrack.
    return false;
  }
};


export default MazeSolver;