import {CSS2DRenderer, CSS2DObject} from 'three-css2drenderer';
import {OrbitControls} from "orbit-controls"
import {
    PerspectiveCamera,
    WebGLRenderer,
    Scene,
    Vector3,
    Vector2,
    Object3D,
    MathUtils,
    Box3
} from "three";
let 

/**
 * @type {PerspectiveCamera}
 */
camera, 

/**
 * @type {WebGLRenderer}
 */
renderer, 
/**
 * @type {Scene}
 */
scene,
/**
 * @type {Scene}
 */
scene_mas,
/**
 * @type {OrbitControls}
 */
controls,
/**
 * @type {OrbitControls}
 */
controls_mas;

/**
 * @type {CSS2DObject}
 */
let mascot_obj = null;

/**
 * @type {CSS2DObject}
 */
 let border_obj = null;

 /**
 * @type {CSS2DObject}
 */
let eye_obj = null;

let size_w = 600;
let size_h = 400;
let aspect_ratio = size_w / size_h;

let mouse_x = 0.8;
let mouse_y = 0.7;

/**
 * @type {HTMLElement}
 */
let eyes_dom = null;

/**
 * @type {HTMLElement}
 */
 let border_dom = null;

function initSize() {
    size_w = container.clientWidth;
    size_h = container.clientHeight;
    aspect_ratio = size_w / size_h;
}

const imageMap = [
    "people", "heart", "eye", "chat"
]

function init() {
    initSize();
    renderer = new CSS2DRenderer();
    renderer.setSize(size_w, size_h);
    /* renderer.setPixelRatio(window.devicePixelRatio); */

    document.getElementById('container').appendChild(renderer.domElement);

    scene = new Scene();
    scene_mas = new Scene();

    camera = new PerspectiveCamera(45, aspect_ratio * window.devicePixelRatio, 1, 500);
    camera.position.x = 115;
    camera.position.y = 50;
    camera.position.z = 50;

    for (let index = 0; index < 10; index++) {
        var cssElement = new CSS2DObject();
        cssElement.__value = MathUtils.randInt(1000, 9999);
        cssElement.element.innerHTML = `
        <div class="numbers people d-flex items-center border-55px">
            <p>+${cssElement.__value}</p><img src="./assets/img/${imageMap[MathUtils.randInt(0, 3)]}.svg" alt="Людей">
        </div>`;
        cssElement.__valueDom = cssElement.element.children[0].children[0];
        cssElement.position.copy(randomPointInSphere(56).clone());
        scene.add(cssElement);
    }

    mascot_obj = new CSS2DObject(document.createElement('div'));
    mascot_obj.element.innerHTML = `<img class="mas no-scale" src="./assets/img/mas.png" alt="">`

    border_obj = new CSS2DObject(document.createElement('div'));
    border_obj.element.innerHTML = `<img class="form-eye no-scale" src="./assets/img/feye.png" alt="">`

    eye_obj = new CSS2DObject(document.createElement('div'));
    eye_obj.element.innerHTML = `
    <div class="mas-eye-filter">
    <img id="eyes" class="mas-eye no-scale" src="./assets/img/meye.svg" alt="">
    </div>`

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

    eyes_dom = eye_obj.element.children[0].children[0];
    border_dom = border_obj.element.children[0];
    console.log(eyes_dom);

    document.addEventListener('mousemove', (e) => {
        mouse_x = e.clientX / window.innerWidth;
        mouse_y = e.clientY / window.innerHeight;
    });
}


/**
 * @type {Vector3[]}
 */
const v_points = []

function randomPointInSphere(radius) {
    /**
     * @type {Vector3}
     */
    let v = new Vector3();
    for (let index = 0; index < 10; index++) {
        
        v = new Vector3();
        v
        const x = MathUtils.randFloat(-1, 1);
        const y = MathUtils.randFloat(-1, 1);
        const z = MathUtils.randFloat(-1, 1);
        
        const normalizationFactor = 1 / Math.sqrt(x * x + y * y + z * z);

        v.x = x * normalizationFactor * radius;
        v.y = y * normalizationFactor * radius;
        v.z = z * normalizationFactor * radius;

        if (v_points.filter(k => {
            const firstBB = new Box3(k.clone().subScalar(5), k.clone().addScalar(5));
            const secondBB = new Box3(v.clone().subScalar(5), v.clone().addScalar(5));

            return firstBB.intersectsBox(secondBB);
        }) < 1) break;
        
    }
    v_points.push(v);
    return v;
}

function initPoints() {
    for (var i = 0; i < 10; i++) {
        const geometry = new BufferGeometry();
        var positions = [];
        var vertex = randomPointInSphere(50);
        positions.push(vertex.x, vertex.y, vertex.z);
        geometry.addAttribute('position', new Float32BufferAttribute(positions, 3));
    
        let material = new PointsMaterial({ color: MathUtils.randInt(0x000000, 0xFFFFFF), size: 20 });
        const particles = new Points(geometry, material);
        scene.add(particles);
    }

    
}

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
    const size = new Vector3();
    const box = new Box3().setFromObject(object).getSize(size);
    size.project(camera);

    /* let halfWidth = size_w / 2;
    let halfHeight = size_h / 2;

    size.x = (size.x * halfWidth);
    size.y = (size.y * halfHeight); */
    
    return new Vector3(size.x,size.y, new Box3().setFromObject(object).max.z);
}


/**
 * 
 * @param {HTMLElement} h1 
 * @param {Object3D<Event>} child 
 */
function seth(h1, child) {
    var vector = new Vector3();
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
        var vector2 = new Vector3();
        const [x1, y2, z3] = child.geometry.attributes.position.array;
        vector2.set( x1, y2, z3 );
        
        /* const test = camera.worldToLocal(vector2); */
        
        /* h1.innerHTML = child.position.distanceTo(controls.position0); */
        const t = new Spherical();

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
let frameDelta = 16.6666;
let frameAlerts = 0;
let frameIncreaseAlerts = 0;
function animate(timestamp) {
    
    if (timestamp - prevTimestamp <= frameDelta) {
        if (timestamp - prevTimestamp <= frameDelta / 1.3) {
            frameDelta /= 2;
            frameAlerts = 0;
        }
        requestAnimationFrame(animate);
        return;
    } else if (timestamp - prevTimestamp >= frameDelta * 1.3) {
        if (frameAlerts >= 5) {
            frameDelta *= 2;
            frameAlerts = 0;
        }
        frameAlerts++;
    }

    if (timestamp - prevTimestamp >= 100) {
        disableAlerts++;
        
    } else { 
        disableAlerts = 0;
        disabledControls = false;
    }

    prevTimestamp = timestamp;

    if (!disabledControls) {
        controls.update();
    }

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
            /* const scale_value = scale_start + scale_factor * (el_z / z_max); */
        } catch (error) {
            console.log(error);
        }
        
    }

    eyes_dom.style.transform = "";
    renderer.render(scene, camera);
    const max_w = 30;
    const max_h = 12;
    const max_bw = 15;
    const max_bh = 7;
    border_dom.style.transform = 
    `translate(${(-15 + max_bw * mouse_x).toFixed(2)}%, ${(5 + max_bh * mouse_y).toFixed(2)}%)`;
    eyes_dom.style.transform = 
    `translate(${(-25 + max_w * mouse_x).toFixed(2)}%, ${(-7 + max_h * mouse_y).toFixed(2)}%)`;
    requestAnimationFrame(animate);
}

function onWindowResize() {
    try {
        if(window.matchMedia("(any-hover: none)").matches) {
            mouse_x = 0.8;
            mouse_y = 0.7;
        }
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
            try {
                    
                init();
                /* initPoints(); */
                animate(); 
                window.addEventListener('resize', onWindowResize);
                console.log("test");
            } catch (error2) {
                alert(error2.toString());
            }
        }
    } catch (error) {
        alert(error.toString());
    }
});



