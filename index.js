// ---------------------------------------------- 
// ------------- CREATING ELEMENTS --------------
// ----------------------------------------------
const GAME_CONTAINER = window.document.getElementById('game')
const MAX_ELEMENTS = 10
const els = []
// Setting elements
for (let index = 1; index <= MAX_ELEMENTS; index++) {
    els.push(index)
    els.push(index)
}
shuffle(els) // Shuffle values of the array


function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}



// ------------------------------------------ 
// ------------- HTML ELEMENTS --------------
// ------------------------------------------
const createHTMLElement = tag => attributes => value => `<${tag} ${attributes}>${value}</${tag}>`
const SPAN_ELEMENT = (val) => createHTMLElement('span')('class="card__value"')(val)
const CARD_ELEMENT = (val) => createHTMLElement('article')(`class="card card--hide" data-value="${val}"`)(SPAN_ELEMENT(val))

// Inserting cards into the HTML
const cards = []
els.forEach(val => {
    let card = CARD_ELEMENT(val)
    cards.push(card)
    GAME_CONTAINER.insertAdjacentHTML('beforeend', card)
})

// Adding event listener
GAME_CONTAINER.childNodes.forEach(card => {
    card.addEventListener('click', selectCard)    
})


// --------------------------------------- 
// ------------- GAME LOGIC --------------
// --------------------------------------- 
const GUESSED_TO_WIN = cards.length / 2
const AWAITING_TIME = 500
let isAwaiting = false
let isCardSelected = false
let currentCards = [null, null]
let guessedNumber = 0


function userWin() {
    guessedNumber++
    if(guessedNumber === GUESSED_TO_WIN) {
        window.document.getElementsByClassName('header')[0].innerHtml = createHTMLElement('h1')('')('You WIN')   
    }
}

function selectCard(ev) {

    let card = ev.target
    if(isAwaiting || card.dataset.guessed) return false


    // Identify if the user selects the same card
    if(currentCards[0] == card) {
        card.classList.remove('card--show')
        card.classList.add('card--hide')
        return false
    }
    
    card.classList.remove('card--hide')
    card.classList.add('card--show')

    if(!isCardSelected) {
        currentCards[0] = card
        isCardSelected = true
    } else {
        currentCards[1] = card
    }

    CurrentTry()
}

function resetTry() {
    isCardSelected = false
    currentCards[0] = null
    currentCards[1] = null
    isAwaiting = false
}

function CurrentTry() {
    if(!currentCards[0] || !currentCards[1]) return false
    isAwaiting = true

    const firstCard = currentCards[0]
    const secondCard = currentCards[1]

    let isCorrect = Number(firstCard.dataset.value) === Number(secondCard.dataset.value)

    if(isCorrect) {
        firstCard.classList.add('card--show', 'card--guessed')
        firstCard.dataset.guessed = true
        secondCard.classList.add('card--show', 'card--guessed')
        secondCard.dataset.guessed = true
        resetTry()
        userWin()
        return true
    }

    firstCard.classList.remove('card--show')
    secondCard.classList.remove('card--show')

    resetTry()

    setTimeout(() => {
        firstCard.classList.add('card--hide')
        secondCard.classList.add('card--hide')
    }, 500)

    
    return false
}