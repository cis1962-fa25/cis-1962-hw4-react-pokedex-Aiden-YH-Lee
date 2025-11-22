import type { InsertBoxEntry } from "../types/types";
import type { UpdateBoxEntry } from "../types/types";

export class PokemonAPI {
    static BASE_URL = 'https://hw4.cis1962.esinx.net/api'
    static auth_token = 'eyJhbGciOiJIUzI1NiJ9.eyJwZW5ua2V5IjoiYWlkZW5sZWUiLCJpYXQiOjE3NTkwOTgyMTgsImlzcyI6ImVkdTp1cGVubjpzZWFzOmNpczE5NjIiLCJhdWQiOiJlZHU6dXBlbm46c2VhczpjaXMxOTYyIiwiZXhwIjoxNzY0MjgyMjE4fQ.jsxDYOKJ-00bUkfXGW9SPM3aKeQ81mbdcbc2PqFP8QA'

    static async get_all_pokemons(limit: number, offset: number) {

        const response = await fetch(`${PokemonAPI.BASE_URL}/pokemon?limit=${limit}&offset=${offset}`, {
            mode: 'cors',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching pokemons: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    }

    static async get_pokemon_by_name(name: string) {

        const response = await fetch(`${PokemonAPI.BASE_URL}/pokemon/${name}`, {
            mode: 'cors',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching pokemon: ${response.statusText}`);
        }

        const data = await response.json();
        return data;

    }

    static async get_all_boxes() {
        const response = await fetch(`${PokemonAPI.BASE_URL}/box`, {
            mode: 'cors',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${PokemonAPI.auth_token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching boxes: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    }

    static async create_box(entry: InsertBoxEntry) {
        const response = await fetch(`${PokemonAPI.BASE_URL}/box`, {
            mode: 'cors',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${PokemonAPI.auth_token}`
            },
            body: JSON.stringify(entry)
        });

        if (!response.ok) {
            throw new Error(`Error creating box: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    }

    static async get_box(id: string) {
        const response = await fetch(`${PokemonAPI.BASE_URL}/box/${id}`, {
            mode: 'cors',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${PokemonAPI.auth_token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching box: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    }

    static async update_box(id: string, entry: UpdateBoxEntry) {
        const response = await fetch(`${PokemonAPI.BASE_URL}/box/${id}`, {
            mode: 'cors',
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${PokemonAPI.auth_token}`
            },
            body: JSON.stringify(entry)
        });

        if (!response.ok) {
            throw new Error(`Error updating box: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    }

    static async delete_box(id: string) {
        const response = await fetch(`${PokemonAPI.BASE_URL}/box/${id}`, {
            mode: 'cors',
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${PokemonAPI.auth_token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error deleting box: ${response.statusText}`);
        }

        return;
    }

    static async delete_all_box() {
        const response = await fetch(`${PokemonAPI.BASE_URL}/box`, {
            mode: 'cors',
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${PokemonAPI.auth_token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error deleting all boxes: ${response.statusText}`);
        }
        return;
    }
}
