const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const playerImages = [
  { name: "ronaldo", img: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Cristiano_Ronaldo_2018.jpg" },
  { name: "messi", img: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Leo_Messi_WC2022.jpg" },
  { name: "neymar", img: "https://upload.wikimedia.org/wikipedia/commons/9/97/Neymar_2018.jpg" },
  { name: "mbappé", img: "https://upload.wikimedia.org/wikipedia/commons/8/88/Kylian_Mbappé_2019.jpg" },
  { name: "haaland", img: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Erling_Haaland_2023.jpg" },
  { name: "kane", img: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Harry_Kane_2018.jpg" },
  { name: "lewandowski", img: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Robert_Lewandowski_2019.jpg" },
  { name: "modric", img: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Luka_Modrić_2018.jpg" },
  { name: "salah", img: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Mohamed_Salah_2018.jpg" },
  { name: "benzema", img: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Karim_Benzema_2018.jpg" },
];

let currentRound = 0;
let score = 0;
let blur = 20;
let progress = 0;
let currentPlayer = null;
let timerInterval;

function startRound() {
  currentPlayer = playerImages[Math.floor(Math.random() * playerImages.length)];
  blur = 20;
  progress = 0;
  step = 0;

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = currentPlayer.img;

  img.onload = () => {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    timerInterval = setInterval(() => {
      step++;
      progress = (step / steps) * 100;
      document.getElementById('progress').style.width = progress + '%';

      if (blur > 0 && step % 20 === 0) blur--; // blur reduziert langsamer
      pixelate(img, blur);

      if (step >= steps) {
        clearInterval(timerInterval);
        showFeedback(false);
        nextRound();
      }
    }, tick);
  };

  img.onerror = () => {
    console.error("Bild konnte nicht geladen werden.");
  };
}


function pixelate(img, pixelSize) {
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < canvas.height; y += pixelSize) {
    for (let x = 0; x < canvas.width; x += pixelSize) {
      let i = (y * canvas.width + x) * 4;
      let r = imageData.data[i];
      let g = imageData.data[i + 1];
      let b = imageData.data[i + 2];
      for (let dy = 0; dy < pixelSize; dy++) {
        for (let dx = 0; dx < pixelSize; dx++) {
          let j = ((y + dy) * canvas.width + (x + dx)) * 4;
          imageData.data[j] = r;
          imageData.data[j + 1] = g;
          imageData.data[j + 2] = b;
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
      document.getElementById("progress").style.width = "0%";
      startRound();
    }
  }, 3000);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

window.onload = () => {
  startRound();
};

let steps = 400; // 40 Sekunden
let tick = 100; // 100ms pro Schritt
let step = 0;

timerInterval = setInterval(() => {
  step++;
  progress = (step / steps) * 100;
  document.getElementById('progress').style.width = progress + '%';
  if (blur > 0) blur--;
  pixelate(img, blur);
  if (step >= steps) {
    clearInterval(timerInterval);
    showFeedback(false);
    nextRound();
  }
}, tick);

