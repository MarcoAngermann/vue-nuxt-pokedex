<template>
  <div class="min-h-screen bg-gray-950 p-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-7xl font-bold mb-8 text-center text-gray-700">Pokédex</h1>
      
      <!-- Suchfeld -->
      <div class="mb-8 flex justify-center">
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="Pokémon suchen (mind. 3 Buchstaben, z.B. 'Pika')..."
          class="w-full max-w-md px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border-2 border-gray-700 focus:border-red-500 focus:outline-none transition"
        />
      </div>
      
      <div v-if="loading && displayedPokemon.length === 0" class="text-center text-lg text-gray-400">⏳ Lade Pokémon...</div>
      <div v-else-if="error" class="text-center text-red-400">Fehler beim Laden</div>
      <div v-else-if="displayedPokemon.length === 0 && searchQuery" class="text-center text-gray-400">
        Keine Pokémon gefunden für "{{ searchQuery }}"
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <PokemonCard 
          v-for="p in displayedPokemon" 
          :key="p.id"
          :pokemon="p"
        />
      </div>
      
      <!-- Sentinel Element nur zeigen, wenn nicht gesucht wird -->
      <div v-if="hasMore && !searchQuery" ref="sentinel" class="col-span-full h-10 mt-8"></div>
      
      <!-- Loading Indicator -->
      <div v-if="loading && displayedPokemon.length > 0" class="text-center mt-8 text-gray-400">
        ⏳ Lade mehr Pokémon...
      </div>
      
      <!-- Ende erreicht -->
      <div v-if="!hasMore && displayedPokemon.length > 0 && !searchQuery" class="text-center mt-8 text-gray-400">
        ✅ Alle Pokémon geladen!
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Pokemon {
  name: string
  id: number
  [key: string]: any
}

const { pokemon, loading, error, fetchPokemon, hasMore, searchQuery, loadAllPokemonNames, isSearching, allPokemon } = usePokemon()
const sentinel = ref<HTMLElement | null>(null)
const searchResults = ref<Pokemon[]>([])

const displayedPokemon = computed(() => {
  return searchQuery.value && searchQuery.value.length >= 3 ? searchResults.value : pokemon.value
})

// Beobachte searchQuery und führe Suche durch
watch(searchQuery, async (newQuery) => {
  if (newQuery && newQuery.length >= 3) {
    const results = await searchPokemonLocal(newQuery)
    searchResults.value = results
  } else {
    searchResults.value = []
  }
})

const searchPokemonLocal = async (query: string) => {
  const matches = allPokemon.value.filter(p =>
    p.name.toLowerCase().startsWith(query.toLowerCase())
  )
  
  return await Promise.all(
    matches.slice(0, 20).map(p => $fetch(p.url))
  )
}

onMounted(async () => {
  await loadAllPokemonNames()  // ← Lade alle Namen beim Start
  fetchPokemon()
  
  nextTick(() => {
    if (sentinel.value) {
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0]
          if (entry && entry.isIntersecting && hasMore.value && !loading.value && !searchQuery.value) {
            console.log('Loading more Pokemon...')
            fetchPokemon(true)
          }
        },
        { threshold: 0.1, rootMargin: '100px' }
      )
      
      observer.observe(sentinel.value)
      
      onBeforeUnmount(() => {
        observer.disconnect()
      })
    }
  })
})
</script>

