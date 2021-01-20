
$(Document).ready(function () {

    const rows = 10;
    const cols = 10;
    const FREESPACE = 0;
    const OBSTACLE = 10;
    const WEAPON0 = 20;
    const WEAPON1 = 21;
    const WEAPON2 = 22;
    const WEAPON3 = 23;
    const WEAPON4 = 24;
    const CAKE = 30;
    const APPLE = 31;
    const healthClasses = ['cake', 'apple'];
    const weaponClasses = ['weapon0', 'weapon1', 'weapon2', 'weapon3', 'weapon4']
    const PLAYER1 = 40;
    const PLAYER2 = 41;
    const healthPercentage = 0.06;
    const obstaclePercentage = 0.12;
    const maxMoves = 3;

    //============================================================ WEAPONS OBJECT ============================================================//
    const weapon0 = new Weapon(WEAPON0, 'Punch', 'weapon0', 5)
    const weaponOne = new Weapon(WEAPON1, 'Shinigami1', "weapon1", 10)
    const weaponTwo = new Weapon(WEAPON2, 'Shinigami2', "weapon2", 15)
    const weaponThree = new Weapon(WEAPON3, 'Shinigami3', "weapon3", 20)
    const weaponFour = new Weapon(WEAPON4, 'Note Book', "weapon4", 30)
    const weaponObjects = [weapon0, weaponOne, weaponTwo, weaponThree, weaponFour]

    //============================================================ PLAYERS OBJECT ============================================================//
    let player1
    let player2
    let currentPlayer

    let board = []

    addElement = (boardObject, x, y) => {
        let cell = $("<div></div>").text(" ")
        let className = "cell "
        switch (boardObject) {
            case FREESPACE: break;
            case PLAYER1: className += 'playerOnePosition'; break;
            case PLAYER2: className += 'playerTwoPosition'; break;
            case OBSTACLE: className += 'obstacle'; break;
            case CAKE: className += 'cake'; break;
            case APPLE: className += 'apple'; break;
            case WEAPON1: className += 'weapon1'; break;
            case WEAPON2: className += 'weapon2'; break;
            case WEAPON3: className += 'weapon3'; break;
            case WEAPON4: className += 'weapon4'; break;
        }
        cell.addClass(className)
        cell.attr("data-x", x)
        cell.attr("data-y", y)

        $("#gameBoard").append(cell)
    }

    drawBoard = () => {
        let gameBoard = $("#gameBoard")
        gameBoard.text(' ')
        for (i = 0; i < rows; i++) {
            for (j = 0; j < cols; j++) {
                addElement(board[i][j], i, j)
            }
        }
    }

    //============================================================ FREESPACE ============================================================//
    generateFreespace = () => {
        board = Array.from(Array(rows), () => { return (new Array(cols)).fill(FREESPACE) })
    }


    randomNumber = (max) => {
        return Math.floor(Math.random() * max)
    }

    //============================================================ OBSTACLES ============================================================//
    //define a coeficient of what percentage of obstacles(how many)
    generateObstacles = () => {
        const numberOfObstacles = Math.floor(rows * cols * obstaclePercentage)
        let obstaclePlaced = 0
        while (obstaclePlaced < numberOfObstacles) {
            const x = randomNumber(rows)
            const y = randomNumber(cols)
            if (board[x][y] === FREESPACE) {
                board[x][y] = OBSTACLE
                obstaclePlaced++
            }
        }
    }

    //============================================================ HEALTH ============================================================//
    //Same approach like obstacles.... 
    //but here having two kinds of health and we want to create random health so put them in an array
    generateHealth = () => {
        let healthArray = [CAKE, APPLE]
        const numberOfHealth = Math.floor(rows * cols * healthPercentage)
        let healthPlaced = 0
        while (healthPlaced < numberOfHealth) {
            const x = randomNumber(rows)
            const y = randomNumber(cols)
            const healthArrayIndex = randomNumber(healthArray.length)
            if (board[x][y] === FREESPACE) {
                board[x][y] = healthArray[healthArrayIndex]
                healthPlaced++
            }
        }
    }

    //============================================================ WEAPONS ============================================================//
    generateWeapons = () => {
        let flag = true
        while (flag) {
            const x = randomNumber(rows)
            const y = randomNumber(cols)
            if (board[x][y] === FREESPACE) {
                board[x][y] = WEAPON1
                flag = false
            }
        }
        flag = true
        while (flag) {
            const x = randomNumber(rows)
            const y = randomNumber(cols)
            if (board[x][y] === FREESPACE) {
                board[x][y] = WEAPON2
                flag = false
            }
        }
        flag = true
        while (flag) {
            const x = randomNumber(rows)
            const y = randomNumber(cols)
            if (board[x][y] === FREESPACE) {
                board[x][y] = WEAPON3
                flag = false
            }
        }
        flag = true
        while (flag) {
            const x = randomNumber(rows)
            const y = randomNumber(cols)
            if (board[x][y] === FREESPACE) {
                board[x][y] = WEAPON4
                flag = false
            }
        }
    }

    //============================================================ PLAYERS ============================================================//
    getCellsAroundPlayer = (x, y) => {
        return [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]
    }

    playerFilter = ([x, y]) => {
        return (board[x][y] === PLAYER1 || board[x][y] === PLAYER2)
    }

    checkBoundry = (x, y) => {
        return (x >= 0 && x < rows && y >= 0 && y < cols)
    }

    //write the above function in a way that it applys on an array, therefore, as a parameter we have an array object then we use it to filter an array
    boundryFilter = ([x, y]) => {
        return checkBoundry(x, y)
    }

    generatePlayers = () => {
        let flag = true
        while (flag) {
            const x1 = randomNumber(rows)
            const y1 = randomNumber(cols)
            if (board[x1][y1] === FREESPACE) {
                board[x1][y1] = PLAYER1
                player1.setPosition(x1, y1)
                flag = false
            }
        }

        flag = true
        while (flag) {
            const x2 = randomNumber(rows)
            const y2 = randomNumber(cols)
            const cellsAroundPlayer2 = getCellsAroundPlayer(x2, y2) //returns an array
            if ((board[x2][y2] === FREESPACE) && (cellsAroundPlayer2.filter(boundryFilter).filter(playerFilter).length === 0)) {
                board[x2][y2] = PLAYER2
                player2.setPosition(x2, y2)
                flag = false
            }
        }
    }

    //============================================================ ALLOWED CELLS TO MOVE ==================================================//
    forbidenClassFilter = (x, y) => {
        return (board[x][y] === OBSTACLE || board[x][y] === PLAYER1 || board[x][y] === PLAYER2)
    }

    getvalidUpPosition = (x, y) => {
        let validUpPositions = [];
        for (i = 1; i <= maxMoves; i++) {
            let newX = x - i
            let newY = y
            if (checkBoundry(x - i, y)) {
                if (forbidenClassFilter(x - i, y)) { break }
                else {
                    validUpPositions.push([newX, newY]);
                }
            }
        }
        return validUpPositions;
    }

    getvalidDownPosition = (x, y) => {
        let validDownPositions = [];
        for (i = 1; i <= maxMoves; i++) {
            let newX = x + i
            let newY = y
            if (checkBoundry(x + i, y)) {
                if (forbidenClassFilter(x + i, y)) { break }
                else {
                    validDownPositions.push([newX, newY]);
                }
            }
        }
        return validDownPositions;
    }

    getvalidLeftPosition = (x, y) => {
        let validLeftPositions = [];
        for (i = 1; i <= maxMoves; i++) {
            let newX = x
            let newY = y - i
            if (checkBoundry(x, y - i)) {
                if (forbidenClassFilter(x, y - i)) { break }
                else {
                    validLeftPositions.push([newX, newY]);
                }
            }
        }
        return validLeftPositions;
    }

    getvalidRightPosition = (x, y) => {
        let validRightPositions = [];
        for (i = 1; i <= maxMoves; i++) {
            let newX = x
            let newY = y + i
            if (checkBoundry(x, y + i)) {
                if (forbidenClassFilter(x, y + i)) { break }
                else {
                    validRightPositions.push([newX, newY]);
                }
            }
        }
        return validRightPositions;
    }

    //Sum of all valid cells
    getAllValidPositions = (x, y) => {
        const allUp = getvalidUpPosition(x, y);
        const allDown = getvalidDownPosition(x, y)
        const allLeft = getvalidLeftPosition(x, y)
        const allRight = getvalidRightPosition(x, y)
        const allpositions = allUp.concat(allDown, allLeft, allRight)
        return allpositions;
    }

    highlightCell = (x, y) => {
        $(".cell[data-x='" + x + "'][data-y='" + y + "']").addClass("pathHighlight")
    }

    unHighlightCell = (x, y) => {
        $(".cell[data-x='" + x + "'][data-y='" + y + "']").removeClass("pathHighlight")
    }

    showPossiblePathToMove = (x, y) => {
        getAllValidPositions(x, y).forEach(([x, y]) => {
            highlightCell(x, y)
        })
        enableClick()
    }

    hidePossiblePath = (x, y) => {
        $(".pathHighlight").off("click")
        $(".pathHighlight").removeClass("pathHighlight")
    }

    switchPlayer = () => {
        currentPlayer = (currentPlayer.ID === PLAYER1) ? player2 : player1
        showPossiblePathToMove(currentPlayer.x, currentPlayer.y)
    }

    //============================================================ COLLECT HEALTH ============================================================//
    getHealthElement = (classList) => {
        return healthClasses.filter(item => {
            return classList.search(item) !== -1
        })
    }

    eatHealth = (x, y) => {
        let currentHealthClass = getHealthElement($(".cell[data-x='" + x + "'][data-y='" + y + "']").attr("class"))[0]
        if (currentHealthClass === 'cake' || currentHealthClass === 'apple') {
            $(".cell[data-x='" + x + "'][data-y='" + y + "']").removeClass(currentHealthClass)
            board[x][y] = FREESPACE
            currentPlayer.health += 5
            if (currentPlayer.ID === PLAYER1) {
                $(".countHealthPlayer1").text(currentPlayer.health)
                $(".healthBar1").attr("value", player1.health)

            } else if (currentPlayer.ID === PLAYER2) {
                $(".countHealthPlayer2").text(currentPlayer.health)
                $(".healthBar2").attr("value", player2.health)
            }
        }
    }

    //============================================================ PICK UP WEAPON ============================================================//
    getWeapon = (classList) => {
        return weaponClasses.filter(item => {
            return classList.search(item) !== -1
        })
    }

    getWeaponByClassName = (className) => {
        return weaponObjects.filter(w => w.className === className)
    }

    pickWeapon = (x, y) => {
        let currentWeaponClass = getWeapon($(".cell[data-x='" + x + "'][data-y='" + y + "']").attr("class"))
        if (currentWeaponClass.length > 0) {
            currentWeaponClass = currentWeaponClass[0]
            //if the previouse weapon is punch make it undefined
            currentPlayer.previousWeapon = (currentPlayer.currentWeapon === weapon0) ? undefined : currentPlayer.currentWeapon
            currentPlayer.currentWeapon = getWeaponByClassName(currentWeaponClass)[0]
            $(".cell[data-x='" + x + "'][data-y='" + y + "']").removeClass(currentWeaponClass)
            // board[x][y] = FREESPACE
            if (currentPlayer.ID === PLAYER1) {
                $(".whichWeaponPlayer1").text(currentPlayer.currentWeapon.name)
            } else if (currentPlayer.ID === PLAYER2) {
                $(".whichWeaponPlayer2").text(currentPlayer.currentWeapon.name)
            }
        }
    }

    //get all cells around so you can collect evrything by passing through
    getAll = (oldX, oldY, newX, newY) => {
        let xDir = 0
        let yDir = 0
        const diffX = oldX - newX
        const diffY = oldY - newY
        if (diffX !== 0) { //different collumns
            xDir = (diffX > 0) ? -1 : 1
        }
        if (diffY !== 0) { //different rows
            yDir = (diffY > 0) ? -1 : 1
        }
        let [x, y] = [oldX, oldY]
        let result = []
        let flag = true
        while (flag) {
            x += xDir
            y += yDir
            result.push([x, y])
            if (x === newX && y === newY) {
                flag = false
            }
        }
        return result
    }

    //when two players encounter --> the battle starts
    getVicinityOfPlayer = (x, y) => {
        return [
            [x, y - 1], [x, y + 1], [x - 1, y], [x + 1, y]
        ]
    }

    //============================================================ CLICK EVENT ============================================================//
    enableClick = () => {
        $(".pathHighlight").click(function () {
            let playerPositionClass = currentPlayer.playerPositionClass
            let oldX = currentPlayer.x
            let oldY = currentPlayer.y
            let newX = parseInt($(this).attr('data-x'), 10)
            let newY = parseInt($(this).attr('data-y'), 10)
            //===drop of all previouse weapons===//
            if (currentPlayer.previousWeapon !== undefined) {
                board[oldX][oldY] = currentPlayer.previousWeapon.ID
                $("." + playerPositionClass).addClass(currentPlayer.previousWeapon.className)
                currentPlayer.previousWeapon = undefined
            }
            $("." + playerPositionClass).removeClass(playerPositionClass)
            $(this).addClass(playerPositionClass)

            //collect Health and pick up a weapon
            getAll(oldX, oldY, newX, newY).forEach(([x, y]) => {
                eatHealth(x, y)
                pickWeapon(x, y)
            })

            hidePossiblePath(oldX, oldY)
            board[oldX][oldY] = FREESPACE
            board[newX][newY] = currentPlayer.ID
            currentPlayer.setPosition(newX, newY)

            //players encounter
            let startBattle = false
            getVicinityOfPlayer(newX, newY).filter(boundryFilter).forEach(([x, y]) => {
                if (board[x][y] === PLAYER2 || board[x][y] === PLAYER1) {
                    startBattle = true
                }
            })

            //battle Mode
            if (startBattle) {
                // disableClick
                $(".pathHighlight").off("click")
                // showBattleScreen
                showBattleMode()
            } else {
                switchPlayer()
            }
        })
    }

    //============================================================ FIGHT MODE ============================================================//
    otherPlayer = () => {
        return currentPlayer.ID === PLAYER1 ? player2 : player1
    }

    enableDisableButtons = () => {
        if (currentPlayer.ID === PLAYER1) {
            $("#attackButton2").prop("disabled", true)
            $("#attackButton1").prop("disabled", false)
            $("#defendButton2").prop("disabled", true)
            $("#defendButton1").prop("disabled", false)
        } else {
            $("#attackButton2").prop("disabled", false)
            $("#attackButton1").prop("disabled", true)
            $("#defendButton2").prop("disabled", false)
            $("#defendButton1").prop("disabled", true)
        }
    }

    updateBattleDashboard = () => {
        $(".countHealthPlayer1").text(player1.health)
        $(".countHealthPlayer2").text(player2.health)
        $(".healthBar1").attr("value", player1.health)
        $(".healthBar2").attr("value", player2.health)
        $(".whichWeaponPlayer1").text(player1.currentWeapon.name)
        $(".whichWeaponPlayer2").text(player2.currentWeapon.name)
        $(".damagePlayer1").text(player1.currentWeapon.damage)
        $(".damagePlayer2").text(player2.currentWeapon.damage)
    }

    attack = () => {
        //defend mode is off
        $(".defending1").css("display", "none")
        $(".defending2").css("display", "none")
        otherPlayer().takeDamage(currentPlayer.currentWeapon.damage)
        //game over
        if (checkGameOver()) {
            $("#battleModal").css("display", "none")
            showGameOver()
        } else {
            updateBattleDashboard()
            switchPlayer()
            enableDisableButtons()
        }
    }

    defend = () => {
        //defend mode is off
        $(".defending1").css("display", "none")
        $(".defending2").css("display", "none")
        currentPlayer.defend = true
        if (currentPlayer.ID === PLAYER1 && player1.defend === true) {
            $(".defending1").css("display", "block")
        } else if (currentPlayer.ID === PLAYER2 && player2.defend === true) {
            $(".defending2").css("display", "block")
        }
        updateBattleDashboard()
        switchPlayer()
        enableDisableButtons()
    }

    showBattleMode = () => {
        enableDisableButtons()
        updateBattleDashboard()
        $("#battleModal").css("display", "block")
    }

    checkGameOver = () => {
        if (player1.health <= 0 || player2.health <= 0) {
            return true
        } else {
            return false
        }
    }

    showGameOver = () => {
        if (player1.health > player2.health) {
            $("#player1WinsModal").slideDown("slow").css("display", "block")
            $('#backgroundSound')[0].pause()
            $('#kiraWins')[0].play()
        } else {
            $("#player2WinsModal").slideDown("slow").css("display", "block")
            $('#backgroundSound')[0].pause()
            $('#LWins')[0].play()
        }
    }

    //============================================================ START THE GAME ============================================================//
    start = () => {
        player1 = new Player(PLAYER1, "Kira", undefined, weapon0, "playerOnePosition")
        player2 = new Player(PLAYER2, "L", undefined, weapon0, "playerTwoPosition")
        currentPlayer = player1
        board = []
        generateFreespace()
        generateObstacles()
        generateHealth()
        generateWeapons()
        generatePlayers()
        drawBoard()
        showPossiblePathToMove(currentPlayer.x, currentPlayer.y)
    }

    start()
    //start Button
    $("#startGame").click(function () {
        $("#openingModal").css("display", "none")
        $('#backgroundSound')[0].play()
        start()
    })

    mute = () => {
        $('#backgroundSound')[0].pause()
    }

    //============================================================ RESTART THE GAME ============================================================//
    $(".playAgain").click(function () {
        $('#kiraWins')[0].pause()
        $('#LWins')[0].pause()
        $('#backgroundSound')[0].play()
        $("#player1WinsModal").css("display", "none")
        $("#player2WinsModal").css("display", "none")
        $(".healthBar1").attr("value", "100")
        $(".healthBar2").attr("value", "100")
        $(".whichWeaponPlayer1").text(weapon0.name)
        $(".whichWeaponPlayer2").text(weapon0.name)
        start()
    })

});