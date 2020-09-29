document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  grid.innerHTML="";
  const flagsLeft = document.querySelector('#flags-left')
  const result = document.querySelector('#result')

  const radio_btn = document.querySelectorAll('.radio-btn')
  radio_btn[0].checked = true;
  const difficulty_btn = document.querySelector('.difficulty-btn')
  const hints_left = document.querySelector('#hints-left');
  const hint_btn = document.querySelector('.hint');
  const cancel_hint = document.querySelector('.cancel-hint');
  const time_spent = document.querySelector('#time-spent');
  
  let width = 8
  let bombAmount = 20
  let flags = 0
  let squares = []
  let hints = 3
  let isGameOver = false
  let life = 3;
  let firstClick = false;
  
  let timer;
  let hintClick = false;

  difficulty_btn.addEventListener('click', () => {
    for(let i = 0; i < radio_btn.length; i++) {
      if(radio_btn[i].checked) {
        width = parseInt(radio_btn[i].value)
      }
    }
    createBoard()
   

  })

  hint_btn.addEventListener('click', () => {
    if(hints > 0){
      hintClick = true;
      hint_btn.style.display = 'none';
      cancel_hint.style.display = 'inline-block';
    }
    else{
      hint_btn.innerHTML = 'No Hints Left'
    }
  })

  cancel_hint.addEventListener('click', () => {
    hintClick = false;
    hint_btn.style.display = 'inline-block';
    cancel_hint.style.display = 'none';
  })

  createBoard();

  //create Board
  function createBoard() {
    grid.innerHTML = ""
    grid.style.gridTemplateColumns = `repeat(${width}, 1fr)`
    grid.style.gridTemplateRows = `repeat(${width}, 1fr)`
    isGameOver = false
    hints = 3;
    result.innerHTML ="";
    firstClick = false;
    hints_left.innerHTML = hints;
    time_spent.innerHTML = 0;
    window.clearInterval(timer);
    timer = setInterval(() =>{
      time_spent.innerHTML = parseInt(time_spent.innerHTML) + 1;
    }, 1000);
    hint_btn.innerHTML = 'Get Hint';
    squares=[];
    flagsLeft.innerHTML = bombAmount

    //get shuffled game array with random bombs
    const bombsArray = Array(bombAmount).fill('bomb')
    const emptyArray = Array(width*width - bombAmount).fill('valid')
    const gameArray = emptyArray.concat(bombsArray)
    const shuffledArray = gameArray.sort(() => Math.random() -0.5)

    for(let i = 0; i < width*width; i++) {
      const square = document.createElement('div')
      square.setAttribute('id', i)
      square.classList.add(shuffledArray[i])
      grid.appendChild(square)
      squares.push(square)
      //normal click
      square.addEventListener('click', function(e) {
        click(square)
      })

      //cntrl and left click
      square.oncontextmenu = function(e) {
        e.preventDefault()
        addFlag(square)
      }
    }

    //add numbers
    for (let i = 0; i < squares.length; i++) {
      let total = 0
      const isLeftEdge = (i % width === 0)
      const isRightEdge = (i % width === width -1)

      if (squares[i].classList.contains('valid')) {
        if (i > 0 && !isLeftEdge && squares[i -1].classList.contains('bomb')) total ++
        if (i > 9 && !isRightEdge && squares[i +1 -width].classList.contains('bomb')) total ++
        if (i > 10 && squares[i -width].classList.contains('bomb')) total ++
        if (i > 11 && !isLeftEdge && squares[i -1 -width].classList.contains('bomb')) total ++
        if (i < 98 && !isRightEdge && squares[i +1].classList.contains('bomb')) total ++
        if (i < 90 && !isLeftEdge && squares[i -1 +width].classList.contains('bomb')) total ++
        if (i < 88 && !isRightEdge && squares[i +1 +width].classList.contains('bomb')) total ++
        if (i < 89 && squares[i +width].classList.contains('bomb')) total ++
        squares[i].setAttribute('data', total)
      }
    }

  }

  //add Flag with right click
  function addFlag(square) {
    if (isGameOver) return   
    if (!square.classList.contains('checked') && (flags < bombAmount)) {
      if (!square.classList.contains('flag')) {
        square.classList.add('flag')
        square.innerHTML = ' 🚩'
        flags ++
        flagsLeft.innerHTML = bombAmount- flags
        checkForWin()
      } else {
        square.classList.remove('flag')
        square.innerHTML = ''
        flags --
        flagsLeft.innerHTML = bombAmount- flags
      }
    }
  }

  //click on square actions
  function click(square) {
    let currentId = square.id
    if (isGameOver) return
    if (square.classList.contains('checked') || square.classList.contains('flag')) return
    if (hintClick){
      showHint(square);
      hintClick = false;
      hints -= 1;
      hints_left.innerHTML = hints;
      cancel_hint.click();
      return
    }
    if (!firstClick){
      firstClick = true;
      if (square.classList.contains('bomb')) {
        for(var i=0;i<squares.length;i++){
          var randomField = squares[Math.floor(Math.random() * squares.length-1)];
          if(!randomField.hasAttribute('data')){
            continue;
          }
          if (!(randomField.classList.contains('checked') || randomField.classList.contains('flag')) && randomField.classList.contains('valid')){
            square.classList.add('valid');
            square.classList.remove('bomb');
            randomField.classList.add('bomb');
            randomField.classList.remove('valid');
            square.setAttribute('data', randomField.getAttribute('data'));
            randomField.removeAttribute('data');
            break;
          }
        }
      }
    }
    if (square.classList.contains('bomb')) {
      gameOver(square)
    } else {
      let total = square.getAttribute('data')
      if (total !=0) {
        square.classList.add('checked')
        if (total == 1) square.classList.add('one')
        if (total == 2) square.classList.add('two')
        if (total == 3) square.classList.add('three')
        if (total == 4) square.classList.add('four')
        square.innerHTML = total
        return
      }
      checkSquare(square, currentId)
    }
    square.classList.add('checked')
  }


  //check neighboring squares once square is clicked
  function checkSquare(square, currentId) {
    const isLeftEdge = (currentId % width === 0)
    const isRightEdge = (currentId % width === width -1)

    setTimeout(() => {
      if (currentId > 0 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) -1].id
        //const newId = parseInt(currentId) - 1   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId > 9 && !isRightEdge) {
        const newId = squares[parseInt(currentId) +1 -width].id
        //const newId = parseInt(currentId) +1 -width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId > 10) {
        const newId = squares[parseInt(currentId -width)].id
        //const newId = parseInt(currentId) -width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId > 11 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) -1 -width].id
        //const newId = parseInt(currentId) -1 -width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < 98 && !isRightEdge) {
        const newId = squares[parseInt(currentId) +1].id
        //const newId = parseInt(currentId) +1   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < 90 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) -1 +width].id
        //const newId = parseInt(currentId) -1 +width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < 88 && !isRightEdge) {
        const newId = squares[parseInt(currentId) +1 +width].id
        //const newId = parseInt(currentId) +1 +width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < 89) {
        const newId = squares[parseInt(currentId) +width].id
        //const newId = parseInt(currentId) +width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
    }, 10)
  }

  //game over
  function gameOver(square) {
    life--;
    result.innerHTML = 'BOOM! Game Over! You are left with '+life+' lives'
    isGameOver = true
    window.clearInterval(timer);

    
    //show ALL the bombs
    squares.forEach(square => {
      if (square.classList.contains('bomb')) {
        square.innerHTML = '💣'
        square.classList.remove('bomb')
        square.classList.add('checked')
      }
    }
    )
 //counter for lives
  if(life >0 && life <3)
  {
  //timer for restarting the game 
  setTimeout(function(){ createBoard(); }, 3000);
  }
  else
  {
    result.innerHTML ="No More Lives! Game will restart in 5 seconds";
    setTimeout(function(){ playAgain(); }, 7000);

  }

  }
  //final function when you lose all your lives
  function playAgain()
  {
    
    window.location.reload();
  }

  //check for win
  function checkForWin() {
    ///simplified win argument
  let matches = 0

    for (let i = 0; i < squares.length; i++) {
      if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
        matches ++
      }
      if (matches === bombAmount) {
        result.innerHTML = 'YOU WIN!'
        isGameOver = true
      }
    }
  }

  function showHint(square) {
    var currentId = parseInt(square.id);
    const isLeftEdge = (currentId % width === 0);
    const isRightEdge = (currentId % width === width -1);
    const isBottomEdge = (width*width - currentId <= width);
    const isTopEdge = (currentId < width);

    var top, bot, right, left, topright, topleft, botright, botleft;
    top = bot = right = left = topright = topleft = botright = botleft = true;

    showSquare(square);
    
    if(isTopEdge){
      top = false;
    }
    if(isBottomEdge){
      bot = false;
    }
    if(isLeftEdge){
      left = false;
    }
    
    if(isRightEdge){
      right = false;
    }

    topright = top && right;
    topleft = top && left;
    botright = bot && right;
    botleft = bot && left;
    
    if(left){
      showSquare(squares[currentId-1]);
    }
    if(right){
      showSquare(squares[currentId+1]);
    }
    if(top){
      showSquare(squares[currentId-width]);
    }
    if(bot){
      showSquare(squares[currentId+width]);
    }
    if(botright){
      showSquare(squares[currentId+width+1]);
    }
    if(topright){
      showSquare(squares[currentId-width+1]);
    }
    if(botleft){
      showSquare(squares[currentId+width-1]);
    }
    if(topleft){
      showSquare(squares[currentId-width-1]);
    }
  }

  function showSquare(square){
    if (square.classList.contains('bomb')) {
      square.innerHTML = '💣';
    } else {
      let total = square.getAttribute('data')
      if (total !=0) {
        square.innerHTML = total
      }
    }

    setTimeout(()=>{
      square.innerHTML = '';
    },1000);
  }
})
