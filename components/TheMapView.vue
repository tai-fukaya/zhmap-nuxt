<template>
  <canvas ref="canvas" class="map-view"></canvas>
</template>

<script>
import GLMapView from './js/GLMapView'

// https://qiita.com/misaki_mofu/items/145ac26d600b429a6f8a
export default {
  props: {
    mapItems: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    mapItems(n, o) {
      this.canvas.showSearchResult(n, this.$props.searchedIds)
    }
  },
  mounted() {
    this.canvas = new GLMapView(this.$refs.canvas)
  }
}
</script>

<style scoped>
.map-view {
  width: 100%;

  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
}
</style>
