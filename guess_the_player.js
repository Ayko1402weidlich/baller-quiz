const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let playerImages = [];
let currentPlayer = null;
let currentRound = 0;
let score = 0;
let blur = 20;
let step = 0;
let steps = 400; // 40 Sekunden
let tick = 100;
let timerInterval;

// Lade JSON mit Spielern
fetch("players.json")
  .then(res => res.json())
  .then(data => {
    playerImages = shuffleArray(data);
    startRound();
  })
  .catch(err => console.error("Fehler beim Laden der Spielerdaten:", err));

function startRound() {
  blur = 20;
  step = 0;
  document.getElementById('progress').style.width = '0%';
  currentPlayer = playerImages[currentRound];

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = currentPlayer.image;

  img.onload = () => {
    timerInterval = setInterval(() => {
      step++;
      let progress = (step / steps) * 100;
      document.getElementById('progress').style.width = progress + '%';

      if (blur > 0 && step % 20 === 0) blur--;
      pixelate(img, blur);

      if (step >= steps) {
        clearInterval(timerInterval);
        showFeedback(false);
        nextRound();
      }
    }, tick);
  };

  img.onerror = () => {
    console.error("Bild konnte nicht geladen werden:", currentPlayer.image);
    showFeedback(false);
    nextRound();
  };
}

function pixelate(img, pixelSize) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < canvas.height; y += pixelSize) {
    for (let x = 0; x < canvas.width; x += pixelSize) {
      let i = (y * canvas.width + x) * 4;
      let r = imageData.data[i];
      let g = imageData.data[i + 1];
      let b = imageData.data[i + 2];
      for (let dy = 0; dy < pixelSize; dy++) {
        for (let dx = 0; dx < pixelSize; dx++) {
          let j = ((y + dy) * canvas.width + (x + dx)) * 4;
          if (j < imageData.data.length) {
            imageData.data[j] = r;
            imageData.data[j + 1] = g;
            imageData.data[j + 2] = b;
          }
        }
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

document.getElementById("buzzer").onclick = () => {
  clearInterval(timerInterval);
  document.getElementById("buzzer").style.display = "none";
  document.getElementById("answerBox").style.display = "block";
};

function checkAnswer() {
  const input = document.getElementById("answer").value.trim().toLowerCase();
  if (input.includes(currentPlayer.name.toLowerCase())) {
    score += 3;
    showFeedback(true);
  } else {
    showFeedback(false);
  }
  nextRound();
}

function showFeedback(correct) {
  const feedback = document.getElementById("feedback");
  feedback.style.display = "block";
  if (correct) {
    feedback.innerText = "✅ RICHTIG! Das war " + capitalize(currentPlayer.name);
  } else {
    feedback.innerText = "❌ FALSCH! Das war " + capitalize(currentPlayer.name);
  }
}

function nextRound() {
  currentRound++;
  setTimeout(() => {
    if (currentRound >= 10) {
      localStorage.setItem("score", score);
      window.location.href = "end.html";
    } else {
      document.getElementById("answerBox").style.display = "none";
      document.getElementById("buzzer").style.display = "block";
      document.getElementById("feedback").innerText = "";
      startRound();
    }
  }, 3000);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function shuffleArray(array) {
  let a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
