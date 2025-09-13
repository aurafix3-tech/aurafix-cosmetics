# Contributing to AuraFix

Thank you for your interest in contributing to AuraFix! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues
1. Check existing issues to avoid duplicates
2. Use the issue template when creating new issues
3. Provide detailed information including:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details

### Submitting Pull Requests
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes following our coding standards
4. Write or update tests as needed
5. Update documentation if required
6. Commit with clear, descriptive messages
7. Push to your fork and submit a pull request

## 🏗️ Development Setup

### Prerequisites
- Node.js 16+ and npm
- MongoDB (local or cloud)
- Git

### Local Development
```bash
# Clone your fork
git clone https://github.com/your-username/aurafix.git
cd aurafix

# Install dependencies
npm run install-all

# Set up environment variables
cp server/.env.example server/.env
# Edit server/.env with your configuration

# Start development servers
npm run dev
```

## 📝 Coding Standards

### JavaScript/React
- Use ES6+ features
- Follow React Hooks patterns
- Use functional components
- Implement proper error handling
- Write descriptive variable and function names

### Code Style
```javascript
// ✅ Good
const fetchUserData = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
};

// ❌ Avoid
const getData = (id) => {
  return api.get('/users/' + id).then(res => res.data);
};
```

### Component Structure
```javascript
// Component file structure
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Styled components
const Container = styled.div`
  // styles
`;

// Main component
const MyComponent = ({ prop1, prop2 }) => {
  // Hooks
  const [state, setState] = useState(null);
  
  // Effects
  useEffect(() => {
    // effect logic
  }, []);
  
  // Event handlers
  const handleClick = () => {
    // handler logic
  };
  
  // Render
  return (
    <Container>
      {/* JSX */}
    </Container>
  );
};

export default MyComponent;
```

### Backend API Standards
```javascript
// Route structure
const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth');

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Route logic
    res.json({ success: true, data: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
```

## 🧪 Testing Guidelines

### Frontend Testing
```javascript
// Component tests
import { render, screen, fireEvent } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  test('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
  
  test('handles user interaction', () => {
    render(<MyComponent />);
    fireEvent.click(screen.getByRole('button'));
    // Assert expected behavior
  });
});
```

### Backend Testing
```javascript
// API tests
const request = require('supertest');
const app = require('../server');

describe('Products API', () => {
  test('GET /api/products', async () => {
    const response = await request(app)
      .get('/api/products')
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
```

## 📚 Documentation

### Code Comments
```javascript
/**
 * Calculates the total price including tax and shipping
 * @param {number} subtotal - The subtotal amount
 * @param {number} taxRate - Tax rate as decimal (0.1 for 10%)
 * @param {number} shipping - Shipping cost
 * @returns {number} Total price
 */
const calculateTotal = (subtotal, taxRate, shipping) => {
  return subtotal + (subtotal * taxRate) + shipping;
};
```

### API Documentation
```javascript
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *     responses:
 *       200:
 *         description: List of products
 */
```

## 🎨 UI/UX Guidelines

### Design Principles
- **Consistency**: Use established patterns and components
- **Accessibility**: Follow WCAG 2.1 guidelines
- **Performance**: Optimize for fast loading and smooth interactions
- **Mobile-first**: Design for mobile, enhance for desktop

### Color Palette
```css
/* Primary Colors */
--primary: #667eea;
--primary-dark: #764ba2;

/* Secondary Colors */
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;

/* Neutral Colors */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-900: #1f2937;
```

### Typography
```css
/* Font Weights */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Font Sizes */
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
```

## 🔄 Git Workflow

### Branch Naming
- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/critical-fix` - Critical production fixes
- `docs/documentation-update` - Documentation changes

### Commit Messages
```
type(scope): description

feat(auth): add password reset functionality
fix(cart): resolve quantity update issue
docs(readme): update installation instructions
style(header): improve mobile responsiveness
refactor(api): optimize database queries
test(products): add unit tests for product service
```

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots
If applicable, add screenshots

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
```

## 🚀 Release Process

### Version Numbering
We follow [Semantic Versioning](https://semver.org/):
- `MAJOR.MINOR.PATCH`
- Major: Breaking changes
- Minor: New features (backward compatible)
- Patch: Bug fixes (backward compatible)

### Release Checklist
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Version number bumped
- [ ] Changelog updated
- [ ] Security review completed
- [ ] Performance testing done

## 🏷️ Issue Labels

### Type Labels
- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to docs
- `question` - Further information is requested

### Priority Labels
- `priority: high` - Critical issues
- `priority: medium` - Important issues
- `priority: low` - Nice to have

### Status Labels
- `status: in-progress` - Currently being worked on
- `status: needs-review` - Ready for review
- `status: blocked` - Blocked by dependencies

## 🎯 Areas for Contribution

### High Priority
- [ ] Performance optimizations
- [ ] Accessibility improvements
- [ ] Mobile responsiveness
- [ ] Test coverage increase
- [ ] Security enhancements

### Medium Priority
- [ ] New payment methods
- [ ] Advanced search features
- [ ] Email templates
- [ ] Analytics dashboard
- [ ] Inventory management

### Low Priority
- [ ] Internationalization (i18n)
- [ ] Dark mode theme
- [ ] Social media integration
- [ ] Advanced reporting
- [ ] Mobile app development

## 📞 Getting Help

### Communication Channels
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Email**: contact@aurafix.com for sensitive issues

### Code Review Process
1. Submit pull request
2. Automated tests run
3. Code review by maintainers
4. Address feedback if needed
5. Merge when approved

## 📄 License

By contributing to AuraFix, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Annual contributor highlights

Thank you for helping make AuraFix better! 🎉
