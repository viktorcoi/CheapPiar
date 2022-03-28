

let 

/**
 * @type {THREE.PerspectiveCamera}
 */
camera, 

/**
 * @type {THREE.WebGLRenderer}
 */
renderer, 
/**
 * @type {THREE.Scene}
 */
scene,
/**
 * @type {OrbitControls}
 */
controls;

let size_w = 600;
let size_h = 400;
let aspect_ratio = size_w / size_h;

function initSize() {
    size_w = container.clientWidth;
    size_h = container.clientHeight;
    aspect_ratio = size_w / size_h;
}

function init() {
    initSize();
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(size_w, size_h);
    renderer
    renderer.setPixelRatio(window.devicePixelRatio);

    document.getElementById('container').appendChild(renderer.domElement);
    /* document.body.appendChild(renderer.domElement); */

    scene = new THREE.Scene();


    camera = new THREE.PerspectiveCamera(45, aspect_ratio, 1, 1000);
    camera.position.set(100, 0, 100);
    

    controls = new THREE.OrbitControls(camera, renderer.domElement);
}

const v = new THREE.Vector3();

function randomPointInSphere(radius) {
    const x = THREE.MathUtils.randFloat(-1, 1);
    const y = THREE.MathUtils.randFloat(-1, 1);
    const z = THREE.MathUtils.randFloat(-1, 1);
    const normalizationFactor = 1 / Math.sqrt(x * x + y * y + z * z);

    v.x = x * normalizationFactor * radius;
    v.y = y * normalizationFactor * radius;
    v.z = z * normalizationFactor * radius;

    return v;
}
/* var positions = []; */
/* var particles = null; */
function initPoints() {
    

    /* var positions = []; */

    for (var i = 0; i < 10; i++) {
        const geometry = new THREE.BufferGeometry();
        var positions = [];
        var vertex = randomPointInSphere(50);
        positions.push(vertex.x, vertex.y, vertex.z);
        geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    
        material = new THREE.PointsMaterial({ color: THREE.MathUtils.randInt(0x000000, 0xFFFFFF), size: 20 });
        const particles = new THREE.Points(geometry, material);
        scene.add(particles);
    }

    
}

let axis = 0.001;
/**
 * @type {HTMLElement}
 */
let h1 = null;

/**
 * @type {HTMLElement}
 */
let container = null;
function animate() {
    controls.autoRotate = true;
    controls.update();
    controls.autoRotateSpeed = 0.5;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.004;
    requestAnimationFrame(animate);
    
    renderer.render(scene, camera);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();

    const child = scene.children[0];
    var vector = new THREE.Vector3();
    var canvas = renderer.domElement;
    const [x, y, z] = child.geometry.attributes.position.array;
    vector.set( x, y, z );

    vector.project(camera);

    vector.x = Math.round( (   vector.x + 1 ) * canvas.width  / 2 ),
    vector.y = Math.round( ( - vector.y + 1 ) * canvas.height / 2 );
    
    if (h1) {
        const x = vector.x - h1.clientWidth / 2;
        const y = vector.y - h1.clientHeight / 2;
        
        /* h1.style.left = `${(x / window.innerWidth) * 100}%`;
        h1.style.top = `${(y / window.innerHeight) * 100}%`; */
       /*  h1.innerHTML = (camera.position.z).toString(); */
       debugger;
       /* console.log(controls); */
        /* h1.innerHTML = (controls.sphericalDelta.phi).toString(); */
    }
    /* console.log(vector) */
}

function onWindowResize() {
    initSize();
    camera.aspect = aspect_ratio;
    camera.updateProjectionMatrix();
    renderer.setSize(size_w, size_h);
}

document.onreadystatechange = (async () => {
    if (document.readyState == "complete") {
        h1 = document.getElementById("test");
        container = document.getElementById("container");
        setTimeout(() => {
            init();
            initPoints();
            animate(); 
        }, 0);
        
    }
});


window.addEventListener('resize', onWindowResize);
console.log("test");

