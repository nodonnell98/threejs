// these need to be accessed inside more than one function so we'll declare them first
let container;
let camera;
let controls;
let renderer;
let scene;
let mesh;
let button = document.getElementById('colourBtn');
let inputX = document.getElementById('inputX');
let rotation = 0.01;

function init() {

  container = document.querySelector( '#scene-container' );

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x02c2af );

  createCamera();
  createControls();
  createLights();
  createMeshes();
  createRenderer();

  // start the animation loop
  renderer.setAnimationLoop( () => {

    update();
    render();

  } );

}

function createCamera() {

  camera = new THREE.PerspectiveCamera(
    35, // FOV
    container.clientWidth / container.clientHeight, // aspect
    0.1, // near clipping plane
    100, // far clipping plane
  );

  camera.position.set( -15, 8, 12 );

}

function createControls() {

  controls = new THREE.OrbitControls( camera, container );

}

function createLights() {

  const ambientLight = new THREE.HemisphereLight(
    0xffffff, // sky color
    0x020020, // ground color
    4, // intensity
  );

  const mainLight = new THREE.DirectionalLight( 0xffffff, 5 );
  mainLight.position.set( 10, 10, 10 );

  scene.add( ambientLight, mainLight );

}

function createMaterials() {

  // we'll create a red materials for the body
  // and a dark grey material for the details here
  
  const body = new THREE.MeshStandardMaterial( {
    color: 0xff3333, // red
    flatShading: true,
  } );

  // just as with textures, we need to put colors into linear color space
  body.color.convertSRGBToLinear();

  const detail = new THREE.MeshStandardMaterial( {
    color: 0x333333, // darkgrey
    flatShading: true,
  } );

  detail.color.convertSRGBToLinear();

  const base = new THREE.MeshStandardMaterial( {
    color: 0xd6d5d1, //grey
    flatShading: false,
  });

  base.color.convertSRGBToLinear();

  return {

    body,
    detail,
    base,

  };



}

function createGeometries() {

  // we'll create geometries for the nose, cabin, chimney, and wheels here
  const nose = new THREE.CylinderBufferGeometry( 0.75, 0.75, 3, 12 );
  const cabin = new THREE.BoxBufferGeometry( 2, 2.25, 1.5 );
  const chimney = new THREE.CylinderBufferGeometry( 0.3, 0.1, 0.5 );
  const wheel = new THREE.CylinderBufferGeometry( 0.4, 0.4, 1.75, 16 );
  wheel.rotateX( Math.PI / 2 );
  const platform = new THREE.CylinderBufferGeometry(5, 5, 0.1, 100);


  return{
    nose,
    cabin,
    chimney,
    wheel,
    platform,
  };

}

function createMeshes() {

  const train = new THREE.Group();
  scene.add(train);

  const materials = createMaterials();
  const geometries = createGeometries();

  const nose = new THREE.Mesh( geometries.nose, materials.body );
  nose.rotation.z = Math.PI / 2;
  nose.position.x = -1;

  const cabin = new THREE.Mesh( geometries.cabin, materials.body );
  cabin.position.set( 1.5, 0.4, 0 );

  const chimney = new THREE.Mesh( geometries.chimney, materials.detail );
  chimney.position.set( -2, 0.9, 0 );

  const smallWheelRear = new THREE.Mesh( geometries.wheel, materials.detail );
  smallWheelRear.position.set( 0, -0.5, 0 );

  const smallWheelCenter = smallWheelRear.clone();
  smallWheelCenter.position.x = -1;

  const smallWheelFront = smallWheelRear.clone();
  smallWheelFront.position.x = -2;

  const bigWheel = smallWheelRear.clone();
  bigWheel.scale.set( 2, 2, 1.25 );
  bigWheel.position.set( 1.5, -0.1, 0 );

  const trainPlatform = new THREE.Mesh(geometries.platform, materials.base);
  trainPlatform.position.set(0, -0.95, 0)

  train.add(
    nose,
    cabin,
    chimney,

    smallWheelRear,
    smallWheelCenter,
    smallWheelFront,
    bigWheel,    
  );

  scene.add(trainPlatform);

 
  var colourChange = function(event) {
 
    let newColor = Math.floor(Math.random()*16777215).toString(16);
    let materialColor = "0x" + newColor.toString();
    let buttonColor = "#" + newColor.toString();
  
    materials.body.color.setHex(materialColor); // there is also setHSV and setRGB
    button.style.backgroundColor = buttonColor;
    
    }
  
    button.addEventListener('click', colourChange, false);
}

function createRenderer() {

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( container.clientWidth, container.clientHeight );

  renderer.setPixelRatio( window.devicePixelRatio );

  renderer.gammaFactor = 2.2;
  renderer.gammaOutput = true;

  renderer.physicallyCorrectLights = true;

  container.appendChild( renderer.domElement );

}

// perform any updates to the scene, called once per frame
// avoid heavy computation here
function update() {
  
scene.rotation.y += 0.005;
  
  // Don't delete this function!
  
}

// render, or 'draw a still image', of the scene
function render() {

  renderer.render( scene, camera );

}

// a function that will be called every time the window gets resized.
// It can get called a lot, so don't put any heavy computation in here!
function onWindowResize() {

  // set the aspect ratio to match the new browser window aspect ratio
  camera.aspect = container.clientWidth / container.clientHeight;

  // update the camera's frustum
  camera.updateProjectionMatrix();

  // update the size of the renderer AND the canvas
  renderer.setSize( container.clientWidth, container.clientHeight );

}

window.addEventListener( 'resize', onWindowResize );

// call the init function to set everything up
init();



  
