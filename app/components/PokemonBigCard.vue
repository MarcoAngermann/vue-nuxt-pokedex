<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
    <div class="bg-gray-800 rounded-xl max-w-4xl w-full border-2" :class="borderColor">
      <div 
        class="h-3"
        :class="headerGradient"
      ></div>
      
      <!-- Header mit Close Button -->
      <div class="flex justify-between items-center p-6 border-b border-gray-700">
        <h2 class="text-3xl font-bold text-white capitalize">{{ pokemon.name }}</h2>
        <button 
          @click="close"
          class="text-gray-400 hover:text-white text-2xl transition"
        >
          ✕
        </button>
      </div>
      
      <!-- Tab Navigation -->
      <div class="flex border-b border-gray-700 px-6">
        <button
          @click="activeTab = 'overview'"
          :class="[
            'px-6 py-3 font-bold transition-all border-b-2',
            activeTab === 'overview'
              ? 'text-white border-b-red-500'
              : 'text-gray-400 border-b-transparent hover:text-white'
          ]"
        >
          📋 Übersicht
        </button>
        <button
          @click="activeTab = 'evolution'"
          :class="[
            'px-6 py-3 font-bold transition-all border-b-2',
            activeTab === 'evolution'
              ? 'text-white border-b-red-500'
              : 'text-gray-400 border-b-transparent hover:text-white'
          ]"
        >
          🔄 Evolutionen
        </button>
      </div>
      
      <!-- Tab Content -->
      <div class="p-6">
        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'" class="animate-fadeIn">
          <div class="grid grid-cols-2 gap-6">
            <!-- Bild -->
            <div 
              class="flex items-center justify-center rounded-lg p-6"
              :class="bgColor"
            >
              <img 
                :src="pokemon.sprites?.other?.['official-artwork']?.front_default"
                :alt="pokemon.name"
                class="w-64 h-64 object-contain drop-shadow-lg"
              />
            </div>
            
            <!-- Info & Stats -->
            <div class="flex flex-col justify-between">
              <div>
                <div class="mb-4">
                  <p class="text-gray-400 text-sm mb-1">Pokédex ID</p>
                  <p class="text-2xl font-bold text-white">#{{ pokemon.id }}</p>
                </div>
                
                <!-- Types -->
                <div class="mb-4">
                  <p class="text-gray-400 text-sm mb-2">Typen</p>
                  <div class="flex gap-2">
                    <span 
                      v-for="type in pokemon.types" 
                      :key="type.type.name"
                      class="text-xs px-3 py-1 rounded font-bold text-gray-700 capitalize"
                      :class="getTypeColor(type.type.name)"
                    >
                      {{ type.type.name }}
                    </span>
                  </div>
                </div>
                
                <!-- Basis Daten -->
                <div class="mb-4">
                  <p class="text-gray-400 text-sm mb-2">Größe & Gewicht</p>
                  <p class="text-white">Höhe: <span class="font-bold">{{ (pokemon.height / 10).toFixed(1) }} m</span></p>
                  <p class="text-white">Gewicht: <span class="font-bold">{{ (pokemon.weight / 10).toFixed(1) }} kg</span></p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Stats Section -->
          <div class="mt-6 border-t border-gray-700 pt-6">
            <h3 class="text-xl font-bold text-white mb-4">Stats</h3>
            <div class="space-y-3">
              <div v-for="stat in pokemon.stats" :key="stat.stat.name" class="flex items-center gap-4">
                <span class="text-gray-400 w-20 capitalize text-sm">{{ stat.stat.name }}</span>
                <div class="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div 
                    class="h-full rounded-full transition-all"
                    :class="getStatColor(stat.base_stat)"
                    :style="{ width: (stat.base_stat / 150) * 100 + '%' }"
                  ></div>
                </div>
                <span class="text-white font-bold w-8 text-right">{{ stat.base_stat }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Evolution Tab -->
        <div v-if="activeTab === 'evolution'" class="animate-fadeIn">
          <div v-if="evolutions.length > 0">
            <div class="flex items-center justify-center gap-4 flex-wrap">
              <div v-for="(evo, index) in evolutions" :key="evo.id" class="flex items-center gap-4">
                <!-- Pokémon Karte -->
                <div class="text-center">
                  <div 
                    class="rounded-lg p-4 mb-2 w-32 h-32 flex items-center justify-center"
                    :class="getEvolutionBgColor(evo)"
                  >
                    <img 
                      :src="evo.sprites?.other?.['official-artwork']?.front_default"
                      :alt="evo.name"
                      class="w-24 h-24 object-contain drop-shadow-lg"
                    />
                  </div>
                  <p class="font-bold text-white capitalize">{{ evo.name }}</p>
                  <p class="text-xs text-gray-400">#{{ evo.id }}</p>
                  <p v-if="evo.evolutionLevel" class="text-xs text-gray-400 mt-1">Level {{ evo.evolutionLevel }}</p>
                </div>
                
                <div v-if="index < evolutions.length - 1" class="text-2xl text-gray-400">→</div>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-gray-400 py-8">
            Keine Evolutionen für dieses Pokémon vorhanden
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const typeColors = {
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  grass: 'bg-green-500',
  electric: 'bg-yellow-400',
  ice: 'bg-cyan-400',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-700',
  flying: 'bg-blue-400',
  psychic: 'bg-pink-500',
  bug: 'bg-green-600',
  rock: 'bg-gray-600',
  ghost: 'bg-purple-700',
  dragon: 'bg-indigo-600',
  dark: 'bg-gray-800',
  steel: 'bg-gray-500',
  fairy: 'bg-pink-400',
} as const

type TypeKey = keyof typeof typeColors

const props = defineProps<{
  pokemon: any
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const activeTab = ref('overview')
const evolutions = ref<any[]>([])
const loading = ref(false)

const close = () => emit('close')

const primaryType = computed(() => props.pokemon.types[0].type.name as TypeKey)

const headerGradient = computed(() => typeColors[primaryType.value] || 'bg-gray-400')
const bgColor = computed(() => 'bg-gray-700')
const borderColor = computed(() => {
  const colorMap: Record<TypeKey, string> = {
    fire: 'border-red-600',
    water: 'border-blue-600',
    grass: 'border-green-600',
    electric: 'border-yellow-500',
    ice: 'border-cyan-500',
    fighting: 'border-red-800',
    poison: 'border-purple-600',
    ground: 'border-yellow-800',
    flying: 'border-blue-500',
    psychic: 'border-pink-600',
    bug: 'border-green-700',
    rock: 'border-gray-700',
    ghost: 'border-purple-800',
    dragon: 'border-indigo-700',
    dark: 'border-gray-900',
    steel: 'border-gray-600',
    fairy: 'border-pink-500',
  }
  return colorMap[primaryType.value] || 'border-gray-600'
})

const getTypeColor = (type: string) => typeColors[type as TypeKey] || 'bg-gray-400'

const getStatColor = (value: number) => {
  if (value >= 120) return 'bg-green-500'
  if (value >= 100) return 'bg-blue-500'
  if (value >= 80) return 'bg-yellow-500'
  if (value >= 60) return 'bg-orange-500'
  return 'bg-red-500'
}

const getEvolutionBgColor = (evo: any) => {
  if (!evo.types || evo.types.length === 0) return 'bg-gray-700'
  const type = evo.types[0].type.name as TypeKey
  const colorMap: Record<TypeKey, string> = {
    fire: 'bg-red-900',
    water: 'bg-blue-900',
    grass: 'bg-green-900',
    electric: 'bg-yellow-900',
    ice: 'bg-cyan-900',
    fighting: 'bg-red-950',
    poison: 'bg-purple-900',
    ground: 'bg-yellow-950',
    flying: 'bg-blue-900',
    psychic: 'bg-pink-900',
    bug: 'bg-green-950',
    rock: 'bg-gray-900',
    ghost: 'bg-purple-950',
    dragon: 'bg-indigo-900',
    dark: 'bg-gray-950',
    steel: 'bg-gray-900',
    fairy: 'bg-pink-900',
  }
  return colorMap[type] || 'bg-gray-700'
}

// ID sicher aus URL extrahieren
const getIdFromUrl = (url?: string) => {
  if (!url) return NaN
  const parts = url.split('/').filter(Boolean)
  const lastPart = parts[parts.length - 1] || '0' // fallback, falls undefined
  return parseInt(lastPart)
}

watch(() => props.pokemon, async (newPokemon) => {
  if (newPokemon && activeTab.value === 'evolution') await loadEvolutions(newPokemon)
})

watch(activeTab, async (newTab) => {
  if (newTab === 'evolution' && evolutions.value.length === 0) await loadEvolutions(props.pokemon)
})

const loadEvolutions = async (pokemon: any) => {
  try {
    loading.value = true
    evolutions.value = []

    const speciesData = await $fetch<any>(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`)
    if (!speciesData.evolution_chain) return

    const chainData = await $fetch<any>(speciesData.evolution_chain.url)
    const chain = chainData.chain

    const collectEvolutions = (chainNode: any) => {
      if (!chainNode.evolves_to) return
      for (const evo of chainNode.evolves_to) {
        const evoId = getIdFromUrl(evo.species.url)
        evolutions.value.push({
          id: evoId,
          name: evo.species.name,
          evolutionLevel: evo.evolution_details?.[0]?.min_level ?? null
        })
        collectEvolutions(evo)
      }
    }

    collectEvolutions(chain)

    const evolutionDetails = await Promise.all(
      evolutions.value.map(evo => $fetch<any>(`https://pokeapi.co/api/v2/pokemon/${evo.id}`))
    )

    evolutions.value = evolutions.value.map((evo, index) => ({
      ...evo,
      ...evolutionDetails[index]
    }))

  } catch (err) {
    console.error('Fehler beim Laden der Evolutionen:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-in;
}
</style>

