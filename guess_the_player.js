const canvas = document.getElementById('playerCanvas');
const ctx = canvas.getContext('2d');
const buzzerButton = document.getElementById('buzzerButton');
const answerInput = document.getElementById('answerInput');
const scoreTable = document.getElementById('scoreTable');
const feedback = document.getElementById('feedback');
const timerBar = document.getElementById('timerBar');

let interval;
let timerInterval;
let progressValue = 100;
let pixelation = 30;
let currentRound = 0;
let score = 0;
let players = [];

const apiKey = "2d49fc5ff0a0077008d3ac2954a3563b";

async function fetchPlayers() {
  try {
    const response = await fetch(`https://v3.football.api-sports.io/players?season=2023&page=1`, {
      headers: {
        "x-apisports-key": apiKey
      }
    });
    const data = await response.json();
    players = data.response
      .filter(player => ["ronaldo", "messi", "neymar", "mbappe", "haaland", "kane", "benzema", "lewandowski", "debruyne", "vinicius"].includes(player.player.lastname.toLowerCase()))
      .slice(0, 10)
      .map(player => ({
        name: player.player.lastname.toLowerCase(),
        img: player.player.photo
      }));
    loadPlayer();
  } catch (error) {
    console.error("Fehler beim Laden der Spieler:", error);
    alert("Fehler beim Laden der Spieler.");
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
  progressValue = 100;
  pixelation = 30;
  timerBar.style.width = '100%';
  
  interval = setInterval(() => {
    pixelation -= 1;
    if (pixelation < 1) pixelation = 1;
    drawPixelated(pixelation);
  }, 100);

  timerInterval = setInterval(() => {
    progressValue -= 2;
    timerBar.style.width = progressValue + "%";
    if (progressValue <= 0) {
      clearInterval(interval);
      clearInterval(timerInterval);
      buzzerButton.disabled = true;
      showFeedback(false, "Zeit abgelaufen! Richtige Antwort: " + capitalize(currentPlayer.name));
      setTimeout(() => {
        currentRound++;
        resetRound();
      }, 2000);
    }
  }, 100);
}

buzzerButton.addEventListener('click', () => {
  clearInterval(interval);
  clearInterval(timerInterval);
  buzzerButton.disabled = true;
  answerInput.style.display = 'block';
});

function submitGuess() {
  const guess = document.getElementById('playerGuess').value.trim().toLowerCase();
  if (guess === currentPlayer.name) {
    if (progressValue >= 66) {
      score += 3;
    } else if (progressValue >= 33) {
      score += 2;
    } else {
      score += 1;
    }
    showFeedback(true, "RICHTIG!");
  } else {
    showFeedback(false, "FALSCH! Richtige Antwort: " + capitalize(currentPlayer.name));
  }
  updateScore();
  currentRound++;
  setTimeout(() => {
    resetRound();
  }, 2000);
}

function showFeedback(correct, message) {
  feedback.style.color = correct ? "green" : "red";
  feedback.textContent = message;
}

function resetRound() {
  buzzerButton.disabled = false;
  answerInput.style.display = 'none';
  document.getElementById('playerGuess').value = "";
  feedback.textContent = "";
  loadPlayer();
}

function updateScore() {
  scoreTable.textContent = "Du: " + score;
}

function endGame() {
  localStorage.setItem("finalScore", score);
  window.location.href = "end.html"; // Weiterleitung auf End-Seite
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

fetchPlayers();
