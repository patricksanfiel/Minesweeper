window.onload = () => {
    var difficulty, mineSpaces, allSpaces, safeSpaces, gridColsAndRows
    var score = 0
    const MINESWEEPERDIV = document.getElementById("minesweeper-div")
    const GAMEINSTRUCTIONS = document.getElementById("instructions")
    const SCOREDIV = document.querySelector("#score-span")
    const SPACESLEFTDIV = document.getElementById("spaces-left-span")
    
    function reset(){
        window.location.reload()
    }

    function gameOver(){
        var boardDiv = document.querySelector("#board-div")
            boardDiv.innerHTML = ""
        var gameOverImage = document.createElement("img")
            gameOverImage.setAttribute("src", "./assets/images/explosion.gif")
            gameOverImage.setAttribute("alt", "explosion")
            gameOverImage.setAttribute("height", "150px")
            gameOverImage.setAttribute("width", "150px")
        var gameOverHeader = document.createElement("header")
            gameOverHeader.textContent = "Game Over"
        var gameOverDiv = document.createElement("div")
            gameOverDiv.id = "game-over-div"
            gameOverDiv.append(gameOverHeader)
            gameOverDiv.append(gameOverImage)
            MINESWEEPERDIV.prepend(gameOverDiv) 
            difficulty, mineSpaces, allSpaces, gameOver = null
            score = 0
    }

    function gameWon(){
        var boardDiv = document.querySelector("#board-div")
            boardDiv.innerHTML = ""
        var gameWonHeader = document.createElement("header")
        gameWonHeader.textContent = "You win! Now go outside"
        boardDiv.append(gameWonHeader)
    }


    function renderDifficultySelect(){

        MINESWEEPERDIV.innerHTML = ""
        var difficultyOptions = {easy:{mineSpaces: 10, allSpaces: 100}, normal:{mineSpaces:40, allSpaces: 144}, hard: {mineSpaces:80, allSpaces: 196}}
        var difficultyDiv = document.createElement("div")
        difficultyDiv.id = "difficulty-div"
        var difficultySelectPrompt = document.createElement("p")
        difficultySelectPrompt.textContent = "Please select a difficulty"
        difficultyDiv.append(difficultySelectPrompt)
        for(var property in difficultyOptions){
            let button = document.createElement("button")
            button.textContent = property
            button.setAttribute("data-difficulty", property)
            button.setAttribute("data-mines", difficultyOptions[property].mineSpaces)
            button.setAttribute("data-spaces", difficultyOptions[property].allSpaces)
            button.addEventListener("click", setBoardRules)
            difficultyDiv.append(button)
        }
        MINESWEEPERDIV.append(difficultyDiv)
    }
    
    function checkSpace(event){
        let space = event.target
        let spaceType = event.target.getAttribute("data-spacetype")
        if(spaceType === "safe"){
            safeSpaces--
            console.log("safe")
            space.textContent = "😅"
            space.removeEventListener("click", checkSpace)
            score++
            SCOREDIV.textContent = `Score: ${score}`
            SPACESLEFTDIV.textContent = `Spaces Left: ${safeSpaces}`
            if(safeSpaces===0){
                gameWon()
            }
            console.log(score)
        } else {
            gameOver()
        }
    }

    function setBoardRules(event){
        GAMEINSTRUCTIONS.style.display = "none";
        difficulty = event.target.getAttribute("data-difficulty")
        mineSpaces = event.target.getAttribute("data-mines")
        allSpaces = event.target.getAttribute("data-spaces")
        MINESWEEPERDIV.innerHTML=""
        var boardDiv = document.createElement("div")
        boardDiv.id = "board-div"
        MINESWEEPERDIV.append(boardDiv)
        loadBoardObject(mineSpaces,allSpaces)
    }

    function loadBoardObject(mineSpaces, allSpaces){
        var gridLetters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n"]
        gridColsAndRows = Math.sqrt(allSpaces)
        var boardObject = {}
        var mineSpaceArray = []
        for(let letter=0;letter<gridColsAndRows; letter++){
            for(let number = 0; number<gridColsAndRows; number++){
                boardObject[(gridLetters[letter]+number)]= "safe"
            }
        }
        let boardSpaceArray = Object.keys(boardObject)
        while(mineSpaceArray.length<mineSpaces){
            let randomSpaceIndex = Math.floor(Math.random()*allSpaces)
            let randomSpace =  boardSpaceArray[randomSpaceIndex]
            if(!mineSpaceArray.includes(randomSpace)){
                mineSpaceArray.push(randomSpace)
            }
        }
        for(var property in boardObject){
            if(mineSpaceArray.includes(property)){
                boardObject[property] = "mine"
            }
        }
        renderBoard(boardObject)
    }

    function renderBoard(boardObject){
        safeSpaces = allSpaces-mineSpaces
        SPACESLEFTDIV.textContent = `Safe Spaces Left: ${safeSpaces}`
        console.log("safe spaces", safeSpaces)
        var currentRow = document.createElement("div")
        var boardDiv = document.querySelector("#board-div")
        currentRow.className = "board-row"
        for(var property in boardObject){
            let currentSpace = document.createElement("span")
            currentSpace.className = difficulty+"-space"
            currentSpace.textContent = "❓"
            currentSpace.setAttribute("data-spacetype", boardObject[property])
            currentSpace.addEventListener("click", checkSpace)
            currentRow.append(currentSpace)
            if(currentRow.childElementCount%gridColsAndRows===0){
                boardDiv.append(currentRow)
                currentRow = document.createElement("div")
                currentRow.className = "board-row"
            }
        }
        var retryButton = document.createElement("button")
        retryButton.textContent = "Retry?"
        retryButton.id = "retry-button"
        retryButton.addEventListener("click", reset)
        MINESWEEPERDIV.append(retryButton)
    }   

    renderDifficultySelect()
}