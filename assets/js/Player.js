class Player {
    constructor(name, level, coordX, coordY) {
        this.name = name;
        this.level = level;
        this.coordX = coordX;
        this.coordY = coordY;
        this.enemies = [];
        this.best = localStorage.getItem('chase-best') || 1;
        // const playerImg = new Image();
        // playerImg.src = './assets/images/smiley_sunglasses.png';
        // playerImg.width = 5;
        // playerImg.height = 5;
        // this.icon = playerImg;
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
        ctx.drawImage(this.icon, this.position.x, this.position.y, 10, 10);
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
            if (this.coordY < canvas.height - 10) {
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
            if (this.coordX < canvas.width - 10) {
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
                const personalBubble = 5;
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
            // alert('Victory! Next Level...');
            $('#next-level-alert').show(function () {
                $('#next-level-close').click(function () {
                    $('#next-level-alert').hide('fade');
                })
                setTimeout(() => {
                    $('#next-level-alert').hide('fade');
                }, 3000);
            });

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