class Player {
    constructor(name, level, coordX, coordY) {
        this.name = name;
        this.level = level;
        this.coordX = coordX;
        this.coordY = coordY;
        this.enemies = [];
        this.best = localStorage.getItem('chase-best') || 1;;
        this.icon = document.getElementById('smiley-sunglasses');
    }

    get stats() {
        return {
            name: this.name,
            level: this.level,
            best: this.best,
        }
    }
    get position() {
        return {
            x: this.coordX,
            y: this.coordY,
        }
    }

    setEnemies(enemiesArr) {
        if (enemiesArr.length) {
            this.enemies = enemiesArr;
        }
    }

    setPlayerOnCanvas() {
        const canvas = document.getElementById('game-canvas');
        const ctx = canvas.getContext('2d');
        // ctx.font = "bold italic 50px Arial";
        ctx.font = '5px emoji';
        // ctx.textAlign = "center";
        // ctx.textBaseline = "middle";
        ctx.drawImage(this.icon, this.position.x, this.position.y, 5, 5);
    }

    setInitialPlayerPosition() {
        const canvas = document.getElementById('game-canvas');
        this.coordX = canvas.width / 2;
        this.coordY = canvas.height / 2;
        this.setPlayerOnCanvas()
    }

    // player movement
    moveY(value) {
        const isDown = value == 'down';
        const canvas = document.getElementById('game-canvas');
        const ctx = canvas.getContext('2d');
        if (isDown) {
            if (this.coordY < canvas.height - 5) {
                this.coordY = this.coordY + 1;
            }
        } else {
            if (this.coordY > 0) {
                this.coordY = this.coordY - 1;
            }
        }
        this.setPlayerOnCanvas();
        this.moveEnemies('horizontal');
    }

    moveX(value) {
        const isRight = value.includes('right');
        const canvas = document.getElementById('game-canvas');
        const ctx = canvas.getContext('2d');

        if (isRight) {
            if (this.coordX < canvas.width - 5) {
                this.coordX = this.coordX + 1;
            }
        } else {
            if (this.coordX > 0) {
                this.coordX = this.coordX - 1;
            }
        }
        this.setPlayerOnCanvas();
        this.moveEnemies('vertical');
    }

    moveEnemies(direction) {
        const allEnemies = this.enemies;
        allEnemies.forEach(enemy => {
            if (enemy.isAlive) {
                enemy.moveToPlayer(direction);
            }
        });
        this.checkEnemyPositions();
    }

    refreshBoard() {
        const canvas = document.getElementById('game-canvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.refreshEnemies();
        this.setPlayerOnCanvas();
    }

    refreshEnemies() {
        const allEnemies = this.enemies;
        allEnemies.forEach(enemy => {
            enemy.setEnemyPosition();
        })
    }

    checkEnemyPositions() {
        const allEnemies = this.enemies;

        const duplicates = allEnemies.filter((enemyObj, i) => {
            return allEnemies.some((enemy, ii) => {
                const personalBubble = 3;
                const enemyX = enemy.position.x;
                const enemyY = enemy.position.y;
                const enemyObjX = enemyObj.position.x;
                const enemyObjY = enemyObj.position.y;

                // check if enemy icon is inside 'PersonalBubble' range
                const xOutsidePersonalBubble = enemyX <= enemyObjX - personalBubble || enemyX >= enemyObjX + personalBubble
                const yOutsidePersonalBubble = enemyY <= enemyObjY - personalBubble || enemyY >= enemyObjY + personalBubble

                return (!xOutsidePersonalBubble) && (!yOutsidePersonalBubble) && (i != ii) && enemy.isAlive && enemyObj.isAlive;
            })
        });

        duplicates.forEach(enemy => {
            enemy.die();
        })
        let finishGame = true;
        allEnemies.forEach(enemy => {
            if (enemy.isAlive) {
                finishGame = false;
            }
        })
        if (finishGame) {
            alert('Victory! Next Level...');
            this.level++;
            if (this.level > this.best) {
                localStorage.setItem('chase-best', this.level);
            }
            clearCanvas();
            this.enemies = [];
            this.setInitialPlayerPosition();
            $('#level-text').text(this.level);
            const newEnemies = createEnemies(this);
            this.setEnemies(newEnemies);
        }
    }
}

class Enemy {
    constructor(coordX, coordY, player) {
        this.coordX = coordX;
        this.coordY = coordY;
        this.isAlive = true;
        this.player = player;
        this.icon = document.getElementById('smiley-devil');
    }

    get position() {
        return {
            x: this.coordX,
            y: this.coordY,
        }
    }

    die() {
        this.isAlive = false;
        this.icon = 'X';
        this.setEnemyPosition()
    }

    setEnemyPosition() {
        const canvas = document.getElementById('game-canvas');
        const ctx = canvas.getContext('2d');
        // ctx.font = '1ch emoji';
        if (this.isAlive) {
            ctx.drawImage(this.icon, this.position.x, this.position.y, 5, 5);
        }
    }

    moveToPlayer(direction) {
        const { position: playerPosition } = this.player;
        const { x: playerX, y: playerY } = playerPosition;
        const canvas = document.getElementById('game-canvas');
        const ctx = canvas.getContext('2d');

        const { x, y } = this.position;

        if (direction == 'horizontal') {
            if (x == playerX) {
                if (y < playerY) {
                    this.coordY++;
                }
                if (y > playerY) {
                    this.coordY--;
                }
            } else {
                if (x < playerX) {
                    this.coordX++;
                }
                if (x > playerX) {
                    this.coordX--;
                }
            }
        }
        if (direction == 'vertical') {
            if (y == playerY) {
                if (x < playerX) {
                    this.coordX++;
                }
                if (x > playerX) {
                    this.coordX--;
                }
            } else {
                if (y < playerY) {
                    this.coordY++;
                }
                if (y > playerY) {
                    this.coordY--;
                }
            }
        }


        if (this.coordX == playerX && this.coordY == playerY) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.setEnemyPosition();
            alert('You\'ve been caught!');

            window.location.reload();
        }
        this.setEnemyPosition();
    }
}

function createEnemies(player) {
    const amt = player.level * 2;
    const enemyPositions = [];
    const canvas = document.getElementById('game-canvas');

    const allEnemies = [];

    for (let i = 0; i < amt; i++) {
        let randomCoords = JSON.stringify(_getRandomValues());

        // ensure no enemies spawn on same point or on player position
        while (enemyPositions.includes(randomCoords) || randomCoords == JSON.stringify(player.position)) {
            randomCoords = JSON.stringify(_getRandomValues());
        }

        enemyPositions.push(randomCoords);
    }
    enemyPositions.forEach(positionStr => {
        const { x, y } = JSON.parse(positionStr);

        const newEnemy = new Enemy(x, y, player);
        newEnemy.setEnemyPosition();
        allEnemies.push(newEnemy);
    })

    return allEnemies;

    function _getRandomValues() {
        const randomX = Math.floor(Math.random() * canvas.width);
        const randomY = Math.floor(Math.random() * canvas.height);

        return {
            x: randomX,
            y: randomY,
        }
    }
}

function startGame() {
    $('.buttons').hide();
    $('.instructions').hide();
    let playerName = '';
    while (!playerName.length) {
        playerName = prompt('Enter your name:');
    }
    const newPlayer = new Player(playerName, 1, 0, 0);
    $('p.name').text(`Welcome, ${newPlayer.stats.name}!`);
    _buildStatsDisplay();
    newPlayer.setInitialPlayerPosition();

    let allEnemies = createEnemies(newPlayer);
    newPlayer.setEnemies(allEnemies);

    $('.game-wrapper').css({ position: 'fixed', top: '15%', right: '5%' });
    $('body').css({ overflowY: 'hidden', overflowX: 'hidden' });
    $('.mobile-buttons').show();

    $(document).keydown(e => {
        const { key } = e;
        moveLogic(key, newPlayer);
    })

    $('.arrow-button').click(function () {
        const key = $(this).attr('id');
        moveLogic(key, newPlayer);
    })

    function _buildStatsDisplay() {

        const bestLabel = $('<span>', {
            class: 'label',
            text: 'Best: ',
        })
        const bestText = $('<span>', {
            text: newPlayer.stats.best,
            id: 'best-text'
        })
        const bestLi = $('<li>', { class: 'stats-item' })
        bestLi.append(bestLabel).append(bestText);

        const levelLabel = $('<span>', {
            class: 'label',
            text: 'Level: ',
        })
        const levelText = $('<span>', {
            text: newPlayer.stats.level,
            id: 'level-text'
        })
        const levelLi = $('<li>', { class: 'stats-item' })
        levelLi.append(levelLabel).append(levelText);

        $('ul.stats').append(levelLi).append(bestLi);
        $('.player-stats-wrapper').show(600);
    }
}

function moveLogic(key, newPlayer) {
    clearCanvas();
    switch (key) {
        case 'ArrowDown':
            newPlayer.moveY('down');
            break;
        case 'ArrowUp':
            newPlayer.moveY('up');
            break;
        case 'ArrowLeft':
            newPlayer.moveX('left');
            break;
        case 'ArrowRight':
            newPlayer.moveX('right');
            break;
        default:
            break;
    }
}

function clearCanvas() {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

$('.start-btn').click(e => {
    startGame();
})


