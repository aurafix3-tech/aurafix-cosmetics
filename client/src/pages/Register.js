import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Phone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/authStore';

const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const RegisterCard = styled(motion.div)`
  background: white;
  border-radius: 24px;
  padding: 48px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    padding: 32px 24px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;

  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 8px;
  }

  p {
    color: #666;
    font-size: 1.1rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const InputRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled.div`
  position: relative;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-size: 14px;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px 48px 16px 16px;
  border: 2px solid ${props => props.error ? '#ff6b6b' : '#e1e5e9'};
  border-radius: 12px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  right: 16px;
  color: #666;
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  transition: color 0.3s ease;

  &:hover {
    color: ${props => props.clickable ? '#667eea' : '#666'};
  }
`;

const ErrorMessage = styled.span`
  color: #ff6b6b;
  font-size: 14px;
  margin-top: 4px;
  display: block;
`;

const PasswordStrength = styled.div`
  margin-top: 8px;
  
  .strength-bar {
    height: 4px;
    background: #e1e5e9;
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 4px;
  }
  
  .strength-fill {
    height: 100%;
    transition: all 0.3s ease;
    background: ${props => {
      if (props.strength === 'weak') return '#ff6b6b';
      if (props.strength === 'medium') return '#ffc107';
      if (props.strength === 'strong') return '#28a745';
      return '#e1e5e9';
    }};
    width: ${props => {
      if (props.strength === 'weak') return '33%';
      if (props.strength === 'medium') return '66%';
      if (props.strength === 'strong') return '100%';
      return '0%';
    }};
  }
  
  .strength-text {
    font-size: 12px;
    color: #666;
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Terms = styled.div`
  font-size: 14px;
  color: #666;
  text-align: center;
  line-height: 1.5;

  a {
    color: #667eea;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 32px 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e1e5e9;
  }

  span {
    padding: 0 16px;
    color: #666;
    font-size: 14px;
  }
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 32px;

  p {
    color: #666;
    margin-bottom: 16px;
  }

  a {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.3s ease;

    &:hover {
      color: #5a6fd8;
    }
  }
`;

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  
  const { register: registerUser, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError
  } = useForm();

  const password = watch('password');

  const checkPasswordStrength = (password) => {
    if (!password) return '';
    if (password.length < 6) return 'weak';
    if (password.length < 8 || !/(?=.*[a-z])(?=.*[A-Z])/.test(password)) return 'medium';
    if (/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)) return 'strong';
    return 'medium';
  };

  React.useEffect(() => {
    setPasswordStrength(checkPasswordStrength(password));
  }, [password]);

  const onSubmit = async (data) => {
    const { confirmPassword, ...userData } = data;
    
    const result = await registerUser(userData);
    
    if (result.success) {
      navigate('/');
    } else {
      setError('root', { message: result.message });
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Header>
          <h1>Join AuraFix</h1>
          <p>Create your account and start your beauty journey</p>
        </Header>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <InputRow>
            <InputGroup>
              <Label>First Name</Label>
              <InputWrapper>
                <Input
                  type="text"
                  placeholder="First name"
                  error={errors.firstName}
                  {...register('firstName', {
                    required: 'First name is required',
                    minLength: {
                      value: 2,
                      message: 'First name must be at least 2 characters'
                    }
                  })}
                />
                <InputIcon>
                  <User size={20} />
                </InputIcon>
              </InputWrapper>
              {errors.firstName && <ErrorMessage>{errors.firstName.message}</ErrorMessage>}
            </InputGroup>

            <InputGroup>
              <Label>Last Name</Label>
              <InputWrapper>
                <Input
                  type="text"
                  placeholder="Last name"
                  error={errors.lastName}
                  {...register('lastName', {
                    required: 'Last name is required',
                    minLength: {
                      value: 2,
                      message: 'Last name must be at least 2 characters'
                    }
                  })}
                />
                <InputIcon>
                  <User size={20} />
                </InputIcon>
              </InputWrapper>
              {errors.lastName && <ErrorMessage>{errors.lastName.message}</ErrorMessage>}
            </InputGroup>
          </InputRow>

          <InputGroup>
            <Label>Email Address</Label>
            <InputWrapper>
              <Input
                type="email"
                placeholder="Enter your email"
                error={errors.email}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
              <InputIcon>
                <Mail size={20} />
              </InputIcon>
            </InputWrapper>
            {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <Label>WhatsApp Number</Label>
            <InputWrapper>
              <Input
                type="tel"
                placeholder="Enter your WhatsApp number (e.g., +254712345678)"
                error={errors.whatsapp}
                {...register('whatsapp', {
                  required: 'WhatsApp number is required',
                  pattern: {
                    value: /^\+?[1-9]\d{1,14}$/,
                    message: 'Please enter a valid phone number'
                  }
                })}
              />
              <InputIcon>
                <Phone size={20} />
              </InputIcon>
            </InputWrapper>
            {errors.whatsapp && <ErrorMessage>{errors.whatsapp.message}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <Label>Password</Label>
            <InputWrapper>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                error={errors.password}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
              />
              <InputIcon
                clickable
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </InputIcon>
            </InputWrapper>
            {password && (
              <PasswordStrength strength={passwordStrength}>
                <div className="strength-bar">
                  <div className="strength-fill" />
                </div>
                <div className="strength-text">
                  Password strength: {passwordStrength || 'Enter password'}
                </div>
              </PasswordStrength>
            )}
            {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <Label>Confirm Password</Label>
            <InputWrapper>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                error={errors.confirmPassword}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                })}
              />
              <InputIcon
                clickable
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </InputIcon>
            </InputWrapper>
            {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>}
          </InputGroup>

          {errors.root && <ErrorMessage>{errors.root.message}</ErrorMessage>}

          <Terms>
            By creating an account, you agree to our{' '}
            <Link to="/terms">Terms of Service</Link> and{' '}
            <Link to="/privacy">Privacy Policy</Link>
          </Terms>

          <SubmitButton
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <div className="spinner" style={{ width: '20px', height: '20px' }} />
            ) : (
              <>
                Create Account
                <ArrowRight size={20} />
              </>
            )}
          </SubmitButton>
        </Form>

        <Divider>
          <span>or</span>
        </Divider>

        <Footer>
          <p>Already have an account?</p>
          <Link to="/login">Sign in here</Link>
        </Footer>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;
