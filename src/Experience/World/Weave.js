import * as THREE from "three";
import { MeshLineGeometry, MeshLineMaterial, raycast } from "meshline";
import Experience from "../Experience";
import modMeshLineVertexShader from "../../shaders/weave/vertex.glsl";
import modMeshLineFragmentShader from "../../shaders/weave/fragment.glsl";

export default class Weave {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.time = this.experience.time;

    this.parameters = {
      default: 1.0,
      lineLength: 5.0,
      amplitude: 1.0,
    };
    // this.uniforms = {};
    const points = [];
    const group = new THREE.Group();
    for (
      let i = -this.parameters.lineLength;
      i < this.parameters.lineLength;
      i += 0.01
    ) {
      points.push(new THREE.Vector3(0, 0, i));
    }
    const geometry = new MeshLineGeometry();
    geometry.setPoints(points, (p) => Math.sin(p) / 5);
    this.material = new MeshLineMaterial({
      side: THREE.DoubleSide,
      color: new THREE.Color(0.8, 0.1, 0.3),
    });
    //https://stackoverflow.com/questions/59548828/how-to-give-vertex-shader-to-a-geometry-without-changing-the-material-in-threejs
    this.material.onBeforeCompile = function (info) {
      console.log(info.fragmentShader);
      info.vertexShader = modMeshLineVertexShader;
      info.fragmentShader = modMeshLineFragmentShader;
      info.uniforms.uTime = { value: 0.0 };
      info.uniforms.offset = { value: 0.0 };
      info.uniforms.speed = { value: 1.0 };
      info.uniforms.amplitude = { value: 1.0 };
      //   this might prevent uniforms from updating?
      // this.uniforms = info.uniforms;
      // console.log(info.uniforms);
      // change info.vertexShader, info.fragmentShader, and/or info.uniforms here
      // console.log(info.vertexShader)
    };
    for (var i = 0; i < 2 * Math.PI; i += (2 * Math.PI) / 50) {
      let mesh = new THREE.Mesh(geometry, this.material);
      mesh.rotation.y += Math.PI / 2;
      mesh.rotation.z = i;
      mesh.position.y += Math.random() * 0.4;
      mesh.position.x += Math.random() * 0.05;
      this.scene.add(mesh);
    }
  }
  tick() {
    if (this.material.uniforms.uTime) {
      this.material.uniforms.uTime.value = this.time.elapsedTime;
    }
    if (this.material.uniforms.amplitude) {
      this.material.uniforms.amplitude.value = this.parameters.amplitude;
    }
    // this.material.uniforms.uTime.value = this.time.elapsedTime;
    // this.material2.uniforms.uTime.value = this.time.elapsedTime;
    // this.material.uniforms.amplitude.value = this.parameters.amplitude;
    // this.material2.uniforms.amplitude.value = this.parameters.amplitude;
  }
}
