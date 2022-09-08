const gameBoard = (function(){
    const winConditon = [[0,1,2],[3,4,5],[6,7,8],[0,4,8],[2,4,6],[0,3,6],[1,4,7],[2,5,8]];
    let _array = ['', '', '', '', '', '', '', '', ''];
    const grids = document.querySelectorAll('.gameboard .grid');

    const getArray = () => {return _array};

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
    
    const reset = () => {
        _array = ['', '', '', '', '', '', '', '', '']
        grids.forEach(grid => grid.textContent = "")

    }
    
    //default parameter as actual game array, but allow imaginary game to check
    const checkWin = (game = _array) => {
        let winner = ""
        winConditon.forEach(condition => {
            const checkArray = []
            for (let i = 0; i < 3; i ++){checkArray.push(game[condition[i]])}
            if (checkArray.every(letter => letter == "X")) {winner = "X"}
            if (checkArray.every(letter => letter == "O")) {winner = "O"}
        })
        
        return winner != "" ? winner : (game.filter(grid => grid != "").length == 9 ? "Tie":"");
    }
    return {
        getArray,
        loadArray,
        displayBoard,
        setBoard,
        checkWin,
        reset
    }
})();

const players = (function(){
    const player1 = {name: "Player1", symbol:"X"};
    const player2 = {name: "Player2", symbol: "O"};

    const getPlayer1 = () => {return player1}
    const getPlayer2 = () => {return player2}
    const setPlayerSymbol = (player1Symbol) => {
        player1.symbol = player1Symbol;
        player2.symbol = player1Symbol == "X" ? "O" : "X";
    }
    const switchPlayer2 = () => {
        player2.name != "A.I." ? player2.name = "A.I." : player2.name = "Player2"
    }
    return {getPlayer1, getPlayer2, setPlayerSymbol, switchPlayer2};
})();

const AI = (function(){
    const grids = document.querySelectorAll('.gameboard .grid')
    let _AISymbol = ""
    let _opponentSymbol = ""

    const setAISymbol = () => {
        _AISymbol = players.getPlayer2().symbol
        _opponentSymbol = _AISymbol == "X" ? "O" : "X";
    }

    
    const randomMove = () => {
        const _array = gameBoard.getArray()
        let index = Math.floor(Math.random()*9)
        while (_array[index] != ""){
            index = Math.floor(Math.random()*9)
        }
        grids[index].click();
    }

    const move = () => {
        let bestMove = minimax(gameBoard.getArray(), true).move
        grids[bestMove].click();
    }
    
    const score = (game) => {
        if (gameBoard.checkWin(game) == _AISymbol) {return 10}
        else if (gameBoard.checkWin(game) == _opponentSymbol) {return -10}
        else {return 0}
    }

    const minimax = (game, AITurn) => {
        if (gameBoard.checkWin(game) != "") {return {score:score(game)}}
        let moves = [];
        
        //get all possible moves
        genGameState(game).forEach(move => {
            let _currentState = Array.from(game);
            if (AITurn) {
                _currentState[move] = _AISymbol;
                let score = minimax(_currentState, false).score
                moves.push({move, score})
            } else {
                _currentState[move] = _opponentSymbol;
                let score = minimax(_currentState, true).score
                moves.push({move, score})
            }            
        });
        
        if (AITurn) {
            //randomise choice when there are equal value choice
            let maxIndex = Math.floor(Math.random()* moves.length);
            for(let i = 0; i < moves.length; i++) {if (moves[i].score > moves[maxIndex].score) {maxIndex = i}}
            return moves[maxIndex];
        } else {
            let minIndex = Math.floor(Math.random()* moves.length);
            for(let i = 0; i < moves.length; i++) {if (moves[i].score < moves[minIndex].score) {minIndex = i}}
            return moves[minIndex];
        }
    }

    //generate possible game state
    const genGameState = (game) => {
        possibleMoves = []
        for (let i = 0; i < 9; i++) {game[i]== "" ? possibleMoves.push(i): false};
        return possibleMoves
    } 

    return {
        randomMove,
        setAISymbol,
        move
    }
})()

const gameFlow = (function(){
    const grids = document.querySelectorAll('.gameboard .grid')
    let _currentPlayer = players.getPlayer1();
    let _gameEnd = ""
    let _turn = 0
    let _currentMode = "player"
    
    const startGame = () => {
        gameBoard.reset()
        _currentPlayer = players.getPlayer1().symbol == "X" ? players.getPlayer1() : players.getPlayer2();
        _currentMode == "player" ? true : AI.setAISymbol();
        displayController.displayMsg("Game Start! X goes first")
        grids.forEach(grid => grid.addEventListener('click', playerTurn))
        //AI will go first if AI is X   
        _currentPlayer.name == "A.I." ? AI.randomMove(): false;
    }
    
    const playerTurn = (event) => {
        if(event.currentTarget.textContent == ''){
            event.currentTarget.textContent = _currentPlayer.symbol;    
            switchTurn();
            displayController.displayMsg(_currentPlayer.symbol + "'s turn");
            gameBoard.loadArray();
            _gameEnd = gameBoard.checkWin();
            console.log(_gameEnd);
            if (_gameEnd != "") {endGame(_gameEnd); return;}
        }
        
        //accomodate for AI turn
        _currentPlayer.name == "A.I." ? AI.move() : false;
    }
    
    const endGame = (state) => {
        let results = ""
        if (state == "Tie"){results = "Tie!"}
        else if (state == _currentPlayer.symbol){
            results = _currentPlayer.name + " wins!"
        } else {
            switchTurn();
            results = _currentPlayer.name + " wins!"
        }
        grids.forEach(grid => grid.removeEventListener('click', playerTurn));
        displayController.displayMsg(results) ;    
    }
    
    const restart = () => {startGame();}

    const switchTurn = () => {
        _currentPlayer.symbol == players.getPlayer1().symbol ? _currentPlayer = players.getPlayer2() : _currentPlayer = players.getPlayer1();
    }

    const switchMode = () => {
        if(_currentMode == "player") {
            _currentMode = "AI"; 
            players.switchPlayer2();
        } else {
            _currentMode = "player";
            players.switchPlayer2();
        }
    }
    
    
    return {
        startGame,
        switchMode,
        restart
    };
})();

const displayController = (function(){
    const player1 = document.querySelector('.player1>button');
    const player2 = document.querySelector('.player2>button');
    const startBtn = document.querySelector('.start');
    const resetBtn = document.querySelector('.reset');
    const restartBtn = document.querySelector('.restart');
    const display = document.querySelector('.annoucement')
    const vsAIBtn = document.querySelector('.aiopponent');
    const vsPlayerBtn = document.querySelector('.playeropponent');
    
    const displayMsg = (msg) => {
        display.textContent = msg;
    }
    
    const switchPlayerSymbol = () => {
        player1.textContent = player1.textContent == "X" ? "O" : "X";
        player2.textContent = player2.textContent == "X" ? "O" : "X";
        players.setPlayerSymbol(player1.textContent);
    }
    
    const disableBtns = () => {
        player1.setAttribute('disabled', true)
        player2.setAttribute('disabled', true)
        vsAIBtn.setAttribute('disabled', true)
        vsPlayerBtn.setAttribute('disabled', true)
    }
    
    const enableBtns = () => {
        player1.removeAttribute('disabled')
        player2.removeAttribute('disabled')
        vsAIBtn.removeAttribute('disabled')
        vsPlayerBtn.removeAttribute('disabled')
    }

    player1.addEventListener('click', switchPlayerSymbol);
    player2.addEventListener('click', switchPlayerSymbol);
    startBtn.addEventListener('click', () => { 
        gameFlow.startGame()
        disableBtns();
        startBtn.style.display = "none";
        resetBtn.style.display = "block";
        restartBtn.style.display = "block";
    });
    
    resetBtn.addEventListener('click', () => {
        gameBoard.reset()
        enableBtns();
        startBtn.style.display = "block";
        resetBtn.style.display = "none";
        restartBtn.style.display = "none";
        displayMsg("Choose Your Opponent and Token! X will go first.")
    })
    
    vsAIBtn.addEventListener('click', () => {
        gameFlow.switchMode()
        displayMsg("Now in Player mode")
        vsPlayerBtn.style.display = "block";
        vsAIBtn.style.display = "none";
        document.querySelector('.player2>.name').textContent = players.getPlayer2().name;
    })
    
    vsPlayerBtn.addEventListener('click', () => {
        gameFlow.switchMode()
        displayMsg("Now in AI mode. It is unbeatable")
        vsPlayerBtn.style.display = "none";
        vsAIBtn.style.display = "block";
        document.querySelector('.player2>.name').textContent = players.getPlayer2().name;
    })

    restartBtn.addEventListener('click', () => {
        gameFlow.restart()
        displayMsg("Game restarted")
    })
    
    return{
        displayMsg
    }
})()

