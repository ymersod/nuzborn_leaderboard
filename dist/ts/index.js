"use strict";
var _a;
// Sample data for the leaderboard
const players = [
    { name: "Alice", score: 95 },
    { name: "Bob", score: 88 },
    { name: "Charlie", score: 78 },
    { name: "Diana", score: 90 },
];
// Function to render the leaderboard
function renderLeaderboard() {
    const leaderboard = document.getElementById("leaderboard");
    if (leaderboard) {
        leaderboard.innerHTML = "<h2>Leaderboard</h2>";
        const list = document.createElement("ul");
        players.forEach(player => {
            const listItem = document.createElement("li");
            listItem.textContent = `${player.name}: ${player.score} points`;
            list.appendChild(listItem);
        });
        leaderboard.appendChild(list);
    }
}
// Function to randomly update player scores
function refreshLeaderboard() {
    players.forEach(player => {
        // Generate a random score change between -10 and +10
        const scoreChange = Math.floor(Math.random() * 21) - 10;
        player.score = Math.max(0, player.score + scoreChange); // Ensure score doesn't go below 0
    });
    renderLeaderboard();
}
// Set up event listener for the refresh button
(_a = document.getElementById("refreshButton")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", refreshLeaderboard);
// Initial render
renderLeaderboard();
