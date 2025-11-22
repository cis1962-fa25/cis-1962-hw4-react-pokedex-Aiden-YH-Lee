import { useState } from 'react'
import { useEffect } from 'react'
import { PokemonAPI } from './api/PokemonAPI'
import { PokemonList } from './components/PokemonList'
import { Modal } from './components/Modal'
import { PokemonDetails } from './components/PokemonDetails'
import { BoxList } from './components/BoxList'
import './App.css'
import type { Pokemon } from './types/types'


function App() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null)
  const [view, setView] = useState<'pokemon' | 'box'>('pokemon');
  const [pokemonMap, setPokemonMap] = useState<Map<number, string>>(new Map());
  const PAGE_SIZE = 12;

  const handlePokemonClick = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon)
  }

  const closeModal = () => {
    setSelectedPokemon(null)
  }

  // Fetch all pokemon names once to build a lookup map for the Box view. Due to server limitations, I could only fetch 30.
  useEffect(() => {
    const fetchAllForMap = async () => {
      try {
        const allData = await PokemonAPI.get_all_pokemons(30, 0);
        const map = new Map<number, string>();
        allData.forEach((p: Pokemon) => {
          map.set(p.id, p.name);
        });
        setPokemonMap(map);
      } catch (e) {
        console.error("Failed to fetch all pokemon for map", e);
      }
    };
    fetchAllForMap();
  }, []);

  useEffect(() => {
    let ignore = false;
    const offset = currentPage * PAGE_SIZE;
    // console.log("Fetching pokemons...");

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await PokemonAPI.get_all_pokemons(PAGE_SIZE, offset);
        if (!ignore) {
          setPokemons(data);
          setError(null);
        }
      } catch (e) {
        if (!ignore) {
          setError(`Failed to fetch Pokemon: ${e}. Please try again.`);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      ignore = true;
    };
  }, [currentPage])


  return (
    <>
      <div className='app-header'>
        <div className='view-toggle'>
          <button
            className={view === 'pokemon' ? 'active' : ''}
            onClick={() => setView('pokemon')}
          >
            All Pokémon
          </button>
          <button
            className={view === 'box' ? 'active' : ''}
            onClick={() => setView('box')}
          >
            My Box
          </button>
        </div>
      </div>

      <h1>Pokedex</h1>

      {view === 'pokemon' ? (
        <>
          <div className="pokemon-container" style={{ position: 'relative', minHeight: '400px' }}>
            {loading && (
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 10
              }}>
                <h3>Loading Pokemons...</h3>
              </div>
            )}
            <div style={{ visibility: loading ? 'hidden' : 'visible' }}>
              {error && <h3>{error}</h3>}
              <PokemonList pokemonList={pokemons} onPokemonClick={handlePokemonClick} />
            </div>
          </div>
          <div className="pagination-controls">
            <button onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))} disabled={currentPage === 0}>
              Previous
            </button>
            <span> Page {currentPage + 1} </span>
            <button onClick={() => setCurrentPage(prev => prev + 1)}>
              Next
            </button>
          </div>
        </>
      ) : (
        <BoxList pokemonMap={pokemonMap} />
      )}

      <Modal isOpen={selectedPokemon !== null} onClose={closeModal}>
        {selectedPokemon && <PokemonDetails pokemon={selectedPokemon} onClose={closeModal} />}
      </Modal>
    </>
  )
}

export default App
