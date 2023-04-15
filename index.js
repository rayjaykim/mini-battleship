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

function printGrid(grid, enemy) {
  const headers = createHeader(grid.length);
  console.log(' ');
  if (enemy) {
    console.log('Enemy Board');
  } else {
    console.log('My Board');
  }
  console.log(' ');
  console.log(headers);
  console.log('  -----------------------------------------');
  for (let i = 0; i < (grid.length * 2); i++) {
    let temp = (i / 2);
    let rowStr;
    if (i % 2 == 0) {
      rowStr = alphabet[temp] + ' |';
      for (let cell of grid[temp]) {
        if (cell == 'O') {
          rowStr += ' O |';
        } else if (cell == 'X') {
          rowStr += ' X |';
        } else if (enemy || cell == '-') {
          rowStr += '   |';
        } else {
          rowStr += ` ${cell} |`;
        }
      }
    } else {
      rowStr = '  -----------------------------------------';
    }
    console.log(rowStr);
  }
  console.log(' ');
}

function createHeader(size) {
  let header = '    ';
  for (let i = 1; i <= size; i++) {
    header += i + '   ';
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
    for(let i = 0; i < gridArr.length; i++) {
      if (gridArr[i][0] == x && gridArr[i][1] == y) {
        return [];
      }
    }
    temp.push([x,y]);
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
  while(temp.length == 0) {
    temp = checkShip(gridArr, size, length);
  }
  temp.forEach(elem => {
    gridArr.push(elem);
  })
  setShip(grid, temp, shipNum);
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
  } else if (grid[x][y] == '-') {
    console.log(`You have missed! Enemy remaining ships: ${shipNum}`)
    return grid[x][y] = 'X';
  } else {
    grid[x][y] = 'O';
    let currentShips = numberOfShips(grid);
    if (shipNum == currentShips) {
      console.log(`Hit! Enemy remaining ships: ${shipNum}`)
    } else {
      console.log(`Hit. You have sunk a battleship. Enemy remaining ships: ${currentShips}`)
    }
    return grid[x][y] = 'O';
  }
}

function enemyAttack() {
  let letterPos = Math.floor(Math.random() * alphabet.length);
  let numberPos = Math.floor(Math.random() * number.length);
  let letter = alphabet[letterPos];
  let numb = number[numberPos];
  let enemyHit = letter.concat(numb);
  return enemyHit;
}

function enemyAttackShip(grid, shipNum) {
  let enemyHit = enemyAttack();
  let x = alphabet.findIndex(char => char == enemyHit[0]);
  let y = enemyHit.slice(1) - 1;
  while(grid[x][y] == 'O' || grid[x][y] == 'X') {
    enemyHit = enemyAttack();
    x = alphabet.findIndex(char => char == enemyHit[0]);
    y = enemyHit.slice(1) - 1;
  }
  if (grid[x][y] == '-') {
    console.log(`Enemy attacked ${enemyHit} and missed! Your remaining ships: ${shipNum}`)
    return grid[x][y] = 'X';
  } else {
    grid[x][y] == 'O';
    let currentShips = numberOfShips(grid);
    if (shipNum == currentShips) {
      console.log(`Enemy hit ${enemyHit}! Your remaining ships: ${shipNum}`)
    } else {
      console.log(`Enemy hit ${enemyHit} and sunk a battleship. Your remaining ships: ${currentShips}`)
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
  for(let x = 0; x < grid.length; x++) {
    for(let y = 0; y < grid[x].length; y++) {
      if (grid[x][y] > 0) {
        return true;
      }
    }
  }
}

function gameStart(size) {
  let grid = createGrid(size);
  let enemyGrid = createGrid(size);
  let gridArr = [];
  let enemyGridArr = [];
  createShip(grid, gridArr, size, 2, 1);
  createShip(grid, gridArr, size, 3, 2);
  createShip(grid, gridArr, size, 3, 3);
  createShip(grid, gridArr, size, 4, 4);
  createShip(grid, gridArr, size, 5, 5);
  createShip(enemyGrid, enemyGridArr, size, 2, 1);
  createShip(enemyGrid, enemyGridArr, size, 3, 2);
  createShip(enemyGrid, enemyGridArr, size, 3, 3);
  createShip(enemyGrid, enemyGridArr, size, 4, 4);
  createShip(enemyGrid, enemyGridArr, size, 5, 5);
  printGrid(grid, false);
  printGrid(enemyGrid, true);
  while (checkShipStatus(grid) && checkShipStatus(enemyGrid)) {
    let shipNum = numberOfShips(grid);
    let enemyShipNum = numberOfShips(enemyGrid);
    attackShip(enemyGrid, attack(), enemyShipNum);
    printGrid(enemyGrid, true);
    enemyAttackShip(grid, shipNum);
    printGrid(grid, false);
  }
}

rs.keyIn("Press any key to start the game.");
let restart = true;
while (restart) {
  gameStart(10);
  restart = rs.keyInYN('You have destroyed all battleships. Would you like to play again? Y/N');
}