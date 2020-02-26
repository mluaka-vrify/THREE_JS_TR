(() => {
  // -- create a canvas and render it
  const canvas = document.getElementById('c')
  const renderer = new THREE.WebGLRenderer({ canvas })

  // -- setting up the camera's perspective
  const camera = _getCamera(75, 2, 0.1, 5)

  // -- setting up the scene
  const scene = new THREE.Scene()
  const createCube = _cubeCreator(scene)

  // -- create a box
  const geometry = _getGeometry(1, 1, 1)

  // -- create a light object
  const light = _getLighting(0xFFFFFF, 1)

  // -- add objects to the scene
  scene.add(light)
  const cubes = [
    createCube(geometry, 0x44aa88, 0),
    createCube(geometry, 0x8844aa, -2),
    createCube(geometry, 0xaa8844, 2)
  ]

  // -- render everything
  requestAnimationFrame(_render(renderer, scene, camera, cubes))
})()

function _render (renderer, scene, camera, cubes) {
  return function (time) {
    // -- convert time to seconds
    time *= 0.001

    if (_resizeRendererToDisplay(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }

    cubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * .1
      const rot = time * speed

      cube.rotation.x = rot
      cube.rotation.y = rot
    })

    renderer.render(scene, camera)
    requestAnimationFrame(_render(renderer, scene, camera, cubes))
  }
}

function _cubeCreator (scene) {
  return function (geometry, color, x /** x value on the x-axis (controls side to side movements) */) {
    const material = new THREE.MeshPhongMaterial({ color })
    const cube = new THREE.Mesh(geometry, material)

    scene.add(cube)

    cube.position.x = x

    return cube
  }
}

function _getCamera (fov, aspect, near, far) {
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.z = 2

  return camera
}

function _getLighting (color, intensity) {
  const light = new THREE.DirectionalLight(color, intensity)
  light.position.set(-1, 2, 4)

  return light
}

function _getGeometry (w, h, d) {
  return new THREE.BoxGeometry(w, h, d)
}

function _resizeRendererToDisplay (renderer) {
  const canvas = renderer.domElement
  const pixelRatio = window.devicePixelRatio
  const width = canvas.clientWidth * pixelRatio | 0
  const height = canvas.clientHeight * pixelRatio | 0
  const needResize = canvas.width !== width || canvas.height !== height

  if (needResize) {
    renderer.setSize(width, height, false)
  }

  return needResize
}