// Elements of interest
const quoteCard = document.querySelector(".card");
const quoteNumber = document.querySelector(".card-title");
const quoteAdvice = document.querySelector(".card-text");
const getNewQuoteBtn = document.querySelector(".card button");

const main = async () => {
  // Get a sample quote from API
  const quoteData = await getQuote();

  // Display quote
  displayQuote(quoteData);
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

function displayQuote(quoteData) {
  quoteNumber.textContent = `Advice # ${quoteData.id}`;
  quoteAdvice.textContent = quoteData.advice;
}
