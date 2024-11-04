"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function fetchPokemonData(pokemonNames) {
    return __awaiter(this, void 0, void 0, function* () {
        const promises = pokemonNames.map(name => fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`)
            .then(response => response.json()));
        try {
            const pokemons = yield Promise.all(promises);
            return pokemons;
        }
        catch (error) {
            console.error('Error fetching Pokémon:', error);
            return [];
        }
    });
}
function fetchAPI() {
    return __awaiter(this, void 0, void 0, function* () {
        const baseURL = "https://nuzborn.azurewebsites.net/Trainer/GetAllTrainers";
        const url = new URL(baseURL);
        try {
            const response = yield fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = yield response.json();
            return data;
        }
        catch (error) {
            console.error("Error fetching data:", error);
            return [];
        }
    });
}
// Function to render the leaderboard
function renderLeaderboard() {
    return __awaiter(this, void 0, void 0, function* () {
        const leaderboard = document.getElementById("leaderboard");
        if (!leaderboard) {
            console.error("Leaderboard element not found");
            return;
        }
        try {
            const api_data = yield fetchAPI();
            if (!api_data) {
                console.error("No data returned from fetchAPI");
                return;
            }
            // Clear existing leaderboard content
            leaderboard.innerHTML = '';
            // Sort trainers by progress in descending order
            api_data.sort((a, b) => {
                return Number(b.progress) - Number(a.progress);
            });
            for (const trainer of api_data) {
                const partyPokemons = trainer.pokemon.filter(poke => poke.party === true); // Filter for Pokémon in the party
                const boxedMons = trainer.pokemon.filter(poke => poke.party === false); // Filter for Pokémon in the box
                const poke_api_data_party = yield fetchPokemonData(partyPokemons.map(poke => poke.name));
                const poke_api_data_boxed = yield fetchPokemonData(boxedMons.map(poke => poke.name));
                if (poke_api_data_party && poke_api_data_party.length > 0) {
                    // Create a container for the trainer
                    const trainerElement = document.createElement("div");
                    trainerElement.style.border = "1px solid #ccc"; // Border around each trainer
                    trainerElement.style.textAlign = "center"; // Center text for trainer's nickname
                    trainerElement.innerHTML = `<h3>${trainer.nickName} : ${trainer.trainerID}</h3>`;
                    trainerElement.innerHTML += `<h2>${trainer.progress} badges</h2>`;
                    // Create a grid container for the Pokémon party
                    const pokemonGrid = document.createElement("div");
                    pokemonGrid.className = "pokemon-grid"; // Apply grid class for styling
                    // Title for the party Pokémon grid
                    const pokemonTitle = document.createElement("div");
                    pokemonTitle.className = "pokemon-title";
                    pokemonTitle.textContent = "Party Pokémon";
                    trainerElement.appendChild(pokemonTitle); // Append title to the trainer element
                    // Render party Pokémon
                    for (const poke of poke_api_data_party) {
                        const pokemonBox = document.createElement("div");
                        pokemonBox.className = "pokemon-box"; // Apply box class for styling
                        // Create an image element for the Pokémon
                        const pokeImage = document.createElement("img");
                        pokeImage.src = poke.sprites.front_default; // Image URL
                        pokeImage.alt = `${poke.name} image`;
                        // Append image and text to the box
                        pokemonBox.appendChild(pokeImage);
                        pokemonBox.appendChild(document.createTextNode(`${poke.name}`));
                        pokemonGrid.appendChild(pokemonBox);
                    }
                    trainerElement.appendChild(pokemonGrid); // Append the party Pokémon grid
                    // Create a smaller grid container for boxed Pokémon
                    const boxedGrid = document.createElement("div");
                    boxedGrid.className = "boxed-grid"; // Apply boxed grid class for styling
                    // Title for the boxed Pokémon grid
                    const boxedTitle = document.createElement("div");
                    boxedTitle.className = "boxed-title";
                    boxedTitle.textContent = "Boxed Pokémon";
                    trainerElement.appendChild(boxedTitle); // Append title to the trainer element
                    // Render boxed Pokémon
                    if (poke_api_data_boxed && poke_api_data_boxed.length > 0) {
                        for (const poke of poke_api_data_boxed) {
                            const boxedPokemonBox = document.createElement("div");
                            boxedPokemonBox.className = "boxed-pokemon-box"; // Apply boxed box class for styling
                            // Create an image element for the Pokémon
                            const boxedPokeImage = document.createElement("img");
                            boxedPokeImage.src = poke.sprites.front_default; // Image URL
                            boxedPokeImage.alt = `${poke.name} image`;
                            // Append image and text to the boxed box
                            boxedPokemonBox.appendChild(boxedPokeImage);
                            boxedPokemonBox.appendChild(document.createTextNode(`${poke.name}`));
                            boxedGrid.appendChild(boxedPokemonBox);
                        }
                    }
                    trainerElement.appendChild(boxedGrid); // Append the boxed Pokémon grid
                    leaderboard.appendChild(trainerElement); // Append the trainer element to the leaderboard
                }
            }
        }
        catch (error) {
            console.error("Error fetching data:", error);
        }
    });
}
// Function to randomly update player scores
function refreshLeaderboard() {
    renderLeaderboard();
}
// Initial render
renderLeaderboard();
