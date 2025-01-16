// Отримуємо елементи з DOM
const astronaut = document.getElementById("astronaut");
const bit = document.getElementById("bit");
const scoreDisplay = document.getElementById("score");
const musicToggleButton = document.getElementById("music-toggle");
const backgroundMusic = document.getElementById("background-music");

let score = 0;
let gameArea = document.getElementById('game-area');
let gameWidth = gameArea.offsetWidth;
let gameHeight = gameArea.offsetHeight;

// Початкові позиції
let astronautPos = { left: gameWidth / 2 - 25, bottom: 20 };
let bitPos = { left: Math.random() * (gameWidth - 50), top: -50 };

// Масив для астероїдів
let asteroids = [];

// Точний розмір астероїда
const asteroidWidth = 50;
const asteroidHeight = 50;

// Функція для створення астероїда
function createAsteroid() {
    let asteroid = {
        left: Math.random() * (gameWidth - asteroidWidth),
        top: -Math.random() * 150,  // Різна початкова висота
        id: "asteroid" + Math.random() // Унікальний ID для кожного астероїда
    };
    asteroids.push(asteroid);
}

// Оновлення позицій елементів
function updatePositions() {
    astronaut.style.left = astronautPos.left + "px";
    astronaut.style.bottom = astronautPos.bottom + "px";

    bit.style.left = bitPos.left + "px";
    bit.style.top = bitPos.top + "px";

    // Оновлюємо позиції астероїдів
    asteroids.forEach((asteroid) => {
        let asteroidElem = document.getElementById(asteroid.id);

        if (!asteroidElem) {
            asteroidElem = document.createElement("div");
            asteroidElem.id = asteroid.id;
            asteroidElem.classList.add("asteroid");
            asteroidElem.style.backgroundImage = "url('ast.png')";
            asteroidElem.style.backgroundSize = "cover";
            gameArea.appendChild(asteroidElem);
        }

        asteroidElem.style.left = asteroid.left + "px";
        asteroidElem.style.top = asteroid.top + "px";
    });
}

// Логіка переміщення космонавта
document.addEventListener("keydown", function(e) {
    if (e.key === "ArrowLeft") {
        astronautPos.left -= 20;
    }
    if (e.key === "ArrowRight") {
        astronautPos.left += 20;
    }

    // Обмежуємо рух по екрану
    if (astronautPos.left < 0) astronautPos.left = 0;
    if (astronautPos.left > gameWidth - 50) astronautPos.left = gameWidth - 50;

    updatePositions();
});

// Логіка оновлення гри (мегабіти та астероїди падають)
function gameLoop() {
    bitPos.top += 5;

    // Оновлюємо позиції астероїдів
    asteroids.forEach((asteroid, index) => {
        asteroid.top += 4 + Math.floor(score / 50);  // Швидкість астероїдів залежить від очок

        // Перевірка на зіткнення з астероїдами
        if (
            checkCollision(asteroid) // Функція перевірки колізії
        ) {
            alert("Гра завершена! Ви набрали " + score + " очок.");
            resetGame();
        }

        // Якщо астероїд вийшов за межі екрану, видаляємо його
        if (asteroid.top >= gameHeight) {
            asteroids.splice(index, 1); // Видаляємо астероїд з масиву
            document.getElementById(asteroid.id).remove(); // Видаляємо астероїд з DOM
        }
    });

    // Перевірка на ловлення бонусів
    if (
        bitPos.top + 50 >= gameHeight - astronautPos.bottom &&
        bitPos.left + 50 >= astronautPos.left &&
        bitPos.left <= astronautPos.left + 50
    ) {
        score += 10;
        scoreDisplay.textContent = "Очки: " + score;
        bitPos.top = -50;
        bitPos.left = Math.random() * (gameWidth - 50);
    }

    // Якщо бонус вийшов за межі екрану, перезавантажуємо його
    if (bitPos.top >= gameHeight) {
        bitPos.top = -50;
        bitPos.left = Math.random() * (gameWidth - 50);
    }

    updatePositions();
}

// Функція для перевірки колізії між космонавтом і астероїдом
function checkCollision(asteroid) {
    // Отримуємо точні розміри астероїда та космонавта
    const asteroidElem = document.getElementById(asteroid.id);
    const astronautRect = astronaut.getBoundingClientRect();
    const asteroidRect = asteroidElem.getBoundingClientRect();

    // Перевіряємо, чи є перекриття між прямокутниками космонавта і астероїда
    return (
        astronautRect.left < asteroidRect.right &&
        astronautRect.right > asteroidRect.left &&
        astronautRect.top < asteroidRect.bottom &&
        astronautRect.bottom > asteroidRect.top
    );
}

// Функція для генерації астероїдів
function generateAsteroids() {
    let numAsteroids = Math.floor(Math.random() * 4) + 2; // Генеруємо від 2 до 5 астероїдів

    for (let i = 0; i < numAsteroids; i++) {
        createAsteroid();  // Створюємо астероїд
    }
}

// Функція для скидання гри
function resetGame() {
    score = 0;
    scoreDisplay.textContent = "Очки: 0";
    asteroids = [];  // Очищаємо астероїди
    document.querySelectorAll('.asteroid').forEach(asteroidElem => asteroidElem.remove());
}

// Викликаємо оновлення гри кожні 50 мс
setInterval(gameLoop, 50);

// Генерація астероїдів кожні 1.5 секунди
setInterval(generateAsteroids, 1500); // Генерація астероїдів кожні 1.5 секунди

// Логіка для увімкнення/вимкнення музики
let isMusicPlaying = false;

musicToggleButton.addEventListener("click", function() {
    if (isMusicPlaying) {
        backgroundMusic.pause();
        musicToggleButton.textContent = "Увімкнути музику";
    } else {
        backgroundMusic.play();
        musicToggleButton.textContent = "Вимкнути музику";
    }
    isMusicPlaying = !isMusicPlaying;
});
