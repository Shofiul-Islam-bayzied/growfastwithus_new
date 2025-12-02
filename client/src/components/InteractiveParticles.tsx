import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface InteractiveParticlesProps {
  className?: string;
  intensity?: number;
}

export function InteractiveParticles({ className = '', intensity = 1 }: InteractiveParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, velocity: { x: 0, y: 0 } });
  const particlesRef = useRef<THREE.Points | null>(null);

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

    // Create neural network-like particle system
    const particleCount = 200 * intensity;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const connections = new Float32Array(particleCount * 6); // For line connections

    // Brand colors in RGB
    const brandColors = [
      { r: 0.388, g: 0.4, b: 0.945 },    // Primary Indigo
      { r: 0.925, g: 0.282, b: 0.6 },    // Pink Accent
      { r: 1.0, g: 0.42, b: 0.208 },     // Orange Secondary
    ];

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Spiral distribution
      const radius = Math.random() * 25 + 5;
      const angle = (i / particleCount) * Math.PI * 4;
      const height = (Math.random() - 0.5) * 30;
      
      positions[i3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 10;
      positions[i3 + 1] = height;
      positions[i3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 10;

      // Random velocities
      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;

      // Assign colors
      const colorIndex = Math.floor(Math.random() * brandColors.length);
      const color = brandColors[colorIndex];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('particleColor', new THREE.BufferAttribute(colors, 3));

    // Advanced particle material with custom shaders
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        mouse: { value: new THREE.Vector2(0, 0) },
        mouseVelocity: { value: 0 },
        pixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
      },
      vertexShader: `
        uniform float time;
        uniform vec2 mouse;
        uniform float mouseVelocity;
        uniform float pixelRatio;
        attribute vec3 particleColor;
        varying vec3 vColor;
        varying float vIntensity;

        void main() {
          vColor = particleColor;
          
          vec3 pos = position;
          
          // Organic movement
          pos.x += sin(time * 0.5 + position.y * 0.1) * 1.5;
          pos.y += cos(time * 0.3 + position.x * 0.1) * 1.0;
          pos.z += sin(time * 0.4 + position.x * 0.05 + position.y * 0.05) * 0.8;
          
          // Mouse interaction - attraction/repulsion
          vec2 mousePos = mouse * 20.0;
          float distanceToMouse = distance(pos.xy, mousePos);
          float mouseInfluence = exp(-distanceToMouse * 0.1) * mouseVelocity * 5.0;
          
          vec2 mouseDirection = normalize(pos.xy - mousePos);
          pos.xy += mouseDirection * mouseInfluence;
          
          // Calculate intensity based on mouse proximity
          vIntensity = 1.0 + mouseInfluence * 2.0;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          float size = (20.0 + mouseInfluence * 30.0) * pixelRatio;
          gl_PointSize = size * (300.0 / -mvPosition.z);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vIntensity;

        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          
          // Create glowing effect
          float strength = 1.0 - (dist * 2.0);
          strength = pow(strength, 2.0);
          
          // Add pulsing glow
          float glow = exp(-dist * 4.0) * vIntensity;
          
          vec3 finalColor = vColor * (2.0 + glow);
          float alpha = strength * (0.3 + glow * 0.7);
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });

    const particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // Create connection lines between nearby particles
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(particleCount * particleCount * 6);
    const lineColors = new Float32Array(particleCount * particleCount * 9);
    
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('lineColor', new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        mouse: { value: new THREE.Vector2(0, 0) }
      },
      vertexShader: `
        uniform float time;
        uniform vec2 mouse;
        attribute vec3 lineColor;
        varying vec3 vColor;
        varying float vOpacity;

        void main() {
          vColor = lineColor;
          
          vec3 pos = position;
          float distanceToMouse = distance(pos.xy, mouse * 20.0);
          vOpacity = exp(-distanceToMouse * 0.2) * 0.3 + 0.1;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vOpacity;

        void main() {
          gl_FragColor = vec4(vColor, vOpacity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    camera.position.z = 30;

    // Mouse tracking with velocity
    let lastMouseTime = Date.now();
    const handleMouseMove = (event: MouseEvent) => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastMouseTime;
      lastMouseTime = currentTime;

      const newX = (event.clientX / window.innerWidth) * 2 - 1;
      const newY = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Calculate velocity
      const velocityX = (newX - mouseRef.current.x) / (deltaTime / 1000);
      const velocityY = (newY - mouseRef.current.y) / (deltaTime / 1000);
      const velocity = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
      
      mouseRef.current.velocity.x = velocityX;
      mouseRef.current.velocity.y = velocityY;
      mouseRef.current.x = newX;
      mouseRef.current.y = newY;
      
      // Update shader uniforms
      if (particleMaterial.uniforms.mouse) {
        particleMaterial.uniforms.mouse.value.set(newX, newY);
        particleMaterial.uniforms.mouseVelocity.value = Math.min(velocity, 5);
      }
      if (lineMaterial.uniforms.mouse) {
        lineMaterial.uniforms.mouse.value.set(newX, newY);
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
      
      // Update uniforms
      if (particleMaterial.uniforms.time) {
        particleMaterial.uniforms.time.value = time;
      }
      if (lineMaterial.uniforms.time) {
        lineMaterial.uniforms.time.value = time;
      }
      
      // Update particle positions for organic movement
      if (!particles.geometry.attributes.position) return;
      const positions = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] += velocities[i3];
        positions[i3 + 1] += velocities[i3 + 1];
        positions[i3 + 2] += velocities[i3 + 2];
        
        // Boundary checking
        if (Math.abs(positions[i3]) > 30) velocities[i3] *= -0.8;
        if (Math.abs(positions[i3 + 1]) > 20) velocities[i3 + 1] *= -0.8;
        if (Math.abs(positions[i3 + 2]) > 30) velocities[i3 + 2] *= -0.8;
      }
      particles.geometry.attributes.position.needsUpdate = true;
      
      // Update connection lines
      let lineIndex = 0;
      if (!lines.geometry.attributes.position || !lines.geometry.attributes.lineColor) return;
      const linePositions = lines.geometry.attributes.position.array as Float32Array;
      const lineColors = lines.geometry.attributes.lineColor.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const i3 = i * 3;
          const j3 = j * 3;
          
          const dx = positions[i3] - positions[j3];
          const dy = positions[i3 + 1] - positions[j3 + 1];
          const dz = positions[i3 + 2] - positions[j3 + 2];
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
          
          if (distance < 8 && lineIndex < linePositions.length - 6) {
            // Add line
            linePositions[lineIndex] = positions[i3];
            linePositions[lineIndex + 1] = positions[i3 + 1];
            linePositions[lineIndex + 2] = positions[i3 + 2];
            linePositions[lineIndex + 3] = positions[j3];
            linePositions[lineIndex + 4] = positions[j3 + 1];
            linePositions[lineIndex + 5] = positions[j3 + 2];
            
            // Set line colors
            const colorI = colors[i3];
            const colorJ = colors[j3];
            lineColors[lineIndex] = colorI;
            lineColors[lineIndex + 1] = colors[i3 + 1];
            lineColors[lineIndex + 2] = colors[i3 + 2];
            lineColors[lineIndex + 3] = colorJ;
            lineColors[lineIndex + 4] = colors[j3 + 1];
            lineColors[lineIndex + 5] = colors[j3 + 2];
            
            lineIndex += 6;
          }
        }
      }
      
      // Clear remaining lines
      for (let i = lineIndex; i < linePositions.length; i++) {
        linePositions[i] = 0;
        if (i < lineColors.length) lineColors[i] = 0;
      }
      
      lines.geometry.attributes.position.needsUpdate = true;
      lines.geometry.attributes.lineColor.needsUpdate = true;
      
      // Gentle camera rotation
      particles.rotation.y += 0.001;
      lines.rotation.y += 0.001;
      
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
      
      // Dispose resources
      geometry.dispose();
      particleMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    };
  }, [intensity]);

  return (
    <div 
      ref={containerRef} 
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
    />
  );
}