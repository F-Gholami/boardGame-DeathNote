# boardGame-DeathNote

## Introduaction and Rules
Object-oriented turn-based JavaScript board game

### Part 1: Grid

- The game starts with a grid with randomly placed obstacles (20% of all tiles), weapons (4) and players (2).
- Each player has a default weapon that inflicts 10 points of damage. The other weapons cause higher damage.
- Each player can move 1-3 steps N/E/S/W each turn, provided there is no obstacle or player in their way.
- When landing on a tile with a different weapon, they can swap the weapon they are holding for the one on the tile.
- Players can earn more health by collecting apples and cakes.
- When landing on a tile adjacent to the other player, a battle begins.

### Part 2: Fight

- The player that caused the start of the fight, starts.
- Each turn a player can choose to attack or to defend.
- If attacking, the other player loses as many life points as the damage of the weapon the attacking player is holding.
- If defending, the player will sustain 50% less damage in the following attack.
- Each player starts of with 100 life points.
- The game is over when one player has no life points left. A game over message appears.

## Theme
The characters and weapons are based on an anime called **Death Note** which was the first anime I've ever watched and fell in love with.

The story follows *Light Yagami* who attempts to use the Death Note to carry out a world-wide massacre of individuals whom he deems morally unworthy of life to change the world into a utopian society without crime, using the alias of a God-like vigilante named **Kira** and the subsequent efforts of an elite task-force of law enforcement officers, consisting of members of the Japanese police force, led by **L**, an enigmatic international detective whose past is shrouded in mystery, to apprehend him and end his reign of terror.

*...Having Cakes and Apples for increasing the score of health for each player was not part of the brief, but I added as a challenge to my own version of the game...*
