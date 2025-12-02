import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface AnimatedBackgroundProps {
  className?: string;
}

export function AnimatedBackground({ className = '' }: AnimatedBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Create minimal particles
    const particleCount = 15;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities: number[] = [];

    // Minimal brand colors
    const brandColors = [
      new THREE.Color('#FF5722'), // Primary Orange
    ];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Spiral distribution
      const radius = Math.random() * 20 + 5;
      const angle = (i / particleCount) * Math.PI * 4;
      const height = (Math.random() - 0.5) * 20;
      
      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = height;
      positions[i3 + 2] = Math.sin(angle) * radius;

      // Random velocities
      velocities.push((Math.random() - 0.5) * 0.01);
      velocities.push((Math.random() - 0.5) * 0.01);
      velocities.push((Math.random() - 0.5) * 0.01);

      // Assign colors
      const color = brandColors[Math.floor(Math.random() * brandColors.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Minimal particle material
    const particleMaterial = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    // Create floating geometric shapes - focusing on cubes for mirror effect
    const geometries = [
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.BoxGeometry(1.5, 1.5, 1.5),
      new THREE.BoxGeometry(0.8, 0.8, 0.8)
    ];

    // Minimal geometric shapes
    const shapes: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.015,
        wireframe: true
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      // Position cubes far from center
      const angle = (i / 3) * Math.PI * 2;
      const radius = 35;
      mesh.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 15,
        Math.sin(angle) * radius
      );
      mesh.scale.setScalar(0.8);
      
      shapes.push(mesh);
      scene.add(mesh);
    }

    // Create subtle mirror effect waves
    const waveGeometry = new THREE.PlaneGeometry(60, 60, 16, 16);
    const waveMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.01,
      wireframe: true
    });

    const wave1 = new THREE.Mesh(waveGeometry, waveMaterial);
    wave1.rotation.x = -Math.PI * 0.3;
    wave1.position.y = -10;
    scene.add(wave1);

    camera.position.z = 25;

    // Mouse interaction
    const mouse = { x: 0, y: 0 };
    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    // Animation loop
    const animate = () => {
      const time = Date.now() * 0.001;
      
      // Update particle positions
      const positionsArray = particleSystem.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Organic movement
        positionsArray[i3] += Math.sin(time + i * 0.1) * 0.002;
        positionsArray[i3 + 1] += Math.cos(time + i * 0.1) * 0.002;
        positionsArray[i3 + 2] += Math.sin(time * 0.5 + i * 0.05) * 0.001;
        
        // Boundary checking
        if (Math.abs(positionsArray[i3]) > 25) positionsArray[i3] *= 0.99;
        if (Math.abs(positionsArray[i3 + 1]) > 15) positionsArray[i3 + 1] *= 0.99;
        if (Math.abs(positionsArray[i3 + 2]) > 25) positionsArray[i3 + 2] *= 0.99;
      }
      particleSystem.geometry.attributes.position.needsUpdate = true;
      
      // Animate geometric shapes
      shapes.forEach((shape, index) => {
        shape.rotation.x += 0.001 * (index + 1);
        shape.rotation.y += 0.002 * (index + 1);
        shape.position.y += Math.sin(time + index) * 0.01;
      });
      
      // Animate wave
      wave1.rotation.z += 0.0005;
      
      // Rotate particle system
      particleSystem.rotation.y += 0.0003;
      
      // Gentle camera movement based on mouse
      camera.position.x += (mouse.x * 2 - camera.position.x) * 0.01;
      camera.position.y += (mouse.y * 2 - camera.position.y) * 0.01;
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
      className={`fixed inset-0 pointer-events-none three-background ${className}`}
      style={{ zIndex: 0 }}
    />
  );
}