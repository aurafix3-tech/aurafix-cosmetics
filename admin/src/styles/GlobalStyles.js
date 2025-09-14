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
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  }

  #root {
    width: 100%;
    min-height: 100vh;
  }

  /* Mobile viewport fixes */
  @media (max-width: 768px) {
    html {
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

    /* Touch-friendly elements */
    button, .button, input, select, textarea {
      min-height: 44px;
    }

    /* Responsive tables */
    table {
      width: 100%;
      overflow-x: auto;
      display: block;
      white-space: nowrap;
    }

    thead, tbody, tr {
      display: table;
      width: 100%;
      table-layout: fixed;
    }

    /* Form improvements */
    .form-row {
      flex-direction: column !important;
      gap: 12px !important;
    }

    .form-group {
      width: 100% !important;
      margin-bottom: 16px;
    }

    /* Card layouts */
    .card-grid {
      grid-template-columns: 1fr !important;
      gap: 12px !important;
    }

    /* Modal adjustments */
    .modal-content {
      margin: 20px !important;
      width: calc(100% - 40px) !important;
      max-height: calc(100vh - 40px) !important;
      overflow-y: auto;
    }
  }

  /* Extra small screens */
  @media (max-width: 480px) {
    .container {
      padding: 8px !important;
    }

    h1 { font-size: 24px !important; }
    h2 { font-size: 20px !important; }
    h3 { font-size: 18px !important; }
    
    .btn {
      padding: 12px 16px !important;
      font-size: 14px !important;
    }
  }
`;

export default GlobalStyles;
