import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled, { keyframes, css } from 'styled-components';
import { Link } from 'react-router-dom';
import { Sparkles, Leaf, Award, Users, Star } from 'lucide-react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import Navbar from '../components/Layout/Navbar';
import HeroComponent from '../components/Hero/HeroSection';
import ProductCardComponent from '../components/Product/ProductCard';
import VirtualTryOn from '../components/Product/VirtualTryOn';
import { useInView } from 'react-intersection-observer';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.4); }
  50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.8), 0 0 60px rgba(59, 130, 246, 0.4); }
`;

const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const neonPulse = keyframes`
  0%, 100% { 
    text-shadow: 0 0 20px #3b82f6, 0 0 40px #3b82f6, 0 0 60px #3b82f6;
    transform: scale(1);
  }
  50% { 
    text-shadow: 0 0 30px #3b82f6, 0 0 60px #3b82f6, 0 0 90px #3b82f6;
    transform: scale(1.02);
  }
`;

const electricGlow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 30px rgba(59, 130, 246, 0.6), 0 0 60px rgba(147, 197, 253, 0.4);
  }
  50% { 
    box-shadow: 0 0 50px rgba(59, 130, 246, 0.9), 0 0 100px rgba(147, 197, 253, 0.7);
  }
`;

const holographicShift = keyframes`
  0% { filter: hue-rotate(0deg) saturate(1.2); }
  25% { filter: hue-rotate(90deg) saturate(1.5); }
  50% { filter: hue-rotate(180deg) saturate(1.8); }
  75% { filter: hue-rotate(270deg) saturate(1.5); }
  100% { filter: hue-rotate(360deg) saturate(1.2); }
`;

const HomeContainer = styled.div`
  width: 100%;
  overflow-x: hidden;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  min-height: 100vh;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 0;
    margin: 0;
  }
`;

const ContentOverlay = styled.div`
  position: relative;
  z-index: 2;
  background: transparent;
`;

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 0 5%;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    min-height: 90vh;
    padding: 20px 4%;
  }
  
  @media (max-width: 480px) {
    min-height: 85vh;
    padding: 20px 6%;
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
    padding: 0 10px;
  }
  
  @media (max-width: 480px) {
    gap: 30px;
    padding: 0 5px;
  }
`;

const HeroText = styled.div`
  color: white;

  h1 {
    font-size: 5.5rem;
    font-weight: 900;
    line-height: 1.1;
    margin-bottom: 24px;
    background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 25%, #93c5fd 50%, #1d4ed8 75%, #3b82f6 100%);
    background-size: 300% 100%;
    color: transparent;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    ${css`animation: ${gradientMove} 2s ease infinite, ${neonPulse} 3s ease infinite;`}
    position: relative;
    transform-style: preserve-3d;
    
    &::before {
      content: attr(data-text);
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      background: linear-gradient(135deg, #3b82f6, #60a5fa);
      color: transparent;
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      transform: translateZ(-10px) scale(1.05);
      opacity: 0.3;
      filter: blur(2px);
    }

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.3), transparent);
      background-size: 200% 100%;
      ${css`animation: ${gradientMove} 1.5s ease infinite;`}
      pointer-events: none;
      mix-blend-mode: overlay;
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
    
    @media (max-width: 768px) {
      font-size: 1.1rem;
      margin-bottom: 28px;
      line-height: 1.6;
    }
    
    @media (max-width: 480px) {
      font-size: 1rem;
      margin-bottom: 24px;
      line-height: 1.5;
      padding: 0 10px;
    }
  }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 30px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
    padding: 0 20px;
  }
  
  @media (max-width: 480px) {
    gap: 12px;
    padding: 0 10px;
    margin-top: 25px;
  }
`;

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 20px 40px;
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 50%, #3b82f6 100%);
  background-size: 200% 100%;
  color: #000;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 900;
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  ${css`animation: ${electricGlow} 2s ease infinite;`}
  position: relative;
  overflow: hidden;
  border: 2px solid transparent;
  background-clip: padding-box;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
    transition: left 0.6s;
  }

  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(135deg, #3b82f6, #60a5fa, #1d4ed8);
    background-size: 300% 100%;
    ${css`animation: ${gradientMove} 2s ease infinite;`}
    border-radius: 50px;
    z-index: -1;
  }

  &:hover {
    transform: translateY(-6px) scale(1.05) rotateX(10deg);
    background-position: 100% 0;
    text-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
    
    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(-3px) scale(0.98);
  }
  
  @media (max-width: 768px) {
    padding: 16px 32px;
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    padding: 14px 28px;
    font-size: 1rem;
    letter-spacing: 0.5px;
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 20px 40px;
  background: rgba(0, 0, 0, 0.3);
  color: #60a5fa;
  text-decoration: none;
  border: 2px solid #60a5fa;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
  text-shadow: 0 0 10px rgba(96, 165, 250, 0.5);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(96, 165, 250, 0.1), rgba(59, 130, 246, 0.1));
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover {
    background: rgba(96, 165, 250, 0.2);
    color: #000;
    transform: translateY(-6px) scale(1.05) rotateX(10deg);
    border-color: #3b82f6;
    box-shadow: 0 0 40px rgba(96, 165, 250, 0.6), 0 15px 50px rgba(0, 0, 0, 0.3);
    text-shadow: 0 0 20px rgba(96, 165, 250, 0.8);
    
    &::before {
      opacity: 1;
    }
  }
  
  @media (max-width: 768px) {
    padding: 16px 32px;
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    padding: 14px 28px;
    font-size: 1rem;
    letter-spacing: 0.5px;
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
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(29, 78, 216, 0.1) 100%);
    border-radius: 25px;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8, #3b82f6);
    background-size: 300% 300%;
    ${css`animation: ${gradientMove} 4s ease infinite;`}
    border-radius: 27px;
    z-index: -1;
  }

  @media (max-width: 768px) {
    height: 350px;
    border-radius: 20px;
    margin: 0 10px;
  }
  
  @media (max-width: 480px) {
    height: 280px;
    border-radius: 16px;
    margin: 0 5px;
  }
`;


const Section = styled.section`
  padding: 100px 20px;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 60px 16px;
  }
  
  @media (max-width: 480px) {
    padding: 40px 12px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 60px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 40px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.6rem;
    margin-bottom: 30px;
  }
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
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #3b82f6 100%);
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
    background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.03), transparent);
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
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
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
  
  @media (max-width: 768px) {
    padding: 30px 20px;
    border-radius: 20px;
    
    .icon {
      width: 70px;
      height: 70px;
      margin-bottom: 20px;
    }
    
    h3 {
      font-size: 1.4rem;
      margin-bottom: 15px;
    }
    
    p {
      font-size: 1rem;
    }
  }
  
  @media (max-width: 480px) {
    padding: 25px 15px;
    border-radius: 16px;
    
    .icon {
      width: 60px;
      height: 60px;
      margin-bottom: 16px;
    }
    
    h3 {
      font-size: 1.2rem;
      margin-bottom: 12px;
    }
    
    p {
      font-size: 0.9rem;
      line-height: 1.6;
    }
  }
`;

const ProductShowcase = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 40px;
  margin-top: 60px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 30px;
    margin-top: 40px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-top: 30px;
  }
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
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(29, 78, 216, 0.02) 100%);
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
  
  @media (max-width: 768px) {
    border-radius: 20px;
    
    &:hover {
      transform: translateY(-8px) scale(1.01);
    }
  }
  
  @media (max-width: 480px) {
    border-radius: 16px;
    
    &:hover {
      transform: translateY(-4px) scale(1.005);
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
    color: #3b82f6;
    margin-bottom: 16px;
  }
  
  @media (max-width: 768px) {
    padding: 20px;
    
    h3 {
      font-size: 1.1rem;
    }
    
    p {
      font-size: 0.9rem;
      margin-bottom: 14px;
    }
    
    .price {
      font-size: 1.3rem;
      margin-bottom: 14px;
    }
  }
  
  @media (max-width: 480px) {
    padding: 16px;
    
    h3 {
      font-size: 1rem;
      margin-bottom: 6px;
    }
    
    p {
      font-size: 0.85rem;
      margin-bottom: 12px;
    }
    
    .price {
      font-size: 1.2rem;
      margin-bottom: 12px;
    }
  }
`;

const AddToCartButton = styled(motion.button)`
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  @media (max-width: 768px) {
    padding: 10px;
    font-size: 0.9rem;
    gap: 6px;
  }
  
  @media (max-width: 480px) {
    padding: 8px;
    font-size: 0.85rem;
    gap: 4px;
  }
`;

const ProductCarouselSection = styled.section`
  padding: 100px 5% 80px;
  position: relative;
  width: 100%;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 60px 4% 50px;
  }
  
  @media (max-width: 480px) {
    padding: 40px 2% 30px;
  }
`;

const BrandStorySection = styled.section`
  padding: 100px 5%;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 60px 4%;
  }
  
  @media (max-width: 480px) {
    padding: 40px 3%;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  
  @media (max-width: 768px) {
    padding: 0 16px;
  }
  
  @media (max-width: 480px) {
    padding: 0 12px;
  }
`;

const CarouselContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  
  @media (max-width: 768px) {
    padding: 0 15px;
  }
  
  @media (max-width: 480px) {
    padding: 0 10px;
    max-width: 100%;
    overflow: hidden;
  }
`;


const AnimatedSectionTitle = styled(motion.h2)`
  font-size: 48px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 60px;
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 36px;
    margin-bottom: 40px;
  }
  
  @media (max-width: 480px) {
    font-size: 28px;
    margin-bottom: 30px;
  }
`;

const GradientText = styled.span`
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const BrandStoryContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  @media (max-width: 480px) {
    gap: 30px;
  }
`;

const BrandStoryText = styled.div`
  h2 {
    font-size: 42px;
    font-weight: 700;
    margin-bottom: 30px;
    background: linear-gradient(135deg, #3b82f6, #60a5fa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    font-size: 18px;
    line-height: 1.7;
    margin-bottom: 20px;
    color: rgba(255, 255, 255, 0.8);
  }
  
  @media (max-width: 768px) {
    text-align: center;
    
    h2 {
      font-size: 32px;
      margin-bottom: 20px;
    }
    
    p {
      font-size: 16px;
    }
  }
  
  @media (max-width: 480px) {
    h2 {
      font-size: 24px;
      margin-bottom: 16px;
    }
    
    p {
      font-size: 14px;
      margin-bottom: 16px;
    }
  }
`;

const BrandValues = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 40px;
`;

const BrandValue = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  border: 1px solid rgba(59, 130, 246, 0.2);
  
  .icon {
    color: #3b82f6;
    flex-shrink: 0;
  }
  
  .content h3 {
    color: #fff;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  .content p {
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    line-height: 1.5;
  }
`;

const BrandStoryImage = styled.div`
  height: 500px;
  background: linear-gradient(135deg, 
    rgba(59, 130, 246, 0.2) 0%, 
    rgba(147, 197, 253, 0.2) 50%, 
    rgba(29, 78, 216, 0.2) 100%),
    url('https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80') center/cover;
  border-radius: 25px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
  }
`;

const ProductCarousel = styled.div`
  margin-top: 60px;
  width: 100%;
  
  .swiper {
    padding: 20px 0 60px;
    width: 100%;
    overflow: hidden;
  }
  
  .swiper-wrapper {
    align-items: stretch;
  }
  
  .swiper-slide {
    height: auto;
    display: flex;
    align-items: stretch;
    justify-content: center;
  }
  
  .swiper-slide > * {
    width: 100%;
    max-width: 350px;
    margin: 0 auto;
  }
  
  .swiper-pagination {
    bottom: 20px;
  }
  
  .swiper-pagination-bullet {
    background: rgba(59, 130, 246, 0.5);
    width: 12px;
    height: 12px;
  }
  
  .swiper-pagination-bullet-active {
    background: #3b82f6;
  }
  
  .swiper-button-next,
  .swiper-button-prev {
    color: #3b82f6;
    
    &:after {
      font-size: 20px;
    }
  }
  
  @media (max-width: 768px) {
    margin-top: 40px;
    
    .swiper {
      padding: 15px 10px 50px;
    }
    
    .swiper-pagination {
      bottom: 15px;
    }
    
    .swiper-button-next,
    .swiper-button-prev {
      &:after {
        font-size: 16px;
      }
    }
  }
  
  @media (max-width: 480px) {
    margin-top: 30px;
    margin-left: -10px;
    margin-right: -10px;
    
    .swiper {
      padding: 10px 20px 40px;
      margin: 0 -10px;
    }
    
    .swiper-slide {
      padding: 0 10px;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
    }
    
    .swiper-slide > * {
      width: 100%;
      max-width: 300px;
    }
    
    .swiper-pagination {
      bottom: 10px;
    }
    
    .swiper-pagination-bullet {
      width: 8px;
      height: 8px;
    }
    
    .swiper-button-next,
    .swiper-button-prev {
      display: none; /* Hide navigation arrows on mobile for cleaner look */
    }
  }
`;


const ModernFeatureCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 20px;
  padding: 40px 30px;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(59, 130, 246, 0.5);
    box-shadow: 0 20px 40px rgba(59, 130, 246, 0.2);
  }
  
  .icon {
    color: #3b82f6;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
  }
  
  h3 {
    color: #fff;
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 15px;
  }
  
  p {
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.6;
    font-size: 16px;
  }
`;

const TestimonialsSection = styled.section`
  padding: 100px 5%;
  background: linear-gradient(135deg, 
    rgba(59, 130, 246, 0.1) 0%, 
    rgba(147, 197, 253, 0.1) 50%, 
    rgba(29, 78, 216, 0.1) 100%);
  position: relative;
  
  @media (max-width: 768px) {
    padding: 60px 4%;
  }
`;

const TestimonialCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 20px;
  padding: 30px;
  max-width: 600px;
  margin: 0 auto;
  
  .stars {
    display: flex;
    gap: 5px;
    color: #60a5fa;
    margin-bottom: 15px;
  }
  
  .text {
    color: #fff;
    font-size: 18px;
    line-height: 1.6;
    margin-bottom: 20px;
    font-style: italic;
  }
  
  .author {
    color: #3b82f6;
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 5px;
  }
  
  .product {
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px;
  }
`;

const ModernFloatingElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
`;

const ModernFloatingIcon = styled(motion.div)`
  position: absolute;
  color: rgba(59, 130, 246, 0.6);
  pointer-events: none;
`;

const Home = () => {
  const { addItem } = useCartStore();
  const { user, setUser } = useAuthStore();
  const canvasRef = useRef(null);
  const scrollAnimationsRef = useRef();

  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);

  const navigate = useNavigate();

  const handleSceneReady = (sceneData) => {
    console.log('Scene ready callback triggered:', sceneData);
    if (scrollAnimationsRef.current) {
      scrollAnimationsRef.current.destroy();
    }
    
    // ScrollAnimations will be handled by Scene3D component internally
    setSceneReady(true);
    console.log('ScrollAnimations initialized');
  };

  const features = [
    {
      icon: <Leaf size={36} />,
      title: "Cruelty-Free & Vegan",
      description: "100% cruelty-free and vegan formulas that are kind to your skin and the planet. Ethically sourced ingredients for conscious beauty."
    },
    {
      icon: <Award size={36} />,
      title: "Premium Quality",
      description: "Dermatologist-tested formulas with clinically proven ingredients. Each product is crafted to deliver exceptional results you can see and feel."
    },
    {
      icon: <Users size={36} />,
      title: "Inclusive Beauty",
      description: "Celebrating all skin tones and types with our diverse range. Beauty products designed for everyone, by everyone."
    }
  ];

  const brandValues = [
    {
      title: "Sustainable Beauty",
      description: "Eco-friendly packaging and responsibly sourced ingredients",
      icon: <Leaf size={24} />
    },
    {
      title: "Inclusive Shades",
      description: "40+ shades to match every beautiful skin tone",
      icon: <Users size={24} />
    },
    {
      title: "Clean Formulas",
      description: "Free from parabens, sulfates, and harmful chemicals",
      icon: <Award size={24} />
    }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      rating: 5,
      text: "Aurafixx transformed my skincare routine! The glow serum is absolutely magical.",
      product: "Radiance Glow Serum"
    },
    {
      name: "Maya K.",
      rating: 5,
      text: "Finally found my perfect foundation shade! The coverage is flawless yet natural.",
      product: "Perfect Match Foundation"
    },
    {
      name: "Jessica L.",
      rating: 5,
      text: "Love that it's cruelty-free and the packaging is gorgeous. Quality is amazing!",
      product: "Velvet Matte Lipstick"
    }
  ];

  const { data: productsData = [], isLoading, error } = useQuery(
    'products',
    async () => {
      try {
        const response = await axios.get('/api/products');
        console.log('API Response:', response.data);
        // Ensure we return an array - handle both direct array and object with products property
        const products = Array.isArray(response.data) ? response.data : (response.data.products || []);
        console.log('Processed products:', products);
        return products;
      } catch (error) {
        console.error('Error fetching products:', error);
        // Return empty array instead of throwing to prevent app crash
        return [];
      }
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      onError: (error) => {
        console.error('Products query error:', error);
      }
    }
  );

  // Ensure products is always an array
  const products = Array.isArray(productsData) ? productsData : [];

  const handleAddToCart = (product) => {
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.url || '',
      quantity: 1
    });
  };

  const handleWishlistToggle = async (productId) => {
    if (!user) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users/wishlist/toggle`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      if (response.data.success) {
        // Update user in auth store
        setUser({
          ...user,
          wishlist: response.data.wishlist
        });
        
        const isAdded = response.data.wishlist.includes(productId);
        toast.success(isAdded ? 'Added to wishlist!' : 'Removed from wishlist!');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error('Failed to update wishlist');
    }
  };

  const nextProduct = () => {
    if (products.length > 0) {
      setCurrentProductIndex((prev) => 
        prev === products.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevProduct = () => {
    if (products.length > 0) {
      setCurrentProductIndex((prev) => 
        prev === 0 ? products.length - 1 : prev - 1
      );
    }
  };

  const [ref, inView] = useInView();
  const [ref2, inView2] = useInView();

  return (
    <HomeContainer>
      
      <ContentOverlay>
        <HeroSection className="hero-section">
          <ModernFloatingElements>
            {[...Array(6)].map((_, i) => (
              <ModernFloatingIcon
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
              </ModernFloatingIcon>
            ))}
          </ModernFloatingElements>

          <HeroContent>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <HeroText>
                <h1>Discover Your <GradientText>Beauty</GradientText></h1>
                <p>Premium cosmetics that enhance your natural beauty and unleash your inner radiance.</p>
                <HeroButtons>
                  <PrimaryButton onClick={() => navigate('/products')}>Shop Now</PrimaryButton>
                  <SecondaryButton onClick={() => setShowQuiz(true)}>Find Your Match</SecondaryButton>
                  <VirtualTryOn product={{ name: 'Signature Lipstick', _id: 'hero-demo' }} productType="lipstick" />
                </HeroButtons>
              </HeroText>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <HeroComponent 
                featuredProducts={products.slice(0, 3)}
                onShopNow={() => navigate('/products')}
                onLearnMore={() => setShowQuiz(true)}
              />
            </motion.div>
          </HeroContent>
        </HeroSection>

        {/* Brand Story Section */}
        <BrandStorySection className="brand-story-section">
          <BrandStoryContent>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <BrandStoryText>
                <h2>Our Story</h2>
                <p>
                  At Aurafixx, we believe beauty should be inclusive, sustainable, and transformative. 
                  Born from a passion for clean, effective skincare, we've crafted a collection that 
                  celebrates every skin tone and type.
                </p>
                <p>
                  Our journey began with a simple mission: to create premium cosmetics that are 
                  kind to your skin and the planet. Every product is carefully formulated with 
                  ethically sourced ingredients and packaged sustainably.
                </p>
              </BrandStoryText>
              <BrandValues>
                {brandValues.map((value, index) => (
                  <BrandValue
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    <div className="icon">{value.icon}</div>
                    <div className="content">
                      <h3>{value.title}</h3>
                      <p>{value.description}</p>
                    </div>
                  </BrandValue>
                ))}
              </BrandValues>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <BrandStoryImage />
            </motion.div>
          </BrandStoryContent>
        </BrandStorySection>

        {/* Featured Products Carousel */}
        <ProductCarouselSection className="product-carousel-section">
          <CarouselContainer>
            <AnimatedSectionTitle
              ref={ref2}
              initial={{ opacity: 0, y: 50 }}
              animate={inView2 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              Featured Products
            </AnimatedSectionTitle>
            
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <div style={{ color: '#ff1493', fontSize: '18px' }}>Loading amazing products...</div>
              </div>
            ) : error ? (
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <div style={{ color: '#ff6b6b', fontSize: '18px' }}>Unable to load products. Please try again later.</div>
              </div>
            ) : (
              <ProductCarousel>
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={20}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 4000, disableOnInteraction: false }}
                  centeredSlides={false}
                  breakpoints={{
                    320: { 
                      slidesPerView: 1,
                      spaceBetween: 10,
                      centeredSlides: false
                    },
                    480: { 
                      slidesPerView: 1,
                      spaceBetween: 15,
                      centeredSlides: false
                    },
                    640: { 
                      slidesPerView: 2,
                      spaceBetween: 20
                    },
                    1024: { 
                      slidesPerView: 3,
                      spaceBetween: 30
                    }
                  }}
                >
                  {products && Array.isArray(products) && products.map((product) => (
                    <SwiperSlide key={product._id}>
                      <ProductCardComponent
                        product={product}
                        onAddToCart={handleAddToCart}
                        onViewDetails={(product) => navigate(`/products/${product._id}`)}
                        onToggleWishlist={(productId) => handleWishlistToggle(productId)}
                        isInWishlist={user && Array.isArray(user.wishlist) && user.wishlist.includes(product._id)}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </ProductCarousel>
            )}
          </CarouselContainer>
        </ProductCarouselSection>

        {/* Features Section */}
        <Section>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <AnimatedSectionTitle>Why Choose Aurafixx?</AnimatedSectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', marginTop: '60px' }}>
              {features.map((feature, index) => (
                <ModernFeatureCard
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
                </ModernFeatureCard>
              ))}
            </div>
          </motion.div>
        </Section>

        {/* Testimonials Section */}
        <TestimonialsSection className="testimonials-section">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <AnimatedSectionTitle style={{ color: 'white', marginBottom: '60px' }}>
              What Our Customers Say
            </AnimatedSectionTitle>
            
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                style={{ marginBottom: index < testimonials.length - 1 ? '40px' : '0' }}
              >
                <div className="stars">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} fill="currentColor" />
                  ))}
                </div>
                <div className="text">"{testimonial.text}"</div>
                <div className="author">{testimonial.name}</div>
                <div className="product">Verified purchase: {testimonial.product}</div>
              </TestimonialCard>
            ))}
          </motion.div>
        </TestimonialsSection>
      </ContentOverlay>

      {/* Skin Quiz Modal - Simple version */}
      {showQuiz && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '20px',
            maxWidth: '500px',
            width: '90%',
            textAlign: 'center'
          }}>
            <h2 style={{ color: '#3b82f6', marginBottom: '20px' }}>Find Your Perfect Match</h2>
            <p style={{ marginBottom: '30px' }}>Our skin quiz is coming soon! For now, browse our products to find your perfect match.</p>
            <button 
              onClick={() => {
                setShowQuiz(false);
                navigate('/products');
              }}
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: 'white',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              Browse Products
            </button>
            <button 
              onClick={() => setShowQuiz(false)}
              style={{
                background: 'transparent',
                color: '#64748b',
                border: '1px solid #cbd5e1',
                padding: '12px 30px',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </HomeContainer>
  );
};

export default Home;
