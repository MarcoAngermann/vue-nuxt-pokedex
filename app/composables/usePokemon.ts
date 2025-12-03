import { ref } from 'vue'

export const usePokemon = () => {
  const pokemon = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchPokemon = async (limit = 20, offset = 0) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch('https://pokeapi.co/api/v2/pokemon', {
        query: { limit, offset }
      })
      
      // Detailinformationen für jedes Pokémon laden
      const detailedPokemon = await Promise.all(
        data.results.map(p => $fetch(p.url))
      )
      
      pokemon.value = detailedPokemon
    } catch (err) {
      error.value = err
      console.error('Pokemon Fehler:', err)
    } finally {
      loading.value = false
    }
  }

  return { pokemon, loading, error, fetchPokemon }
}