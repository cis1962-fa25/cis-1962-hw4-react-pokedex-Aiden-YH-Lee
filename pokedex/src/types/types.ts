// From API.md - Pokemon types
export interface PokemonType {
    name: string;
    color: string;
}

export interface PokemonMove {
    name: string;
    power?: number;
    type: PokemonType;
}

export interface Pokemon {
    id: number;
    name: string;
    description: string;
    types: PokemonType[];
    moves: PokemonMove[];
    sprites: {
        front_default: string;
        back_default: string;
        front_shiny: string;
        back_shiny: string;
    };
    stats: {
        hp: number;
        speed: number;
        attack: number;
        defense: number;
        specialAttack: number;
        specialDefense: number;
    };
}

// Box entry types
export interface BoxEntry {
    id: string;
    createdAt: string;
    level: number;
    location: string;
    notes?: string;
    pokemonId: number;
}

export interface InsertBoxEntry {
    createdAt: string;
    level: number;
    location: string;
    notes?: string;
    pokemonId: number;
}

export interface UpdateBoxEntry {
    createdAt?: string;
    level?: number;
    location?: string;
    notes?: string;
    pokemonId?: number;
}