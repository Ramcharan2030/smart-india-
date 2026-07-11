"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

export default function ThreeVillaModel() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x17130F, 0.06);

    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(3, 2, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mount.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xC8A96A, 0.4);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xFFF8EE, 1.5);
    dirLight.position.set(5, 8, 3);
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x8A6A3E, 0.5);
    rimLight.position.set(-3, 2, -5);
    scene.add(rimLight);

    const pointLight = new THREE.PointLight(0xC8A96A, 0.8, 12);
    pointLight.position.set(0, 4, 0);
    scene.add(pointLight);

    // Model group for animation
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Load GLTF model
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      "/models/villa.glb",
      (gltf) => {
        const model = gltf.scene;
        // Auto-center and scale
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.5 / maxDim;
        model.scale.setScalar(scale);
        model.position.sub(center.multiplyScalar(scale));

        // Enhance materials
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.envMapIntensity = 0.7;
            }
          }
        });

        modelGroup.add(model);
      },
      undefined,
      (err) => {
        console.warn("GLB load error:", err);
        // Show fallback geometry
        const geo = new THREE.OctahedronGeometry(1, 2);
        const mat = new THREE.MeshStandardMaterial({ color: 0xC8A96A, roughness: 0.3, metalness: 0.8 });
        modelGroup.add(new THREE.Mesh(geo, mat));
      }
    );

    // Animation loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      modelGroup.rotation.y += 0.003;
      modelGroup.position.y = Math.sin(t * 0.5) * 0.05;
      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      dracoLoader.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" style={{ minHeight: "400px" }} />;
}
