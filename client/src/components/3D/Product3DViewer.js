import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  ContactShadows, 
  PresentationControls,
  Float,
  Text,
  Html
} from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ViewerContainer = styled.div`
  width: 100%;
  height: ${props => props.height || '400px'};
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: relative;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  z-index: 10;
`;

const Controls = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 5;
`;

const ControlButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  color: #667eea;
`;

const ColorSwatch = styled(motion.div)`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  border: 3px solid ${props => props.$active ? '#667eea' : 'transparent'};
  background: ${props => props.color};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ColorPalette = styled.div`
  display: flex;
  gap: 8px;
`;

// Error Boundary for 3D Models
class ModelErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('3D Model loading error:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }

    return this.props.children;
  }
}

// GLTF Model Component
const GLTFModel = ({ url, color, scale, rotation }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const gltf = useLoader(GLTFLoader, url);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <primitive
      ref={meshRef}
      object={gltf.scene}
      scale={scale}
      rotation={rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    />
  );
};

// Product Image Display Component
const ProductImageDisplay = ({ product, selectedColor }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState(null);

  // Get the product image URL
  const getImageUrl = () => {
    if (product?.images && product.images.length > 0) {
      // If it's an array of image objects
      if (typeof product.images[0] === 'object' && product.images[0].url) {
        return product.images[0].url;
      }
      // If it's an array of URLs
      if (typeof product.images[0] === 'string') {
        return product.images[0];
      }
    }
    // Fallback to a placeholder image
    return 'https://via.placeholder.com/400x400/f0f0f0/999999?text=No+Image';
  };

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  // Load texture
  React.useEffect(() => {
    const loader = new THREE.TextureLoader();
    const imageUrl = getImageUrl();
    
    loader.load(
      imageUrl,
      (loadedTexture) => {
        loadedTexture.flipY = false;
        setTexture(loadedTexture);
      },
      undefined,
      (error) => {
        console.warn('Failed to load product image:', error);
        // Create a fallback colored texture
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = selectedColor;
        ctx.fillRect(0, 0, 256, 256);
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(product?.name || 'Product', 128, 128);
        
        const fallbackTexture = new THREE.CanvasTexture(canvas);
        setTexture(fallbackTexture);
      }
    );
  }, [product, selectedColor]);

  return (
    <Float speed={1} rotationIntensity={0.3} floatIntensity={0.3}>
      <group
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.05 : 1}
      >
        {/* Main product image plane */}
        <mesh position={[0, 0, 0]} castShadow>
          <planeGeometry args={[3, 3]} />
          <meshStandardMaterial
            map={texture}
            transparent
            alphaTest={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Subtle background glow */}
        <mesh position={[0, 0, -0.1]} scale={1.2}>
          <planeGeometry args={[3.5, 3.5]} />
          <meshBasicMaterial
            color={selectedColor}
            transparent
            opacity={0.1}
          />
        </mesh>

        {/* Product name text */}
        {product?.name && (
          <Text
            position={[0, -2, 0]}
            fontSize={0.3}
            color="#333"
            anchorX="center"
            anchorY="middle"
            maxWidth={4}
            textAlign="center"
          >
            {product.name}
          </Text>
        )}

        {/* Brand text */}
        {product?.brand && (
          <Text
            position={[0, -2.5, 0]}
            fontSize={0.2}
            color="#666"
            anchorX="center"
            anchorY="middle"
            maxWidth={4}
            textAlign="center"
          >
            {product.brand}
          </Text>
        )}
      </group>
    </Float>
  );
};

// Particle System for magical effects
const Particles = () => {
  const particlesRef = useRef();
  const particleCount = 100;

  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

    colors[i * 3] = Math.random();
    colors[i * 3 + 1] = Math.random();
    colors[i * 3 + 2] = Math.random();
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.002;
      particlesRef.current.rotation.x += 0.001;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

const Product3DViewer = ({ 
  product, 
  height = '400px',
  showControls = true,
  autoRotate = true 
}) => {
  const [selectedColor, setSelectedColor] = useState('#ff6b6b');
  const [isLoading, setIsLoading] = useState(true);
  const [modelError, setModelError] = useState(false);

  const colors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', 
    '#f9ca24', '#f0932b', '#eb4d4b',
    '#6c5ce7', '#a29bfe', '#fd79a8'
  ];

  return (
    <ViewerContainer height={height}>
      {isLoading && (
        <LoadingOverlay>
          <div className="spinner" />
        </LoadingOverlay>
      )}

      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        shadows
        onCreated={() => setIsLoading(false)}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />

          {/* Environment */}
          <Environment preset="studio" />

          {/* 3D Model */}
          <PresentationControls
            enabled={true}
            global={false}
            cursor={true}
            snap={false}
            speed={1}
            zoom={1}
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 3, Math.PI / 3]}
            azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
          >
            {/* Display real product image */}
            <ProductImageDisplay
              product={product}
              selectedColor={selectedColor}
            />
          </PresentationControls>

          {/* Particles */}
          <Particles />

          {/* Ground */}
          <ContactShadows
            position={[0, -3, 0]}
            opacity={0.4}
            scale={10}
            blur={2}
            far={4}
          />

          {/* Controls */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            autoRotate={autoRotate}
            autoRotateSpeed={2}
            minDistance={3}
            maxDistance={15}
          />
        </Suspense>
      </Canvas>

      {showControls && (
        <Controls>
          <ColorPalette>
            {colors.map((color, index) => (
              <ColorSwatch
                key={index}
                color={color}
                $active={selectedColor === color}
                onClick={() => setSelectedColor(color)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              />
            ))}
          </ColorPalette>

          <div style={{ display: 'flex', gap: '8px' }}>
            <ControlButton
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Reset View"
            >
              🔄
            </ControlButton>
            <ControlButton
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Fullscreen"
            >
              ⛶
            </ControlButton>
          </div>
        </Controls>
      )}
    </ViewerContainer>
  );
};

export default Product3DViewer;
