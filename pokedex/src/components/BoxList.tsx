import { useState, useEffect } from 'react';
import { PokemonAPI } from '../api/PokemonAPI';
import type { BoxEntry } from '../types/types';
import { BoxCard } from './BoxCard';
import { Modal } from './Modal';
import { BoxForm } from './BoxForm';

interface BoxListProps {
    pokemonMap: Map<number, string>;
}

export function BoxList({ pokemonMap }: BoxListProps) {
    const [boxEntries, setBoxEntries] = useState<BoxEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingEntry, setEditingEntry] = useState<BoxEntry | null>(null);

    const fetchBoxData = async () => {
        setLoading(true);
        try {
            // 1. Get IDs
            const ids: string[] = await PokemonAPI.get_all_boxes();

            // 2. Get details for each
            const promises = ids.map((id: string) => PokemonAPI.get_box(id));
            const entries = await Promise.all(promises);
            setBoxEntries(entries);
        } catch (e) {
            console.error("Failed to fetch box data", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBoxData();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this Pokemon from your box?")) {
            try {
                await PokemonAPI.delete_box(id);
                fetchBoxData(); // Refresh
            } catch (e) {
                console.error(e);
                alert("Failed to delete");
            }
        }
    };

    const handleEdit = (entry: BoxEntry) => {
        setEditingEntry(entry);
    };

    const handleUpdateSuccess = () => {
        setEditingEntry(null);
        fetchBoxData(); // Refresh
    };

    if (loading) return <div>Loading Box...</div>;

    return (
        <>
            <div className="pokemon-container pokemon-grid">
                {boxEntries.map(entry => (
                    <BoxCard
                        key={entry.id}
                        boxEntry={entry}
                        pokemonName={pokemonMap.get(entry.pokemonId) || 'Unknown'}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
                {boxEntries.length === 0 && <p>Your box is empty!</p>}
            </div>

            <Modal isOpen={editingEntry !== null} onClose={() => setEditingEntry(null)}>
                {editingEntry && (
                    <BoxForm
                        pokemonId={editingEntry.pokemonId}
                        pokemonName={pokemonMap.get(editingEntry.pokemonId) || 'Unknown'}
                        initialData={editingEntry}
                        onSuccess={handleUpdateSuccess}
                        onCancel={() => setEditingEntry(null)}
                    />
                )}
            </Modal>
        </>
    );
}