"use strict";

const animeAPIURL = "https://api.jikan.moe/v4/anime?q=";
const searchInput = document.querySelector(".js-search-text");
const searchButton = document.querySelector(".js-search");
const resetButton = document.querySelector('.js-reset');
const seriesResultsContainer = document.querySelector(".js-series");
const favoritesResultsContainer = document.querySelector(".js-favorites");

let seriesList = [];
let favoritesList = [];

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
    //añadir otro color de fondo y fuente al seleccionar series como favorita
    event.currentTarget.classList.add('favorite');
  }
}

const renderSeries = (series) => {
  let content = "";
  for (const seriesItem of series) {
    content += `
        <div class="series-item" data-id="${seriesItem.mal_id}" id="${seriesItem.mal_id}">
                <img src="${seriesItem.images.jpg.large_image_url}">
                <h3>${seriesItem.title}</h3>
            </div>
        `;
  }
  seriesResultsContainer.innerHTML = content;

  const seriesItems = document.querySelectorAll(".series-item");
  for (const seriesItem of seriesItems) {
    seriesItem.addEventListener("click", handleAddFavorite);
  }
};

function renderFavorites(favorites) {
  let content = "";
  for (const favorite of favorites) {
    content += `
        <div class="favorite-item" data-id="${favorite.mal_id}">
            <img src="${favorite.images.jpg.large_image_url}">
            <h3>${favorite.title}</h3>
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

function handleRemoveFavorite(event) {
  const seriesId = event.currentTarget.dataset.id;
  favoritesList = favoritesList.filter((favorite) => favorite.mal_id !== parseInt(seriesId));
  renderFavorites(favoritesList);
  localStorage.setItem("favorites", JSON.stringify(favoritesList));
}

const fetchSeriesData = () => {
  const inputValue = searchInput.value.toLowerCase();

  fetch(`${animeAPIURL}${inputValue}`)
    .then((response) => response.json())
    .then((data) => {
      seriesList = data.data;
      renderSeries(seriesList);
      localStorage.setItem("series", JSON.stringify(seriesList));
    });
};

const favoritesDataFromLocalStorage = JSON.parse(localStorage.getItem("favorites"));
if (favoritesDataFromLocalStorage !== null) {
  favoritesList = favoritesDataFromLocalStorage;
  renderFavorites(favoritesList);
}

const handleSearch = (event) => {
  event.preventDefault();

  fetchSeriesData();
};

searchButton.addEventListener("click", handleSearch);

resetButton.addEventListener("click", handleReset);

function handleReset(event) {
  event.preventDefault();

  favoritesList = [];
  renderFavorites(favoritesList);
  seriesResultsContainer.innerHTML = "";
  searchInput.value = "";

  localStorage.removeItem("favorites");
  localStorage.removeItem("series");
}
