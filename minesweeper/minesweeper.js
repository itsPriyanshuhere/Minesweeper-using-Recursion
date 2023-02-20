export const TILE_STATUSES = {
    HIDDEN: 'hidden',
    MINE: 'mine',
    NUMBER: 'number',
    MARKED: 'marked',
}

export function createBoard(boardSize, numberofMines){
    const board = []
    const minePositions = getMinePositions(boardSize,numberofMines)
    console.log(minePositions)
    for(let x=0;x<boardSize;x++){
        const row = []
        for(let y=0;y<boardSize;y++){
            const element = document.createElement('div') // creating an element of div which can be later appended into the body
            // "This line of code creates a new HTML element using JavaScript by calling the document.createElement() method, and assigns it to the variable element. In this specific case, the code is creating a new div element.

            // Once the div element is created, you can modify its properties, such as adding content, changing its styles, or appending it to other elements in the DOM tree.
            
            // For example, you could add text to the newly created div element using the textContent property:
            
            // python
            // Copy code
            // element.textContent = 'Hello World';
            // Or, you could set some CSS styles to the div using the style property:
            
            // python
            // Copy code
            // element.style.backgroundColor = 'blue';
            // element.style.color = 'white';
            // Once you have created and modified the element, you can insert it into the DOM tree by using one of the methods such as appendChild() or insertBefore() on another element, for example:
            
            // javascript
            // Copy code
            // document.body.appendChild(element);
            // This would append the newly created div element to the end of the body element in the current HTML document."

            element.dataset.status = TILE_STATUSES.HIDDEN
            const tile = {
                element,
                x,
                y,
                mine: minePositions.some(positionMatch.bind(null,{x,y})),
                get status(){
                    return element.dataset.status
                },
                set status(value){
                    this.element.dataset.status = value
                }
            }
            row.push(tile)
        }
        board.push(row)
    }
    return board
}

export function markTile(tile){
    if(tile.status !== TILE_STATUSES.HIDDEN
     && tile.status !== TILE_STATUSES.MARKED){
        return
     }

     if(tile.status === TILE_STATUSES.MARKED){
        tile.status = TILE_STATUSES.HIDDEN
     }else{
        tile.status = TILE_STATUSES.MARKED
     }
}

export function checkWin(board){
    return board.every(row => {
        return row.every(tile =>{
            return tile.status === TILE_STATUSES.NUMBER ||
            (tile.mine &&(tile.status === TILE_STATUSES.HIDDEN
                || tile.status === TILE_STATUSES.MARKED))
        })
    })
}

export function checkLose(board){
   return board.some(row => {
    return row.some(tile => {
        return tile.status === TILE_STATUSES.MINE
    })
   })
}

function getMinePositions(boardSize,numberofMines){
    const positions = []

    while(positions.length < numberofMines){
        const position  = {
            x: randomNumber(boardSize),
            y: randomNumber(boardSize)
        }

        if(!positions.some(positionMatch.bind(null,position))){
            //The some() method checks whether at least one element in the positions array passes the test implemented by the provided function. The positionMatch
            // function is being used as the test function in this
            // case.
            positions.push(position)
        }
    }

    return positions
}

function positionMatch(a,b){
    return a.x === b.x  &&  a.y === b.y
}

function randomNumber(size){
    return Math.floor(Math.random()*size)
}

