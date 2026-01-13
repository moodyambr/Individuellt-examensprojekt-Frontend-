let deck = []; // The deck, an array of card objects
let currentCard = null; // The current card being displayed
let score = 0; // The player's score
let lives = 3; // Number of lives remaining

// Create deck (52 cards: 2-14, hearts, spades, diamonds, clubs)
function createDeck() {
  const suits = ["♥", "♠", "♦", "♣"]; // Suits: hearts, spades, diamonds, clubs
  const values = [2,3,4,5,6,7,8,9,10,11,12,13,14]; // Card values, 11=J, 12=Q, 13=K, 14=A
  let newDeck = [];
  for (let s of suits) { // For each suit
    for (let v of values) { // For each value
      newDeck.push({value: v, suit: s}); // Create a card object and add to deck
    }
  }
  return shuffle(newDeck); // Shuffle the deck before returning
}

// Shuffle deck with Fisher-Yates algorithm
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) { // Go backwards through the array
    const j = Math.floor(Math.random() * (i + 1)); // Choose a random position
    [array[i], array[j]] = [array[j], array[i]]; // Swap the cards
  }
  return array; // Return the shuffled deck
}

// Start the game
function startGame() {
  deck = createDeck(); // Create and shuffle a new deck
  score = 0; // Reset score
  lives = 3; // Reset lives
  document.getElementById("score").innerText = score; // Update score display
  document.getElementById("lives").innerText = lives; // Update lives display
  document.getElementById("message").innerText = ""; // Clear message area
  drawFirstCard(); // Draw first card
}

function drawFirstCard() {
  currentCard = deck.pop(); // Remove and return last card in deck
  updateCardDisplay(currentCard); // Display card on screen
  updateCardsLeft(); // Update cards remaining
}

function updateCardDisplay(card) {
  let cardDiv = document.getElementById("current-card"); // Get card div
  let displayValue = card.value; // Set card value
  if (card.value === 11) displayValue = "J"; // If jack, show "J"
  if (card.value === 12) displayValue = "Q"; // If queen, show "Q"
  if (card.value === 13) displayValue = "K"; // If king, show "K"
  if (card.value === 14) displayValue = "A"; // If ace, show "A"

  // Set content in corners and center
  cardDiv.querySelector('.top-left').innerText = displayValue; // Left corner
  cardDiv.querySelector('.bottom-right').innerText = displayValue; // Right corner
  cardDiv.querySelector('.card-suit').innerText = card.suit; // Suit in center

  // Add color class for hearts and diamonds
  if (card.suit === "♥" || card.suit === "♦") {
    cardDiv.classList.add("red-card"); // Make card red
  } else {
    cardDiv.classList.remove("red-card"); // Remove red color
  }
}

function updateCardsLeft() {
  document.getElementById("cards-left").innerText = deck.length; // Display cards remaining
}

// Player makes a guess
function makeGuess(guess) {
  if (deck.length === 0 || lives <= 0) return; // Cancel if game is over
  let nextCard = deck.pop(); // Draw next card
  let result = "";

  // Check if guess is correct
  if (
    (guess === "higher" && nextCard.value > currentCard.value) || // Higher
    (guess === "lower" && nextCard.value < currentCard.value) || // Lower
    (guess === "equal" && nextCard.value === currentCard.value) // Equal
  ) {
    score++; // Increase score
    document.getElementById("score").innerText = score; // Update score display
    result = "Correct guess!"; // Announce correct guess
  } else {
    lives--;
    document.getElementById("lives").innerText = lives;
    result = "Wrong guess!";
    if (lives === 1) {
      result += " <span style='color:#8B0000;'>Warning! 1 life left!</span>"; // Warning
    }
  }

  currentCard = nextCard;
  updateCardDisplay(currentCard);
  updateCardsLeft();
  document.getElementById("message").innerHTML = result; // Changed to innerHTML

  if (lives === 0 || deck.length === 0) {
    endGame();
  }
}

// Game is over
function endGame() {
  let msg = `Game over! Your score: ${score}`; // Create end message
  document.getElementById("message").innerText = msg; // Display end message
}

// Start the game immediately when page loads, or when "Restart" button ↻ is pressed
startGame();