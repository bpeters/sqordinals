let lcg_index = 0;
const gridSize = 512;
const subGridSize = 32;
const blockSplit = 210000;

const numberOfSubGridsPerRow = gridSize / subGridSize;

const subTiles = [{
  startX: 0,
  startY: 0,
  endX: 511,
  endY: 511,
}];

for (let i = 0; i < numberOfSubGridsPerRow; i++) {
  for (let j = 0; j < numberOfSubGridsPerRow; j++) {
    subTiles.push({
      startX: j * subGridSize,
      startY: i * subGridSize,
      endX: (j * subGridSize) + subGridSize - 1,
      endY: (i * subGridSize) + subGridSize - 1,
    });
  }
}

let grid = Array.from({ length: gridSize }, () => Array(gridSize).fill({
  state: 0,
  style: 0,
}));

const styleColors = [
  "#FFC0CB", // Style 0: Classic Red
  "#FFA500", // Style 1: Bright Orange
  "#FFFF00", // Style 2: Vivid Yellow
  "#00FF00", // Style 3: Lime Green
  "#00BFFF", // Style 4: Sky Blue
  "#0000FF", // Style 5: Deep Blue
  "#4B0082", // Style 6: Indigo
  "#EE82EE", // Style 7: Violet
  "#FFC0CB", // Style 8: Soft Pink
  "#00FF7F", // Style 9: Bright Green
  "#008080", // Style 10: Teal
  "#808000", // Style 11: Olive Green
  "#FF0000", // Style 12: Red
  "#708090", // Style 13: Slate Gray
  "#191970"  // Style 14: Midnight Blue
];

function lcg() {
  const a = 1664525;
  const c = 1013904223;
  const m = Math.pow(2, 32);
  lcg_index = (a * lcg_index + c) % m;
  return lcg_index / m;
}

function generateRandomHex() {
  let result = '';
  const characters = 'abcdef0123456789';
  for (let i = 0; i < 64; i++) {
    result += characters.charAt(Math.floor(lcg() * characters.length));
  }
  lcg_index++
  return '0x' + result;
}

function hashToNumber(hash) {
  if (hash.startsWith('0x')) {
    hash = hash.substring(2);
  }
  let bigInt = BigInt('0x' + hash.substring(0, 16));
  return Number(bigInt) / 18446744073709551616;
}

function generateRandomHexSimple(hash) {
  lcg_index = hashToNumber(hash)
  return hash;
}

function findSubTile(x, y) {
  for (let i = 1; i < subTiles.length; i++) {
    const subTile = subTiles[i];
    if (x >= subTile.startX && x <= subTile.endX && y >= subTile.startY && y <= subTile.endY) {
      return i - 1;
    }
  }
  return null;
}

function countNeighbors(grid, x, y) {
  const neighborCoordinates = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];

  let aliveCount = 0;
  let deadCount = 0;

  for (const [dx, dy] of neighborCoordinates) {
    const nx = x + dx;
    const ny = y + dy;

    if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize) {
      if (grid[ny][nx].state) {
        aliveCount++;
      } else {
        deadCount++;
      }
    }
  }

  return [aliveCount, deadCount];
}

function drawGridTile(startX, startY, endX, endY, height, ctx) {
  const subGridHeight = endY - startY;

  const cellSizeY = Math.ceil(height / subGridHeight);
  const cellSizeX = cellSizeY;
  ctx.font = `${cellSizeY / 1.5}px mono`;
  ctx.lineWidth = cellSizeY / 10;

  for (let y = startY; y < endY; y++) {
    for (let x = startX; x < endX; x++) {
      const cell = grid[y][x];
      if (cell.state) {
        const [aliveNeighbors] = countNeighbors(grid, x, y);
        const subTile = findSubTile(x, y) % 15;
        const posX = (x - startX) * cellSizeX;
        const posY = (y - startY) * cellSizeY;

        if (aliveNeighbors >= 1) {
          ctx.fillStyle = cell.style === 0 ? `${styleColors[subTile]}20` : `${styleColors[cell.style]}20`;
          ctx.strokeStyle = 'black';
          ctx.fillRect(posX, posY, cellSizeX, cellSizeY);
          ctx.strokeRect(posX, posY, cellSizeX, cellSizeY);
        } else {
          ctx.fillStyle = 'black';
          ctx.fillRect(posX, posY, cellSizeX, cellSizeY);
          ctx.fillStyle = '#F7931A';
          ctx.fillText("\u20BF", posX + (cellSizeX / 2), posY + (cellSizeY / 2) + 2);
        }
      } else {
        ctx.fillStyle = 'black';
        ctx.strokeStyle = ctx.fillStyle;
        const posX = (x - startX) * cellSizeX;
        const posY = (y - startY) * cellSizeY;
        ctx.fillRect(posX, posY, cellSizeX, cellSizeY);
      }
    }
  }
}

function simulateStepsAndUpdateGrid(steps, startX, startY, endX, endY, height, ctx) {
  for (let step = 0; step < steps; step++) {
    let newGrid = grid.map(arr => [...arr]);

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const [aliveNeighbors, deadNeighbors] = countNeighbors(grid, x, y);
        const cell = grid[y][x];
        const dead = { state: 0, style: cell.style };
        const alive = { state: 1, style: cell.style };

        switch (cell.style) {
          case 0: // Classic Conway's Game of Life
            if (cell.state === 1 && (aliveNeighbors < 2 || aliveNeighbors > 3)) {
              newGrid[y][x] = dead;
            } else if (cell.state === 0 && aliveNeighbors === 3) {
              newGrid[y][x] = alive;
            }
            break;
          case 1: // Inversion Rules
            if (cell.state === 1 && aliveNeighbors === 3) {
              newGrid[y][x] = dead;
            } else if (cell.state === 0 && (aliveNeighbors < 2 || aliveNeighbors > 3)) {
              newGrid[y][x] = alive;
            }
            break;
          case 2: // High Life
            if (cell.state === 1 && (aliveNeighbors < 2 || aliveNeighbors > 3)) {
              newGrid[y][x] = dead;
            } else if (cell.state === 0 && (aliveNeighbors === 3 || aliveNeighbors === 6)) {
              newGrid[y][x] = alive;
            }
            break;
          case 3: // Stasis and Growth
            if (cell.state === 1 && (aliveNeighbors === 2)) {
              newGrid[y][x] = alive;
            } else if (cell.state === 0 && (aliveNeighbors === 2 || aliveNeighbors === 3)) {
              newGrid[y][x] = alive;
            } else {
              newGrid[y][x] = dead;
            }
            break;
          case 4: // Maze Generator
            if (cell.state === 1 && (aliveNeighbors >= 1 && aliveNeighbors <= 5)) {
              newGrid[y][x] = alive;
            } else if (cell.state === 0 && (aliveNeighbors === 3)) {
              newGrid[y][x] = alive;
            } else {
              newGrid[y][x] = dead;
            }
            break;
          case 5: // Expansionist
            if (cell.state === 1) {
              newGrid[y][x] = alive;
            } else if (cell.state === 0 && (aliveNeighbors > 0)) {
              newGrid[y][x] = alive;
            } else {
              newGrid[y][x] = dead;
            }
            break;
          case 6: // Isolation
            if (cell.state === 1 && (aliveNeighbors === 0 || aliveNeighbors === 1)) {
              newGrid[y][x] = alive;
            } else if (cell.state === 0 && (aliveNeighbors > 2)) {
              newGrid[y][x] = alive;
            } else {
              newGrid[y][x] = dead;
            }
            break;
          case 7: // Dense Life
            if (cell.state === 1 && (aliveNeighbors >= 4 && aliveNeighbors <= 8)) {
              newGrid[y][x] = alive;
            } else if (cell.state === 0 && (aliveNeighbors >= 5 && aliveNeighbors <= 7)) {
              newGrid[y][x] = alive;
            } else {
              newGrid[y][x] = dead;
            }
            break;
          case 8: // Slow Growth
            if (cell.state === 1 && (aliveNeighbors >= 2 && aliveNeighbors <= 3)) {
              newGrid[y][x] = alive;
            } else if (cell.state === 0 && (aliveNeighbors === 3)) {
              newGrid[y][x] = alive;
            } else {
              newGrid[y][x] = dead;
            }
            break;
          case 9: // Fast Decay
            if (cell.state === 1 && (aliveNeighbors > 4)) {
              newGrid[y][x] = dead;
            } else if (cell.state === 0 && (aliveNeighbors === 1)) {
              newGrid[y][x] = alive;
            }
            break;
          case 10: // Revival
            if (cell.state === 0 && deadNeighbors >= 3) {
              newGrid[y][x] = alive;
            } else if (cell.state === 1 && (aliveNeighbors < 2 || aliveNeighbors > 3)) {
              newGrid[y][x] = dead;
            }
            break;
          case 11: // Loneliness
            if (cell.state === 1 && (aliveNeighbors === 0 || aliveNeighbors === 1)) {
              newGrid[y][x] = dead;
            } else if (cell.state === 0 && (aliveNeighbors >= 4 && aliveNeighbors >= 4)) {
              newGrid[y][x] = alive;
            }
            break;
          case 12: // Overcrowding
            if (cell.state === 1 && (aliveNeighbors > 5)) {
              newGrid[y][x] = dead;
            } else if (cell.state === 0 && (aliveNeighbors === 2)) {
              newGrid[y][x] = alive;
            }
            break;
          case 13: // Stability
            if (cell.state === 1 && (aliveNeighbors >= 3 && aliveNeighbors <= 4)) {
              newGrid[y][x] = alive;
            } else if (cell.state === 0 && (aliveNeighbors === 3)) {
              newGrid[y][x] = alive;
            } else {
              newGrid[y][x] = dead;
            }
            break;
          case 14: // Randomness
            let neighborHash = BigInt(generateRandomHex());
            let probability = Number(neighborHash % BigInt(0xFFFFFFFFFFFFFFFF)) / Number(0xFFFFFFFFFFFFFFFF);

            newGrid[y][x] = {
              state: probability < 0.5 ? 0 : 1,
              style: cell.style
            };
            break;
        }
      }
    }

    grid = newGrid;
  }

  drawGridTile(startX, startY, endX, endY, height, ctx);
}

function generateStartingGrid(hash) {
  generateRandomHexSimple(`0x${hash}`);
  const numberOfCells = Math.floor(hashToNumber(generateRandomHex()) * (gridSize * 2));

  for (let i = 0; i < numberOfCells; i++) {
    let xHashedValue = hashToNumber(generateRandomHex());
    let yHashedValue = hashToNumber(generateRandomHex());

    let xCoordinate = Math.floor(xHashedValue * gridSize);
    let yCoordinate = Math.floor(yHashedValue * gridSize);

    let styleProbability = Number(BigInt(generateRandomHex()) % BigInt(0xFFFFFFFFFFFFFFFF)) / Number(0xFFFFFFFFFFFFFFFF);
    let randomStyle = Math.floor(styleProbability * 15);

    grid[yCoordinate][xCoordinate] = {
      state: 1,
      style: randomStyle,
    };

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;

        let nx = xCoordinate + dx;
        let ny = yCoordinate + dy;

        if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize) {
          let neighborHash = BigInt(generateRandomHex());
          let probability = Number(neighborHash % BigInt(0xFFFFFFFFFFFFFFFF)) / Number(0xFFFFFFFFFFFFFFFF);

          if (probability < 0.5) {
            grid[ny][nx] = {
              state: 1,
              style: randomStyle,
            };
          }
        }
      }
    }
  }
}

function promiseReturns(urls) {
  return Promise.all(urls.map(url => {
    return fetch(url).then(r => {
      return r.ok ? r.json() : '';
    })
  }));
}

async function createLife(canvas, tileIndex) {
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerHeight;
  canvas.height = window.innerHeight;
  ctx.strokeStyle = 'black';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const [blockHeight, original] = await promiseReturns([
    "https://ordinals.com/r/blockheight",
    "https://ordinals.com/r/blockhash/0",
  ]);

  if (blockHeight && original) {
    generateStartingGrid(original);

    const tile = subTiles[tileIndex];
    const cellSize = Math.ceil(canvas.height / (tile.endX - tile.startX + 1));
    const defaultGridSize = Math.floor(canvas.height / 2);

    console.log(tile, cellSize, defaultGridSize);

    if (cellSize < 2) {
      simulateStepsAndUpdateGrid(1, tile.startX, tile.startY, defaultGridSize, defaultGridSize, canvas.height, ctx);
    } else {
      simulateStepsAndUpdateGrid(1, tile.startX, tile.startY, tile.endX, tile.endY, canvas.height, ctx);
    }

    const lastEpoch = Math.floor(blockHeight / blockSplit) * blockSplit;

    let blockDiff = blockHeight - lastEpoch;

    const [newHash] = await promiseReturns([`https://ordinals.com/r/blockhash/${lastEpoch}`]);

    generateStartingGrid(newHash);

    const animationInterval = 100;

    function startAnimation() {
      setInterval(function () {
        if (blockDiff) {
          if (cellSize < 2) {
            simulateStepsAndUpdateGrid(1, tile.startX, tile.startY, defaultGridSize, defaultGridSize, canvas.height, ctx);
          } else {
            simulateStepsAndUpdateGrid(1, tile.startX, tile.startY, tile.endX, tile.endY, canvas.height, ctx);
          }

          blockDiff--;
        }

      }, animationInterval);
    }

    startAnimation();
  }
}
