<template>
  <canvas ref="canvas"></canvas>
</template>

<script lang="ts" setup>
import TheGame from '@/core/TheGame';
import { ref, onMounted } from 'vue';

const canvas = ref<HTMLCanvasElement>();

onMounted(() => {
  if (!canvas.value) return;
  const game = new TheGame(canvas.value);
  game.start();
});
</script>

<style scoped lang="scss">
canvas {
  width: 100%;
  height: 100vh;
  display: block;
}
.fps {
  position: absolute;
  left: 0;
  top: 0;
  font-size: 20px;
}
</style>
