import * as THREE from "three"

export default class GLMapView {
  constructor($canvas) {
    this.width = window.innerWidth * 2
    this.height = window.innerHeight * 2
    this.mapData = []
    this.searchedIds = []
		this.cameraFov = 60
    let cameraZpos = this.height / 2 * Math.sqrt(3)

    // レンダラ
		this.renderer = new THREE.WebGLRenderer({
      canvas: $canvas,
      // antialias: true,
      alpha: true
    })
		this.renderer.setSize(this.width, this.height)
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.domElement.style.transform = "scale(0.5)"
    this.renderer.domElement.style.transformOrigin = "left top"

		// シーン
		this.scene = new THREE.Scene()

		// カメラ
		this.camera = new THREE.PerspectiveCamera(this.cameraFov, this.width / this.height, 0.1, cameraZpos)
    this.camera.position.z = cameraZpos

    this.initGeometry()

    // 描画アップデート処理
    window.addEventListener("resize", this.resize.bind(this))
    this.loop()
  }
  loop(){
    this.render()
    requestAnimationFrame(this.loop.bind(this))
  }
	render() {
		this.renderer.render(this.scene, this.camera)
  }
	resize() {
    console.log("resize")
    this.width = window.innerWidth * 2
    this.height = window.innerHeight * 2

		this.camera.aspect = this.width / this.height
		this.camera.position.z = this.height / 2 * Math.sqrt(3)
    this.camera.updateProjectionMatrix()
    
    this.calcurateGeometry()
    
    this.renderer.setSize(this.width, this.height)
  }

  // 以下独自処理
  // FIXME 切り分ける
  showSearchData(mapData, searchedIds) {
    this.mapData = mapData
    this.searchedIds = searchedIds
    this.calcurateGeometry()
  }
  initGeometry() {
		let geometry = new THREE.BufferGeometry()
		let material = new THREE.PointsMaterial({
			size: 2,
			vertexColors: THREE.VertexColors,
			// depthTest: false,
			// transparent: true
		})
		let particle = new THREE.Points(geometry, material)
		particle.position.x = -this.width / 2
    particle.position.y = -this.height / 2
		particle.visible = false
    this.particle = particle
    
    this.scene.add(this.particle)
  }
  calcurateGeometry() {
    console.log("calcurate")
    // とりあえず各地図の表示
    let maxLat = 0,
      minLat = Number.MAX_SAFE_INTEGER,
      maxLng = 0,
      minLng = Number.MAX_SAFE_INTEGER
    
    // 検索結果にあわせる
    this.mapData.forEach(data => {
      if (!data.searched) return
      if (data.latitude > maxLat) {
        maxLat = data.latitude
      }
      if (data.latitude < minLat) {
        minLat = data.latitude
      }
      if (data.longitude > maxLng) {
        maxLng = data.longitude
      }
      if (data.longitude < minLng) {
        minLng = data.longitude
      }
    })
    if (maxLat === 0) {
      this.mapData.forEach(data => {
        if (data.latitude > maxLat) {
          maxLat = data.latitude
        }
        if (data.latitude < minLat) {
          minLat = data.latitude
        }
        if (data.longitude > maxLng) {
          maxLng = data.longitude
        }
        if (data.longitude < minLng) {
          minLng = data.longitude
        }
      })
    }
    minLat -= 80000000
    maxLat += 80000000
    console.log(maxLat, minLat, maxLng, minLng)

    let dataSize = this.mapData.length
    let longitudeCoeff = this.width / (maxLng - minLng)
    let latitudeCoeff = this.height / (maxLat - minLat)

    let coeff = Math.min(longitudeCoeff, latitudeCoeff)
		let marginLeft = (this.width - (maxLng - minLng) * coeff) / 2
    let marginTop = (this.height - (maxLat - minLat) * coeff) / 2
    
    console.log(this.width, marginLeft, this.height, marginTop, longitudeCoeff, latitudeCoeff, coeff)

    let colors = new Float32Array(dataSize * 3)
    let positions = new Float32Array(dataSize * 3)
		this.mapData.forEach((data, i) => {
      let baseId = i * 3
      // 色の設定
      colors[baseId + 0] = colors[baseId + 1] = colors[baseId + 2] = 0.7
      if (data.searched) {
        colors[baseId + 0] = 1.0
        colors[baseId + 1] = 0.0
        colors[baseId + 2] = 0.0
      }
      // 位置の設定
			positions[baseId + 0] = Math.floor(marginLeft + (data.longitude - minLng) * coeff)
			positions[baseId + 1] = Math.floor(marginTop + (data.latitude - minLat) * coeff)
			positions[baseId + 2] = 0
		})
    this.particle.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    this.particle.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    
    this.particle.position.x = -this.width / 2
		this.particle.position.y = -this.height / 2
		this.particle.visible = true
  }
}