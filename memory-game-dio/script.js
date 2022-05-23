let cards = document.querySelectorAll(".complete-card");

let firstCardId;
let secondCardId;
let hasFlippedCard = false;

/*CALL BACKS */
function flipCard(e) {
  const card = e.target.closest(".complete-card");
  if (card.classList.contains("flip")) return;
  card.classList.add("flip");

  setTimeout(() => {
    setAndUpdateCardsIds(card);
    checkCorrectCards();
  }, 2000);
  // setTimeout(checkCorrectCards, 2000);
}
/* HELPERS */

function setAndUpdateCardsIds(card) {
  if (!hasFlippedCard) {
    firstCardId = card.id;
    hasFlippedCard = true;
    console.log("setting first card id: ", firstCardId);
    return;
  }

  secondCardId = card.id;
  console.log("setting second card id: ", secondCardId);
  hasFlippedCard = false;
}

function checkCorrectCards() {
  if (!secondCardId) return;
  console.log("checking cards...", firstCardId + " + " + secondCardId);

  if (firstCardId != secondCardId) {
    console.log("ids are different" + firstCardId + secondCardId);
    const firstCard = getFlippedCardById(firstCardId);
    const secondCard = getFlippedCardById(secondCardId);
    [firstCard, secondCard].forEach((card) => {
      card.classList.remove("flip");
    });
  }

  resetCardsIds();
}

function getFlippedCardById(id) {
  let cardElement;
  updateCardsElements();
  cards.forEach((card) => {
    if (card.id == id) cardElement = card;
  });
  console.log("returning card element ", cardElement);
  return cardElement;
}

function updateCardsElements() {
  cards = document.querySelectorAll(".flip");
}
function resetCardsIds() {
  console.log("reseting cards ids");
  firstCardId = null;
  secondCardId = null;
}

/*EVENT LISTENERS */

cards.forEach((card) =>
  card.addEventListener("click", (e) => {
    flipCard(e);
  })
);
