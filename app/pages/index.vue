<template>
  <div class="min-h-screen bg-gray-950 p-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-7xl font-bold mb-12 text-center text-gray-500">Pokédex</h1>
      
      <div v-if="loading && pokemon.length === 0" class="text-center text-lg text-gray-400">⏳ Lade Pokémon...</div>
      <div v-else-if="error" class="text-center text-red-400">Fehler beim Laden</div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <PokemonCard 
          v-for="p in pokemon" 
          :key="p.id"
          :pokemon="p"
        />
      </div>
      
      
      <div v-if="hasMore" ref="sentinel" class="col-span-full h-10 mt-8"></div>
      
     
      <div v-if="loading && pokemon.length > 0" class="text-center mt-8 text-gray-400">
        ⏳ Lade mehr Pokémon...
      </div>
      
      
      <div v-if="!hasMore && pokemon.length > 0" class="text-center mt-8 text-gray-400">
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

const { pokemon, loading, error, fetchPokemon, hasMore } = usePokemon()
const sentinel = ref<HTMLElement | null>(null)

onMounted(() => {
  fetchPokemon()
  
  
  nextTick(() => {
    if (sentinel.value) {
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0]
          if (entry && entry.isIntersecting && hasMore.value && !loading.value) {
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

