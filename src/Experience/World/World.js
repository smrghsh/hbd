import * as THREE from 'three'
import Experience from '../Experience.js'
import Circles from './Circles.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import Hypercube from './Hypercube.js'
// import Spectra from './Spectra.js'
import Stars from './Stars.js'
import DNAbackboneVertexShader from '../../shaders/DNAbackbone/vertex.glsl'
import DNAbackboneFragmentShader from '../../shaders/DNAbackbone/fragment.glsl'
// import Sushi from './Sushi.js'
// import Test from './Test.js'

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.floor = new Floor()
        // this.circles = new Circles()
        // this.hypercube = new Hypercube()
        // Wait for resources
        this.ready = false;
        this.resources.on('ready', () =>
        {
            // Setup
            console.log('resources ready')
            // this.test = new Test()
            this.stars = new Stars()
            const lineLength = 17
            const points = [];
            const size = [];
            const thickness = 0.20
            const speed = 1.0
            const amplitude = 1.0
            const DNA = new THREE.Group()
            for (let i = -lineLength; i < lineLength; i+=0.1*Math.random()) {
                points.push( new THREE.Vector3( Math.random()*thickness, Math.random()*thickness, i) );
            }
            this.material = new THREE.ShaderMaterial({
                vertexShader: DNAbackboneVertexShader,
                fragmentShader: DNAbackboneFragmentShader,
                uniforms: {
                    uTime: {value: 0.0},
                    offset: {value: 0.0},
                    speed: {value: speed},
                    amplitude: {value: amplitude}
                },
                side: THREE.DoubleSide
            });
            this.material2 = new THREE.ShaderMaterial({
                vertexShader: DNAbackboneVertexShader,
                fragmentShader: DNAbackboneFragmentShader,
                uniforms: {
                    uTime: {value: 0.0},
                    offset: {value: 1.0},
                    speed: {value: speed},
                    amplitude: {value: amplitude}

                },
                side: THREE.DoubleSide
            });
            const geometry = new THREE.BufferGeometry().setFromPoints( points );
            // const backbone1 = new THREE.Line( geometry, material );
            const backbone1 = new THREE.Mesh(geometry,this.material)
            // const backbone2 = new THREE.Line( geometry, material2 );
            const backbone2 = new THREE.Points( geometry, this.material2 );
            // line2.position.z += 8.0;
            DNA.add(backbone1)
            DNA.add(backbone2)
            DNA.rotation.x += 1.111111
            


            for(let i = 0; i < 4; i+= 0.09){
                var DNA2 = DNA.clone()
                DNA2.position.y +=i
                DNA2.rotation.y += Math.random()
                DNA2.rotation.x +=  1.0 *  (Math.random() - 0.0) + i/4
                // DNA2.rotation.z +=  Math.PI
                this.scene.add(DNA2)
            }
            // this.spectra = new Spectra()
            // this.sushi = new Sushi()
            
            this.environment = new Environment()
            this.ready = true
        })
    }
    update() {
        if (this.ready){
            let t = Date.now () - this.experience.time.start 
            this.material.uniforms.uTime.value = t/1000
            this.material2.uniforms.uTime.value = t/1000
            this.material.uniforms.amplitude.value = 1.0 + 0.2 * Math.sin(t/4000)
            this.material2.uniforms.amplitude.value = 1.0 + 0.2 * Math.sin(t/4000)
        }
        // this.circles.update()

    }
}