<template>
  <div class="container">

    <!-- 使い方の表示エリア -->
    <!-- 検索ワード入力エリア -->
    <div class="search-bar">
      <input v-model="searchWord" @keyup="searchMapData" placeholder="110101002(area code), k: Keyword, m: Ministry Name, p:, c:, t:" class="search-word">
    </div>
    <!-- 検索結果表示エリア -->
    <div class="search-result">
      <p><span class="search-result-title">Result:</span> {{searchCount}} / {{mapData.length}}</p>
      <p><span class="search-result-title">Area Code:</span> {{firstSearchedData.displayId}}</p>
      <p><span class="search-result-title">Ministry:</span> {{firstSearchedData.ministry}}</p>
      <p><span class="search-result-title">Province:</span> {{firstSearchedData.province}}</p>
      <p><span class="search-result-title">City:</span> {{firstSearchedData.city}}</p>
      <p><span class="search-result-title">Town:</span> {{firstSearchedData.town}}</p>
      <p><span class="search-result-title">Latitude:</span> {{firstSearchedData.showLatitude.toFixed(7)}}</p>
      <p><span class="search-result-title">Longitude:</span> {{firstSearchedData.showLongitude.toFixed(7)}}</p>
    </div>

    <!-- 地図データ表示エリア -->
    <the-map-view :map-data="mapData" />
  </div>
</template>

<script>
import TheMapView from '~/components/TheMapView.vue'

class MapItem {
  constructor(
    searchId = "",
    ministry = "",
    province = "",
    city = "",
    town = "",
    areaLevel = 0,
    latitude = 0,
    longitude = 0
  ) {
    this.displayId = searchId ? searchId.padEnd('0', 12) : ''
    this.searchId = searchId
    this.ministry = ministry
    this.province = province
    this.city = city
    this.town = town
    this.areaLevel = areaLevel
    this.latitude = latitude
    this.longitude = longitude
    this.showLatitude = latitude / 10000000
    this.showLongitude = longitude / 10000000
    this.searched = false
  }
  static parse(splitted) {
    if (splitted.length != 8) {
      console.log('error', splitted)
      return
    }
    return new MapItem(
      splitted[0],
      splitted[1],
      splitted[2],
      splitted[3],
      splitted[4],
      parseInt(splitted[5]),
      parseInt(splitted[6]),
      parseInt(splitted[7])
    )
  }
}
export default {
  head() {
    return {
      title: 'Chinese Map Search',
      meta: [
        { name: 'twitter:title', content: 'Chinese Map Search'},
        { name: 'twitter:description', content: 'Search chinese map by areacode'},
        { name: 'twitter:image', content: 'https://i.imgur.com/UYP2umJ.png'},
        { name: 'twitter:card', content: 'summary_large_image'}
      ]
    }
  },
  components: {
    TheMapView
  },
  data: () => {
    return {
      searchWord: "",
      mapData: [], // これ自体は更新チェックの対象から外したい
    }
  },
  async mounted() {
    // 遅延読み込みでいいので、createdでやってもいいかも？
    const {data} = await this.getCsvData()
    const mapData = this.csvToMapData(data)
    this.$data.mapData = mapData
  },
  computed: {
    searchCount() {
      return this.$data.mapData.filter(item => item.searched).length
    },
    firstSearchedData() {
      return this.$data.mapData.find(item => item.searched) || new MapItem()
    }
  },
  methods: {
    async getCsvData() {
      return await this.$axios.get(`${this.$axios.defaults.baseURL}data.csv`)
    },
    // FIXME store のほうに移す
    csvToMapData(csvData) {
      let items = []
      let lines = csvData.split('\n')
      for (let line of lines) {
        let item = MapItem.parse(line.split(','))
        if (item) {
          items.push(item)
        }
      }
      return items
    },
    searchMapData() {
      // 何も設定しない場合、search_idに検索をかける
      // mはじまりは、ministryに、同様に、p, c, tに関しては、province, city, townを
      // a始まりの場合、ministry, province, city, town全部にOR検索する
      // m,p,c,tの場合は、AND検索とする（複数指定の場合）
      let functions = event.target.value.split(',').map(x => {
        let commands = x.split(':').map(x => x.trim()).filter(x => x !== '')
        // console.log(commands)
        if (/^\d+$/.test(commands[0])) {
          return this.funcIsMatchById(commands[0])
        } else if (commands.length > 1) {
          switch(commands[0]) {
            case 'k':
              return this.funcIsMatchByKeyword(commands[1])
            case 'm':
              return this.funcIsMatchByMinistry(commands[1])
            case 'p':
              return this.funcIsMatchByProvince(commands[1])
            case 'c':
              return this.funcIsMatchByCity(commands[1])
            case 't':
              return this.funcIsMatchByTown(commands[1])
          }
        }
        return
      }).filter(x => x != null)
      // console.log(functions)
      let result = this.$data.mapData.map(item => {
        item.searched = functions.length ? functions.every(func => func(item)) : false
        return item
      })
      this.$data.mapData = result
    },
    funcIsMatchById(searchId) {
      return item => item.searchId.indexOf(searchId) === 0
    },
    funcIsMatchByMinistry(searchText) {
      return item => item.ministry.indexOf(searchText) >= 0
    },
    funcIsMatchByProvince(searchText) {
      return item => item.province.indexOf(searchText) >= 0
    },
    funcIsMatchByCity(searchText) {
      return item => item.city.indexOf(searchText) >= 0
    },
    funcIsMatchByTown(searchText) {
      return item => item.town.indexOf(searchText) >= 0
    },
    funcIsMatchByKeyword(searchText) {
      return item => item.ministry.indexOf(searchText) >= 0
        || item.province.indexOf(searchText) >= 0
        || item.city.indexOf(searchText) >= 0
        || item.town.indexOf(searchText) >= 0
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
  width:100%;
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
