class MapItem {
  constructor(
    searchId = '',
    ministry = '',
    province = '',
    city = '',
    town = '',
    areaLevel = 0,
    latitude = 0,
    longitude = 0
  ) {
    this.displayId = searchId ? searchId.padEnd(12, '0') : ''
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
    if (splitted.length !== 8) {
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

  static copy(source) {
    return new MapItem(
      source.searchId,
      source.ministry,
      source.province,
      source.city,
      source.town,
      source.areaLevel,
      source.latitude,
      source.longitude
    )
  }

  static nonReactive(item) {
    let non = {}
    for (let key in item) {
      Object.defineProperty(non, key, {
        configurable: false,
        value: item[key]
      })
    }
    return non
  }
}

function funcIsMatchById(searchId) {
  return (item) => item.searchId.indexOf(searchId) === 0
}
function funcIsMatchByMinistry(searchText) {
  return (item) => item.ministry.includes(searchText)
}
function funcIsMatchByProvince(searchText) {
  return (item) => item.province.includes(searchText)
}
function funcIsMatchByCity(searchText) {
  return (item) => item.city.includes(searchText)
}
function funcIsMatchByTown(searchText) {
  return (item) => item.town.includes(searchText)
}
function funcIsMatchByKeyword(searchText) {
  return (item) =>
    item.ministry.includes(searchText) ||
    item.province.includes(searchText) ||
    item.city.includes(searchText) ||
    item.town.includes(searchText)
}

export default {
  state: () => {
    return {
      items: []
    }
  },
  getters: {
    items(state) {
      return state.items
    },
    totalCount(state) {
      return state.items.length || 0
    },
    searchCount(state) {
      return state.items.filter((item) => item.searched).length || 0
    },
    firstSearchedItem(state) {
      return state.items.find((item) => item.searched) || new MapItem()
    }
  },
  mutations: {
    updateFromCsv(state, csvData) {
      const items = []
      const lines = csvData.split('\n')
      for (const line of lines) {
        const item = MapItem.parse(line.split(','))
        if (item) {
          items.push(MapItem.nonReactive(item))
        }
      }
      console.log(items.length)
      state.items = items
    },
    search(state, searchText) {
      // 何も設定しない場合、search_idに検索をかける
      // mはじまりは、ministryに、同様に、p, c, tに関しては、province, city, townを
      // a始まりの場合、ministry, province, city, town全部にOR検索する
      // m,p,c,tの場合は、AND検索とする（複数指定の場合）
      const functions = searchText
        .split(',')
        .map((x) => {
          const commands = x
            .split(':')
            .map((x) => x.trim())
            .filter((x) => x !== '')
          console.log(commands)
          if (/^\d+$/.test(commands[0])) {
            return funcIsMatchById(commands[0])
          } else if (commands.length > 1) {
            switch (commands[0]) {
              case 'k':
                return funcIsMatchByKeyword(commands[1])
              case 'm':
                return funcIsMatchByMinistry(commands[1])
              case 'p':
                return funcIsMatchByProvince(commands[1])
              case 'c':
                return funcIsMatchByCity(commands[1])
              case 't':
                return funcIsMatchByTown(commands[1])
            }
          }
        })
        .filter((x) => x != null)
      // console.log(functions)
      // Reactiveだと、表示がおそくなるので、データをコピー、値変更している
      const result = state.items.map((item) => {
        const newItem = MapItem.copy(item)
        newItem.searched = functions.length
          ? functions.every((func) => func(newItem))
          : false
        return MapItem.nonReactive(newItem)
      })
      state.items = result
      console.log('finish')
    }
  },
  actions: {
    async downloadData({ commit }) {
      const { data } = await this.$axios.get(`${this.$axios.defaults.baseURL}data.csv`)
      commit('updateFromCsv', data)
    }
  }
}