import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    overflow-x: hidden;
  }

  #root {
    width: 100%;
    min-height: 100vh;
  }

  .desktop-only {
    @media (max-width: 768px) {
      display: none;
    }
  }

  .mobile-only {
    display: none;
    
    @media (max-width: 768px) {
      display: block;
    }
  }

  .mobile-inline {
    display: none;
    
    @media (max-width: 768px) {
      display: inline;
    }
  }

  /* Mobile viewport fixes */
  @media (max-width: 768px) {
    html {
      scroll-behavior: smooth;
      width: 100%;
    }
    
    body {
      -webkit-overflow-scrolling: touch;
      width: 100%;
      margin: 0;
      padding: 0;
    }

    /* Prevent horizontal scrolling */
    * {
      max-width: 100%;
    }
  }

  /* Touch-friendly button sizes */
  @media (max-width: 768px) {
    button, .button {
      min-height: 44px;
      min-width: 44px;
    }
  }
`;

export default GlobalStyles;
