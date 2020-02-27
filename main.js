(() => {
  // -- initialization
  const scene = new THREE.Scene()
  const canvas = document.getElementById('c')
  const renderer = new THREE.WebGLRenderer({ canvas })  
  
  // -- create a re-usable sphere blueprint
  const sphereGeometry = new THREE.SphereBufferGeometry(1, 6, 6)

  const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xFFFF00 })
  const sunMesh = _getSun(sphereGeometry, sunMaterial)

  const earthMaterial = new THREE.MeshPhongMaterial({ color: 0x2233FF, emissive: 0x112244 })
  const earthMesh = _getEarth(sphereGeometry, earthMaterial)

  // -- setting up the camera's perspective
  const camera = _getCamera(40, 2, 0.1, 1000)

  // -- create a light object
  const light = new THREE.PointLight(0xFFFFFF, 3)

  // -- add objects to the scene
  scene.add(light)
  scene.add(sunMesh)
  scene.add(earthMesh)

  // -- render everything
  requestAnimationFrame(_render(
    renderer,
    scene,
    camera,
    time => [sunMesh, earthMesh].forEach(obj => (obj.rotation.y = time))
  ))
})()

function _render (renderer, scene, camera, cb) {
  function resizeRendererToDisplay () {
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

  return function (time) {
    // -- convert time to seconds
    time *= 0.001

    if (resizeRendererToDisplay()) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }

    cb(time)
    renderer.render(scene, camera)
    requestAnimationFrame(_render(renderer, scene, camera, cb))
  }
}

function _getCamera (fov, aspect, near, far) {
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.set(0, 50, 0)
  camera.up.set(0, 0, 1)
  camera.lookAt(0, 0, 0)

  return camera
}

function _getSun(geometry, material) {
  const sunMesh = new THREE.Mesh(geometry, material)
  sunMesh.scale.set(5, 5, 5)
  return sunMesh
}

function _getEarth(geometry, material) {
  const earthMesh = new THREE.Mesh(geometry, material)
  earthMesh.position.x = 10
  return earthMesh
}
