import {CSS2DRenderer, CSS2DObject} from 'three-css2drenderer';
import {CSS3DRenderer, CSS3DObject} from 'three-css3drenderer';
import {OrbitControls} from "orbit-controls"

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

/**
 * @type {CSS2DObject}
 */
let mascot_obj = null;

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
    
    /* renderer = new THREE.WebGLRenderer({alpha: true}); */
    renderer = new CSS2DRenderer();
    renderer.setSize(size_w, size_h);
    
    /* renderer.setPixelRatio(window.devicePixelRatio); */

    document.getElementById('container').appendChild(renderer.domElement);
    /* document.body.appendChild(renderer.domElement); */

    scene = new THREE.Scene();


    camera = new THREE.PerspectiveCamera(45, aspect_ratio, 1, 500);
    /* camera.position.set(100, 0, 100); */
    camera.position.x = 115;
    camera.position.y = 50;
    camera.position.z = 50;

    for (let index = 0; index < 15; index++) {
        var cssElement = new CSS2DObject();
       /*  cssElement.element.class = "pos-absolute"; */
        cssElement.element.innerHTML = `
        <div class="numbers people d-flex items-center border-55px">
            <p>+2605</p><img src="./assets/img/people.svg" alt="Людей">
        </div>`;
        /* cssElement.element.style.width = "5em";
        cssElement.element.style.height = "5em";
        cssElement.element.style.background = "black"; */
        cssElement.position.copy(randomPointInSphere(50).clone());
        /* cssElement.position.set(100, 100, 100); */
        scene.add(cssElement);
    }

    mascot_obj = new CSS2DObject(document.createElement('img'));
    mascot_obj.element.src = "./assets/img/mas.png";
    mascot_obj.element.class = 'mas';
    mascot_obj.element.style.width = "45em";

    let border_obj = new CSS2DObject(document.createElement('div'));
    border_obj.element.innerHTML = `<img class="form-eye no-scale" src="./assets/img/feye.png" alt="">`

    let eye_obj = new CSS2DObject(document.createElement('div'));
    eye_obj.element.innerHTML = `<img class="mas-eye no-scale" src="./assets/img/meye.svg" alt="">`

    scene.add(eye_obj);
    scene.add(border_obj);
    scene.add(mascot_obj);
    

    controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    controls.update();
    controls.autoRotateSpeed = 0.5;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.004;
}

/* const v = new THREE.Vector3(); */

/**
 * @type {THREE.Vector3[]}
 */
const v_points = []

function randomPointInSphere(radius) {
    /**
     * @type {THREE.Vector3}
     */
    let v = new THREE.Vector3();
    for (let index = 0; index < 10; index++) {
        
        v = new THREE.Vector3();
        v
        const x = THREE.MathUtils.randFloat(-1, 1);
        const y = THREE.MathUtils.randFloat(-1, 1);
        const z = THREE.MathUtils.randFloat(-1, 1);
        
        const normalizationFactor = 1 / Math.sqrt(x * x + y * y + z * z);

        v.x = x * normalizationFactor * radius;
        v.y = y * normalizationFactor * radius;
        v.z = z * normalizationFactor * radius;

        if (v_points.filter(k => {
            const firstBB = new THREE.Box3(k.clone().subScalar(5), k.clone().addScalar(5));
            const secondBB = new THREE.Box3(v.clone().subScalar(5), v.clone().addScalar(5));

            return firstBB.intersectsBox(secondBB);
        }) < 1) break;
        
    }
    v_points.push(v);
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
    
        let material = new THREE.PointsMaterial({ color: THREE.MathUtils.randInt(0x000000, 0xFFFFFF), size: 20 });
        const particles = new THREE.Points(geometry, material);
        scene.add(particles);
    }

    
}

function initCSS() {

}

let axis = 0.001;
/**
 * @type {HTMLElement}
 */
var h1 = null;
var h2 = null;

/**
 * @type {HTMLElement}
 */
let container = null;

function getObjectSizeInViewSpace(object, camera) {
    const size = new THREE.Vector3();
    const box = new THREE.Box3().setFromObject(object).getSize(size);
    size.project(camera);

    /* let halfWidth = size_w / 2;
    let halfHeight = size_h / 2;

    size.x = (size.x * halfWidth);
    size.y = (size.y * halfHeight); */
    
    return new THREE.Vector3(size.x,size.y, new THREE.Box3().setFromObject(object).max.z);
}


/**
 * 
 * @param {HTMLElement} h1 
 * @param {THREE.Object3D<THREE.Event>} child 
 */
function seth(h1, child) {
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
        
        /* h1.style.left = `${(x / size_w) * 100}%`;
        h1.style.top = `${(y / size_h) * 100}%`; */
        /* h1.innerHTML = (controls.getAzimuthalAngle()).toFixed(2); */
        var vector2 = new THREE.Vector3();
        const [x1, y2, z3] = child.geometry.attributes.position.array;
        vector2.set( x1, y2, z3 );
        
        /* const test = camera.worldToLocal(vector2); */
        
        /* h1.innerHTML = child.position.distanceTo(controls.position0); */
        const t = new THREE.Spherical();

        const test_v = getObjectSizeInViewSpace(child, camera);
        /* h1.innerHTML = t.setFromVector3(vector2).theta - controls.getAzimuthalAngle() + 3.77; */
        /* h1.innerHTML = controls.object.position.distanceTo(vector2); */
        /* h1.innerHTML = test_v.z; */
        /* debugger; */
        /* h1.innerHTML = camera.getWorldDirection(child.getWorldPosition()).z; */
       
       /* console.log(controls); */
        /* h1.innerHTML = (controls.sphericalDelta.phi).toString(); */
    }
}


let disabledControls = false;
let disableAlerts = 0; 
let prevTimestamp = 0;

function animate(timestamp) {

    if (timestamp - prevTimestamp >= 100) {
        disableAlerts++;
        /* alert("disable alert"); */
    } else { 
        disableAlerts = 0;
        disabledControls = false;
    }

    prevTimestamp = timestamp;
    if (!disabledControls) {
        controls.update();
    }
    
    if (disableAlerts >= 5) {
        disableAlerts = 0;
        disabledControls = true;
    }
    renderer.render(scene, camera);
    /* camera.updateProjectionMatrix();
    camera.updateMatrixWorld(); */

    const child = scene.children[0];
    const z_map = scene.children.map(({element}) => parseInt(element.style.zIndex));
    const z_max = Math.max(...z_map);
    const z_mascot = parseInt(mascot_obj.element.style.zIndex);
    const scale_factor = 0.5;
    const scale_start = 1.0 - scale_factor;
   
    for (const it of scene.children) {
        /**
         * @type {HTMLElement}
         */
        const element = it.element;
        if (!(element)) continue;
        if (it == mascot_obj) continue;
        if (element.children.length < 1) continue;
        if (element.children[0].classList.contains("no-scale")) continue;
        try {
            const el_z = parseInt(element.style.zIndex);
            if (el_z <= z_mascot) {
                element.children[0].classList.add("blur");
            } else element.children[0].classList.remove("blur");
            const scale_value = scale_start + scale_factor * (el_z / z_max);
            debugger;
            element.children[0].style.cssText += `transform: rotate(5deg) scale(${scale_value});`
        } catch (error) {
            console.log(error);
        }
        
    }
    requestAnimationFrame(animate);
}

function onWindowResize() {
    try {
        initSize();
        camera.aspect = aspect_ratio;
        camera.updateProjectionMatrix();
        renderer.setSize(size_w, size_h);
    } catch (error) {
        alert(error.toString());
    }
    
}

document.onreadystatechange = (async () => {
    try {
        if (document.readyState == "complete") {
            h1 = document.getElementById("test");
            h2 = document.getElementById("test2");
            container = document.getElementById("container");
            setTimeout(() => {
                try {
                    
                    init();
                    /* initPoints(); */
                    animate(); 
                    window.addEventListener('resize', onWindowResize);
                    console.log("test");
                } catch (error2) {
                    alert(error2.toString());
                }
                
            }, 0);
        }
    } catch (error) {
        alert(error.toString());
    }
});



