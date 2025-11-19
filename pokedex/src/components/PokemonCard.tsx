import type { Pokemon } from "../types/types";
import styles from './PokemonCard.module.css';

interface PokemonCardProps {
    pokemon: Pokemon;
    onClick?: () => void;
}

export function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
    return (
        <div className={styles.pokemonCard} onClick={onClick}>
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
            <h3>{pokemon.name} (#{pokemon.id})</h3>
            <div>{pokemon.description}</div>
            {pokemon.types.map((type) => (
                <span key={type.name} style={{ color: type.color }}>{type.name}</span>
            ))}
        </div>
    )
}