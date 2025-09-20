import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, ShoppingBag, Sparkles } from 'lucide-react';

const HeroContainer = styled.div`
  height: 550px;
  width: 100%;
  position: relative;
  border-radius: 25px;
  overflow: hidden;
  background: linear-gradient(135deg, 
    rgba(59, 130, 246, 0.1) 0%, 
    rgba(147, 197, 253, 0.1) 50%, 
    rgba(219, 234, 254, 0.1) 100%);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, transparent 0%, rgba(59, 130, 246, 0.1) 100%);
    z-index: 1;
    pointer-events: none;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 40px;
  
  @media (max-width: 768px) {
    padding: 0 20px;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }
`;

const TextContent = styled(motion.div)`
  flex: 1;
  max-width: 500px;
  
  @media (max-width: 768px) {
    margin-bottom: 30px;
  }
`;

const Title = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e40af, #3b82f6, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const CTAButtons = styled(motion.div)`
  display: flex;
  gap: 15px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const PrimaryButton = styled(motion.button)`
  padding: 15px 30px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(59, 130, 246, 0.4);
  }
`;

const SecondaryButton = styled(motion.button)`
  padding: 15px 30px;
  background: rgba(255, 255, 255, 0.9);
  color: #3b82f6;
  border: 2px solid #3b82f6;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: #3b82f6;
    color: white;
  }
`;

const ProductShowcase = styled(motion.div)`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 100%;
`;

const ProductCarousel = styled.div`
  position: relative;
  width: 400px;
  height: 400px;
  
  @media (max-width: 768px) {
    width: 300px;
    height: 300px;
  }
`;

const ProductSlide = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ProductImage = styled.img`
  width: 250px;
  height: 250px;
  object-fit: cover;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(59, 130, 246, 0.3);
  
  @media (max-width: 768px) {
    width: 200px;
    height: 200px;
  }
`;

const ProductInfo = styled.div`
  text-align: center;
  margin-top: 20px;
  
  h3 {
    color: #1e293b;
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 5px;
  }
  
  p {
    color: #64748b;
    font-size: 0.9rem;
  }
`;

const NavigationButton = styled(motion.button)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  color: #3b82f6;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  z-index: 3;
  
  &.prev {
    left: -25px;
  }
  
  &.next {
    right: -25px;
  }
  
  &:hover {
    background: #3b82f6;
    color: white;
  }
`;

const FloatingElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
`;

const FloatingIcon = styled(motion.div)`
  position: absolute;
  color: #3b82f6;
  opacity: 0.3;
`;

const Indicators = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 3;
`;

const Indicator = styled.button`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: ${props => props.active ? '#3b82f6' : 'rgba(255, 255, 255, 0.5)'};
  cursor: pointer;
  transition: all 0.3s ease;
`;

const PlaceholderImage = styled.div`
  width: 250px;
  height: 250px;
  background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 16px;
  font-weight: 500;
  box-shadow: 0 20px 40px rgba(59, 130, 246, 0.3);
  
  @media (max-width: 768px) {
    width: 200px;
    height: 200px;
  }
`;

const HeroSection = ({ featuredProducts = [], onShopNow, onLearnMore }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageErrors, setImageErrors] = useState({});

  // Default products if none provided
  const defaultProducts = [
    {
      id: 1,
      name: "Radiant Glow Serum",
      description: "Transform your skin with our bestselling serum",
      images: []
    },
    {
      id: 2,
      name: "Velvet Matte Lipstick",
      description: "Long-lasting color that feels weightless",
      images: []
    },
    {
      id: 3,
      name: "Hydrating Face Cream",
      description: "24-hour moisture for all skin types",
      images: []
    }
  ];

  const products = featuredProducts.length > 0 ? featuredProducts.slice(0, 3) : defaultProducts;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % products.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [products.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + products.length) % products.length);
  };

  const getImageUrl = (product) => {
    if (product?.images && product.images.length > 0) {
      if (typeof product.images[0] === 'object' && product.images[0].url) {
        return product.images[0].url;
      }
      if (typeof product.images[0] === 'string') {
        return product.images[0];
      }
    }
    return null;
  };

  const handleImageError = (productId) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  const floatingIcons = [
    { Icon: Sparkles, top: '20%', left: '10%', delay: 0 },
    { Icon: Star, top: '30%', right: '15%', delay: 1 },
    { Icon: ShoppingBag, bottom: '25%', left: '8%', delay: 2 },
    { Icon: Sparkles, top: '60%', right: '10%', delay: 3 },
  ];

  return (
    <HeroContainer>
      <FloatingElements>
        {floatingIcons.map(({ Icon, delay, ...position }, index) => (
          <FloatingIcon
            key={index}
            style={position}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: delay,
              ease: "easeInOut"
            }}
          >
            <Icon size={24} />
          </FloatingIcon>
        ))}
      </FloatingElements>

      <HeroContent>
        <TextContent
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Title
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            AURAFIXX
          </Title>
          
          <Subtitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover the perfect beauty products tailored just for you. 
            Experience luxury cosmetics that enhance your natural radiance.
          </Subtitle>
          
          <CTAButtons
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <PrimaryButton
              onClick={onShopNow}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingBag size={20} />
              Shop Now
            </PrimaryButton>
            
            <SecondaryButton
              onClick={onLearnMore}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </SecondaryButton>
          </CTAButtons>
        </TextContent>

        <ProductShowcase
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <ProductCarousel>
            <AnimatePresence mode="wait">
              <ProductSlide
                key={currentSlide}
                initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                transition={{ duration: 0.6 }}
              >
                {(() => {
                  const product = products[currentSlide];
                  const imageUrl = getImageUrl(product);
                  
                  return (
                    <>
                      {imageUrl && !imageErrors[product.id] ? (
                        <ProductImage
                          src={imageUrl}
                          alt={product.name}
                          onError={() => handleImageError(product.id)}
                        />
                      ) : (
                        <PlaceholderImage>
                          {product.name}
                        </PlaceholderImage>
                      )}
                      
                      <ProductInfo>
                        <h3>{product.name}</h3>
                        <p>{product.description || product.shortDescription}</p>
                      </ProductInfo>
                    </>
                  );
                })()}
              </ProductSlide>
            </AnimatePresence>

            <NavigationButton
              className="prev"
              onClick={prevSlide}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft size={24} />
            </NavigationButton>

            <NavigationButton
              className="next"
              onClick={nextSlide}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight size={24} />
            </NavigationButton>
          </ProductCarousel>

          <Indicators>
            {products.map((_, index) => (
              <Indicator
                key={index}
                active={index === currentSlide}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </Indicators>
        </ProductShowcase>
      </HeroContent>
    </HeroContainer>
  );
};

export default HeroSection;
