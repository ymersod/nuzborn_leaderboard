interface Trainer {
  trainerID: string,
  nickName: string,
  runAlive: boolean,
  progress: string,
  pokemon: Pokemon[],
}
interface Pokemon {
  name: string,
  level: number,
  party: boolean,
  alive: boolean,
}

interface PokeAPIPokemon {
  name: string;
  id: number;
  height: number;
  weight: number;
  sprites: { front_default: string };
  types: { type: { name: string } }[];
}

async function fetchPokemonData(pokemonNames: string[]): Promise<PokeAPIPokemon[] | null> {
 const promises = pokemonNames.map(name => 
        fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`)
            .then(response => response.json())
    );

    try {
        const pokemons = await Promise.all(promises);
        return pokemons;
    } catch (error) {
        console.error('Error fetching Pokémon:', error);
        return [];
    }
}

async function fetchAPI(): Promise<Trainer[] | null> {
  const baseURL = "https://nuzborn.azurewebsites.net/Trainer/GetAllTrainers";
  const url = new URL(baseURL);
  try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      return data;
  } catch (error) {
      console.error("Error fetching data:", error);
      return [];
  }
}

// Function to render the leaderboard
async function renderLeaderboard(): Promise<void> {
  const leaderboard = document.getElementById("leaderboard");
  
  if (!leaderboard) {
    console.error("Leaderboard element not found");
    return;
  }

  try {
    const api_data = await fetchAPI();
    if (!api_data) {
      console.error("No data returned from fetchAPI");
      return;
    }

    // Clear existing leaderboard content
    leaderboard.innerHTML = '';
    
    // Sort trainers by progress in descending order
    const runaliveTrue = api_data
      .filter((item) => item.runAlive === true)
      .sort((a, b) => Number(b.progress) - Number(a.progress));

    for (const trainer of runaliveTrue) {
      const partyPokemons = trainer.pokemon.filter(poke => poke.party === true); // Filter for Pokémon in the party
      const boxedMons = trainer.pokemon.filter(poke => poke.party === false); // Filter for Pokémon in the box
      const poke_api_data_party = await fetchPokemonData(partyPokemons.map(poke => poke.name));
      const poke_api_data_boxed = await fetchPokemonData(boxedMons.map(poke => poke.name));

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
    const runaliveFalse = api_data
      .filter((item) => item.runAlive === false)
    const title = document.createElement("h1");
    title.innerHTML = "Graveyard";
    leaderboard.appendChild(title);
    for (const trainer of runaliveFalse) {
      const trainerElement = document.createElement("div");
      trainerElement.style.border = "1px solid #ccc"; // Border around each trainer
      trainerElement.style.textAlign = "center"; // Center text for trainer's nickname
      trainerElement.innerHTML = `<h3>${trainer.nickName} : ${trainer.trainerID}</h3>`;
      trainerElement.innerHTML += `<h2>${trainer.progress} badges</h2>`;
      leaderboard.appendChild(trainerElement);
    }

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Function to randomly update player scores
function refreshLeaderboard(): void {
  renderLeaderboard();
}

// Initial render
renderLeaderboard();