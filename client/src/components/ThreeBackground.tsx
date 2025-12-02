import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeBackgroundProps {
  className?: string;
}

export function ThreeBackground({ className = '' }: ThreeBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Create floating particles
    const particleCount = 100;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    // Brand colors
    const brandColors = [
      new THREE.Color(0x6366f1), // Primary Indigo
      new THREE.Color(0xec4899), // Pink Accent
      new THREE.Color(0xff6b35), // Orange Secondary
    ];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Random positions
      positions[i3] = (Math.random() - 0.5) * 50;
      positions[i3 + 1] = (Math.random() - 0.5) * 50;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;

      // Random colors from brand palette
      const color = brandColors[Math.floor(Math.random() * brandColors.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      // Random sizes
      sizes[i] = Math.random() * 0.8 + 0.2;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Particle material with custom shader
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
      },
      vertexShader: `
        uniform float time;
        uniform float pixelRatio;
        attribute float size;
        varying vec3 vColor;
        varying float vOpacity;

        void main() {
          vColor = color;
          
          vec3 pos = position;
          pos.y += sin(time * 0.5 + position.x * 0.1) * 2.0;
          pos.x += cos(time * 0.3 + position.y * 0.1) * 1.5;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          float distance = length(mvPosition.xyz);
          vOpacity = 1.0 - (distance / 50.0);
          vOpacity = clamp(vOpacity, 0.1, 0.8);
          
          gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vOpacity;

        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float strength = 1.0 - (distanceToCenter * 2.0);
          strength = pow(strength, 3.0);
          
          vec3 finalColor = vColor * 2.0;
          gl_FragColor = vec4(finalColor, strength * vOpacity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    // Create flowing waves
    const waveGeometry = new THREE.PlaneGeometry(100, 100, 32, 32);
    const waveMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        mouse: { value: new THREE.Vector2(0, 0) }
      },
      vertexShader: `
        uniform float time;
        uniform vec2 mouse;
        varying vec2 vUv;
        varying float vElevation;

        void main() {
          vUv = uv;
          
          vec3 pos = position;
          float elevation = sin(pos.x * 0.3 + time * 0.5) * 0.5;
          elevation += sin(pos.y * 0.2 + time * 0.3) * 0.3;
          elevation += sin(pos.x * 0.1 + pos.y * 0.1 + time * 0.2) * 0.2;
          
          // Mouse interaction
          float mouseDistance = distance(pos.xy, mouse * 10.0);
          elevation += exp(-mouseDistance * 0.1) * 2.0;
          
          pos.z = elevation;
          vElevation = elevation;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        varying float vElevation;

        void main() {
          vec3 color1 = vec3(0.388, 0.4, 0.945); // Primary Indigo
          vec3 color2 = vec3(0.925, 0.282, 0.6);  // Pink Accent
          vec3 color3 = vec3(1.0, 0.42, 0.208);   // Orange Secondary
          
          float mixValue = sin(vUv.x * 3.14159 + time * 0.5) * 0.5 + 0.5;
          vec3 finalColor = mix(color1, color2, mixValue);
          finalColor = mix(finalColor, color3, vElevation * 0.3 + 0.2);
          
          float opacity = 0.1 + vElevation * 0.05;
          opacity = clamp(opacity, 0.02, 0.15);
          
          gl_FragColor = vec4(finalColor, opacity);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });

    const waveMesh = new THREE.Mesh(waveGeometry, waveMaterial);
    waveMesh.rotation.x = -Math.PI * 0.3;
    waveMesh.position.y = -15;
    scene.add(waveMesh);

    // Create geometric shapes
    const geometries = [
      new THREE.OctahedronGeometry(1),
      new THREE.TetrahedronGeometry(1),
      new THREE.IcosahedronGeometry(1)
    ];

    const shapes: THREE.Mesh[] = [];
    for (let i = 0; i < 8; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = new THREE.MeshBasicMaterial({
        color: brandColors[Math.floor(Math.random() * brandColors.length)],
        transparent: true,
        opacity: 0.1,
        wireframe: true
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 20
      );
      mesh.scale.setScalar(Math.random() * 2 + 0.5);
      
      shapes.push(mesh);
      scene.add(mesh);
    }

    camera.position.z = 20;

    // Mouse movement handler
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      if (waveMaterial.uniforms.mouse) {
        waveMaterial.uniforms.mouse.value.set(mouseRef.current.x, mouseRef.current.y);
      }
    };

    // Resize handler
    const handleResize = () => {
      if (!camera || !renderer) return;
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    // Animation loop
    const animate = () => {
      const time = Date.now() * 0.001;
      
      // Update particle system
      if (particleMaterial.uniforms.time) {
        particleMaterial.uniforms.time.value = time;
      }
      
      // Update wave
      if (waveMaterial.uniforms.time) {
        waveMaterial.uniforms.time.value = time;
      }
      
      // Animate geometric shapes
      shapes.forEach((shape, index) => {
        shape.rotation.x += 0.001 * (index + 1);
        shape.rotation.y += 0.002 * (index + 1);
        shape.position.y += Math.sin(time + index) * 0.01;
      });
      
      // Rotate particle system
      particleSystem.rotation.y += 0.0005;
      
      // Camera gentle movement
      camera.position.x += (mouseRef.current.x * 2 - camera.position.x) * 0.02;
      camera.position.y += (mouseRef.current.y * 2 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);
      
      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of Three.js resources
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (child.material instanceof THREE.Material) {
            child.material.dispose();
          }
        }
      });
      
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ zIndex: -1 }}
    />
  );
}