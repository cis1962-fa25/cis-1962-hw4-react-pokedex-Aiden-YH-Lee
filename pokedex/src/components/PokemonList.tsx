import type { Pokemon } from "../types/types";
import { PokemonCard } from "./PokemonCard";

interface PokemonListProps {
    pokemonList: Pokemon[];
    onPokemonClick?: (pokemon: Pokemon) => void;
}

const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1.5rem',
    padding: '2rem',
};

export function PokemonList({ pokemonList, onPokemonClick }: PokemonListProps) {
    return (
        <div style={gridStyle} className="pokemon-list">
            {pokemonList.map((pokemon) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} onClick={() => onPokemonClick?.(pokemon)} />
            ))}
        </div>
    );
}