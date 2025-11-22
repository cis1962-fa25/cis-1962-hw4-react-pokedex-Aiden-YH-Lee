import { useState, useEffect } from 'react';
import type { BoxEntry, Pokemon } from '../types/types';
import { PokemonAPI } from '../api/PokemonAPI';
import styles from './PokemonCard.module.css'; // Re-using the card styles

interface BoxCardProps {
    boxEntry: BoxEntry;
    pokemonName: string;
    onEdit: (entry: BoxEntry) => void;
    onDelete: (id: string) => void;
}

export function BoxCard({ boxEntry, pokemonName, onEdit, onDelete }: BoxCardProps) {
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPokemon = async () => {
            try {
                const data = await PokemonAPI.get_pokemon_by_name(pokemonName);
                setPokemon(data);
            } catch (e) {
                console.error("Failed to fetch pokemon details for box card", e);
            } finally {
                setLoading(false);
            }
        };
        if (pokemonName) {
            fetchPokemon();
        }
    }, [pokemonName]);

    if (loading) return <div className={styles.pokemonCard}>Loading...</div>;
    if (!pokemon) return <div className={styles.pokemonCard}>Error loading pokemon</div>;

    return (
        <div className={styles.pokemonCard}>
            <h3>{pokemon.name}</h3>
            <img src={pokemon.sprites.front_default} alt={pokemon.name} width={100} />

            <div style={{ textAlign: 'left', marginTop: '10px', fontSize: '0.9rem' }}>
                <p><strong>Level:</strong> {boxEntry.level}</p>
                <p><strong>Location:</strong> {boxEntry.location}</p>
                <p><strong>Caught:</strong> {new Date(boxEntry.createdAt).toLocaleDateString()}</p>
                {boxEntry.notes && <p><strong>Notes:</strong> {boxEntry.notes}</p>}
            </div>

            <div style={{ marginTop: '10px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button onClick={() => onEdit(boxEntry)}>Edit</button>
                <button onClick={() => onDelete(boxEntry.id)}>Delete</button>
            </div>
        </div>
    );
}