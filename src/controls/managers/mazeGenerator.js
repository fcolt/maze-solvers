const MazeGenerator = {
  grid: null,

  DIRECTION: {
    TOP: 2,
    RIGHT: 4,
    BOTTOM: 8,
    LEFT: 16,
  },

  CELL: {
    OPEN: 1,
    CLOSED: 0,
    CLEAR: -1,
    PATH: 2,
  },

  initialize: function (width, height) {
    MazeGenerator.grid = [];

    // Initialize cells to 0.
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        MazeGenerator.grid[y] = MazeGenerator.grid[y] || [];
        MazeGenerator.grid[y][x] = 0;
      }
    }

    MazeGenerator.carve(0, 0);
  },

  opposite: function (direction) {
    let result = 0;

    switch (direction) {
      case MazeGenerator.DIRECTION.TOP:
        result = MazeGenerator.DIRECTION.BOTTOM;
        break;
      case MazeGenerator.DIRECTION.RIGHT:
        result = MazeGenerator.DIRECTION.LEFT;
        break;
      case MazeGenerator.DIRECTION.BOTTOM:
        result = MazeGenerator.DIRECTION.TOP;
        break;
      case MazeGenerator.DIRECTION.LEFT:
        result = MazeGenerator.DIRECTION.RIGHT;
        break;
      default:
        result = MazeGenerator.DIRECTION.RIGHT;
        break;
    }

    return result;
  },

  path: function (fromX, fromY, toX, toY, direction) {
    MazeGenerator.grid[fromY][fromX] |= direction;
    MazeGenerator.grid[toY][toX] |= MazeGenerator.opposite(direction);

    // Carve a path from the new cell.
    MazeGenerator.carve(toX, toY);
  },

  carve: function (x, y) {
    // Carve a path from x,y to an adjacent cell.

    // First, try each direction (in random order).
    const directions = [0, 1, 2, 3].sort(() => Math.random() * 2 - 1);

    directions.forEach(function (direction) {
      if (direction === 0 && y - 1 >= 0 && MazeGenerator.grid[y - 1][x] === 0) {
        // Top.
        MazeGenerator.path(x, y, x, y - 1, MazeGenerator.DIRECTION.TOP);
      } else if (
        direction === 1 &&
        x + 1 < MazeGenerator.grid[0].length &&
        MazeGenerator.grid[y][x + 1] === 0
      ) {
        // Right.
        MazeGenerator.path(x, y, x + 1, y, MazeGenerator.DIRECTION.RIGHT);
      } else if (
        direction === 2 &&
        y + 1 < MazeGenerator.grid.length &&
        MazeGenerator.grid[y + 1][x] === 0
      ) {
        // Bottom.
        MazeGenerator.path(x, y, x, y + 1, MazeGenerator.DIRECTION.BOTTOM);
      } else if (
        direction === 3 &&
        x - 1 >= 0 &&
        MazeGenerator.grid[y][x - 1] === 0
      ) {
        // Left.
        MazeGenerator.path(x, y, x - 1, y, MazeGenerator.DIRECTION.LEFT);
      }
    });
  },

  toString: function () {
    let result = "";

    // Top border.
    for (let i = 0; i < MazeGenerator.grid[0].length * 2; i++) {
      result += "_";
    }

    result += "\n";

    // Main content.
    for (let y = 0; y < MazeGenerator.grid.length; y++) {
      result += "|";

      for (let x = 0; x < MazeGenerator.grid[0].length; x++) {
        // We only need to check south and east (because north and west have borders already included).
        result +=
          (MazeGenerator.grid[y][x] & MazeGenerator.DIRECTION.BOTTOM) ===
          MazeGenerator.DIRECTION.BOTTOM
            ? " "
            : "_";
        result +=
          (MazeGenerator.grid[y][x] & MazeGenerator.DIRECTION.RIGHT) ===
          MazeGenerator.DIRECTION.RIGHT
            ? " "
            : "|";
      }

      result += "\n";
    }

    return result;
  },

  gridElements: function (solutionPath) {
    const elements = [];

    // Top border.
    for (let i = 0; i <= MazeGenerator.grid[0].length * 2; i++) {
      elements.push(MazeGenerator.CELL.CLOSED);
    }

    elements.push(MazeGenerator.CELL.CLEAR);

    // Main grid.
    for (let y = 0; y < MazeGenerator.grid.length; y++) {
      const passageRow = [];

      // Left border column.
      elements.push(MazeGenerator.CELL.CLOSED);
      passageRow.push(MazeGenerator.CELL.CLOSED);

      // Rooms. Note, we only need to check south and east (because north and west have borders already included).
      for (let x = 0; x < MazeGenerator.grid[0].length; x++) {
        // Add a cell for the room.
        const isPath =
          solutionPath &&
          solutionPath.some((cell) => cell.x === x && cell.y === y);
        if (isPath) {
          elements.push({ x: x, y: y }); // Mark cell as part of the solution path
        } else {
          elements.push(MazeGenerator.CELL.OPEN);
        }

        if (
          (MazeGenerator.grid[y][x] & MazeGenerator.DIRECTION.BOTTOM) ===
          MazeGenerator.DIRECTION.BOTTOM
        ) {
          // Open a passage to the south.
          passageRow.push(isPath ? {x: x, y: y} : MazeGenerator.CELL.OPEN);
        } else {
          // Close a passage to the south.
          passageRow.push(MazeGenerator.CELL.CLOSED);
        }

        // Add closed passage to next row between rooms.
        passageRow.push(MazeGenerator.CELL.CLOSED);

        if (
          (MazeGenerator.grid[y][x] & MazeGenerator.DIRECTION.RIGHT) ===
          MazeGenerator.DIRECTION.RIGHT
        ) {
          // Open a passage to the east.
          elements.push(isPath ? {x: x, y: y} : MazeGenerator.CELL.OPEN);
        } else {
          // Close a passage to the east.
          elements.push(MazeGenerator.CELL.CLOSED);
        }
      }

      elements.push(MazeGenerator.CELL.CLEAR);
      passageRow.push(MazeGenerator.CELL.CLEAR);

      // Append passages row to elements.
      elements.push.apply(elements, passageRow);
    }

    return elements;
  },
};

export default MazeGenerator;
