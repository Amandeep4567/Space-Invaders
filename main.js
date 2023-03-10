const grid = document.querySelector(".grid");
const resultsDisplay = document.querySelector(".results");
const finalResult = document.querySelector(".final");
let currentShooterIndex = 202;
let width = 15;
let direction = 1;
var invadersId;
let goingRight = true;
let aliensRemoved = [];
let results = 0;

for (let i = 0; i < 225; i++) {
  const square = document.createElement("div");
  square.setAttribute("id", i);
  grid.appendChild(square);
}

const squares = Array.from(document.querySelectorAll(".grid div"));

var alienInvaders = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
  30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
];

function draw() {
  for (let i = 0; i < alienInvaders.length; i++) {
    if (!aliensRemoved.includes(i)) {
      squares[alienInvaders[i]].classList.add("invader");
    }
  }
}
draw();

function remove() {
  for (let i = 0; i < alienInvaders.length; i++) {
    squares[alienInvaders[i]].classList.remove("invader");
  }
}

squares[currentShooterIndex].classList.add("shooter");

function moveShooter(e) {
  squares[currentShooterIndex].classList.remove("shooter");
  switch (e.key) {
    case "ArrowLeft":
      if (currentShooterIndex % width !== 0) {
        currentShooterIndex -= 1;
        break;
      }
    case "ArrowRight":
      if (currentShooterIndex % width < width - 1) {
        currentShooterIndex += 1;
        break;
      }
  }
  squares[currentShooterIndex].classList.add("shooter");
}
document.addEventListener("keydown", moveShooter);

function moveInvaders() {
  const leftEdge = alienInvaders[0] % width === 0;
  const rightEdge =
    alienInvaders[alienInvaders.length - 1] % width === width - 1;
  remove();

  if (rightEdge && goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width + 1;
      direction = -1;
      goingRight = false;
    }
  }
  if (leftEdge && !goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width;
      direction = 1;
      goingRight = true;
    }
  }

  for (let i = 0; i < alienInvaders.length; i++) {
    alienInvaders[i] += direction;
  }
  draw();

  if (squares[currentShooterIndex].classList.contains("invader", "shooter")) {
    finalResult.innerHTML = "GAME OVER";

    clearInterval(invadersId);
  }

  // console.log("squares.length", squares.length);
  for (let i = 0; i < alienInvaders.length; i++) {
    // console.log(alienInvaders[i]);
    if (alienInvaders[i] > squares.length) {
      finalResult.innerHTML = "GAME OVER";
      clearInterval(invadersId);
    }
  }
  if (aliensRemoved.length === alienInvaders.length) {
    finalResult.innerHTML = "YOU WIN";
    clearInterval(invadersId);
  }
}

invadersId = setInterval(moveInvaders, 460);

function shoot(e) {
  let laserId;
  let currentLaserIndex = currentShooterIndex;
  function moveLaser() {
    squares[currentLaserIndex].classList.remove("laser");
    currentLaserIndex -= width;
    squares[currentLaserIndex].classList.add("laser");

    if (squares[currentLaserIndex].classList.contains("invader")) {
      squares[currentLaserIndex].classList.remove("laser");
      squares[currentLaserIndex].classList.remove("invader");
      squares[currentLaserIndex].classList.add("boom");

      setTimeout(
        () => squares[currentLaserIndex].classList.remove("boom"),
        300
      );
      clearInterval(laserId);

      const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
      aliensRemoved.push(alienRemoved);
      results++;
      resultsDisplay.innerHTML = results;
      console.log(aliensRemoved);

      if (results === 15) {
        invadersId = setInterval(moveInvaders, 350);
      }
    }
  }
  switch (e.key) {
    case "ArrowUp":
      laserId = setInterval(moveLaser, 80);
  }
}

document.addEventListener("keydown", shoot);

document.addEventListener("keyup", function (e) {
  if (e.key == " " || e.code == "Space" || e.keyCode == 32) {
    window.location.reload();
  }
});
