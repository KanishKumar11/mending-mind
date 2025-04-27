"use client";

import { useState, useEffect } from "react";
import { pdf } from "@react-pdf/renderer";
import JsBarcode from "jsbarcode";
import ChartImageGenerator from "../components/ChartImageGenerator";

// Import the MyDocument component from PDFViewer
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

// Load an image as a data URL
const loadImage = (src) => {
  return new Promise((resolve) => {
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
      resolve(
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="
      );
    };
    img.src = src;
  });
};

// Generate barcode as data URL
const generateBarcodeDataUrl = (quizId) => {
  return new Promise((resolve) => {
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
      resolve(
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="
      );
    }
  });
};

// Generate chart images
const generateChartImages = (reportScores) => {
  return new Promise((resolve) => {
    // Create a hidden div to render the chart generator
    const div = document.createElement("div");
    div.style.position = "absolute";
    div.style.visibility = "hidden";
    div.style.width = "0";
    div.style.height = "0";
    document.body.appendChild(div);

    // Create a function to handle chart images
    const handleChartsGenerated = (images) => {
      document.body.removeChild(div);
      resolve(images);
    };

    // Render the ChartImageGenerator component
    const chartGenerator = document.createElement("div");
    chartGenerator.innerHTML = "<div id='chart-generator'></div>";
    div.appendChild(chartGenerator);

    // Use the ChartImageGenerator component
    const chartGeneratorInstance = ChartImageGenerator({
      reportScores,
      onChartsGenerated: handleChartsGenerated,
    });

    // If chart generation fails, resolve with empty images
    setTimeout(() => {
      if (!chartGeneratorInstance) {
        resolve({
          personalityChart:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
          stressChart:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
          decisionStyleChart:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
          resilienceChart:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
        });
      }
    }, 2000);
  });
};

// Main function to generate and download PDF
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
    const chartImages = await generateChartImages(reportScores);

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
