import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Sparkles, ShoppingBag, Heart, Zap, Crown } from 'lucide-react';
import { useQuery } from 'react-query';
import axios from 'axios';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { useCartStore } from '../store/cartStore';

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.4); }
  50% { box-shadow: 0 0 40px rgba(102, 126, 234, 0.8), 0 0 60px rgba(102, 126, 234, 0.4); }
`;

const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const HomeContainer = styled.div`
  overflow-x: hidden;
  position: relative;
`;

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%);
  background-size: 400% 400%;
  ${css`animation: ${gradientMove} 15s ease infinite;`}
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
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
    font-size: 4.5rem;
    font-weight: 900;
    line-height: 1.1;
    margin-bottom: 24px;
    background: linear-gradient(135deg, #fff 0%, #f0f0f0 50%, #fff 100%);
    background-size: 200% 100%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    ${css`animation: ${gradientMove} 3s ease infinite;`}
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      background-size: 200% 100%;
      ${css`animation: ${gradientMove} 2s ease infinite;`}
      pointer-events: none;
    }

    @media (max-width: 768px) {
      font-size: 2.8rem;
    }

    @media (max-width: 480px) {
      font-size: 2.2rem;
    }
  }

  p {
    font-size: 1.3rem;
    line-height: 1.7;
    margin-bottom: 32px;
    opacity: 0.95;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    font-weight: 300;
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
  padding: 18px 36px;
  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
  color: #667eea;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    transition: left 0.6s;
  }

  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3), 0 0 30px rgba(102, 126, 234, 0.3);
    
    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(-2px) scale(0.98);
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 18px 36px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  text-decoration: none;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.2));
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.95);
    color: #667eea;
    transform: translateY(-4px) scale(1.02);
    border-color: rgba(255, 255, 255, 0.8);
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
    
    &::before {
      opacity: 1;
    }
  }
`;

const HeroImage = styled.div`
  height: 550px;
  position: relative;
  background: url('https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80') center/cover;
  border-radius: 25px;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);
  ${css`animation: ${float} 6s ease-in-out infinite;`}
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    border-radius: 25px;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(135deg, #667eea, #764ba2, #667eea);
    background-size: 300% 300%;
    ${css`animation: ${gradientMove} 4s ease infinite;`}
    border-radius: 27px;
    z-index: -1;
  }

  @media (max-width: 768px) {
    height: 350px;
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
  color: rgba(255, 255, 255, 0.4);
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
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
  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
  padding: 45px;
  border-radius: 25px;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(102, 126, 234, 0.05);
  text-align: center;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%);
    background-size: 200% 100%;
    ${css`animation: ${gradientMove} 3s ease infinite;`}
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.03), transparent);
    transition: left 0.6s;
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 25px 70px rgba(0, 0, 0, 0.15), 0 0 30px rgba(102, 126, 234, 0.1);
    
    &::after {
      left: 100%;
    }
    
    .icon {
      ${css`animation: ${glow} 2s ease infinite;`}
      transform: scale(1.1);
    }
  }

  .icon {
    width: 90px;
    height: 90px;
    margin: 0 auto 28px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }

  h3 {
    font-size: 1.6rem;
    font-weight: 700;
    margin-bottom: 18px;
    color: #2d3748;
    background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  p {
    color: #718096;
    line-height: 1.7;
    font-size: 1.05rem;
  }
`;

const ProductShowcase = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 40px;
  margin-top: 60px;
`;

const ProductCard = styled(motion.div)`
  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
  border-radius: 25px;
  overflow: hidden;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(102, 126, 234, 0.05);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(118, 75, 162, 0.02) 100%);
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 25px 70px rgba(0, 0, 0, 0.15), 0 0 30px rgba(102, 126, 234, 0.1);
    
    &::before {
      opacity: 1;
    }
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


const Home = () => {
  const { addItem } = useCartStore();

  const features = [
    {
      icon: <Crown size={36} />,
      title: "Premium Quality",
      description: "Carefully curated cosmetics from the world's finest brands, ensuring exceptional quality and performance that transforms your beauty routine."
    },
    {
      icon: <Sparkles size={36} />,
      title: "Expert Curation",
      description: "Our beauty experts carefully select each product to ensure you get the best quality cosmetics that enhance your natural radiance."
    },
    {
      icon: <Zap size={36} />,
      title: "Fast Delivery",
      description: "Lightning-fast and secure shipping worldwide with real-time tracking and premium insurance protection for your precious beauty products."
    }
  ];

  // Fetch featured products from API
  const { data: featuredProducts = [], isLoading: featuredLoading, error: featuredError } = useQuery(
    'featuredProducts',
    async () => {
      try {
        const response = await axios.get('/api/products/featured/list');
        return response.data;
      } catch (error) {
        console.error('Error fetching featured products:', error);
        // Return empty array instead of throwing to prevent app crash
        return [];
      }
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      onError: (error) => {
        console.error('Featured products query error:', error);
      }
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
                Experience luxury cosmetics with premium quality products. 
                Explore and find products that enhance your natural radiance.
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
            <HeroImage />
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
                  <div style={{ 
                    height: '250px',
                    background: product.images?.[0]?.url ? `url(${product.images[0].url})` : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '20px 20px 0 0'
                  }} />
                  <ProductInfo>
                    <h3>{product.name}</h3>
                    <p>{product.shortDescription || product.description}</p>
                    <div className="price">KSH {product.price}</div>
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
