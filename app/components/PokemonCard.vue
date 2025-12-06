<template>
  <div 
    class="bg-gray-800 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer overflow-hidden border-2"
    :class="borderColor"
    @click="openBigCard"
  >
    <div 
      class="h-2"
      :class="headerGradient"
    ></div>
    
    <div 
      class="p-6 flex items-center justify-center h-48"
      :class="bgColor"
    >
      <img 
        :src="pokemon.sprites.other['official-artwork'].front_default"
        :alt="pokemon.name"
        class="w-40 h-40 object-contain drop-shadow-lg"
      />
    </div>
    
    <div class="p-4 text-center border-t border-gray-700">
      <p class="capitalize font-bold text-lg text-white">{{ pokemon.name }}</p>
      <p class="text-xs text-gray-400 mt-1">#{{ pokemon.id }}</p>
      <div class="flex gap-2 justify-center mt-2">
        <span 
          v-for="type in pokemon.types" 
          :key="type.type.name"
          class="text-xs px-2 py-1 rounded font-bold text-gray-700 capitalize"
          :class="getTypeColor(type.type.name)"
        >
          {{ type.type.name }}
        </span>
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
}>()

const emit = defineEmits<{
  openCard: [pokemon: any]
}>()

const primaryType = props.pokemon.types[0].type.name as TypeKey

const headerGradient = computed(() => {
  const colorClass = typeColors[primaryType] || 'bg-gray-400'
  return colorClass
})

const bgColor = computed(() => {
  const type = primaryType as TypeKey
  const colorMap: Record<TypeKey, string> = {
    fire: 'bg-gray-700',
    water: 'bg-gray-700',
    grass: 'bg-gray-700',
    electric: 'bg-gray-700',
    ice: 'bg-gray-700',
    fighting: 'bg-gray-700',
    poison: 'bg-gray-700',
    ground: 'bg-gray-700',
    flying: 'bg-gray-700',
    psychic: 'bg-gray-700',
    bug: 'bg-gray-700',
    rock: 'bg-gray-700',
    ghost: 'bg-gray-700',
    dragon: 'bg-gray-700',
    dark: 'bg-gray-700',
    steel: 'bg-gray-700',
    fairy: 'bg-gray-700',
  }
  return colorMap[type] || 'bg-gray-700'
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
  return colorMap[primaryType] || 'border-gray-600'
})

const getTypeColor = (type: string) => {
  return typeColors[type as TypeKey] || 'bg-gray-400'
}

const openBigCard = () => {
  emit('openCard', props.pokemon)
}
</script>