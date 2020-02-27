import * as dat from 'dat.gui'
import * as THREE from 'three'
import GenerateOrbitalControls from 'three-orbit-controls'

/**
 * 1) create a renderer
 * 2) create a scene & a camera
 * 3) create geometric object & its material
 * 4) create a mesh by using results from step 3
 * 5) add mesh object to the scene
 * 6) renderer scene with its camera(s)
 */

(() => { // -- init function
  // -- scene === a container for every object you will be rendering
  const gui = new dat.GUI()
  const scene = new THREE.Scene()
  const camera = getCamera()
  const light = getPointLight(1)
  const renderer = getRendererScene()

  // -- every time you are creating an object in Threejs, you must add it to the scene in order to see it
  scene.add(getPlane(20))
  scene.add(getBox(1, 1, 1))
  light.add(getSphere(0.05)) 
  scene.add(light)

  gui.add(light, 'intensity', 0, 10)
  gui.add(light.position, 'y', 0, 5)

  // -- enables camera movements
  const OrbitalControls = GenerateOrbitalControls(THREE)
  const controls = new OrbitalControls(camera, renderer.domElement)

  update(renderer, camera, scene, controls)
})()

function update(renderer, camera, scene, controls) {
  renderer.render(scene, camera)
  controls.update()
  requestAnimationFrame(() => update(renderer, camera, scene, controls))
}

function getRendererScene() {
  const renderer = new THREE.WebGLRenderer()
  renderer.shadowMap.enabled = true
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor('rgb(120, 120, 120)')
  document.getElementById('c').appendChild(renderer.domElement)

  return renderer
}

function getCamera() {
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth/window.innerHeight,
    1,
    1000
  )

  camera.position.set(1, 2, 5)
  camera.lookAt(new THREE.Vector3(0, 0, 0))

  return camera
}

function getBox(w, h, d, color = 'rgb(120, 120, 120)') {
  const geometry = new THREE.BoxGeometry(w, h, d)
  const material = new THREE.MeshPhongMaterial({ color })
  const mesh = new THREE.Mesh(geometry, material)
  
  mesh.castShadow = true
  mesh.position.y = mesh.geometry.parameters.height/2

  return mesh
}

function getSphere(size) {
  const geometry = new THREE.SphereGeometry(size, 24, 24)
  const material = new THREE.MeshBasicMaterial({ color: 'rgb(255, 255, 255)' })
  const mesh = new THREE.Mesh(geometry, material)
  
  // mesh.position.y = mesh.geometry.parameters.height/2

  return mesh
}

function getPlane(size, color = 'rgb(120, 120, 120)') {
  const geometry = new THREE.PlaneGeometry(size, size)
  const material = new THREE.MeshPhongMaterial({ color, side: THREE.DoubleSide })
  const mesh = new THREE.Mesh(geometry, material)
  
  mesh.receiveShadow = true
  mesh.rotation.x = Math.PI/2

  return mesh
}

function getPointLight(intensity) {
  const light = new THREE.PointLight(0xffffff, intensity)
  light.castShadow = true
  light.position.y = 1.5

  return light
}
