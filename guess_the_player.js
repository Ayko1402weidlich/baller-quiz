const canvas = document.getElementById('playerCanvas');
const ctx = canvas.getContext('2d');
const progress = document.getElementById('progress');
const buzzerButton = document.getElementById('buzzerButton');
const answerInput = document.getElementById('answerInput');
const scoreDisplay = document.getElementById('scoreDisplay');

let interval;
let progressValue = 0;
let pixelation = 30;
let currentRound = 0;
let score = 0;
let players = [];

const apiKey = "2d49fc5ff0a0077008d3ac2954a3563b"; // Dein API Key

async function fetchPlayers() {
  try {
    const response = await fetch(`https://v3.football.api-sports.io/players?season=2023&page=1`, {
      headers: {
        "x-apisports-key": apiKey
      }
    });
    const data = await response.json();
    players = data.response.slice(0, 10).map(player => ({
      name: player.player.lastname.toLowerCase(),
      img: player.player.photo
    }));
    loadPlayer();
  } catch (error) {
    console.error("Fehler beim Laden der Spieler:", error);
    alert("Fehler beim Laden der Spieler. Bitte später versuchen.");
  }
}

let currentPlayer;
let img = new Image();

function loadPlayer() {
  if (currentRound >= players.length) {
    endGame();
    return;
  }

  currentPlayer = players[currentRound];
  img = new Image();
  img.crossOrigin = "anonymous";
  img.src = currentPlayer.img;
  img.onload = () => {
    drawPixelated(30);
    startProgress();
  };
}

function drawPixelated(pixelSize) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < canvas.height; y += pixelSize) {
    for (let x = 0; x < canvas.width; x += pixelSize) {
      const i = (y * canvas.width + x) * 4;
      const r = imgData.data[i];
      const g = imgData.data[i + 1];
      const b = imgData.data[i + 2];
      for (let dy = 0; dy < pixelSize; dy++) {
        for (let dx = 0; dx < pixelSize; dx++) {
          if (x + dx < canvas.width && y + dy < canvas.height) {
            const j = ((y + dy) * canvas.width + (x + dx)) * 4;
            imgData.data[j] = r;
            imgData.data[j + 1] = g;
            imgData.data[j + 2] = b;
          }
        }
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

function startProgress() {
  progressValue = 0;
  pixelation = 30;
  interval = setInterval(() => {
    progressValue += 0.5;
    pixelation -= 0.2;
    if (pixelation < 1) pixelation = 1;
    if (progressValue > 100) progressValue = 100;
    drawPixelated(Math.floor(pixelation));
    progress.style.width = progressValue + '%';
    if (progressValue >= 100) {
      clearInterval(interval);
      buzzerButton.disabled = true;
      answerInput.style.display = 'block';
    }
  }, 100);
}

buzzerButton.addEventListener('click', () => {
  clearInterval(interval);
  buzzerButton.disabled = true;
  answerInput.style.display = 'block';
});

function submitGuess() {
  const guess = document.getElementById('playerGuess').value.trim().toLowerCase();
  if (guess === currentPlayer.name) {
    if (progressValue <= 33) {
      score += 3;
    } else if (progressValue <= 66) {
      score += 2;
    } else {
      score += 1;
    }
    alert("RICHTIG! +" + (progressValue <= 33 ? 3 : (progressValue <= 66 ? 2 : 1)) + " Punkte!");
  } else {
    alert("FALSCH! 0 Punkte.");
  }
  currentRound++;
  updateScore();
  resetRound();
}

function resetRound() {
  buzzerButton.disabled = false;
  answerInput.style.display = 'none';
  document.getElementById('playerGuess').value = "";
  loadPlayer();
}

function updateScore() {
  scoreDisplay.textContent = "Punkte: " + score;
}

function endGame() {
  alert("Runde beendet! Deine Gesamtpunktzahl: " + score);
  window.location.href = "index.html";
}

// Direkt beim Laden Spieler holen
fetchPlayers();
