import { useEffect, useState } from "react";
import type { Pokemon } from "../types/types";
import { PokemonAPI } from "../api/PokemonAPI";
import { BoxForm } from "./BoxForm";

interface PokemonDetailsProps {
    pokemon: Pokemon;
    onClose?: () => void;
}

export function PokemonDetails({ pokemon, onClose }: PokemonDetailsProps) {
    const [detailedPokemon, setDetailedPokemon] = useState<Pokemon>(pokemon);
    const [loading, setLoading] = useState(false);

    const [showCatchForm, setShowCatchForm] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                const fullPokemon = await PokemonAPI.get_pokemon_by_name(pokemon.name);
                setDetailedPokemon(fullPokemon);
            } catch (error) {
                console.error("Error fetching Pokemon details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [pokemon.name]);

    if (loading) {
        return <div className="pokemon-details">Loading details...</div>;
    }

    if (showCatchForm) {
        // Placeholder for BoxForm component
        return (
            <BoxForm
                pokemonId={detailedPokemon.id}
                pokemonName={detailedPokemon.name}
                onSuccess={() => { alert("Caught!"); onClose?.(); }}
                onCancel={() => setShowCatchForm(false)}
            />
        )
    }

    return (
        <div className="pokemon-details">
            <button onClick={() => setShowCatchForm(true)}>Catch!</button>
            <h2>{detailedPokemon.name}</h2>
            <img src={detailedPokemon.sprites.front_default} alt={detailedPokemon.name} />

            <div className="stats">
                <p>HP: {detailedPokemon.stats.hp}</p>
                <p>Attack: {detailedPokemon.stats.attack}</p>
                <p>Defense: {detailedPokemon.stats.defense}</p>
                <p>Speed: {detailedPokemon.stats.speed}</p>
            </div>

            <div className="types">
                {detailedPokemon.types.map(type => (
                    <span key={type.name} style={{ backgroundColor: type.color }}>
                        {type.name}
                    </span>
                ))}
            </div>

            <div className="moves">
                <h3>Moves</h3>
                {detailedPokemon.moves.map(move => (
                    <div key={move.name}>
                        {move.name} {move.power && `(Power: ${move.power})`}
                    </div>
                ))}
            </div>
        </div>
    );
}