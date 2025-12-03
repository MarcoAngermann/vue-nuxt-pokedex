<template>
  <div 
    class="bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer overflow-hidden border-2"
    :class="borderColor"
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
    
    <div class="p-4 text-center border-t border-gray-100">
      <p class="capitalize font-bold text-lg text-gray-800">{{ pokemon.name }}</p>
      <p class="text-xs text-gray-500 mt-1">#{{ pokemon.id }}</p>
      <div class="flex gap-2 justify-center mt-2">
        <span 
          v-for="type in pokemon.types" 
          :key="type.type.name"
          class="text-xs px-2 py-1 rounded text-white capitalize"
          :class="getTypeColor(type.type.name)"
        >
          {{ type.type.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

const primaryType = props.pokemon.types[0].type.name as TypeKey

const headerGradient = computed(() => {
  const color = typeColors[primaryType] || 'bg-gray-400'
  return `bg-gradient-to-r from-${color.split('-')[1]}-400 to-${color}`
})

const bgColor = computed(() => {
  const color = typeColors[primaryType] || 'bg-gray-100'
  return `bg-gradient-to-br from-${color.split('-')[1]}-50 to-${color.split('-')[1]}-100`
})

const borderColor = computed(() => {
  const color = typeColors[primaryType] || 'border-gray-100'
  return `border-${color.split('-')[1]}-200`
})

const getTypeColor = (type: string) => {
  return typeColors[type as TypeKey] || 'bg-gray-400'
}
</script>