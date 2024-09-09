document.addEventListener("DOMContentLoaded", () => {
  const gameBoard = document.getElementById("game-board");
  const restartButton = document.getElementById("restart");
  const popup = document.getElementById("completion-popup");
  const completionTimeSpan = document.getElementById("completion-time");
  const popupRestartButton = document.getElementById("popup-restart");

  let flippedCards = [];
  let matchedCards = [];
  let startTime;

  // Array of image URLs for the 6 unique images (each will be duplicated for 12 cards)
  const cardImages = [
    "images/1.png",
    "images/2.png",
    "images/3.png",
    "images/4.png",
    "images/5.png",
    "images/6.png",
    "images/1.png",
    "images/2.png",
    "images/3.png",
    "images/4.png",
    "images/5.png",
    "images/6.png",
  ];

  // Shuffle function to randomize card positions
  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  // Create the card elements and add them to the board
  function createBoard() {
    const shuffledImages = shuffle(cardImages);
    gameBoard.innerHTML = ""; // Clear any existing cards
    shuffledImages.forEach((image) => {
      const card = document.createElement("div");
      card.classList.add(
        "card",
        "bg-blue-400",
        "w-20",
        "h-20",
        "md:w-32",
        "md:h-32",
        "flex",
        "items-center",
        "justify-center",
        "cursor-pointer",
        "relative",
        "transition",
        "duration-300",
        "transform",
        "hover:scale-105"
      );
      card.dataset.image = image;

      const frontFace = document.createElement("div");
      frontFace.classList.add(
        "front-face",
        "w-full",
        "h-full",
        "bg-cover",
        "bg-center",
        "hidden"
      );
      frontFace.style.backgroundImage = `url(${image})`;

      const backFace = document.createElement("div");
      backFace.classList.add(
        "back-face",
        "w-full",
        "h-full",
        "bg-blue-500",
        "flex",
        "items-center",
        "justify-center"
      );
      backFace.innerHTML = `<div class="text-white text-2xl font-bold">?</div>`;

      card.appendChild(frontFace);
      card.appendChild(backFace);

      card.addEventListener("click", handleCardClick);
      gameBoard.appendChild(card);
    });

    // Record the start time
    startTime = new Date();
  }

  // Handle card flipping
  function handleCardClick(e) {
    const clickedCard = e.currentTarget;

    // Ignore if the card is already matched or the same card is clicked twice
    if (
      flippedCards.length < 2 &&
      !clickedCard.classList.contains("flipped") &&
      !matchedCards.includes(clickedCard)
    ) {
      clickedCard.classList.add("flipped");
      clickedCard.querySelector(".front-face").classList.remove("hidden");
      clickedCard.querySelector(".back-face").classList.add("hidden");
      flippedCards.push(clickedCard);

      // If two cards are flipped, check for a match
      if (flippedCards.length === 2) {
        checkForMatch();
      }
    }
  }

  // Check for a match
  function checkForMatch() {
    const [firstCard, secondCard] = flippedCards;
    const firstImage = firstCard.dataset.image;
    const secondImage = secondCard.dataset.image;

    if (firstImage === secondImage) {
      // Match found, make the cards disappear
      setTimeout(() => {
        firstCard.style.visibility = "hidden";
        secondCard.style.visibility = "hidden";
        matchedCards.push(firstCard, secondCard);
        flippedCards = [];

        // Check if all cards are matched
        if (matchedCards.length === cardImages.length) {
          setTimeout(showCompletionPopup, 500);
        }
      }, 500);
    } else {
      // No match, flip them back after a short delay
      setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        firstCard.querySelector(".front-face").classList.add("hidden");
        secondCard.querySelector(".front-face").classList.add("hidden");
        firstCard.querySelector(".back-face").classList.remove("hidden");
        secondCard.querySelector(".back-face").classList.remove("hidden");
        flippedCards = [];
      }, 1000);
    }
  }

  // Show completion popup
  function showCompletionPopup() {
    const endTime = new Date();
    const timeTaken = Math.floor((endTime - startTime) / 1000);
    completionTimeSpan.textContent = timeTaken;
    popup.classList.remove("hidden");
  }

  // Restart the game
  function restartGame() {
    flippedCards = [];
    matchedCards = [];
    popup.classList.add("hidden");
    createBoard();
  }

  // Event listeners for restart buttons
  restartButton.addEventListener("click", restartGame);
  popupRestartButton.addEventListener("click", restartGame);

  // Initialize the game
  createBoard();
});
