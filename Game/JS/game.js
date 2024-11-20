const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Динамічний розмір лабіринту
const tileSize = 20;
const rows = 51;
const cols = 51;

// Автоматичний розмір полотна
canvas.width = cols * tileSize;
canvas.height = rows * tileSize;

// Дані гри
let player = { x: 1, y: 1 };
let exit = { x: cols - 2, y: rows - 2 };
let labyrinth = [];
let level = 1;

// Завантаження текстур
const textures = {
    player: new Image(),
    exit: new Image(),
    wall: new Image(),
    floor: new Image(),
};
textures.player.src = "https://via.placeholder.com/20/FF4500/FFFFFF?text=P";
textures.exit.src = "https://via.placeholder.com/20/00FF00/FFFFFF?text=E";
textures.wall.src = "https://via.placeholder.com/20/333333/000000";
textures.floor.src = "https://via.placeholder.com/20/AAAAAA/FFFFFF";

// Генерація лабіринту
function generateLabyrinth(rows, cols) {
    const maze = Array.from({ length: rows }, () => Array(cols).fill(1));

    function carvePassages(cx, cy) {
        const directions = [
            [0, -2], [0, 2], [-2, 0], [2, 0]
        ];
        directions.sort(() => Math.random() - 0.5);

        for (const [dx, dy] of directions) {
            const nx = cx + dx;
            const ny = cy + dy;

            if (nx > 0 && nx < cols - 1 && ny > 0 && ny < rows - 1 && maze[ny][nx] === 1) {
                maze[cy + dy / 2][cx + dx / 2] = 0;
                maze[ny][nx] = 0;
                carvePassages(nx, ny);
            }
        }
    }

    maze[1][1] = 0;
    carvePassages(1, 1);
    maze[rows - 2][cols - 2] = 2;
    return maze;
}

// Малювання лабіринту
function drawLabyrinth() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < labyrinth.length; y++) {
        for (let x = 0; x < labyrinth[y].length; x++) {
            if (labyrinth[y][x] === 1) {
                ctx.drawImage(textures.wall, x * tileSize, y * tileSize, tileSize, tileSize);
            } else if (labyrinth[y][x] === 0) {
                ctx.drawImage(textures.floor, x * tileSize, y * tileSize, tileSize, tileSize);
            } else if (labyrinth[y][x] === 2) {
                ctx.drawImage(textures.exit, x * tileSize, y * tileSize, tileSize, tileSize);
            }
        }
    }

    ctx.shadowBlur = 10;
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.drawImage(textures.player, player.x * tileSize, player.y * tileSize, tileSize, tileSize);
    ctx.shadowBlur = 0;
}

// Логіка переміщення
function movePlayer(dx, dy) {
    const newX = player.x + dx;
    const newY = player.y + dy;

    if (labyrinth[newY][newX] !== 1) {
        player.x = newX;
        player.y = newY;
    }

    if (labyrinth[newY][newX] === 2) {
        level++;
        alert(`Вітаємо! Ви перейшли на рівень ${level}`);
        startNewLevel();
    }
}

// Старт нового рівня
function startNewLevel() {
    labyrinth = generateLabyrinth(rows, cols);
    player = { x: 1, y: 1 };
    exit = { x: cols - 2, y: rows - 2 };
    drawLabyrinth();
}

// Слухач клавіш
let isMouseOverCanvas = false;

document.addEventListener("keydown", (e) => {
    if (isMouseOverCanvas) {
        e.preventDefault(); // Блокуємо стандартну дію прокручування
        switch (e.key) {
            case "ArrowUp":
                movePlayer(0, -1);
                break;
            case "ArrowDown":
                movePlayer(0, 1);
                break;
            case "ArrowLeft":
                movePlayer(-1, 0);
                break;
            case "ArrowRight":
                movePlayer(1, 0);
                break;
        }
        drawLabyrinth();
    }
});

// Відстеження курсора над полотном
canvas.addEventListener("mouseenter", () => {
    isMouseOverCanvas = true;
});
canvas.addEventListener("mouseleave", () => {
    isMouseOverCanvas = false;
});

// Старт гри
startNewLevel();