import React, { Suspense } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Sparkles, ShoppingBag } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Text3D, Environment } from '@react-three/drei';
import { useQuery } from 'react-query';
import axios from 'axios';
import Product3DViewer from '../components/3D/Product3DViewer';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { useCartStore } from '../store/cartStore';

const HomeContainer = styled.div`
  overflow-x: hidden;
`;

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  z-index: 2;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
`;

const HeroText = styled.div`
  color: white;

  h1 {
    font-size: 4rem;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 24px;
    background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;

    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
  }

  p {
    font-size: 1.25rem;
    line-height: 1.6;
    margin-bottom: 32px;
    opacity: 0.9;
  }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  background: white;
  color: #667eea;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  background: transparent;
  color: white;
  text-decoration: none;
  border: 2px solid white;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;

  &:hover {
    background: white;
    color: #667eea;
    transform: translateY(-3px);
  }
`;

const Hero3D = styled.div`
  height: 500px;
  position: relative;

  @media (max-width: 768px) {
    height: 300px;
  }
`;

const FloatingElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
`;

const FloatingIcon = styled(motion.div)`
  position: absolute;
  color: rgba(255, 255, 255, 0.3);
`;

const Section = styled.section`
  padding: 100px 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-top: 60px;
`;

const FeatureCard = styled(motion.div)`
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 16px;
    color: #333;
  }

  p {
    color: #666;
    line-height: 1.6;
  }
`;

const ProductShowcase = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 40px;
  margin-top: 60px;
`;

const ProductCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  }
`;

const ProductInfo = styled.div`
  padding: 24px;

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 8px;
    color: #333;
  }

  p {
    color: #666;
    margin-bottom: 16px;
  }

  .price {
    font-size: 1.5rem;
    font-weight: 700;
    color: #667eea;
    margin-bottom: 16px;
  }
`;

const AddToCartButton = styled(motion.button)`
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

// 3D Scene Component
const Hero3DScene = () => {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Environment preset="sunset" />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshPhysicalMaterial
              color="#ff6b6b"
              metalness={0.1}
              roughness={0.2}
              transmission={0.8}
              thickness={0.5}
              clearcoat={1}
            />
          </mesh>
        </Float>

        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
          <mesh position={[3, 1, -2]}>
            <cylinderGeometry args={[0.5, 0.5, 2, 32]} />
            <meshPhysicalMaterial
              color="#4ecdc4"
              metalness={0.2}
              roughness={0.1}
              transmission={0.9}
            />
          </mesh>
        </Float>

        <Float speed={2.5} rotationIntensity={0.7} floatIntensity={0.7}>
          <mesh position={[-3, -1, -1]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshPhysicalMaterial
              color="#45b7d1"
              metalness={0.3}
              roughness={0.1}
              clearcoat={1}
            />
          </mesh>
        </Float>

        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
      </Suspense>
    </Canvas>
  );
};

const Home = () => {
  const { addItem } = useCartStore();

  const features = [
    {
      icon: <Sparkles size={32} />,
      title: "Premium Quality",
      description: "Carefully curated cosmetics from the world's finest brands, ensuring exceptional quality and performance."
    },
    {
      icon: <Star size={32} />,
      title: "3D Product View",
      description: "Experience products like never before with our immersive 3D visualization technology."
    },
    {
      icon: <ShoppingBag size={32} />,
      title: "Fast Delivery",
      description: "Quick and secure shipping worldwide with tracking and insurance included."
    }
  ];

  // Fetch featured products from API
  const { data: featuredProducts = [], isLoading: featuredLoading } = useQuery(
    'featuredProducts',
    async () => {
      const response = await axios.get('/api/products/featured/list');
      return response.data;
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  const handleAddToCart = (product) => {
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.url || '',
      quantity: 1
    });
  };

  return (
    <HomeContainer>
      <HeroSection>
        <FloatingElements>
          {[...Array(6)].map((_, i) => (
            <FloatingIcon
              key={i}
              initial={{ opacity: 0, y: 100 }}
              animate={{ 
                opacity: [0.3, 0.7, 0.3], 
                y: [100, -20, 100],
                x: [0, Math.random() * 100 - 50, 0]
              }}
              transition={{ 
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: i * 0.5
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            >
              <Sparkles size={24} />
            </FloatingIcon>
          ))}
        </FloatingElements>

        <HeroContent>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <HeroText>
              <h1>Discover Your Perfect Beauty</h1>
              <p>
                Experience luxury cosmetics with cutting-edge 3D technology. 
                Explore, visualize, and find products that enhance your natural radiance.
              </p>
              <HeroButtons>
                <PrimaryButton to="/products">
                  Shop Now <ArrowRight size={20} />
                </PrimaryButton>
                <SecondaryButton to="/about">
                  Learn More
                </SecondaryButton>
              </HeroButtons>
            </HeroText>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Hero3D>
              <Hero3DScene />
            </Hero3D>
          </motion.div>
        </HeroContent>
      </HeroSection>

      <Section>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <SectionTitle>Why Choose AuraFix?</SectionTitle>
          <FeaturesGrid>
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="icon">
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </motion.div>
      </Section>

      <Section>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <SectionTitle>Featured Products</SectionTitle>
          {featuredLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 20px' }}>
              <LoadingSpinner />
            </div>
          ) : featuredProducts.length > 0 ? (
            <ProductShowcase>
              {featuredProducts.map((product, index) => (
                <ProductCard
                  key={product._id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div style={{ height: '250px' }}>
                    <Product3DViewer 
                      product={product} 
                      height="250px"
                      showControls={false}
                    />
                  </div>
                  <ProductInfo>
                    <h3>{product.name}</h3>
                    <p>{product.shortDescription || product.description}</p>
                    <div className="price">${product.price}</div>
                    <AddToCartButton
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingBag size={18} />
                      Add to Cart
                    </AddToCartButton>
                  </ProductInfo>
                </ProductCard>
              ))}
            </ProductShowcase>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px',
              color: '#666',
              fontSize: '1.2rem'
            }}>
              <ShoppingBag size={48} style={{ marginBottom: '20px', opacity: 0.5 }} />
              <p>No featured products available yet.</p>
              <p style={{ fontSize: '1rem', marginTop: '10px' }}>
                Check back soon for amazing cosmetic products!
              </p>
              <PrimaryButton to="/products" style={{ 
                marginTop: '20px',
                display: 'inline-flex'
              }}>
                Browse All Products <ArrowRight size={20} />
              </PrimaryButton>
            </div>
          )}
        </motion.div>
      </Section>
    </HomeContainer>
  );
};

export default Home;
