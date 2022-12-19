function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}
//Get desired class name
function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    // The maximum is exclusive and the minimum is inclusive
    return Math.floor(Math.random() * (max - min) + min)
}

//get random { i : i , j : j }
function getRandomPos() {
    var randPosI = getRandomInt(0, gBoard.length)
    var randPosJ = getRandomInt(0, gBoard[0].length)
    
    while (gBoard[randPosI][randPosJ].gameElement !== null ||
        gBoard[randPosI][randPosJ].type !== FLOOR) {
        randPosI = getRandomInt(0, gBoard.length)
        randPosJ = getRandomInt(0, gBoard[0].length)
    }

    var randomPos = { i: randPosI, j: randPosJ }
    return randomPos
}


