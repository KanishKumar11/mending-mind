"use client";

import React, { useEffect, useState } from 'react';
import { useBarcode } from '@createnextapp/react-barcode';

const Barcode = ({ value }) => {
  const [mounted, setMounted] = useState(false);
  const [dataUrl, setDataUrl] = useState('');
  
  const { inputRef } = useBarcode({
    value: value || 'DEFAULT',
    options: {
      background: '#ffffff',
      height: 40,
      width: 1.5,
      margin: 5,
      fontSize: 10,
      displayValue: true,
    }
  });
  
  useEffect(() => {
    setMounted(true);
    
    // Convert SVG to data URL after rendering
    if (inputRef.current) {
      const svgElement = inputRef.current;
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const encodedSvg = encodeURIComponent(svgString);
      const dataUrl = `data:image/svg+xml;charset=utf-8,${encodedSvg}`;
      setDataUrl(dataUrl);
    }
  }, [inputRef]);
  
  if (!mounted) return null;
  
  return (
    <div>
      <svg ref={inputRef} />
      {dataUrl && <input type="hidden" value={dataUrl} id="barcodeDataUrl" />}
    </div>
  );
};

export default Barcode;
