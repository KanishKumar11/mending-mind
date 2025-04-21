"use client";

import { useEffect } from 'react';

/**
 * Component to preload images for better user experience
 * @param {Array} imagesToPreload - Array of image URLs to preload
 */
const ImagePreloader = ({ imagesToPreload = [] }) => {
  useEffect(() => {
    // Skip if no images to preload
    if (!imagesToPreload || imagesToPreload.length === 0) return;

    // Filter out any null or undefined values
    const validImages = imagesToPreload.filter(img => img);

    // Create an array to track the image objects
    const imageObjects = [];

    // Preload each image
    validImages.forEach(src => {
      if (typeof src === 'string' && src.trim() !== '') {
        const img = new Image();
        img.src = src;
        imageObjects.push(img); // Keep a reference to prevent garbage collection
      }
    });

    // Cleanup function
    return () => {
      // Clear references to allow garbage collection
      imageObjects.length = 0;
    };
  }, [imagesToPreload]);

  // This component doesn't render anything
  return null;
};

export default ImagePreloader;
