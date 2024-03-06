"use strict";

const animeAPIURL = "https://api.jikan.moe/v4/anime?q=";
const searchInput = document.querySelector(".js-search-text");
const searchButton = document.querySelector(".js-search");
const resetButton = document.querySelector(".js-reset");
const seriesResultsContainer = document.querySelector(".js-series");
const favoritesResultsContainer = document.querySelector(".js-favorites");
const resetFavoritesButton = document.querySelector(".js-reset-favorites");

let seriesList = [];
let favoritesList = [];

const favoritesDataFromLocalStorage = JSON.parse(
  localStorage.getItem("favorites")
);

if (favoritesDataFromLocalStorage !== null) {
  favoritesList = favoritesDataFromLocalStorage;
  renderFavorites(favoritesList);
}

function renderFavorites(favorites) {
  let content = "";
  for (const favorite of favorites) {
    const imageUrl = getImageUrl(favorite.images.jpg.large_image_url);
    content += `
        <div class="favorite-item" data-id="${favorite.mal_id}">
          <img src="${imageUrl}">
          <h3 class="movie-name">${favorite.title}</h3> 
          <button class="remove-favorite" data-id="${favorite.mal_id}">X</button>
        </div>
    `;
  }
  favoritesResultsContainer.innerHTML = content;

  const removeFavoriteButtons = document.querySelectorAll(".remove-favorite");
  for (const button of removeFavoriteButtons) {
    button.addEventListener("click", handleRemoveFavorite);
  }
}

function renderSeries(series) {
  let content = "";
  for (const seriesItem of series) {
    const imageUrl = getImageUrl(seriesItem.images.jpg.large_image_url);
    content += `
        <div class="series-item" data-id="${seriesItem.mal_id}" id="${seriesItem.mal_id}">
          <img src="${imageUrl}">
          <h3 class="movie-name">${seriesItem.title}</h3>
        </div>
    `;
  }
  seriesResultsContainer.innerHTML = content;

  const seriesItems = document.querySelectorAll(".series-item");
  for (const seriesItem of seriesItems) {
    seriesItem.addEventListener("click", handleAddFavorite);
  }
}

function fetchSeriesData() {
  const inputValue = searchInput.value.toLowerCase();

  fetch(`${animeAPIURL}${inputValue}`)
    .then((response) => response.json())
    .then((data) => {
      seriesList = data.data;
      renderSeries(seriesList);
      localStorage.setItem("series", JSON.stringify(seriesList));
    });
}

function getImageUrl(apiImageUrl) {
  const missingImageUrl =
    "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png";
  const placeholderImageUrl =
    "https://via.placeholder.com/210x295/ffffff/666666/?text=TV";
  if (apiImageUrl === missingImageUrl) {
    return placeholderImageUrl;
  } else {
    return apiImageUrl;
  }
}

function handleAddFavorite(event) {
  const seriesId = event.currentTarget.dataset.id;

  const seriesSelected = seriesList.find((seriesItem) => {
    return seriesItem.mal_id.toString() === seriesId;
  });

  const indexInFavorites = favoritesList.findIndex((favoriteItem) => {
    return favoriteItem.mal_id === parseInt(seriesId);
  });

  if (indexInFavorites === -1) {
    favoritesList.push(seriesSelected);
    renderFavorites(favoritesList);
    localStorage.setItem("favorites", JSON.stringify(favoritesList));
    event.currentTarget.classList.add("favorite");
  }
}

function handleRemoveFavorite(event) {
  const seriesId = event.currentTarget.dataset.id;
  favoritesList = favoritesList.filter(
    (favorite) => favorite.mal_id !== parseInt(seriesId)
  );
  renderFavorites(favoritesList);
  document.getElementById(seriesId).classList.remove("favorite");
  localStorage.setItem("favorites", JSON.stringify(favoritesList));
}

function handleSearch(event) {
  event.preventDefault();

  fetchSeriesData();
}

function handleReset(event) {
  event.preventDefault();

  favoritesList = [];
  renderFavorites(favoritesList);
  seriesResultsContainer.innerHTML = "";
  searchInput.value = "";

  localStorage.removeItem("favorites");
  localStorage.removeItem("series");
}

function handleResetFavorites() {
  favoritesList = [];
  renderFavorites(favoritesList);
  localStorage.removeItem("favorites");
  const seriesItems = document.querySelectorAll(".series-item");
  for (const seriesItem of seriesItems) {
    seriesItem.classList.remove("favorite");
  }
}

searchButton.addEventListener("click", handleSearch);
resetButton.addEventListener("click", handleReset);
resetFavoritesButton.addEventListener("click", handleResetFavorites);