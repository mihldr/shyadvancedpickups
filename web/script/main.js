import { Vector3, MathUtils } from "three";
import { ThreeWrapper } from "./ThreeWrapper.js";

// Elements
const ELEMENT_PICKUP_TEMPLATE = document.querySelector(".template#pickups").firstElementChild

// Global variables
let wrapper                 = undefined
let currentPlayerPos        = new Vector3(0, 0, 0)
let maxDistance             = 3.0
let pickItemText            = ""
let animation               = {use: false}
let hidePickupsWhileAiming  = false

const helpers = {
    convertAxisToThreeAxis: (vector) => {
        if(window.invokeNative)
            return new Vector3(vector.x * 1, vector.z * 1, vector.y * -1); // GTA Axis: +X+Z-Y

        return new Vector3(vector.x, vector.y, vector.z) // THREE Axis: +X+Y+Z
    }
}

const exportedFunctions = {
    Init: (data) => {
        maxDistance = data.maxDistance
        pickItemText = data.pickItemText
        animation = data.animation
        hidePickupsWhileAiming = data.hidePickupsWhileAiming

        wrapper = new ThreeWrapper(document.querySelector(".container"), data.fov, data.near, data.far)
        wrapper.startRender()

        if(window.invokeNative)
            fetch(`https://${GetParentResourceName()}/ready`, {method: 'POST'}).then(() => {})
    }, 

    UpdateCamMeta: (data) => {
        if(!wrapper)
            return

        wrapper.updateCam(data.fov, data.near, data.far)

        if(data.isInPauseMenu || (hidePickupsWhileAiming && data.isAiming))
            wrapper.renderer.domElement.style.display = 'none'
        else 
            wrapper.renderer.domElement.style.display = 'block'
    },

    OnGameTick: (data) => {
        if(!wrapper)
            return

        // Set Camera Position
        wrapper.setCameraPos(helpers.convertAxisToThreeAxis(data.camPos))
        wrapper.setCamLookAtRelative(helpers.convertAxisToThreeAxis(data.camDirVector))

        currentPlayerPos = helpers.convertAxisToThreeAxis(data.playerPos)
    },

    AddPickup: (data) => {
        let node = ELEMENT_PICKUP_TEMPLATE.cloneNode(true)
        node.querySelector(".itemImg").src = data.imgUrl
        node.querySelector(".itemLabel").innerHTML = data.label
        node.querySelector(".pickItemText").innerHTML = pickItemText

        if(animation.enable) {
            node.querySelector(".animationWrapper").classList.add(animation.name)
            node.querySelector(".animationWrapper").style['animation-duration'] = `${animation.duration}s`
        }

        let x = wrapper.addElement(node, data.id, helpers.convertAxisToThreeAxis(data.pos), new Vector3(0, 0, 0), 0.0045)
        x.inOpacityTimeout = false

        x.onUpdate = () => {
            let isVisible = new Vector3().subVectors(x.position, currentPlayerPos).length() < maxDistance

            if(!isVisible && x.visible && !x.inOpacityTimeout) {
                x.inOpacityTimeout = true
                x.element.querySelector(".animationWrapper").style.opacity = 0

                setTimeout(() => {
                    x.inOpacityTimeout = false
                    x.visible = false
                }, 200)
            }

            if(isVisible && !x.visible) {
                x.visible = true

                setTimeout(() => {
                    x.element.querySelector(".animationWrapper").style.opacity = 1
                }, 10)
            }
            
            // Make object look at player position only when object is being rendered
            if(isVisible)
                x.lookAt(currentPlayerPos)
        }
    },

    RemovePickup: (id) => {
        wrapper.removeElement(id)
    }
}

window.addEventListener('message', (event) => {
    if(exportedFunctions[event.data.action])
        exportedFunctions[event.data.action](event.data.data)
})