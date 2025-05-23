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

function generateRoomCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

async function createRoom() {
  const code = generateRoomCode();
  const name = localStorage.getItem("playerName") || "Host"; // Holt den gespeicherten Namen

  await db.collection("rooms").doc(code).set({
    code: code,
    host: name,
    players: [name],
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  document.getElementById('roomCode').textContent = code;
  localStorage.setItem('roomCode', code); 
  window.location.href = "lobby.html";

}

createRoom();
