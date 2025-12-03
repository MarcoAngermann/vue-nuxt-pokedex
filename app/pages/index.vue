<template>
  <div class="min-h-screen bg-gradient-to-b from-red-50 to-blue-50 p-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-4xl font-bold mb-12 text-center text-gray-800">Pokédex</h1>
      
      <div v-if="loading" class="text-center text-lg text-gray-600">⏳ Lade Pokémon...</div>
      <div v-else-if="error" class="text-center text-red-500">Fehler beim Laden</div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-center">
        <PokemonCard 
          v-for="p in pokemon" 
          :key="p.name"
          :pokemon="p"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { pokemon, loading, error, fetchPokemon } = usePokemon()

onMounted(() => {
  fetchPokemon(20)
})
</script>

