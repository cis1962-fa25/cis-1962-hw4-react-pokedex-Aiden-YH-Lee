import type { Pokemon } from "../types/types";
import { PokemonCard } from "./PokemonCard";

interface PokemonListProps {
    pokemonList: Pokemon[];
    onPokemonClick?: (pokemon: Pokemon) => void;
}

export function PokemonList({ pokemonList, onPokemonClick }: PokemonListProps) {
    return (
        <div className="pokemon-list pokemon-grid">
            {pokemonList.map((pokemon) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} onClick={() => onPokemonClick?.(pokemon)} />
            ))}
        </div>
    );
}