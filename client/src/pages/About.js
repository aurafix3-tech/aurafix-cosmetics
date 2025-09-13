import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Award, Users } from 'lucide-react';

const AboutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Hero = styled.section`
  text-align: center;
  padding: 80px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  color: white;
  margin-bottom: 80px;

  h1 {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 24px;
  }

  p {
    font-size: 1.25rem;
    opacity: 0.9;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
`;

const Section = styled.section`
  margin-bottom: 80px;

  h2 {
    font-size: 2.5rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 60px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
`;

const ValueCard = styled(motion.div)`
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  text-align: center;

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

const About = () => {
  const values = [
    {
      icon: <Sparkles size={32} />,
      title: "Innovation",
      description: "We're pioneering the future of beauty with cutting-edge 3D technology and immersive shopping experiences."
    },
    {
      icon: <Heart size={32} />,
      title: "Quality",
      description: "Every product is carefully curated and tested to ensure the highest standards of quality and safety."
    },
    {
      icon: <Award size={32} />,
      title: "Excellence",
      description: "We strive for excellence in everything we do, from product selection to customer service."
    },
    {
      icon: <Users size={32} />,
      title: "Community",
      description: "Building a community of beauty enthusiasts who inspire and support each other's journey."
    }
  ];

  return (
    <AboutContainer>
      <Hero>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>About AuraFix</h1>
          <p>
            We're revolutionizing the beauty industry with innovative 3D technology, 
            premium products, and an unparalleled shopping experience that celebrates your unique beauty.
          </p>
        </motion.div>
      </Hero>

      <Section>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2>Our Values</h2>
          <ValuesGrid>
            {values.map((value, index) => (
              <ValueCard
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="icon">
                  {value.icon}
                </div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </ValueCard>
            ))}
          </ValuesGrid>
        </motion.div>
      </Section>
    </AboutContainer>
  );
};

export default About;
