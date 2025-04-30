
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let img = new Image();
img.src = 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Cristiano_Ronaldo_2018.jpg';
img.crossOrigin = 'anonymous';

let blur = 25;
let progress = 0;
let score = 0;

img.onload = () => draw(blur);

function draw(blurValue) {
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < canvas.height; y += blurValue) {
    for (let x = 0; x < canvas.width; x += blurValue) {
      let i = (y * canvas.width + x) * 4;
      let r = imageData.data[i];
      let g = imageData.data[i + 1];
      let b = imageData.data[i + 2];
      for (let dy = 0; dy < blurValue; dy++) {
        for (let dx = 0; dx < blurValue; dx++) {
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

let timer = setInterval(() => {
  progress += 1;
  document.getElementById('progress').style.width = progress + '%';
  if (blur > 1) blur--;
  draw(blur);
  if (progress >= 100) {
    clearInterval(timer);
    document.getElementById('feedback').innerText = 'Zeit abgelaufen! Richtige Antwort: Cristiano Ronaldo';
    setTimeout(() => {
      window.location.href = 'end.html';
    }, 3000);
  }
}, 100);

document.getElementById('buzzer').onclick = () => {
  clearInterval(timer);
  document.getElementById('buzzer').style.display = 'none';
  document.getElementById('answerBox').style.display = 'block';
};

function checkAnswer() {
  const answer = document.getElementById('answer').value.toLowerCase();
  const correct = answer.includes("ronaldo");
  if (correct) {
    score = 3;
    localStorage.setItem("score", score);
    document.getElementById('feedback').innerText = 'Richtig!';
  } else {
    document.getElementById('feedback').innerText = 'Falsch! Richtige Antwort: Cristiano Ronaldo';
  }
  setTimeout(() => {
    window.location.href = 'end.html';
  }, 3000);
}
