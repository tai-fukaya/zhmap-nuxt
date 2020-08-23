<template>
  <canvas class="map-view" ref="canvas" ></canvas>
</template>

<script>
import GLMapView from './js/GLMapView'

// https://qiita.com/misaki_mofu/items/145ac26d600b429a6f8a
export default {
  props: {
    mapData: Array
  },
  mounted() {
    this.canvas = new GLMapView(this.$refs.canvas)
  },
  watch: {
    "mapData": function(n, o) {
      this.canvas.showSearchData(n, this.$props.searchedIds)
    }
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