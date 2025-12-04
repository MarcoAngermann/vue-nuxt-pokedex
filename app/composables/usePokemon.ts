import { ref } from 'vue'

export const usePokemon = () => {
  const pokemon = ref<Array<any>>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const offset = ref(0)
  const limit = 20
  const hasMore = ref(true)

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

  return { pokemon, loading, error, fetchPokemon, hasMore }
}