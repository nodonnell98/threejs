// these need to be accessed inside more than one function so we'll declare them first
let container;
let camera;
let controls;
let renderer;
let scene;
let animationSpeed = 1;
const speedInput = document.getElementById("speedInput");
const mixers = [];
const clock = new THREE.Clock();

let button = document.getElementById('colourBtn');

function init() {

  container = document.querySelector( '#scene-container' );

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x02c2af );

  createCamera();
  createControls();
  createLights();
  createRenderer();
  loadModels();

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

camera.position.set( -20, 15, 40 );

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



function loadModels() {

  // ready and waiting for your code!
  const loader = new THREE.GLTFLoader();

  const onLoad = ( gltf, position ) => {

    const model = gltf.scene.children[ 0 ];
    model.position.copy( position );
    

    const animation = gltf.animations[ 0 ];

    const mixer = new THREE.AnimationMixer( model );
    mixers.push( mixer );

    const action = mixer.clipAction( animation );
    action.play();

    model.scale.set(0.1, 0.1, 0.1);

    scene.add( model );

  };

  // the loader will report the loading progress to this function
  const onProgress = () => {};

  // the loader will send any error messages to this function, and we'll log
  // them to to console
  const onError = ( errorMessage ) => { console.log( errorMessage ); };

  const parrotPosition = new THREE.Vector3( -5, 0, 10 );
  loader.load('models/Parrot.glb', gltf => onLoad( gltf, parrotPosition ), onProgress, onError );

  const flamingoPosition = new THREE.Vector3( 5, 5, 0 );
  loader.load('models/Flamingo.glb', gltf => onLoad( gltf, flamingoPosition ), onProgress, onError );

  const storkPosition = new THREE.Vector3( -10, 5, -10 );
  loader.load('models/Stork.glb', gltf => onLoad( gltf, storkPosition ), onProgress, onError );

  
  
  
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
  // Don't delete this function!

  const delta = clock.getDelta();

  for(const mixer of mixers){
    mixer.update(delta*animationSpeed);
  }
  
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



/*speedInput.addEventListener('change', event => {
 animationSpeed = parseFloat(speedInput.value);
});*/

  
