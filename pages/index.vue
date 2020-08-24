<template>
  <div class="container">
    <!-- 使い方の表示エリア -->
    <!-- 検索ワード入力エリア -->
    <div class="search-bar">
      <input
        class="search-word"
        placeholder="110101002(area code), k: Keyword, m: Ministry Name, p:, c:, t:"
        @keyup="searchMap"
      />
    </div>
    <!-- 検索結果表示エリア -->
    <div class="search-result">
      <p>
        <span class="search-result-title">Result:</span> {{ searchCount }} /
        {{ totalCount }}
      </p>
      <p>
        <span class="search-result-title">Area Code:</span>
        {{ firstSearchedItem.displayId }}
      </p>
      <p>
        <span class="search-result-title">Ministry:</span>
        {{ firstSearchedItem.ministry }}
      </p>
      <p>
        <span class="search-result-title">Province:</span>
        {{ firstSearchedItem.province }}
      </p>
      <p>
        <span class="search-result-title">City:</span>
        {{ firstSearchedItem.city }}
      </p>
      <p>
        <span class="search-result-title">Town:</span>
        {{ firstSearchedItem.town }}
      </p>
      <p>
        <span class="search-result-title">Latitude:</span>
        {{ firstSearchedItem.showLatitude.toFixed(7) }}
      </p>
      <p>
        <span class="search-result-title">Longitude:</span>
        {{ firstSearchedItem.showLongitude.toFixed(7) }}
      </p>
    </div>

    <!-- 地図データ表示エリア -->
    <the-map-view :map-items="mapItems" />
  </div>
</template>

<script>
import TheMapView from '~/components/TheMapView.vue'

export default {
  components: {
    TheMapView
  },
  computed: {
    mapItems() {
      return this.$store.getters['items']
    },
    totalCount() {
      return this.$store.getters['totalCount']
    },
    searchCount() {
      return this.$store.getters['searchCount']
    },
    firstSearchedItem() {
      return this.$store.getters['firstSearchedItem']
    }
  },
  async mounted() {
    this.$store.dispatch('downloadData')
  },
  methods: {
    searchMap() {
      this.$store.commit('search', event.target.value)
    }
  },
  head() {
    return {
      title: 'Chinese Map Search',
      meta: [
        { name: 'twitter:title', content: 'Chinese Map Search' },
        {
          name: 'twitter:description',
          content: 'Search chinese map by areacode'
        },
        { name: 'twitter:image', content: 'https://i.imgur.com/UYP2umJ.png' },
        { name: 'twitter:card', content: 'summary_large_image' }
      ]
    }
  }
}
</script>

<style scoped>
.search-result {
  margin: 0 20px;
}
.search-result-title {
  width: 100px;
  display: inline-block;
  text-align: right;
  vertical-align: bottom;
}
.search-bar {
  width: 100%;
  padding: 0 20px;
}
.search-word {
  display: inline-block;

  width: 100%;
  border: 0px;
  border-bottom: 1px solid #000000;

  font-family: 'Courier New', monospace;
}
.search-word:focus {
  outline: none;
  border: 1px solid #000000;
}
</style>
