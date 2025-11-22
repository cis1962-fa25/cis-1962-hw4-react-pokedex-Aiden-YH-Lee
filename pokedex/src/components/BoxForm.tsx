import { useState } from "react"
import { PokemonAPI } from "../api/PokemonAPI"
import type { InsertBoxEntry, BoxEntry, UpdateBoxEntry } from "../types/types"


interface BoxFormProps {
    pokemonId: number,
    pokemonName: string,
    initialData?: BoxEntry,
    onSuccess: () => void;
    onCancel: () => void;
}

export function BoxForm({ pokemonId, pokemonName, initialData, onSuccess, onCancel }: BoxFormProps) {
    const [location, setLocation] = useState(initialData?.location || "");
    const [level, setLevel] = useState<number | ''>(initialData?.level || '');
    const [notes, setNotes] = useState(initialData?.notes || "");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [error, setError] = useState<string | null>(null);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!location.trim()) {
            setError("Location is required.");
            return;
        }
        if (level === '' || level < 1 || level > 100) {
            setError("Level must be between 1 and 100.");
            return;
        }

        setIsSubmitting(true);

        try {
            if (initialData) {
                const updateEntry: UpdateBoxEntry = {
                    location: location.trim(),
                    level: Number(level),
                    notes: notes,
                };
                await PokemonAPI.update_box(initialData.id, updateEntry);
            } else {
                const newEntry: InsertBoxEntry = {
                    pokemonId: pokemonId,
                    location: location.trim(),
                    level: Number(level),
                    notes: notes,
                    createdAt: new Date().toISOString()
                };
                await PokemonAPI.create_box(newEntry);
            }
            onSuccess();

        } catch (e) {
            setError(`Failed to ${initialData ? 'update' : 'catch'} Pokemon: ${e}. Try again.`);
        } finally {
            setIsSubmitting(false);
        }

    }

    return (
        <div className="box-form">
            <h3>{initialData ? `Edit ${pokemonName}` : `Catch ${pokemonName}!`}</h3>
            {error && <p>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Location:</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>

                <div>
                    <label>Level:</label>
                    <input
                        type="number"
                        value={level}
                        onChange={(e) => setLevel(Number(e.target.value))}
                    />
                </div>

                <div>
                    <label>Notes:</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>

                <div className="buttons">
                    <button type="button" onClick={onCancel}>Cancel</button>
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : (initialData ? "Save Changes" : "Catch!")}
                    </button>
                </div>
            </form>
        </div>
    );
}