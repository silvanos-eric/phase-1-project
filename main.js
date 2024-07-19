// Elements of interest
const quoteCardEl = document.querySelector(".card");
const quoteNumberEl = document.querySelector(".card-title");
const quoteAdviceEl = document.querySelector(".card-text");
const getNewQuoteBtnEl = document.querySelector("#new-quote");
const favoriteBtnEl = document.querySelector("button#favorite");
const laodingIndicatorEl = document.querySelector("#loading-indicator");
const favoriteListEl = document.querySelector("#favorite-list");

// Main function
const main = async () => {
  hideQuoteCard();
  const quoteData = await getQuote();
  hideLoadingIndicator();
  showQuoteCard();
  updateQuoteCard(quoteData);

  // Functionality to allow request of a new quote
  quoteChangeInit();

  // Functionality to allow favoriting a quote
  favoriteQuoteInit();

  // Functionality to remove a favorite quote
  removeFavoriteQuote();
};

main();

// Utility functions
async function getQuote(id) {
  try {
    let response = undefined;
    if (id) {
      response = await fetch(`https://api.adviceslip.com/advice/${id}`, {
        cache: "no-cache",
      });
    } else {
      response = await fetch("https://api.adviceslip.com/advice", {
        cache: "no-cache",
      });
    }

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const quoteData = await response.json();
    return quoteData.slip;
  } catch (error) {
    console.error(
      `There was a problem with your fetch operation: ${error.message}`
    );
  }
}

function updateQuoteCard(quoteData) {
  quoteNumberEl.textContent = `Advice # ${quoteData.id}`;
  quoteAdviceEl.textContent = quoteData.advice;
  quoteCardEl.dataset.id = quoteData.id;
}

function quoteChangeInit() {
  getNewQuoteBtnEl.addEventListener("click", async () => {
    hideQuoteCard();
    showLoadingIndicator();
    const quoteData = await getQuote();
    hideLoadingIndicator();
    showQuoteCard();
    updateQuoteCard(quoteData);
  });
}

function hideQuoteCard() {
  quoteCardEl.classList.add("d-none");
}

function hideLoadingIndicator() {
  laodingIndicatorEl.classList.add("d-none");
}

function showQuoteCard() {
  quoteCardEl.classList.remove("d-none");
}

function showLoadingIndicator() {
  laodingIndicatorEl.classList.remove("d-none");
}

function favoriteQuoteInit() {
  favoriteBtnEl.addEventListener("click", async () => {
    const quoteId = quoteCardEl.dataset.id;

    const quoteData = await getQuote(quoteId);
    addQuoteToFavorites(quoteData);
  });
}

function addQuoteToFavorites(quoteData) {
  createFavoriteQuote(quoteData);
}

function createFavoriteQuote(quoteData) {
  const favoriteQuoteEl = document.createElement("li");
  favoriteQuoteEl.classList.add("list-group-item", "d-flex", "gap-2");

  const quoteNumberEl = document.createElement("span");
  quoteNumberEl.textContent = quoteData.id;
  favoriteQuoteEl.appendChild(quoteNumberEl);

  const quoteAdviceEl = document.createElement("span");
  quoteAdviceEl.textContent = quoteData.advice;
  favoriteQuoteEl.appendChild(quoteAdviceEl);

  const removeBtnEl = document.createElement("button");
  removeBtnEl.classList.add("btn", "btn-danger", "ms-auto");
  removeBtnEl.textContent = "X";
  favoriteQuoteEl.appendChild(removeBtnEl);

  appendQuoteToFavorites(favoriteQuoteEl);
}

function appendQuoteToFavorites(quote) {
  favoriteListEl.append(quote);
}

function removeFavoriteQuote() {
  favoriteListEl.addEventListener("click", (event) => {
    if (event.target.matches("button")) {
      removeEl(event.target.parentElement);
    }
  });
}

function removeEl(el) {
  el.remove();
}
