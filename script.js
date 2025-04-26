
document.getElementById('startBtn').addEventListener('click', function() {
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('jokerBtn').style.display = 'inline-block';
    startGame();
});

document.getElementById('jokerBtn').addEventListener('click', function() {
    if (document.getElementById('gameImage')) {
        document.getElementById('gameImage').style.filter = 'none';
        setTimeout(() => {
            document.getElementById('gameImage').style.filter = 'blur(10px)';
        }, 1000);
    }
});

function startGame() {
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = '<img id="gameImage" src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png" style="width:300px; filter: blur(10px); transition: filter 3s;">';
    
    setTimeout(() => {
        if (document.getElementById('gameImage')) {
            document.getElementById('gameImage').style.filter = 'none';
        }
    }, 5000);
}
