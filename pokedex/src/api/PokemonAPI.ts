
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

}