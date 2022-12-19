'use strict'

const GAMER = 'GAMER'
const BOX = 'BOX'
const TARGET = 'TARGET'
const WALL = 'WALL'
const FLOOR = 'FLOOR'
const CLOCK = 'CLOCK'
const GOLD = 'GOLD'
const GLUE = 'GLUE'
//ICONS
const GAMER_IMG = '<img src="img/gamer.png" />'
const GREEN_GAMER_IMG = '<img src="img/gamer.png" style="background-color:green;"/>'
const RED_GAMER_IMG = '<img src="img/gamer.png" style="background-color:red;"/>'
const BOX_IMG = '<img src="img/box.png" />'
const TARGET_IMG = '<img src="img/target.png" />'
const WALL_IMG = '<img src="img/wall.png" />'
const CLOCK_IMG = '<img src="img/clock.png" />'
const GOLD_IMG = '<img src="img/gold.png" />'
const GLUE_IMG = '<img src="img/glue.png" />'

//HTML ELEMENTS 
var elButton
var elScore
var elHeader
var elClockScore
var elClockScoreMain
//GLOBAL VARIABLES
var gBoard
var gPlayerPos
var gGamerPos
var gScore
var gIsGameOn
var gClockScore
//GLOBAL INTERVAL
var gFeaturesInterval
//GLOBAL BOOLEANS
var gIsClockActv
var gIsGoldActv
var gIsGlueActv

function gameInit() {
    //HTML elements
    elButton = document.querySelector('.button')
    elScore = document.querySelector('.score')
    elHeader = document.querySelector('.header')
    elClockScore = document.querySelector('.clock-score')
    elClockScoreMain = document.querySelector('.clock-score-main')
    //Starting point
    gIsGameOn = true
    gGamerPos = { i: 2, j: 2 }
    gBoard = buildBoard()
    renderBoard(gBoard)
    gScore = 100
    gClockScore = 10
    gIsClockActv = false
    gIsGoldActv = false
    gIsGlueActv = false
    //Starting HTML
    elScore.innerText = gScore
    elHeader.innerText = 'Welcome To Sobokan'
    elButton.style.visibility = 'hidden'
    //Intervals
    gFeaturesInterval = setInterval(() => {
        addFeatureElement(CLOCK, CLOCK_IMG)
        addFeatureElement(GOLD, GOLD_IMG)
        addFeatureElement(GLUE, GLUE_IMG)
    }, 10000)

}
//BOARD
//Data board
function buildBoard() {
    var board = createMat(9, 8)
    for (var i = 0; i < board.length; i++) {

        //CELL
        for (var j = 0; j < board[0].length; j++) {
            var cell = { type: FLOOR, gameElement: null }

            //Put Wall
            if (i === 0 || i === board.length - 1 ||
                j === 0 || j === board[0].length - 1) cell.type = WALL

            board[i][j] = cell
        }
    }
    //Out of the board shaping
    board[0][0].type = null
    board[0][1].type = null
    board[0][7].type = null
    board[1][7].type = null
    board[2][7].type = null
    board[3][7].type = null
    board[4][7].type = null
    //Inside of the board shaping
    board[1][6].type = WALL
    board[2][6].type = WALL
    board[3][6].type = WALL
    board[4][6].type = WALL
    board[5][6].type = WALL
    board[3][1].type = WALL
    board[3][2].type = WALL
    board[4][2].type = WALL
    board[4][3].type = WALL
    board[5][2].type = WALL
    board[1][1].type = WALL
    board[1][2].type = WALL
    //Default targets

    board[2][1].type = TARGET
    board[3][5].type = TARGET
    board[5][4].type = TARGET
    board[4][1].type = TARGET
    board[7][4].type = TARGET
    board[6][6].type = TARGET
    //Default characters
    board[6][1].gameElement = BOX
    board[6][3].gameElement = BOX
    board[6][4].gameElement = BOX
    board[6][5].gameElement = BOX
    board[2][3].gameElement = BOX
    board[3][4].gameElement = BOX
    board[4][4].gameElement = BOX

    board[2][2].gameElement = GAMER

    return board
}
//Render data board to html
function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            var cellClass = getClassName({ i: i, j: j })
            //Add cell 
            strHTML += `\t<td class = 'cell ${cellClass}' onclick='moveTo(${i},${j})' >\n`
            //Type appearance
            switch (currCell.type) {
                case WALL:
                    strHTML += WALL_IMG
                    break
                case TARGET:
                    strHTML += TARGET_IMG
                    break
            }
            //Game element appearance 
            switch (currCell.gameElement) {
                case GAMER:
                    strHTML += GAMER_IMG
                    break
                case BOX:
                    strHTML += BOX_IMG
                    break
            }
            strHTML += '\t</td>\n'
        }
        strHTML += '</tr>\n'
    }
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

//Render cell
function renderCell(location, value) {
    var cellSelector = '.' + getClassName(location)
    var elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value
}

//MOVING
function moveTo(i, j) {
    if (!gIsGameOn || gIsGlueActv) return
    // Calculate distance
    var iDiff = i - gGamerPos.i
    var jDiff = j - gGamerPos.j
    // Valid move
    var iAbsDiff = Math.abs(iDiff)
    var jAbsDiff = Math.abs(jDiff)

    // RIGHT is +j
    // LEFT is  -j
    // UP is    -i
    // DOWN is  +i

    //Which cell we want to move to
    var targetCell = gBoard[i][j]
    //Making walls block
    if (targetCell.type === WALL) return
    // If the clicked Cell is one of the four allowed
    if ((iAbsDiff === 1 && jAbsDiff === 0) ||
        (jAbsDiff === 1 && iAbsDiff === 0) ||
        (iAbsDiff === gBoard.length - 1) ||
        (jAbsDiff === gBoard[0].length - 1)
    ) {
        //Moving player+box
        if (targetCell.gameElement === BOX) {
            //UP
            if (iDiff < 0) {
                if (checkBoxBlockage(i - 1, j, gBoard)) return
                handleBox(i - 1, j)
                //DOWN
            } else if (iDiff > 0) {
                if (checkBoxBlockage(i + 1, j, gBoard)) return
                handleBox(i + 1, j)
                //LEFT
            } else if (jDiff < 0) {
                if (checkBoxBlockage(i, j - 1, gBoard)) return
                handleBox(i, j - 1)
                //RIGHT
            } else if (jDiff > 0) {
                if (checkBoxBlockage(i, j + 1, gBoard)) return
                handleBox(i, j + 1)
            }

        }
        //If stepped on FEATURES
        else if (targetCell.gameElement === CLOCK) handleClock()
        else if (targetCell.gameElement === GOLD) handleGold()
        else if (targetCell.gameElement === GLUE) handleGlue()
        //REMOVE features abilities from player
        if (gClockScore <= 0) removeClockFromPlayer()

        // MOVING player from current position
        //Dont takeout targets
        if (gBoard[gGamerPos.i][gGamerPos.j].type === TARGET) {
            gBoard[gGamerPos.i][gGamerPos.j].type === TARGET
            renderCell(gGamerPos, TARGET_IMG)
        } else {
            // MODEL:	
            gBoard[gGamerPos.i][gGamerPos.j].gameElement = null
            // DOM : 
            renderCell(gGamerPos, '')
        }
        // MOVING player to selected position
        // MODEL:
        gGamerPos.j = j
        gGamerPos.i = i
        gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER
        //DOM :
        //If gold collected
        if (gIsGoldActv) {
            renderCell(gGamerPos, GREEN_GAMER_IMG)
            gIsGoldActv = false
            //If glue collected 
        } else if (gIsGlueActv) renderCell(gGamerPos, RED_GAMER_IMG)
        //If clock collected
        else if (gIsClockActv) renderCell(gGamerPos, GREEN_GAMER_IMG)
        else renderCell(gGamerPos, GAMER_IMG)
        //Game function
        scoreCountDown()
        checkIfGameOver()
    }
}
//Checking if there's blockage infront of the moving box
function checkBoxBlockage(i, j, board) {
    if (board[i][j].type === WALL ||
        board[i][j].gameElement === BOX)
        return true
}

// Move the player by keyboard arrows
function handleKey(event) {
    var i = gGamerPos.i
    var j = gGamerPos.j
    switch (event.key) {
        case 'ArrowLeft':
            moveTo(i, j - 1)
            break
        case 'ArrowRight':
            moveTo(i, j + 1)
            break
        case 'ArrowUp':
            moveTo(i - 1, j)
            break
        case 'ArrowDown':
            moveTo(i + 1, j)
            break
    }
}

//BOX   
function handleBox(i, j) {
    //MODEL :
    gBoard[i][j].gameElement = BOX
    //DOM :
    renderCell({ i: i, j: j }, BOX_IMG)
}

//CLOCK
function handleClock() {
    //Activate Clock features
    gClockScore = 10
    elClockScoreMain.style.visibility = 'visible'
    gIsClockActv = true
    //**green bgc activated in moveTo() function **
    //**new score is counted in scoreCountDown() function**
}
function removeClockFromPlayer() {
    elClockScoreMain.style.visibility = 'hidden'
    gIsClockActv = false
    gClockScore = 10
}
//GOLD
function handleGold() {
    //Activate Gold features
    gIsGoldActv = true
    gScore += 100
    //**green bgc activated in moveTo() function **
}
//GLUE
function handleGlue() {
    //Activate Glue features
    gIsGlueActv = true
    var minusFiveInterval = setInterval(scoreCountDown, 700)
    setTimeout(() => {
        gIsGlueActv = false
        clearInterval(minusFiveInterval)
        //if clock feature is on return to previous green color
        if(gIsClockActv) renderCell(gGamerPos, GREEN_GAMER_IMG)
        else renderCell(gGamerPos, GAMER_IMG)
    }, 5000)
    //**Red bgc activated in moveTo() function **
}

//Counting down every player move
function scoreCountDown() {
    //Count free clock feature steps. 
    //Prevent glue feature counting 5 steps from free clock feature steps
   if (gIsClockActv && !gIsGlueActv){
        //In case collecting gold while Clock feature is on
        elScore.innerText = gScore
        //Free step counter
        elClockScore.innerText = gClockScore
        gClockScore--
    }else{
        gScore--
        elScore.innerText = gScore
    }
}
//Makes restart btn visible
function showRestartBtn() {
    elButton.style.visibility = 'visible'
}

//If win or lose game
function checkIfGameOver() {
    //Check if WON
    var winningState = { type: TARGET, gameElement: BOX }
    var isWon = true
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].type === winningState.type &&
                gBoard[i][j].gameElement !== winningState.gameElement) {
                isWon = false
            }
        }
    }
    if (isWon) {
        gIsGameOn = false
        elHeader.innerText = 'You Won!!'
        showRestartBtn()
        clearInterval(gFeaturesInterval)
    }
    //Check if LOST
    else if (gScore === 0) {
        gIsGameOn = false
        elHeader.innerText = 'You Lost!!'
        showRestartBtn()
        clearInterval(gFeaturesInterval)
    }
}

//Adding Features
function addFeatureElement(element, element_IMG) {
    var randomPos = getRandomPos()
    if (gBoard[randomPos.i][randomPos.j].gameElement !== null) return
    updateCellElement(randomPos, element, element_IMG)
    removeElement(randomPos, 5000)
}

function updateCellElement(pos, element, element_IMG) {
    //MODEL
    gBoard[pos.i][pos.j].gameElement = element
    //DOM
    renderCell(pos, element_IMG)
}

function removeElement(pos, time) {
    setTimeout(() => {
        if (gBoard[pos.i][pos.j].gameElement === GAMER ||
            gBoard[pos.i][pos.j].gameElement === BOX) return
        gBoard[pos.i][pos.j].gameElement = null
        renderCell(pos, '')
    }, time)
}




