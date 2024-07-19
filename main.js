// Elements of interest
const quoteCardEl = document.querySelector(".card");
const quoteNumberEl = document.querySelector(".card-title");
const quoteAdviceEl = document.querySelector(".card-text");
const getNewQuoteBtnEl = document.querySelector(".card button");
const laodingIndicatorEl = document.querySelector("#loading-indicator");

// Main function
const main = async () => {
  hideQuoteCard();
  const quoteData = await getQuote();
  hideLoadingIndicator();
  showQuoteCard();
  updateQuoteCard(quoteData);
  quoteChangeInit();
};

main();

// Utility functions
async function getQuote() {
  try {
    const response = await fetch("https://api.adviceslip.com/advice");

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
