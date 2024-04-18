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
            ctx.drawImage(this.icon, this.position.x, this.position.y, 10, 10);
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
                    this.coordY += 1;
                }
                if (y > playerY) {
                    this.coordY -= 1;
                }
            } else {
                if (x < playerX) {
                    this.coordX += 1;
                }
                if (x > playerX) {
                    this.coordX -= 1;
                }
            }
        }
        if (direction == 'vertical') {
            if (y == playerY) {
                if (x < playerX) {
                    this.coordX += 1;
                }
                if (x > playerX) {
                    this.coordX -= 1;
                }
            } else {
                if (y < playerY) {
                    this.coordY += 1;
                }
                if (y > playerY) {
                    this.coordY -= 1;
                }
            }
        }


        if (this.coordX == playerX && this.coordY == playerY) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.setEnemyPosition();
            // alert('You\'ve been caught!');
            $('#caught-alert').show(function () {
                $('#caught-close').click(function () {
                    $('#caught-alert').hide('fade', function () {
                        window.location.reload();
                    });
                })
                setTimeout(() => {
                    $('#caught-alert').hide('fade', function () {
                        window.location.reload();
                    });
                }, 3000);
            });

        }
        this.setEnemyPosition();
    }
}