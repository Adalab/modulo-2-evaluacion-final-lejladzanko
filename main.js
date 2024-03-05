"use strict";

const animeAPIURL = "https://api.jikan.moe/v4/anime?q=";
const searchInput = document.querySelector(".js-search-text");
const searchButton = document.querySelector(".js-search");
const seriesResultsContainer = document.querySelector(".js-series");
const favoritesResultsContainer = document.querySelector(".js-favorites");

let seriesList = [];
let favoritesList = [];

function handleAddFavorite(event) {
  console.log(event.currentTarget);
  console.log(event.currentTarget.id);
  console.log(seriesList);

  const seriesSelected = seriesList.find((seriesItem) => {
    return event.currentTarget.id === seriesItem.mal_id.toString();
  });

  const indexInFavorites = favoritesList.findIndex((favoriteItem) => {
    return favoriteItem.mal_id === parseInt(event.currentTarget.id);
  });

  if (indexInFavorites === -1) {
    favoritesList.push(seriesSelected);
    renderFavorites(favoritesList);

    function handleAddFavorite(event) {
      console.log(event.currentTarget);
      console.log(event.currentTarget.id);
      console.log(seriesList);

      const seriesSelected = seriesList.find((seriesItem) => {
        return event.currentTarget.id === seriesItem.mal_id.toString();
      });

      const indexInFavorites = favoritesList.findIndex((favoriteItem) => {
        return favoriteItem.mal_id === parseInt(event.currentTarget.id);
      });

      if (indexInFavorites === -1) {
        favoritesList.push(seriesSelected);
        renderFavorites(favoritesList);
        localStorage.setItem("favorites", JSON.stringify(favoritesList));
      }
    }
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
        </div>
    `;
  }
  favoritesResultsContainer.innerHTML = content;
}

const fetchSeriesData = () => {
  seriesResultsContainer.innerHTML = "";
  fetch(animeAPIURL)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      seriesList = data.data;
      renderSeries(seriesList);
      localStorage.setItem("series", JSON.stringify(seriesList));
    });
};

const seriesDataFromLocalStorage = JSON.parse(localStorage.getItem("series"));
if (seriesDataFromLocalStorage !== null) {
  seriesList = seriesDataFromLocalStorage;
  renderSeries(seriesList);
} else {
  fetchSeriesData();
}

const handleSearch = (event) => {
  event.preventDefault();
  const inputValue = searchInput.value.toLowerCase();

  const filteredSeries = seriesList.filter((seriesItem) => {
    return seriesItem.title.toLowerCase().includes(inputValue);
  });

  renderSeries(filteredSeries);
};

searchButton.addEventListener("click", handleSearch);
