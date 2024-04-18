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

    // let playerName = '';
    // while (!playerName.length) {
    //     playerName = prompt('Enter your name:');
    // }
    const newPlayer = new Player('Player', 1, 0, 0);

    _updateView();
    _setUpPlayer();

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

    function _updateView() {
        $('.buttons').hide();
        $('.instructions').hide();
        $('.game-wrapper').css({ position: 'fixed', top: '15%', right: '5%' });
        $('body').css({ overflowY: 'hidden', overflowX: 'hidden' });
        $('.mobile-buttons').show();
        // $('p.name').text(`Welcome, ${newPlayer.stats.name}!`);
        primeCanvas();
        _buildStatsDisplay();
    }

    function _setUpPlayer() {
        newPlayer.setInitialPlayerPosition();
        let allEnemies = createEnemies(newPlayer);
        newPlayer.setEnemies(allEnemies);

        $(document).keydown(e => {
            const { key } = e;
            moveLogic(key, newPlayer);
        })

        $('.arrow-button').on('click touchmove', function () {
            const key = $(this).attr('id');
            if (['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft'].includes(key)) {
                moveLogic(key, newPlayer);
            }
        })
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

function primeCanvas() {
    const canvas = document.getElementById('game-canvas');
    canvas.imageSmoothingEnabled = false;
    canvas.width = 200 * window.devicePixelRatio;
    canvas.height = 170 * window.devicePixelRatio;
    canvas.style.width = '100%';
    canvas.style.height = '85%'

}

$('.start-btn').click(e => {
    startGame();
})


