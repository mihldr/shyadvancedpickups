
import * as THREE from 'three';

import { OrbitControls } from '../vendor/OrbitControls.js';
import { CSS3DRenderer, CSS3DObject } from '../vendor/CSS3DRenderer.js';

class ThreeWrapper {
    constructor(container, fov, nearClipping, farClipping) {
        this.onTickHandlers = []

        this.clock = new THREE.Clock(true)

        this.container = container

        // Setup Camera and set position initially to 0, 0, 0
        this.camera = new THREE.PerspectiveCamera(fov, container.offsetWidth / container.offsetHeight, nearClipping, farClipping)
        this.camera.position.set( -300, 200, 200 );

        // Setup Scene
        this.scene = new THREE.Scene()

        // Setup renderer
        this.renderer = new CSS3DRenderer()
        this.renderer.setSize( container.offsetWidth, container.offsetHeight )
        this.renderer.domElement.style.position = 'absolute'
        this.renderer.domElement.style.top = 0
        container.appendChild( this.renderer.domElement )
    }

    addOrbitalControls(minZoom, maxZoom) {
        const controls = new OrbitControls( this.camera, this.renderer.domElement );
        controls.minZoom = minZoom;
        controls.maxZoom = maxZoom;
    }

    setCameraPos(vec3Pos) {
        this.camera.position.copy(vec3Pos)
    }

    setCamLookAtRelative(vec3Norm) {
        this.camera.lookAt(new THREE.Vector3().copy(this.camera.position).add(vec3Norm))
    }

    getCameraPos() {
        return this.camera.position
    }

    addElement( element, id, pos, rot ) {    
        let object = new CSS3DObject( element );

        object.position.copy(pos)
        object.scale.setScalar(0.0045)
        object.fivemId = id

        this.scene.add( object );

        return object
    }

    removeElement(id) {
        this.scene.remove(this.scene.getObjectByProperty("fivemId", id))
    }

    startRender() {
        requestAnimationFrame(() => this.startRender())

        // call onUpdate on all objects in scenegraph
        let updateChilds = (node) => {
            node.children.forEach((child) => {
                if(child.onUpdate)
                    child.onUpdate(this.clock.getDelta())

                if(child.children.length === 0)
                    return

                updateChilds(child)
            })    
        }
        updateChilds(this.scene);
        


        this.renderer.render(this.scene, this.camera)
    }

    addOnTickHandler(fn) {
        this.onTickHandlers.push(fn)
    }

    updateCam(fov, near, far) {
        let valChanged = false

        if(this.camera.fov !== fov) {
            this.camera.fov = fov
            valChanged = true
        }

        if(this.camera.near !== near) {
            this.camera.near = near
            valChanged = true
        }

        
        if(this.camera.far !== far) {
            this.camera.far = far
            valChanged = true
        }

        if(valChanged)
            this.camera.updateProjectionMatrix()            
    }
}

export { ThreeWrapper }