import MazeGenerator from "./mazeGenerator";
import { PriorityQueue } from "@datastructures-js/priority-queue";

const MazeSolver = {
  solveDfs: function () {
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
    const visitedNodes = [];
    MazeSolver.dfs(start, end, visited, path, visitedNodes);
    return [path.reverse(), visitedNodes];
  },

  dfs: function (current, end, visited, path, visitedNodes) {
    // Base case: if current cell is the end point, return true.
    if (current.x === end.x && current.y === end.y) {
      path.push(current);
      return true;
    }

    visited[current.y][current.x] = true;
    visitedNodes.push({ x: current.x, y: current.y });

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
        if (MazeSolver.dfs({ x: nextX, y: nextY }, end, visited, path, visitedNodes)) {
          path.push(current); // Add current cell to the path.
          return true;
        }
      }
    }

    // If no path found from this cell, backtrack.
    return false;
  },

  solveBfs: function () {
    // Find the start and end points.
    const start = { x: 0, y: 0 };
    const end = { x: MazeGenerator.grid[0].length - 1, y: MazeGenerator.grid.length - 1 };
    const visitedNodes = [];

    // Initialize visited array to keep track of visited cells.
    const visited = [];
    for (let y = 0; y < MazeGenerator.grid.length; y++) {
      visited[y] = [];
      for (let x = 0; x < MazeGenerator.grid[0].length; x++) {
        visited[y][x] = false;
      }
    }

    // Initialize queue for BFS.
    const queue = [];
    queue.push({ cell: start, path: [start] });

    while (queue.length > 0) {
      const { cell, path } = queue.shift(); // Dequeue
      visited[cell.y][cell.x] = true;
      visitedNodes.push({ x: cell.x, y: cell.y });

      // If the current cell is the end point, return the path.
      if (cell.x === end.x && cell.y === end.y) {
        return [path, visitedNodes];
      }

      const directions = [
        { dx: 0, dy: -1, bit: MazeGenerator.DIRECTION.TOP }, // Top
        { dx: 1, dy: 0, bit: MazeGenerator.DIRECTION.RIGHT }, // Right
        { dx: 0, dy: 1, bit: MazeGenerator.DIRECTION.BOTTOM }, // Bottom
        { dx: -1, dy: 0, bit: MazeGenerator.DIRECTION.LEFT }, // Left
      ];

      for (let i = 0; i < directions.length; i++) {
        const nextX = cell.x + directions[i].dx;
        const nextY = cell.y + directions[i].dy;

        // Check if next cell is within the bounds of the maze and not visited.
        if (
          nextX >= 0 &&
          nextX < MazeGenerator.grid[0].length &&
          nextY >= 0 &&
          nextY < MazeGenerator.grid.length &&
          !visited[nextY][nextX] &&
          (MazeGenerator.grid[cell.y][cell.x] & directions[i].bit) !== 0
        ) {
          // Enqueue the next cell and its path.
          const nextCell = { x: nextX, y: nextY };
          const nextPath = [...path, nextCell];
          queue.push({ cell: nextCell, path: nextPath });
        }
      }
    }

    return [[], []];
  },

  solveAStar: function () {
    // Find the start and end points.
    const start = { x: 0, y: 0 };
    const end = { x: MazeGenerator.grid[0].length - 1, y: MazeGenerator.grid.length - 1 };
    const visitedNodes = [];

    // Initialize visited array to keep track of visited cells.
    const visited = [];
    for (let y = 0; y < MazeGenerator.grid.length; y++) {
      visited[y] = [];
      for (let x = 0; x < MazeGenerator.grid[0].length; x++) {
        visited[y][x] = false;
      }
    }

    const queue = new PriorityQueue(
      (a, b) => a.cost - b.cost // Sort by total cost
    );

    queue.enqueue({ cell: start, cost: 0 });

    // Tracking parent cells for path reconstruction.
    const parentMap = {};
      
    while (queue.size() > 0) {
      const { cell, cost } = queue.dequeue(); // Dequeue the cell with the lowest cost.
      visited[cell.y][cell.x] = true;
      visitedNodes.push({ x: cell.x, y: cell.y });

      // If the current cell is the end point, reconstruct and return the path.
      if (cell.x === end.x && cell.y === end.y) {
        return [MazeSolver.reconstructPath(parentMap, end), visitedNodes];
      }

      const directions = [
        { dx: 0, dy: -1, bit: MazeGenerator.DIRECTION.TOP },
        { dx: 1, dy: 0, bit: MazeGenerator.DIRECTION.RIGHT },
        { dx: 0, dy: 1, bit: MazeGenerator.DIRECTION.BOTTOM },
        { dx: -1, dy: 0, bit: MazeGenerator.DIRECTION.LEFT } 
      ];

      for (let i = 0; i < directions.length; i++) {
        const nextX = cell.x + directions[i].dx;
        const nextY = cell.y + directions[i].dy;

        // Check if next cell is within the bounds of the maze and not visited.
        if (
          nextX >= 0 && nextX < MazeGenerator.grid[0].length &&
          nextY >= 0 && nextY < MazeGenerator.grid.length &&
          !visited[nextY][nextX] &&
          (MazeGenerator.grid[cell.y][cell.x] & directions[i].bit) !== 0
        ) {
          // Calculate the Manhattan distance from the next cell to the end cell.
          const heuristic = Math.abs(end.x - nextX) + Math.abs(end.y - nextY);

          const totalCost = cost + 1 + heuristic; // 1 is the cost of moving to a neighboring cell

          queue.enqueue({ cell: { x: nextX, y: nextY }, cost: totalCost });

          parentMap[`${nextX},${nextY}`] = cell;
        }
      }
    }

    return [[], []];
  },

  // Reconstruct the path from the parentMap.
  reconstructPath: function (parentMap, end) {
    const path = [];
    let current = end;

    // Traverse parentMap to reconstruct the path.
    while (parentMap[`${current.x},${current.y}`]) {
      path.push(current);
      current = parentMap[`${current.x},${current.y}`];
    }

    // Add the start cell to the path.
    path.push({ x: 0, y: 0 });

    // Reverse the path to get it from start to end.
    return path.reverse();
  }
};


export default MazeSolver;