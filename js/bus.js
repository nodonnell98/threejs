// these need to be accessed inside more than one function so we'll declare them first
let container;
let camera;
let controls;
let renderer;
let scene;
const people = new THREE.Group();
let mixer;
let clock = new THREE.Clock();
var raycaster, mouse = {
  x: 0,
  y: 0
};

function init() {

  container = document.querySelector('#scene-container');

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xbef8f8);

  createCamera();
  createControls();
  createLights();
  loadModels();
  createMeshes();
  createRenderer();
  

  raycaster = new THREE.Raycaster();
  renderer.domElement.addEventListener('click', raycast, false);

  renderer.setAnimationLoop(() => {

    update();
    render();

  });

}

function raycast(e) {
  // Step 1: Detect light helper
  //1. sets the mouse position with a coordinate system where the center
  //   of the screen is the origin
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  //2. set the picking ray from the camera position and mouse coordinates
  raycaster.setFromCamera(mouse, camera);

  //3. compute intersections (note the 2nd parameter)
  var intersects = raycaster.intersectObjects(scene.children, true);


  if (intersects[0].object.name == "vw-transporter-van-free-download_2") {
    console.log("van");
  } else if (intersects[0].object.parent.name == "Harry") {
    console.log("person")
    personAnimation();
  } else {
    console.log("ground");
  }

}


function createCamera() {

  camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(-10, 6, 8);

}

function createControls() {

  controls = new THREE.OrbitControls(camera, container);

}

function createLights() {

  const ambientLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 5);

  const mainLight = new THREE.DirectionalLight(0xffffff, 5);
  mainLight.position.set(10, 10, 10);

  scene.add(ambientLight, mainLight);

}

function createMaterials() {

  const grassMat = new THREE.MeshStandardMaterial({
    color: 0x26b02e, // green
    flatShading: true,
  });

  // just as with textures, we need to put colors into linear color space
  grassMat.color.convertSRGBToLinear();

  // create a texture loader.
  const textureLoader = new THREE.TextureLoader();

  // Load a texture. See the note in chapter 4 on working locally, or the page
  // https://threejs.org/docs/#manual/introduction/How-to-run-things-locally
  // if you run into problems here
  const texture = textureLoader.load('textures/road.png');

  // set the "color space" of the texture
  texture.encoding = THREE.sRGBEncoding;

  // reduce blurring at glancing angles
  texture.anisotropy = 16;

  // create a Standard material using the texture we just loaded as a color map
  const roadTexture = new THREE.MeshStandardMaterial({
    map: texture,
  })


  const personHeadMat = new THREE.MeshStandardMaterial({
    color: 0xdcba81, // cream
    flatShading: false,
  });

  const personBodyMat = new THREE.MeshStandardMaterial({
    color: 0x2988d6, // cream
    flatShading: true,
  });

  return {
    grassMat,
    roadTexture,
    personHeadMat,
    personBodyMat
  };

}

function createGeometries() {

  const roadGeo = new THREE.BoxBufferGeometry(7, 0.05, 4);

  const grassGeo = new THREE.BoxBufferGeometry(2, 0.15, 7);

  const personHeadGeo = new THREE.SphereBufferGeometry(0.17, 32, 32);

  const personBodyGeo = new THREE.CylinderBufferGeometry(0.1, 0.2, 0.3, 64);
  return {
    roadGeo,
    grassGeo,
    personHeadGeo,
    personBodyGeo
  };

}

function createMeshes() {

  const materials = createMaterials();
  const geometries = createGeometries();

  // Creating GROUND
  const ground = new THREE.Group();
  scene.add(ground);

  const road = new THREE.Mesh(geometries.roadGeo, materials.roadTexture);
  road.rotateY(Math.PI / 2);

  const grassFront = new THREE.Mesh(geometries.grassGeo, materials.grassMat);
  grassFront.position.set(-3, 0.05, 0);

  const grassBack = grassFront.clone();
  grassBack.position.set(3, 0.05, 0);

  ground.add(
    road,
    grassFront,
    grassBack
  );

  //CREATING PEOPLE

  scene.add(people);

  const person1 = new THREE.Group();
  people.add(person1);

  const person1Bod = new THREE.Mesh(geometries.personBodyGeo, materials.personBodyMat);
  person1Bod.position.set(-2.5, 0.28, 0);


  const person1Head = new THREE.Mesh(geometries.personHeadGeo, materials.personHeadMat);
  person1Head.position.set(-2.5, 0.57, 0);

  person1.name = "Harry";

  person1.add(
    person1Bod,
    person1Head
  )


}

function createRenderer() {

  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(container.clientWidth, container.clientHeight);

  renderer.setPixelRatio(window.devicePixelRatio);

  renderer.gammaFactor = 2.2;
  renderer.gammaOutput = true;

  renderer.physicallyCorrectLights = true;

  container.appendChild(renderer.domElement);

}

function loadModels() {

  // ready and waiting for your code!
  const loader = new THREE.GLTFLoader();

  const onLoad = (gltf, position) => {

    const model = gltf.scene.children[0];
    model.position.copy(position);


    model.scale.set(0.5, 0.5, 0.5);

    var positionKF = new THREE.VectorKeyframeTrack('.position', [0, 1, 2], [0.5, 0, -4, 0.5, 0, -1, 0.5, 0, -1]);


    // create an animation sequence with the tracks
    // If a negative time value is passed, the duration will be calculated from the times of the passed tracks array
    var clip = new THREE.AnimationClip('Action', 3, [positionKF]);

    // setup the THREE.AnimationMixer
    mixer = new THREE.AnimationMixer(model);

    // create a ClipAction and set it to play
    var clipAction = mixer.clipAction(clip);

    clipAction.setLoop(THREE.LoopOnce)
    clipAction.clampWhenFinished = true
    clipAction.enable = true

    clipAction.play();

    scene.add(model);

  };

  // the loader will report the loading progress to this function
  const onProgress = () => {};

  // the loader will send any error messages to this function, and we'll log
  // them to to console
  const onError = (errorMessage) => {
    console.log(errorMessage);
  };


  const busPosition = new THREE.Vector3(1, 0.8, -1);
  loader.load('models/VW.glb', gltf => onLoad(gltf, busPosition), onProgress, onError);


}


function update() {}

function personAnimation() {
  
  var person = scene.children[3].children[0];
  
  person.translateY(0.1);
  
}

function render() {


  var delta = clock.getDelta();

  if (mixer) {

    mixer.update(delta);

  }
  renderer.render(scene, camera);
}


function onWindowResize() {

  camera.aspect = container.clientWidth / container.clientHeight;

  // update the camera's frustum
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);

}

window.addEventListener('resize', onWindowResize);

init();