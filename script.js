const gameBoard = (function(){
    const winConditon = [[0,1,2],[3,4,5],[6,7,8],[0,4,8],[2,4,6],[0,3,6],[1,4,7],[2,5,8]];
    let _array = ['', '', '', '', '', '', '', '', ''];
    const grids = document.querySelectorAll('.gameboard .grid');

    const getArray = () => {return _array};

    const clearArray = () => {_array = ['', '', '', '', '', '', '', '', '']}

    const loadArray = () => {
        for (let i = 0; i < 9 ; i++){
            _array[i] = grids[i].textContent ;
        }
        
    }
    
    const displayBoard = () => {
        for (let i = 0; i < 9 ; i++){
            grids[i].textContent = _array[i];
        }
    }
    
    const setBoard = (symbol) => {
        grids.forEach(grid => grid.addEventListener('click', () => {
                if(grid.textContent == ''){
                    grid.textContent = symbol;    
                }
            }
        ))
    }

    const clearDisplay = () => {
        grids.forEach(grid => grid.textContent = "")
    }

    const checkWin = () => {
        let winner = ""
        winConditon.forEach(condition => {
            const checkArray = []
            for (let i = 0; i < 3; i ++){checkArray.push(_array[condition[i]])}
            if (checkArray.every(letter => letter == "X")) {winner = "X"}
            if (checkArray.every(letter => letter == "O")) {winner = "O"}
        })
        return winner;
    }
    return {
        getArray,
        clearArray,
        loadArray,
        displayBoard,
        setBoard,
        clearDisplay,
        checkWin
    }
})();

const players = function(){
    const player1 = {name: "player1", symbol:"X"};
    const player2 = {name: "player2", symbol: "O"};

    return {player1, player2};
}();

const gameFlow = (function(){
    const grids = document.querySelectorAll('.gameboard .grid')
    let _symbol = "X"
    let _gameEnd = ""
    let _count = 0
    // 1. Select vs AI or 2players -> 
    // 2. Player/play1 select symbol, defaults X -> [start the whole game from start]
    // 3. starts 

    const startGame = () => {
      grids.forEach(grid => grid.addEventListener('click', ()=>{
        if(grid.textContent == ''){
            grid.textContent = _symbol;    
            switchTurn();
            gameBoard.loadArray();
            _count++
        }
        _gameEnd = gameBoard.checkWin();
        if (_gameEnd != "") {endGame(_gameEnd)}
        else if (_gameEnd == "" && _count == 9) {endGame("Tie")}
      }))

    }

    const endGame = (state) => {
        console.log(state)
    }

    const switchTurn = () => {
        _symbol == "X" ? _symbol = "O" : _symbol = "X";
    }

    return {startGame};
})();

gameFlow.startGame();
