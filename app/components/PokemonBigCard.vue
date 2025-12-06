<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
    <div class="bg-gray-800 rounded-xl max-w-2xl w-full border-2" :class="borderColor">
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
      
      <!-- Content -->
      <div class="p-6 grid grid-cols-2 gap-6">
        <!-- Bild -->
        <div 
          class="flex items-center justify-center rounded-lg p-6"
          :class="bgColor"
        >
          <img 
            :src="pokemon.sprites.other['official-artwork'].front_default"
            :alt="pokemon.name"
            class="w-64 h-64 object-contain drop-shadow-lg"
          />
        </div>
        
        <!-- Info & Stats -->
        <div class="flex flex-col justify-between">
          <!-- Basis-Info -->
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
      <div class="px-6 pb-6 border-t border-gray-700 pt-6">
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
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

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

const close = () => {
  emit('close')
}

const primaryType = computed(() => {
  return props.pokemon.types[0].type.name as TypeKey
})

const headerGradient = computed(() => {
  const colorClass = typeColors[primaryType.value] || 'bg-gray-400'
  return colorClass
})

const bgColor = computed(() => {
  return 'bg-gray-700'
})

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

const getTypeColor = (type: string) => {
  return typeColors[type as TypeKey] || 'bg-gray-400'
}

const getStatColor = (value: number) => {
  if (value >= 120) return 'bg-green-500'
  if (value >= 100) return 'bg-blue-500'
  if (value >= 80) return 'bg-yellow-500'
  if (value >= 60) return 'bg-orange-500'
  return 'bg-red-500'
}
</script>