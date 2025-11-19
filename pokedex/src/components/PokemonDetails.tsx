import type { Pokemon } from "../types/types";

interface PokemonDetailsProps {
    pokemon: Pokemon;
    // onPokemonClick?: (pokemon: Pokemon) => void;
}

export function PokemonDetails({ pokemon }: PokemonDetailsProps) {
    return (
        <div className="pokemon-details">
            <h2>{pokemon.name}</h2>
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />

            <div className="stats">
                <p>HP: {pokemon.stats.hp}</p>
                <p>Attack: {pokemon.stats.attack}</p>
                <p>Defense: {pokemon.stats.defense}</p>
                <p>Speed: {pokemon.stats.speed}</p>
            </div>

            <div className="types">
                {pokemon.types.map(type => (
                    <span key={type.name} style={{ backgroundColor: type.color }}>
                        {type.name}
                    </span>
                ))}
            </div>

            <div className="moves">
                <h3>Moves</h3>
                {pokemon.moves.map(move => (
                    <div key={move.name}>
                        {move.name} {move.power && `(Power: ${move.power})`}
                    </div>
                ))}
            </div>
        </div>
    );
}