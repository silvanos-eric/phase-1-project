// Application state
let favoriteAdviceState = [];

// Elements of interest
const fragmentEl = document.createDocumentFragment();
const adviceCardEl = document.querySelector(".card");
const adviceNumberEl = document.querySelector(".card-title");
const adviceTextEl = document.querySelector(".card-text");
const getNewAdviceBtnEl = document.querySelector("#new-advice");
const favoriteBtnEl = document.querySelector("button#favorite");
const laodingIndicatorEl = document.querySelector("#loading-indicator");
const favoriteListEl = document.querySelector("#favorite-list");
const showBtnEl = document.querySelector("#show");

// Main function
const main = () => {
  // Functionality to load and show advice card
  adviceCardDisplayInit();

  // Functionality to allow request of a new advice
  adviceChangeInit();

  // Functionality to allow favoriting a advice
  favoriteAdviceInit();

  // Functionality to remove a favorite advice
  removeFavoriteAdviceInit();

  // Functionality to scroll back to advice generator
  scrollIntoViewGenerator();
};

main();

// Utility functions
async function adviceCardDisplayInit() {
  hideAdviceCard();
  const adviceData = await getAdvice();
  hideLoadingIndicator();
  showAdviceCard();
  updateAdviceCard(adviceData);
}

async function getAdvice(id) {
  try {
    let response = undefined;

    const httpOptions = {
      cache: "no-cache",
    };
    if (id) {
      response = await fetch(
        `https://api.adviceslip.com/advice/${id}`,
        httpOptions
      );
    } else {
      response = await fetch("https://api.adviceslip.com/advice", httpOptions);
    }

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const adviceData = await response.json();
    return adviceData.slip;
  } catch (error) {
    console.error(
      `There was a problem with your fetch operation: ${error.message}`
    );
  }
}

function updateAdviceCard(adviceData) {
  adviceNumberEl.textContent = `Advice # ${adviceData.id}`;
  adviceTextEl.textContent = adviceData.advice;
  adviceCardEl.dataset.id = adviceData.id;
}

function adviceChangeInit() {
  getNewAdviceBtnEl.addEventListener("click", async () => {
    hideAdviceCard();
    showLoadingIndicator();
    const adviceData = await getAdvice();
    hideLoadingIndicator();
    showAdviceCard();
    updateAdviceCard(adviceData);
  });
}

function hideAdviceCard() {
  adviceCardEl.classList.add("d-none");
}

function hideLoadingIndicator() {
  laodingIndicatorEl.classList.add("d-none");
}

function showAdviceCard() {
  adviceCardEl.classList.remove("d-none");
}

function showLoadingIndicator() {
  laodingIndicatorEl.classList.remove("d-none");
}

function favoriteAdviceInit() {
  favoriteBtnEl.addEventListener("click", async () => {
    const adviceId = adviceCardEl.dataset.id;

    const adviceData = await getAdvice(adviceId);
    addAdviceToFavorites(adviceData);
    showNewFavoriteAdvice();
  });
}

function addAdviceToFavorites(adviceData) {
  if (!checkIfAdviceAlreadyExists(adviceData)) {
    favoriteAdviceState.push(adviceData);
  }
  updateFavoriteListEl(favoriteAdviceState);
}

function createFavoriteAdvice(adviceData) {
  const favoriteAdviceeEl = document.createElement("li");
  favoriteAdviceeEl.classList.add("list-group-item", "d-flex", "gap-2");
  favoriteAdviceeEl.dataset.id = adviceData.id;

  const favoriteNumberEl = document.createElement("span");
  favoriteNumberEl.textContent = adviceData.id;
  favoriteAdviceeEl.appendChild(favoriteNumberEl);

  const adviceTextEl = document.createElement("span");
  adviceTextEl.textContent = adviceData.advice;
  favoriteAdviceeEl.appendChild(adviceTextEl);

  const removeBtnEl = document.createElement("button");
  removeBtnEl.classList.add("btn", "btn-danger", "ms-auto", "align-self-start");
  removeBtnEl.textContent = "X";
  favoriteAdviceeEl.appendChild(removeBtnEl);

  appendAdviceToFragment(favoriteAdviceeEl);
}

function appendAdviceToFragment(advice) {
  fragmentEl.append(advice);
}

function removeFavoriteAdviceInit() {
  favoriteListEl.addEventListener("click", (event) => {
    if (event.target.matches("button")) {
      const parentEl = event.target.parentElement;
      const adviceId = parentEl.dataset.id;
      removeAdvice(adviceId);
    }
  });
}

function removeEl(el) {
  el.remove();
}

function checkIfAdviceAlreadyExists(advice) {
  if (favoriteAdviceState.find((q) => q.id === advice.id)) {
    showModal();
    return true;
  }
  return false;
}

function updateFavoriteListEl(newFavoriteAdviceState) {
  clearFavoriteListEl();
  for (const advice of newFavoriteAdviceState) {
    createFavoriteAdvice(advice);
  }
  favoriteListEl.appendChild(fragmentEl);
}

function clearFavoriteListEl() {
  favoriteListEl.innerHTML = null;
}

function removeAdvice(id) {
  const numberId = Number.parseInt(id, 10);
  favoriteAdviceState = favoriteAdviceState.filter((q) => q.id !== numberId);
  updateFavoriteListEl(favoriteAdviceState);
}

function showNewFavoriteAdvice() {
  const newFavoriteAdviceEl = favoriteListEl.lastElementChild;
  newFavoriteAdviceEl.scrollIntoView({ behavior: "smooth", block: "center" });
}

function scrollIntoViewGenerator() {
  showBtnEl.addEventListener("click", () => {
    adviceCardEl.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

function showModal() {
  const duplicateModal = new bootstrap.Modal(
    document.getElementById("duplicateModal", {
      keyboard: false,
    })
  );
  updateModalMessage();
  duplicateModal.show();
}

function updateModalMessage(adviceId) {
  const messageEl = document.querySelector(".modal-body");
  messageEl.textContent = `Duplicate advice. Advice with number ${adviceId} already exists!`;
}
