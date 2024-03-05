"use strict";

const animeAPIURL = "https://api.jikan.moe/v4/anime?q=";

const searchInput = document.querySelector(".js-search-text");
const searchButton = document.querySelector(".js-search");
const resetButton = document.querySelector(".js-reset");
const seriesResultsContainer = document.querySelector(".js-series");
const favoritesResultsContainer = document.querySelector(".js-favorites");

let seriesList = [];
let favoritesList = [];

const renderSeries = (series) => {
  let content = "";
  for (const seriesItem of series) {
    content += `
            <div class="series-item">
                <h3>${seriesItem.title}</h3>
                <img src="${seriesItem.images.jpg.large_image_url}">
            </div>
        `;
  }
  seriesResultsContainer.innerHTML = content;
};

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

fetchSeriesData();

const handleSearch = (event) => {
  event.preventDefault();
  const inputValue = searchInput.value;
  console.log(inputValue);
};
searchInput.addEventListener("click", handleSearch);
console.log("input");
