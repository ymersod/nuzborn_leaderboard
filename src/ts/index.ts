interface Trainer {
  trainerID: string,
  nickName: string,
  runAlive: boolean,
  progress: string,
  pokemon: Pokemon[],
}
interface Pokemon {
  name: string,
  nickName: string,
  level: number,
  ability: string,
  party: boolean,
  locationCaught: string,
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
    const promises = pokemonNames.map(async name => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
      return await response.json();
  });
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
    
    // Sort trainers by progress in descending 
    const runaliveTrue = api_data
      .filter((item) => item.runAlive == true)
      .sort((a, b) => Number(b.progress) - Number(a.progress));
    
    const edgeCaseList = [
      {case: "DEERLING-SPRING FORM", replacement: "DEERLING"},
      {case: "SAWSBUCK-SPRING FORM", replacement: "SAWSBUCK"},
      {case: "PUMPKABOO", replacement: "PUMPKABOO-LARGE"},
      {case : "UNOWN", replacement: "UNOWN"},
    ]

    function getReplacementName(pokemonName: string): string {
      if (!pokemonName) return pokemonName;
      const edgeCase = edgeCaseList.find(item => pokemonName.includes(item.case));
      return edgeCase ? edgeCase.replacement : pokemonName;
    }
    for (const trainer of runaliveTrue) {
      console.log(trainer)
      trainer.pokemon = trainer.pokemon.map(pokemon => ({
        ...pokemon,
        name: getReplacementName(pokemon.name)
      }));
      const partyPokemons = trainer.pokemon.filter(poke => poke.party == true); // Filter for Pokémon in the party
      const boxedMons = trainer.pokemon.filter(poke => poke.party == false); // Filter for Pokémon in the box
      const poke_api_data_party = await fetchPokemonData(partyPokemons.map(poke => poke.name));
      const poke_api_data_boxed = await fetchPokemonData(boxedMons.map(poke => poke.name));
      
      // const mergedPartyPokemons = poke_api_data_party && poke_api_data_party.length > 0 ? 
      // partyPokemons.map(partyMon => {
      //   const apiData = poke_api_data_party?.find(apiMon => apiMon.name === partyMon.name);
      //   if (apiData) {
      //     return { ...partyMon, ...apiData };
      //   }
      //   return partyMon;
      // }) : [];
 
    
      // const mergedBoxedPokemons = poke_api_data_boxed && poke_api_data_boxed.length > 0 ? 
      // boxedMons.map(partyMon => {
      //   const apiData = poke_api_data_boxed.find(apiMon => apiMon.name === partyMon.name);
      //   if (apiData) {
      //     return { ...partyMon, ...apiData };
      //   }
      //   return partyMon;
      // }) : [];
      
      
      if (poke_api_data_party && poke_api_data_party.length > 0) {
        // Create a container for the trainer
        const trainerElement = document.createElement("div");
        trainerElement.className = "trainer"; // Apply trainer class for styling
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
        
          // Find the corresponding data in partyPokemons
          const pokemonRebornData = partyPokemons.find(pokemon => pokemon.name === poke.name.toUpperCase());
        
          // Set background color based on alive status
          pokemonBox.style.backgroundColor = pokemonRebornData?.alive ? "lightgrey" : "darkred";
        
          // Create a container for the top section (name and nickname)
          const topSection = document.createElement("div");
          topSection.className = "top-section";
        
          // Add Name
          const nameText = document.createElement("p");
          nameText.className = "pokemon-name";
          nameText.textContent = `Species: ${poke.name}`;
          topSection.appendChild(nameText);
        
          // Add Nickname (if available)
          if (pokemonRebornData && pokemonRebornData.nickName) {
            const nicknameText = document.createElement("p");
            nicknameText.className = "pokemon-nickname";
            nicknameText.textContent = `Nickname: ${pokemonRebornData.nickName}`;
            topSection.appendChild(nicknameText);
          }
        
          // Append top section to the box
          pokemonBox.appendChild(topSection);
        
          // Create an image element for the Pokémon
          const pokeImage = document.createElement("img");
          pokeImage.src = poke.sprites.front_default;
          pokeImage.alt = `${poke.name} image`;
          pokeImage.className = "pokemon-image";
          pokemonBox.appendChild(pokeImage);
        
          // Add a bottom section for other details
          const bottomSection = document.createElement("div");
          bottomSection.className = "bottom-section";
        
          // Add Level (if available)
          if (pokemonRebornData && pokemonRebornData.level) {
            const levelText = document.createElement("p");
            levelText.className = "pokemon-level";
            levelText.textContent = `Level: ${pokemonRebornData.level}`;
            bottomSection.appendChild(levelText);
          }
        
          // Add Location caught (if available)
          if (pokemonRebornData && pokemonRebornData.locationCaught) {
            const locationText = document.createElement("p");
            locationText.className = "pokemon-location";
            locationText.textContent = `Caught at: ${pokemonRebornData.locationCaught}`;
            bottomSection.appendChild(locationText);
          }
        
          // Append bottom section to the box
          pokemonBox.appendChild(bottomSection);
        
          // Append the complete pokemonBox to the grid
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
            const pokemonRebornData = boxedMons.find(pokemon => pokemon.name === poke.name.toUpperCase()); // Find the corresponding data in boxedMons

            boxedPokemonBox.style.backgroundColor = pokemonRebornData?.alive ? "lightgreen" : "lightcoral"; // Green if alive, light
            // Create an image element for the Pokémon
            const boxedPokeImage = document.createElement("img");
            boxedPokeImage.src = poke.sprites.front_default; // Image URL
            boxedPokeImage.alt = `${poke.name} image`;

            const tooltip = document.createElement("span");
            tooltip.className = "tooltip";
            tooltip.innerHTML = 
              `Species: ${poke.name}<br>
              Nickname: ${pokemonRebornData?.nickName}<br>
              Level: ${pokemonRebornData?.level}<br>
              Caught at: ${pokemonRebornData?.locationCaught}`;

            // Append image and text to the boxed box
            boxedPokemonBox.appendChild(boxedPokeImage);
            boxedPokemonBox.appendChild(document.createTextNode(`${poke.name}`));
            boxedPokemonBox.appendChild(tooltip);
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

    // Create the popup element
    const popup = document.createElement("div");
    popup.className = "popup"; // Add a class for styling
    popup.style.display = "none"; // Hide it initially
    popup.style.position = "fixed"; // Fixed position
    popup.style.top = "50%"; // Center vertically
    popup.style.left = "50%"; // Center horizontally
    popup.style.transform = "translate(-50%, -50%)"; // Centering transform
    popup.style.backgroundColor = "white"; // Popup background color
    popup.style.border = "1px solid #ccc"; // Popup border
    popup.style.padding = "20px"; // Padding inside the popup
    popup.style.zIndex = "1000"; // Ensure it's above other elements
    document.body.appendChild(popup);

    // Close button for the popup
    const closeButton = document.createElement("button");
    closeButton.innerText = "Close";
    closeButton.onclick = () => {
      popup.style.display = "none"; // Hide the popup when clicked
    };
    popup.appendChild(closeButton);

    for (const trainer of runaliveFalse) {
      // Create a list of fallen Pokémon
      const pokemonList = trainer.pokemon
        .map(pokemon => `<li>${pokemon.nickName} the ${pokemon.name.toLowerCase()}</li>`) // Create list items
        .join(""); // Join the list items into a single string
      const trainerElement = document.createElement("div");
      trainerElement.style.border = "1px solid #ccc"; // Border around each trainer
      trainerElement.style.textAlign = "center"; // Center text for trainer's nickname
      trainerElement.innerHTML = `<h3>${trainer.nickName} : ${trainer.trainerID}</h3>`;
      trainerElement.innerHTML += `<h2>${trainer.progress} badges</h2>`;

      // Add click event to the trainer element
      trainerElement.onclick = () => {
        popup.innerHTML = `<h3>${trainer.nickName} Details</h3>
                          <p>Trainer ID: ${trainer.trainerID}</p>
                          <p>Progress: ${trainer.progress} badges</p>
                          <p>Fallen heroes:</p>
                          <ul>${pokemonList}</ul>`; // Add a list for the fallen Pokémon
        popup.appendChild(closeButton); // Append the close button again (optional)
        popup.style.display = "block"; // Show the popup
      };

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