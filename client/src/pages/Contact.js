import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const ContactContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  margin-top: 40px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const ContactInfo = styled.div`
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  p {
    color: #666;
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 40px;
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;

  .icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .info {
    h3 {
      font-weight: 600;
      color: #333;
      margin-bottom: 4px;
    }

    p {
      color: #666;
      margin: 0;
    }
  }
`;

const ContactForm = styled(motion.form)`
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 24px;
    color: #333;
  }
`;

const InputGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
    font-size: 14px;
  }

  input, textarea {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e1e5e9;
    border-radius: 8px;
    font-size: 16px;
    outline: none;
    transition: all 0.3s ease;
    font-family: inherit;

    &:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    &.error {
      border-color: #ff6b6b;
    }
  }

  textarea {
    resize: vertical;
    min-height: 120px;
  }

  .error-message {
    color: #ff6b6b;
    font-size: 14px;
    margin-top: 4px;
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = async (data) => {
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Message sent successfully!');
    reset();
  };

  return (
    <ContactContainer>
      <ContactGrid>
        <ContactInfo>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Get in Touch</h1>
            <p>
              Have questions about our products or need beauty advice? 
              We'd love to hear from you. Reach out to our team and we'll get back to you as soon as possible.
            </p>

            <ContactItem>
              <div className="icon">
                <Mail size={24} />
              </div>
              <div className="info">
                <h3>Email</h3>
                <p>aurafix3@gmail.com</p>
              </div>
            </ContactItem>

            <ContactItem>
              <div className="icon">
                <Phone size={24} />
              </div>
              <div className="info">
                <h3>Phone</h3>
                <p>+254 741 218 862</p>
              </div>
            </ContactItem>

            <ContactItem>
              <div className="icon">
                <MapPin size={24} />
              </div>
              <div className="info">
                <h3>Address</h3>
                <p>Egerton University, Njoro, Kenya</p>
              </div>
            </ContactItem>

            <ContactItem>
              <div className="icon">
                <Clock size={24} />
              </div>
              <div className="info">
                <h3>Business Hours</h3>
                <p>Mon - Fri: 8AM - 6PM EAT</p>
              </div>
            </ContactItem>
          </motion.div>
        </ContactInfo>

        <ContactForm
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <h2>Send us a Message</h2>

          <InputGroup>
            <label>Name</label>
            <input
              {...register('name', { required: 'Name is required' })}
              className={errors.name ? 'error' : ''}
              placeholder="Your full name"
            />
            {errors.name && <div className="error-message">{errors.name.message}</div>}
          </InputGroup>

          <InputGroup>
            <label>Email</label>
            <input
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className={errors.email ? 'error' : ''}
              placeholder="your.email@example.com"
            />
            {errors.email && <div className="error-message">{errors.email.message}</div>}
          </InputGroup>

          <InputGroup>
            <label>Subject</label>
            <input
              {...register('subject', { required: 'Subject is required' })}
              className={errors.subject ? 'error' : ''}
              placeholder="What's this about?"
            />
            {errors.subject && <div className="error-message">{errors.subject.message}</div>}
          </InputGroup>

          <InputGroup>
            <label>Message</label>
            <textarea
              {...register('message', { required: 'Message is required' })}
              className={errors.message ? 'error' : ''}
              placeholder="Tell us how we can help you..."
            />
            {errors.message && <div className="error-message">{errors.message.message}</div>}
          </InputGroup>

          <SubmitButton
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Send Message
          </SubmitButton>
        </ContactForm>
      </ContactGrid>
    </ContactContainer>
  );
};

export default Contact;
