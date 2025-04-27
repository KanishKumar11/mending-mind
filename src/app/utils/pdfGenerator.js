"use client";

import { pdf } from "@react-pdf/renderer";
import JsBarcode from "jsbarcode";
import { MyDocument } from "../components/PDFDocument";

// Generate a unique alphanumeric ID for the quiz
const generateQuizId = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  let id = "";

  // Generate 3 letters
  for (let i = 0; i < 3; i++) {
    id += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  id += "-";

  // Generate 4 numbers
  for (let i = 0; i < 4; i++) {
    id += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  id += "-";

  // Generate 4 more numbers
  for (let i = 0; i < 4; i++) {
    id += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  return id; // Format: ABC-1234-5678
};

// Generate barcode as data URL
const generateBarcodeDataUrl = (quizId) => {
  return new Promise((resolve, reject) => {
    try {
      // Create a high-resolution canvas element
      const canvas = document.createElement("canvas");
      canvas.width = 800; // Higher resolution for better quality
      canvas.height = 200; // Higher resolution for better quality

      // Generate the barcode with settings to match the reference image
      JsBarcode(canvas, quizId, {
        format: "CODE128",
        width: 1, // Thinner line width for more compact barcode
        height: 40, // Shorter height
        displayValue: true,
        fontSize: 18, // Smaller font size
        margin: 3, // Smaller margin
        background: "#ffffff",
        lineColor: "#000000", // Black lines
        textMargin: 3, // Less space between barcode and text
        flat: false, // Use standard barcode format
      });

      // Convert to data URL
      const dataUrl = canvas.toDataURL("image/png");
      resolve(dataUrl);
    } catch (error) {
      // Return a fallback empty image
      resolve("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=");
    }
  });
};

// Load an image and return as data URL
const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => {
      // Return a fallback empty image
      resolve("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=");
    };
    img.src = src;
  });
};

// Generate and download PDF
export const generateAndDownloadPDF = async (userInfo, reportScores) => {
  try {
    // Generate quiz ID
    const quizId = generateQuizId();
    
    // Load all required images
    const logoUrl = await loadImage("/Mind_Logo.png");
    const reportImageUrl = await loadImage("/brain.png");
    const barcodeUrl = await generateBarcodeDataUrl(quizId);
    const phoneIconUrl = await loadImage("/icons/call.png");
    const emailIconUrl = await loadImage("/icons/mail.png");
    const webIconUrl = await loadImage("/icons/web.png");
    const locationIconUrl = await loadImage("/icons/location.png");
    
    // Load PDF-specific images
    const founderImageUrl = await loadImage("/pdf/founder.png");
    const instaIconUrl = await loadImage("/pdf/instagram.png");
    const fbIconUrl = await loadImage("/pdf/facebook.png");
    const linkedinIconUrl = await loadImage("/pdf/linkedin.png");
    const whatsappIconUrl = await loadImage("/pdf/whatsapp.png");
    const callIconUrl = await loadImage("/pdf/call.png");
    const gmailIconUrl = await loadImage("/pdf/gmail.png");
    const phoneIconPdfUrl = await loadImage("/pdf/phone.png");
    const mailIconPdfUrl = await loadImage("/pdf/mail.png");
    const webIconPdfUrl = await loadImage("/pdf/web.png");
    const bgImageUrl = await loadImage("/pdf/illustration.png");
    
    // Generate chart images
    // Note: In a real implementation, you would generate chart images here
    // For now, we'll use placeholder images
    const chartImages = {
      personalityChart: await loadImage("/chart-placeholder.png"),
      stressChart: await loadImage("/chart-placeholder.png"),
      decisionStyleChart: await loadImage("/chart-placeholder.png"),
      resilienceChart: await loadImage("/chart-placeholder.png"),
    };
    
    // Generate PDF blob
    const blob = await pdf(
      <MyDocument
        userInfo={userInfo}
        reportScores={reportScores}
        logoUrl={logoUrl}
        reportImageUrl={reportImageUrl}
        quizId={quizId}
        barcodeUrl={barcodeUrl}
        phoneIconUrl={phoneIconUrl}
        emailIconUrl={emailIconUrl}
        webIconUrl={webIconUrl}
        locationIconUrl={locationIconUrl}
        chartImages={chartImages}
        // PDF folder images
        founderImageUrl={founderImageUrl}
        instaIconUrl={instaIconUrl}
        fbIconUrl={fbIconUrl}
        linkedinIconUrl={linkedinIconUrl}
        whatsappIconUrl={whatsappIconUrl}
        callIconUrl={callIconUrl}
        gmailIconUrl={gmailIconUrl}
        phoneIconPdfUrl={phoneIconPdfUrl}
        mailIconPdfUrl={mailIconPdfUrl}
        webIconPdfUrl={webIconPdfUrl}
        bgImageUrl={bgImageUrl}
      />
    ).toBlob();
    
    // Download the PDF
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `MendingMind_Assessment_${quizId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
};
