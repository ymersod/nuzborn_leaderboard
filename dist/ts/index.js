"use strict";
// Sample data for the leaderboard
/* const players = [
  { name: "Alice", score: 95 },
  { name: "Bob", score: 88 },
  { name: "Charlie", score: 78 },
  { name: "Diana", score: 90 },
]; */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b, _c;
function fetchPokemonData(pokemonName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
            const pokemon = yield response.json();
            console.log(pokemon);
            return pokemon;
        }
        catch (error) {
            console.error("Error fetching Pokémon data:", error);
            return null;
        }
    });
}
function fetchAPI() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch("http://localhost:5186/weatherforecast");
            const data = yield response.json();
            console.log(data);
        }
        catch (error) {
            console.error("Error fetching data:", error);
        }
    });
}
function displayPokemon(pokemonName) {
    return __awaiter(this, void 0, void 0, function* () {
        const pokemon = yield fetchPokemonData(pokemonName);
        if (pokemon) {
            console.log(`Name: ${pokemon.name}`);
            console.log(`ID: ${pokemon.id}`);
            console.log(`Height: ${pokemon.height}`);
            console.log("Types:", pokemon.types.map(t => t.type.name).join(", "));
        }
        else {
            console.log("Pokémon not found.");
        }
    });
}
// Function to render the leaderboard
function renderLeaderboard() {
    const leaderboard = document.getElementById("leaderboard");
    if (leaderboard) {
        leaderboard.innerHTML = "<h2>Leaderboard</h2>";
        const list = document.createElement("ul");
        /*  players.forEach(player => {
             const listItem = document.createElement("li");
             listItem.textContent = `${player.name}: ${player.score} points`;
             list.appendChild(listItem);
         }); */
        leaderboard.appendChild(list);
    }
}
// Function to randomly update player scores
function refreshLeaderboard() {
    /* players.forEach(player => {
        // Generate a random score change between -10 and +10
        const scoreChange = Math.floor(Math.random() * 21) - 10;
        player.score = Math.max(0, player.score + scoreChange); // Ensure score doesn't go below 0
    }); */
    renderLeaderboard();
}
// Set up event listener for the refresh button
(_a = document.getElementById("getPokeButton")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => displayPokemon("ditto"));
(_b = document.getElementById("refreshButton")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", refreshLeaderboard);
(_c = document.getElementById("fetchAPI")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", fetchAPI);
// Initial render
renderLeaderboard();
