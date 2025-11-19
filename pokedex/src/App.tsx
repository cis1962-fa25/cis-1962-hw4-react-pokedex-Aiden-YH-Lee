import { useState } from 'react'
import { useEffect } from 'react'
import { PokemonAPI } from './api/PokemonAPI'
import { PokemonList } from './components/PokemonList'
import './App.css'


function App() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const PAGE_SIZE = 6; 
  
  useEffect(() => {
    const offset = currentPage * PAGE_SIZE;
    console.log("Fetching pokemons...");
    const fetchData = async () => {
      setLoading(true);
      const data = await PokemonAPI.get_all_pokemons(PAGE_SIZE, offset);
      setPokemons(data);
      setLoading(false);
    }

    fetchData();
  }, [currentPage])


  return (
    <>
      <h1>Pokedex</h1>
      <div className="pokemon-container">
        {loading && <h3>Loading Pokemons...</h3>}
        <PokemonList pokemonList={pokemons} />
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
  )
}

export default App
