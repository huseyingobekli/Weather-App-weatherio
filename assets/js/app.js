import { fetchDATA, url } from "./api.js";
import * as module from "./module.js";

const addEventOnElemnts = function (elements, eventType, callback) {
  for (const element of elements) element.addEventListener(eventType, callback);
};

const searchView = document.querySelector("[data-search-view]");
const searchTogglers = document.querySelectorAll("[data-search-toggler]");

const toggleSearch = () => searchView.classList.toggle("active");
addEventOnElemnts(searchTogglers, "click", toggleSearch);

const searchFiled = document.querySelector("[data-search-field]");
const searchResult = document.querySelector("[data-search-result]");
let searchTimeout = null;
let searchTimeOutDuration = 500;

searchFiled,
  addEventListener("input", function () {
    searchTimeout ?? this.clearTimeout(searchTimeout);
    if (searchFiled.value) {
      searchResult.classList.remove("active");
      searchResult.innerHTML = "";
      searchFiled.classList.remove("searching");
    } else {
      searchFiled.classList.add("searching");
    }

    if (searchFiled.value) {
      searchTimeout = this.setTimeout(() => {
        fetchDATA(url.geo(searchFiled.value), function (locations) {
          searchFiled.classList.remove("searching");
          searchResult.classList.add("active");
          searchResult.innerHTML = `
            <ul class="view-list" data-search-list>
        </ul>
          `;
          const items = [];
          for (const { name, lat, lon, country, state } of locations) {
            const searchItem = document.createElement("li");
            searchItem.classList.add("view-item");
            searchItem.innerHTML = `
                <span class="m-icon">location_on</span>
                    <div>
                        <p class="item-title">${name}</p>
                        <p class="label-2 item-subtitle">${
                          state || ""
                        } ${country}</p>
                    </div>
                <a href="#/weather?lat=${lat}&lon=${lon}" class="item-link has-state" aria-label = "${name} weather" data-search-toggler></a>
            `;

            searchResult
              .querySelector("[data-search-list]")
              .appendChild(searchItem);
            items.push(searchItem.querySelector("[data-search-toggler]"));
          }
        });
      }, searchTimeOutDuration);
    }
  });
