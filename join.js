
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

async function joinRoom() {
  const code = document.getElementById('joinCode').value;
  const name = document.getElementById('joinName').value;

  const roomRef = db.collection("rooms").doc(code);
  const roomSnap = await roomRef.get();

  if (roomSnap.exists) {
    await roomRef.update({
      players: firebase.firestore.FieldValue.arrayUnion(name)
    });
   localStorage.setItem('roomCode', code);
  window.location.href = "lobby.html";
  } else {
    alert("Raum nicht gefunden!");
  }
}
