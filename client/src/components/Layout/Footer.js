import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Youtube,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

const FooterContainer = styled.footer`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: white;
  padding: 60px 20px 20px;
  margin-top: 80px;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
`;

const FooterSection = styled.div`
  h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 20px;
    color: #fff;
  }
`;

const FooterLink = styled(Link)`
  display: block;
  color: #b8b8b8;
  text-decoration: none;
  margin-bottom: 12px;
  transition: color 0.3s ease;

  &:hover {
    color: #667eea;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  color: #b8b8b8;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 20px;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: #b8b8b8;
  transition: all 0.3s ease;

  &:hover {
    background: #667eea;
    color: white;
    transform: translateY(-2px);
  }
`;

const Newsletter = styled.div`
  h3 {
    margin-bottom: 16px;
  }

  p {
    color: #b8b8b8;
    margin-bottom: 20px;
    line-height: 1.6;
  }
`;

const NewsletterForm = styled.form`
  display: flex;
  gap: 12px;
  margin-top: 16px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const NewsletterInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  outline: none;

  &::placeholder {
    color: #b8b8b8;
  }

  &:focus {
    border-color: #667eea;
  }
`;

const NewsletterButton = styled.button`
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: #b8b8b8;
  font-size: 14px;
`;

const PaymentMethods = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const PaymentIcon = styled.div`
  width: 40px;
  height: 24px;
  background: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  color: #333;
`;

const Footer = () => {
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
  };

  return (
    <FooterContainer>
      <FooterContent>
        <FooterGrid>
          <FooterSection>
            <h3>AuraFix</h3>
            <p style={{ color: '#b8b8b8', lineHeight: 1.6, marginBottom: '20px' }}>
              Discover the perfect cosmetics for your unique beauty. Premium quality products 
              that enhance your natural glow.
            </p>
            <SocialLinks>
              <SocialLink href="#" aria-label="Instagram">
                <Instagram size={20} />
              </SocialLink>
              <SocialLink href="#" aria-label="Facebook">
                <Facebook size={20} />
              </SocialLink>
              <SocialLink href="#" aria-label="Twitter">
                <Twitter size={20} />
              </SocialLink>
              <SocialLink href="#" aria-label="YouTube">
                <Youtube size={20} />
              </SocialLink>
            </SocialLinks>
          </FooterSection>

          <FooterSection>
            <h3>Quick Links</h3>
            <FooterLink to="/products">All Products</FooterLink>
            <FooterLink to="/products?category=skincare">Skincare</FooterLink>
            <FooterLink to="/products?category=makeup">Makeup</FooterLink>
            <FooterLink to="/products?category=fragrance">Fragrance</FooterLink>
            <FooterLink to="/products?featured=true">Featured</FooterLink>
            <FooterLink to="/about">About Us</FooterLink>
          </FooterSection>

          <FooterSection>
            <h3>Customer Service</h3>
            <FooterLink to="/contact">Contact Us</FooterLink>
            <FooterLink to="/shipping">Shipping Info</FooterLink>
            <FooterLink to="/returns">Returns & Exchanges</FooterLink>
            <FooterLink to="/faq">FAQ</FooterLink>
            <FooterLink to="/size-guide">Size Guide</FooterLink>
            <FooterLink to="/privacy">Privacy Policy</FooterLink>
          </FooterSection>

          <FooterSection>
            <h3>Contact Info</h3>
            <ContactInfo>
              <Phone size={16} />
              <span>+1 (555) 123-4567</span>
            </ContactInfo>
            <ContactInfo>
              <Mail size={16} />
              <span>hello@aurafix.com</span>
            </ContactInfo>
            <ContactInfo>
              <MapPin size={16} />
              <span>123 Beauty Street, NY 10001</span>
            </ContactInfo>

            <Newsletter>
              <h3>Newsletter</h3>
              <p>Subscribe for exclusive offers and beauty tips!</p>
              <NewsletterForm onSubmit={handleNewsletterSubmit}>
                <NewsletterInput 
                  type="email" 
                  placeholder="Enter your email"
                  required
                />
                <NewsletterButton type="submit">
                  Subscribe
                </NewsletterButton>
              </NewsletterForm>
            </Newsletter>
          </FooterSection>
        </FooterGrid>

        <FooterBottom>
          <Copyright>
            © 2024 AuraFix. All rights reserved.
          </Copyright>
          <PaymentMethods>
            <PaymentIcon>VISA</PaymentIcon>
            <PaymentIcon>MC</PaymentIcon>
            <PaymentIcon>AMEX</PaymentIcon>
            <PaymentIcon>PP</PaymentIcon>
          </PaymentMethods>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
