const rs = require('readline-sync');
const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const number = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

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

function checkShip(gridArr, size, length) {
  let temp = [];
  let count = 0;
  let x = Math.floor(Math.random() * (size - length + 1));
  let y = Math.floor(Math.random() * (size - length + 1));
  let valX = Math.floor(Math.random() * 2);
  let valY = 1 - valX;
  while(count < length) {
    if (gridArr.includes("[x,y]")) {
      return [];
    } else {
      temp.push([x,y])
    }
    x += valX;
    y += valY;
    count++;
  }
  return temp;
}

function setShip(grid, arr, shipNum) {
  arr.forEach(element => {
    let x = element[0];
    let y = element[1];
    grid[x][y] = shipNum;
  })
  return grid;
}

function createShip(grid, gridArr, size, length, shipNum) {
  let temp = [];
  let ship = checkShip(gridArr, size, length);
  while(ship == []) {
    ship = checkShip(gridArr, size, length);
  }
  ship.forEach(element => gridArr.push(element));
  ship.forEach(element => temp.push(element));
  setShip(grid, temp, shipNum);
}

function attack() {
  let att = rs.question(`Enter a location to strike (ie 'A2'): `);
  while (!alphabet.includes(att[0]) || !number.includes(att.slice(1) * 1)) {
    att = rs.question(`Please enter a proper location to strike (ie 'A2'): `)
  }
  return att;
}

function attackShip(grid, attack, numberOfShips) {
  let x = alphabet.findIndex(char => char == attack[0]);
  let y = attack.slice(1) - 1;
  if (grid[x][y] == 'O' || grid[x][y] == 'X') {
    console.log('You have already picked this location. Miss!')
  } else if (grid[x][y] == '-') {
    console.log('You have missed!')
    return grid[x][y] = 'X';
  } else {
    let temp = grid[x][y];
    grid[x][y] = 'O';
    const trueFalse = grid.forEach(element => {
      element.find(elem => {
        elem == temp;
      })
    });
    if (trueFalse == temp) {
      console.log(`Hit! remaining ships: ${numberOfShips}`)
    } else {
      console.log(`Hit. You have sunk a battleship. Remaining ships: ${numberOfShips - 1}`)
    }
    return grid[x][y] = 'O';
  }
}

function numberOfShips(grid) {
  let temp = [];
  grid.forEach(elem => elem.forEach(elem => {
    if (Number.isInteger(elem) && !temp.includes(elem)) {
      temp.push(elem);
    }
  }))
  return temp.length;
}

function checkShipStatus(grid) {
  grid.forEach(elem => elem.forEach(elem => {
    if (Number.isInteger(elem) == true) {
      return true;
    };
  }))
}

function gameStart(grid, size) {
  grid = createGrid(size);
  let gridArr = [];
  createShip(grid, gridArr, size, 2, 1);
  createShip(grid, gridArr, size, 3, 2);
  createShip(grid, gridArr, size, 3, 3);
  createShip(grid, gridArr, size, 4, 4);
  createShip(grid, gridArr, size, 5, 5);
  printGrid(grid);
  console.log(grid);
  console.log(gridArr);
  while (checkShipStatus(grid)) {
    const poke = attack();
    attackShip(grid, poke, numberOfShips(grid));
    printGrid(grid);
  }
}

rs.keyIn("Press any key to start the game.");
let grid;
gameStart(grid, 10);
let restart = rs.keyInYN('You have destroyed all battleships. Would you like to play again? Y/N')

while (restart) {
  gameStart(grid);
  restart = rs.keyInYN('You have destroyed all battleships. Would you like to play again? Y/N');
}