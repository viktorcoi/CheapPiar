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
 * @type {THREE.OrbitControls}
 */
controls;

function init() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.setPixelRatio(window.devicePixelRatio);

    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();


    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
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

function nestedObjecttoScreenXYZ(obj,camera,width,height)
{
	var vector = new THREE.Vector3();
	vector.setFromMatrixPosition( obj.matrixWorld );
	var widthHalf = (width/2);
	var heightHalf = (height/2);
	vector.project(camera);
	vector.x = ( vector.x * widthHalf ) + widthHalf;
	vector.y = - ( vector.y * heightHalf ) + heightHalf;
	return vector;
};

let axis = 0.001;
/**
 * @type {HTMLElement}
 */
let h1 = null;
function animate() {
    controls.autoRotate = true;
    controls.update();
    controls.autoRotateSpeed = 0.5;
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
        h1.style.left = `${vector.x - h1.clientWidth / 2}px`;
        h1.style.top = `${vector.y - h1.clientHeight / 2}px`;
        h1.innerHTML = (camera.position.z + 90).toString();
    }
    /* console.log(vector) */
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

document.onreadystatechange = (async () => {
    setTimeout(() => {
          
    }, 0);
    h1 = document.getElementById("test");
});


window.addEventListener('resize', onWindowResize);
console.log("test");
init();
initPoints();
animate(); 
