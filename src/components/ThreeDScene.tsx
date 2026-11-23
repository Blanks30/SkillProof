"use client";
import { useEffect, useRef } from "react";

export default function ThreeDScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    let animId: number;
    let THREE: typeof import("three");

    import("three").then((mod) => {
      THREE = mod;

      const width = container.clientWidth || 500;
      const height = container.clientHeight || 460;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(0, 0, 7.5);

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      container.appendChild(renderer.domElement);

      // Lights
      scene.add(new THREE.AmbientLight(0xffffff, 1.2));
      const emberLight = new THREE.PointLight(0xff6b35, 4.0, 30);
      emberLight.position.set(3.5, 2.5, 4);
      scene.add(emberLight);
      const indigoLight = new THREE.PointLight(0x6366f1, 3.5, 30);
      indigoLight.position.set(-3.5, -2.5, 3.5);
      scene.add(indigoLight);
      const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
      dirLight.position.set(0, 6, 6);
      scene.add(dirLight);

      const rootGroup = new THREE.Group();
      scene.add(rootGroup);
      const cardGroup = new THREE.Group();
      rootGroup.add(cardGroup);

      // Glass slab
      const slabGeo = new THREE.BoxGeometry(3.8, 2.4, 0.14);
      const slabMat = new THREE.MeshPhongMaterial({ color: 0x181a1c, emissive: 0x0a0c0e, specular: 0xff8844, shininess: 90, transparent: true, opacity: 0.92 });
      cardGroup.add(new THREE.Mesh(slabGeo, slabMat));

      // Wireframe edges
      const frameGeo = new THREE.BoxGeometry(3.84, 2.44, 0.16);
      const wireMat = new THREE.LineBasicMaterial({ color: 0xff6b35, transparent: true, opacity: 0.85 });
      cardGroup.add(new THREE.LineSegments(new THREE.WireframeGeometry(frameGeo), wireMat));

      // Seal octahedron
      const sealGeo = new THREE.OctahedronGeometry(0.5, 0);
      const sealMat = new THREE.MeshPhongMaterial({ color: 0xff7020, emissive: 0x4a1805, specular: 0xffffff, shininess: 120, flatShading: true });
      const sealMesh = new THREE.Mesh(sealGeo, sealMat);
      sealMesh.position.set(1.25, 0.55, 0.25);
      cardGroup.add(sealMesh);

      // Node icosahedron
      const nodeGeo = new THREE.IcosahedronGeometry(0.38, 0);
      const nodeMat = new THREE.MeshPhongMaterial({ color: 0x6366f1, emissive: 0x1e1b4b, specular: 0x818cf8, shininess: 100, flatShading: true });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.set(-1.25, -0.55, 0.25);
      cardGroup.add(nodeMesh);

      // Orbit rings
      const ringMesh1 = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.02, 16, 120), new THREE.MeshBasicMaterial({ color: 0xff8c42, transparent: true, opacity: 0.6 }));
      ringMesh1.rotation.x = Math.PI / 3;
      cardGroup.add(ringMesh1);
      const ringMesh2 = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.015, 16, 120), new THREE.MeshBasicMaterial({ color: 0x818cf8, transparent: true, opacity: 0.45 }));
      ringMesh2.rotation.y = Math.PI / 4;
      cardGroup.add(ringMesh2);

      // Satellites
      const blockGeo = new THREE.BoxGeometry(0.2, 0.2, 0.2);
      const blockMat = new THREE.MeshPhongMaterial({ color: 0xffaa40, emissive: 0x331405, shininess: 80 });
      const satellites = Array.from({ length: 4 }, (_, i) => {
        const sat = new THREE.Mesh(blockGeo, blockMat);
        cardGroup.add(sat);
        return { mesh: sat, angle: (i * Math.PI) / 2, radius: 2.1, speed: 0.8 + i * 0.2 };
      });

      // Particles
      const pCount = 120;
      const pPos = new Float32Array(pCount * 3);
      for (let i = 0; i < pCount * 3; i += 3) {
        pPos[i] = (Math.random() - 0.5) * 12;
        pPos[i + 1] = (Math.random() - 0.5) * 8;
        pPos[i + 2] = (Math.random() - 0.5) * 6;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
      const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ size: 0.05, color: 0xff9944, transparent: true, opacity: 0.75 }));
      scene.add(particles);

      // Mouse parallax
      let mouseX = 0, mouseY = 0;
      const handleMouse = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        mouseX = (e.clientX - (rect.left + rect.width / 2)) * 0.0018;
        mouseY = (e.clientY - (rect.top + rect.height / 2)) * 0.0018;
      };
      window.addEventListener("mousemove", handleMouse);

      const handleResize = () => {
        const w = container.clientWidth || 500;
        const h = container.clientHeight || 460;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", handleResize);

      const clock = new THREE.Clock();
      function animate() {
        animId = requestAnimationFrame(animate);
        const delta = clock.getDelta();
        const time = clock.getElapsedTime();

        const targetX = mouseX * 1.8;
        const targetY = mouseY * 1.5;
        cardGroup.rotation.y += (targetX - cardGroup.rotation.y) * 0.08;
        cardGroup.rotation.x += (targetY - cardGroup.rotation.x) * 0.08;
        cardGroup.position.y = Math.sin(time * 1.6) * 0.12;
        cardGroup.rotation.z = Math.sin(time * 0.9) * 0.03;

        sealMesh.rotation.y += 0.025;
        sealMesh.rotation.x += 0.018;
        nodeMesh.rotation.y -= 0.03;
        nodeMesh.rotation.z += 0.02;
        ringMesh1.rotation.z += 0.008;
        ringMesh2.rotation.x -= 0.006;

        satellites.forEach((s) => {
          s.angle += delta * s.speed;
          s.mesh.position.x = Math.cos(s.angle) * s.radius;
          s.mesh.position.y = Math.sin(s.angle * 1.3) * (s.radius * 0.45);
          s.mesh.position.z = Math.sin(s.angle) * 0.6;
          s.mesh.rotation.x += 0.03;
          s.mesh.rotation.y += 0.03;
        });
        particles.rotation.y = time * 0.025;
        renderer.render(scene, camera);
      }
      animate();

      // Cleanup stored on element for unmount
      (container as HTMLDivElement & { _cleanup?: () => void })._cleanup = () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("mousemove", handleMouse);
        window.removeEventListener("resize", handleResize);
        renderer.dispose();
        slabGeo.dispose(); slabMat.dispose();
        frameGeo.dispose(); wireMat.dispose();
        sealGeo.dispose(); sealMat.dispose();
        nodeGeo.dispose(); nodeMat.dispose();
        pGeo.dispose();
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
      };
    });

    return () => {
      const c = containerRef.current as (HTMLDivElement & { _cleanup?: () => void }) | null;
      if (c?._cleanup) c._cleanup();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full min-h-[460px] relative z-10" style={{ display: "block" }} />
  );
}
