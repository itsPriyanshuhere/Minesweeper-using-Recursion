import { TILE_STATUSES,createBoard, markTile
,checkWin,checkLose } from "./minesweeper.js"

const BOARD_SIZE = 2
const NUMBER_OF_MINES = 3

const board = createBoard(BOARD_SIZE,NUMBER_OF_MINES)
const boardElement = document.querySelector(".board")//calling first html attribute with class board
const minesLeft = document.querySelector("[data-mine-count]")
const messageText = document.querySelector(".subtext")

board.forEach(row => {
    row.forEach(tile =>{
        boardElement.append(tile.element)
        tile.element.addEventListener('click', () =>{
            revealTile(board,tile)
            checkGameStatus()
        })
        tile.element.addEventListener('contextmenu',e =>{
            e.preventDefault()
            markTile(tile)
            listMinesLeft()
        })
    })
})
boardElement.style.setProperty("--size",BOARD_SIZE)
minesLeft.textContent = NUMBER_OF_MINES

export function revealTile(board,tile){
    if(tile.status != TILE_STATUSES.HIDDEN){
        return
    }
    if(tile.mine){
        tile.status = TILE_STATUSES.MINE
        return
    }
    tile.status = TILE_STATUSES.NUMBER
    const adjacent =  nearby(board,tile)
    const mines = adjacent.filter(t => t.mine)
    if(mines.length === 0){
        adjacent.forEach(revealTile.bind(null,board))
    }else{
        tile.element.textContent = mines.length
    }
}

function listMinesLeft(){
    const markedTilesCount = board.reduce((count,row) => {
        return count + row.filter(tile => tile.status ===TILE_STATUSES.MARKED).
        length
    }, 0)

    minesLeft.textContent = NUMBER_OF_MINES - markedTilesCount
}

function checkGameStatus(){
    const win = checkWin(board)
    const lose = checkLose(board)

    if(win || lose){
        boardElement.addEventListener("click",stopProp,{capture: true})
        boardElement.addEventListener("contextmenu",stopProp,{capture: true})
    }

    if(win){
        messageText.textContent = "You Win"
    }
    if(lose){
        messageText.textContent = "You Lose"
        board.forEach(row =>{
            row.forEach(tile => {
                if(tile.TILE_STATUSES === TILE_STATUSES.MARKED) markTile(tile)
                if(tile.mine) revealTile(board, tile)
            })
        })
    }
}

function nearby(board,{x,y}){
    const tiles = []

    for(let xo=-1;xo<=1;xo++){
        for(let yo=-1;yo<=1;yo++){
            const tile = board[x+ xo]?.[y+yo]
            if(tile){
                tiles.push(tile)
                }
            }
    }

    return tiles
}

function stopProp(e){
    e.stopImmediatePropagation()
}