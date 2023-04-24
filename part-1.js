const rs = require('readline-sync');
const alphabet = ['A', 'B', 'C'];
const number = [1, 2, 3];

function createGrid(size) {
  let arr = [];
  let temp = [];
  for (let j = 0; j < size; j++) {
    arr[j] = [];
    for (let i = 0; i < size; i++) {
      arr[j][i] = '-';
    }
  }
  return arr;
}

function printGrid(grid) {
  const headers = createHeader(grid.length);
  console.log(headers);
  for (let i = 0; i < grid.length; i++) {
    let rowStr = alphabet[i] + ' ';
    for (let cell of grid[i]) {
      if (cell == 'O') {
        rowStr += 'O ';
      } else if (cell == 'X') {
        rowStr += 'X ';
      } else {
        rowStr += '- ';
      }
    }
    console.log(rowStr);
  }
}

function createHeader(size) {
  let header = '  ';
  for (let i = 1; i <= size; i++) {
    header += i + ' ';
  }
  return header;
};

function createShip(grid, size) {
  let temp = grid;
  let x = Math.floor(Math.random() * size);
  let y = Math.floor(Math.random() * size);
  if (temp[x][y] == 1) {
    createShip(grid, size);
  } else {
    temp[x][y] = 1;
  }
  return temp;
}

function attack() {
  let att = rs.question(`Enter a location to strike (ie 'A2'): `);
  while (!alphabet.includes(att[0]) || !number.includes(att.slice(1) * 1)) {
    att = rs.question(`Please enter a proper location to strike (ie 'A2'): `)
  }
  return att;
}

function attackShip(grid, attack, shipNum) {
  let x = alphabet.findIndex(char => char == attack[0]);
  let y = attack.slice(1) - 1;
  if (grid[x][y] == 'O' || grid[x][y] == 'X') {
    console.log('You have already picked this location. Miss!')
  } else if (grid[x][y] == 1) {
    console.log(`Hit. You have sunk a battleship. ${shipNum - 1} ship(s) remaining.`)
    return grid[x][y] = 'O';
  } else {
    console.log('You have missed!')
    return grid[x][y] = 'X';
  }
}

function numberOfShips(grid) {
  let count = 0;
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      if (grid[x][y] == 1) {
        count++;
      }
    }
  }
  return count;
}

function checkShipStatus(grid) {
  return grid
  .map(ship => ship.find(ship => ship == 1) == 1)
  .find(ship => ship == true);
}

function gameStart(grid) {
  grid = createGrid(3);
  createShip(grid, 3);
  createShip(grid, 3);
  while (checkShipStatus(grid)) {
    attackShip(grid, attack(), numberOfShips(grid));
    printGrid(grid);
  }
}

rs.keyIn("Press any key to start the game.");
let grid;
let restart = true;
while (restart) {
  gameStart(grid);
  restart = rs.keyInYN('You have destroyed all battleships. Would you like to play again? Y/N');
}