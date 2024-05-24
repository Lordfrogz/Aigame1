const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size (adjust as needed)
canvas.width = 800;
canvas.height = 600;

// Define game variables
let playerX = 50;
let playerY = 100;
let playerWidth = 20; // Adjust for desired size of "/" symbol
let playerHeight = 40; // Adjust for desired size of "/" symbol
let playerSpeed = 5; // Adjust for desired movement speed
let jumpPower = 7; // Adjust for desired jump height
let gravity = 0.3; // Adjust for a more realistic gravity (lower value for stronger gravity)
let terminalVelocity = 15; // Maximum falling speed
let isJumping = false;
let jumpHeight = 0;

let platforms = []; // Array to store platforms
let dollars = []; // Array to store dollar signs
let score = 0;
let winFlagX = 0; // X position of the win flag
let winFlagY = 0; // Y position of the win flag
let numDollarsToCollect = 10; // Number of dollars to collect to win
let keysPressed = {}; // Object to store pressed keys
let gameOver = false; // Flag to track game state

// Function to generate random platforms
function generatePlatforms() {
  platforms = [];
  for (let i = 0; i < 10; i++) { // Adjust number of platforms for complexity
    const platformX = Math.floor(Math.random() * canvas.width);
    const platformY = Math.floor(Math.random() * canvas.height) - 100;
    const platformWidth = Math.floor(Math.random() * 100) + 50;
    const platformHeight = 10;
    platforms.push({ x: platformX, y: platformY, width: platformWidth, height: platformHeight });
  }
  winFlagX = Math.floor(Math.random() * canvas.width); // Minor correction: use Math.random()
  winFlagY = 100; // Place flag at the bottom
  // Generate random dollar signs within platforms
  dollars = [];
  for (let i = 0; i < numDollarsToCollect; i++) {
    const platform = platforms[Math.floor(Math.random() * platforms.length)]; // Pick a random platform
    const dollarX = Math.floor(platform.x + Math.random() * platform.width);
    const dollarY = platform.y - playerHeight; // Place dollar slightly above platform
    dollars.push({ x: dollarX, y: dollarY });
  }
}

// Function to draw game elements
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw platforms
  platforms.forEach(platform => {
    ctx.fillStyle = '#000';
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
  });

  // Draw player ("/|" symbol)
  if (!gameOver) { // Only draw player if not in game over state
    ctx.fillStyle = '#f0f'; // Adjust color as desired
    ctx.beginPath();
    ctx.moveTo(playerX, playerY);
    ctx.lineTo(playerX + playerWidth / 2, playerY + playerHeight);
    ctx.lineTo(playerX + playerWidth, playerY);
    ctx.fill();
  }

  // Draw dollars with dollar sign
  dollars.forEach(dollar => {
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(dollar.x, dollar.y, 15, 15);
    ctx.fillStyle = '#000'; // Black for dollar sign
    ctx.font = '12px Arial';
    ctx.fillText('$', dollar.x + 5, dollar.y + 10); // Adjust position for centering
  });

  // Draw win flag
  if (!gameOver) { // Only draw flag if not in game over state
    ctx.fillStyle = '#f00';
    ctx.fillRect(winFlagX, winFlagY, 20, 50);
  }

  // Display score
  ctx.font = '16px Arial';
ctx.fillStyle = '#fff';
if (gameOver) {
  // Victory screen (only displayed when gameOver is true)
  ctx.fillStyle = '#0f0'; // Green for victory
  ctx.font = '32px Arial';
  ctx.fillText('You Win!', canvas.width / 2 - 50, canvas.height / 2 - 50);
  ctx.font = '16px Arial';
  ctx.fillText(`Total Collected: ${score} out of ${numDollarsToCollect}`, canvas.width / 2 - 70, canvas.height / 2);
} else {
  ctx.fillText(`Score: ${score}`, 10, 20);
}
}

// Function to update game logic
function update() {
  // Player movement (uses WASD keys)
  if (keysPressed['w'] && playerY > 0) { // Up key (W)
    playerY -= playerSpeed;
  } else if (keysPressed['s'] && playerY < canvas.height - playerHeight) { // Down key (S)
    playerY += playerSpeed;
  }
  if (keysPressed['d'] && playerX < canvas.width - playerWidth) { // Right key (D)
    playerX += playerSpeed;
  } else if (keysPressed['a'] && playerX > 0) { // Left key (A)
    playerX -= playerSpeed;
  }

  // Jumping
  if (keysPressed[' '] && !isJumping) { // Space key for jump
    isJumping = true;
  }
  if (isJumping) {
    playerY -= jumpPower;
    jumpHeight += jumpPower;
    if (jumpHeight >= 100) {
      isJumping = false;
      jumpHeight = 0;
    }
  } else {
    // Apply realistic gravity
    playerY += gravity;
    if (playerY > canvas.height - playerHeight) {
      playerY = canvas.height - playerHeight; // Prevent falling below canvas
      gravity = 0; // Stop gravity when on ground
    } else {
      gravity = Math.min(gravity + 0.1, terminalVelocity); // Gradually increase gravity
    }
  }

  // Check for collisions with platforms (fixed the missing semicolon here)
  platforms.forEach(platform => {
    if (playerX + playerWidth > platform.x &&
        playerX < platform.x + platform.width &&
        playerY + playerHeight > platform.y &&
        playerY < platform.y + platform.height) {
      isJumping = false; // Reset jump if on platform
      gravity = 0; // Reset gravity when on platform
    }
  });

  // Check for dollar sign collection
  dollars.forEach((dollar, i) => {
    if (playerX + playerWidth > dollar.x &&
        playerX < dollar.x + 15 && // Adjust for dollar width
        playerY + playerHeight > dollar.y &&
        playerY < dollar.y + 15) { // Adjust for dollar height
      dollars.splice(i, 1); // Remove collected dollar sign
      score++;
      if (score === numDollarsToCollect) {
        gameOver = true; // Set game to over state upon collecting all dollars
        console.log('You Win!');
      }
    }
  });

  // Check if player falls below the canvas
  if (playerY > canvas.height) {
    gameOver = true; // Set game to over state if player falls
    console.log('Game Over!');
  }
}

// Event listener to handle key presses
document.addEventListener('keydown', (event) => {
  keysPressed[event.key] = true;
});

document.addEventListener('keyup', (event) => {
  keysPressed[event.key] = false;
});

// Game loop
function gameLoop() {
  requestAnimationFrame(gameLoop);
  update();
  draw();
}

// Start the game
generatePlatforms();
gameLoop();