import { ref, computed } from 'vue'

export const usePokemon = () => {
  const pokemon = ref<Array<any>>([])
  const allPokemon = ref<Array<any>>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const offset = ref(0)
  const limit = 20
  const hasMore = ref(true)
  const searchQuery = ref('')
  const isSearching = ref(false)

  const loadAllPokemonNames = async () => {
    try {
      const data = await $fetch<{ results: Array<{ name: string, url: string }>, count: number }>('https://pokeapi.co/api/v2/pokemon', {
        query: { limit: 10000 } 
      })
      allPokemon.value = data.results
    } catch (err) {
      console.error('Fehler beim Laden der Namen:', err)
    }
  }

  const fetchPokemon = async (loadMore = false) => {
    if (loading.value) return
    
    loading.value = true
    error.value = null
    
    try {
      const data = await $fetch<{ results: Array<{ url: string }>, count: number }>('https://pokeapi.co/api/v2/pokemon', {
        query: { limit, offset: offset.value }
      })
      
      const detailedPokemon = await Promise.all(
        data.results.map(p => $fetch(p.url))
      )
      
      if (loadMore) {
        pokemon.value = [...pokemon.value, ...detailedPokemon]
      } else {
        pokemon.value = detailedPokemon
      }
      
      offset.value += limit
      hasMore.value = offset.value < data.count
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      console.error('Pokemon Fehler:', err)
    } finally {
      loading.value = false
    }
  }

  const searchPokemon = async (query: string) => {
    if (!query || query.length < 3) return []
    
    isSearching.value = true
    
    try {
      // Finde Pokémon, deren Namen mit der Suchanfrage beginnen
      const matches = allPokemon.value.filter(p =>
        p.name.toLowerCase().startsWith(query.toLowerCase())
      )
      
      // Lade Details für gefundene Pokémon
      const detailed = await Promise.all(
        matches.map(p => $fetch(p.url))
      )
      
      return detailed
    } catch (err) {
      console.error('Such-Fehler:', err)
      return []
    } finally {
      isSearching.value = false
    }
  }

  const filteredPokemon = computed(async () => {
    if (!searchQuery.value || searchQuery.value.length < 3) {
      return pokemon.value
    }
    
    return await searchPokemon(searchQuery.value)
  })

  return { 
    pokemon, 
    filteredPokemon, 
    loading, 
    error, 
    fetchPokemon, 
    hasMore, 
    searchQuery,
    loadAllPokemonNames,
    isSearching,
    allPokemon
  }
}