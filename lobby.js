
const firebaseConfig = {
  apiKey: "AIzaSyCDW9uh-jSALffSqs5Yqdg3lCkYUodD-So",
  authDomain: "ballerquizonline.firebaseapp.com",
  projectId: "ballerquizonline",
  storageBucket: "ballerquizonline.firebasestorage.app",
  messagingSenderId: "863084755703",
  appId: "1:863084755703:web:2b79f2da21ffba0998b1f2",
  measurementId: "G-BLL620M4TL"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const roomCode = localStorage.getItem('roomCode');
const playerName = localStorage.getItem('playerName');
const roomInfo = document.getElementById('roomInfo');
const playersList = document.getElementById('playersList');
const hostOptions = document.getElementById('hostOptions');

if (!roomCode || !playerName) {
  alert("Fehler: Keine Raumdaten gefunden.");
  window.location.href = "index.html";
}

roomInfo.textContent = "Raum: " + roomCode;

const roomRef = db.collection("rooms").doc(roomCode);

roomRef.onSnapshot(doc => {
  const data = doc.data();
  playersList.innerHTML = "";

  if (data && data.players) {
    data.players.forEach(p => {
      const playerItem = document.createElement('div');
      playerItem.textContent = p;
      playersList.appendChild(playerItem);
    });
  }

  if (data && data.started) {
    window.location.href = "guess_the_player.html";
  }

  if (data && data.host === playerName && !data.started) {
    hostOptions.innerHTML = '<button onclick="startGame()">Spiel starten</button>';
  } else if (!data.started) {
    hostOptions.innerHTML = '<p style="font-family: Roboto, sans-serif;">Warten auf Host...</p>';
  }
});

async function startGame() {
  await roomRef.update({ started: true });
}
