import { useState, useEffect, useRef } from 'react';

// Cache for background data to persist across page refreshes
const backgroundCache = new Map();
const imagePreloadCache = new Map();

const usePageBackground = (pageName) => {
  const [background, setBackground] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Preload image when background data is available
  useEffect(() => {
    if (background && background.mediaType === 'image' && background.mediaUrl) {
      const imageUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${background.mediaUrl}`;
      
      // Check if image is already preloaded
      if (imagePreloadCache.has(imageUrl)) {
        setImageLoaded(true);
        return;
      }

      const img = new Image();
      img.onload = () => {
        if (mountedRef.current) {
          imagePreloadCache.set(imageUrl, true);
          setImageLoaded(true);
        }
      };
      img.onerror = () => {
        if (mountedRef.current) {
          setImageLoaded(false);
        }
      };
      img.src = imageUrl;
    } else {
      setImageLoaded(true);
    }
  }, [background]);

  useEffect(() => {
    const fetchBackground = async () => {
      try {
        // Check cache first
        const cacheKey = `background_${pageName}`;
        if (backgroundCache.has(cacheKey)) {
          const cachedData = backgroundCache.get(cacheKey);
          if (mountedRef.current) {
            setBackground(cachedData);
            setLoading(false);
          }
          return;
        }

        setLoading(true);
        
        // Add timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/backgrounds/${pageName}`,
          { 
            signal: controller.signal,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (mountedRef.current) {
          if (data.success && data.data) {
            // Cache the background data
            backgroundCache.set(cacheKey, data.data);
            setBackground(data.data);
          } else {
            setBackground(null);
          }
        }
      } catch (err) {
        console.warn(`Failed to fetch page background for ${pageName}:`, err.message);
        if (mountedRef.current) {
          // Don't set error state to prevent crashes, just log and continue
          setBackground(null);
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    if (pageName) {
      fetchBackground();
    }
  }, [pageName]);

  return { background, loading, error, imageLoaded };
};

export default usePageBackground;
