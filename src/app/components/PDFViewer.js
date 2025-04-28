"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer as ReactPDFViewer,
  Font,
  pdf,
  Link,
} from "@react-pdf/renderer";
import { Image as PDFImage } from "@react-pdf/renderer";
// Import JsBarcode for direct barcode generation
import JsBarcode from "jsbarcode";
import { styles } from "./pdfStyles";
import ChartImageGenerator from "./ChartImageGenerator";
import PersonalityTraitDisplay from "./PersonalityTraitDisplay";
import StressScaleDisplay from "./StressScaleDisplay";
import DecisionStyleDisplay from "./DecisionStyleDisplay";
import ResilienceScaleDisplay from "./ResilienceScaleDisplay";
import TaxpayerJudgementDisplay from "./TaxpayerJudgementDisplay";

// Simple Pie Chart component for PDF (using circles instead of SVG)
const PieChart = ({
  value,
  maxValue = 100,
  color = "#F0C93B",
  size = 100,
  label,
}) => {
  // Calculate percentage
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100));

  return (
    <View style={{ width: size, height: size, alignSelf: "center" }}>
      {/* Background circle */}
      <View
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: "#E0E0E0",
        }}
      />

      {/* Colored circle with percentage */}
      <View
        style={{
          position: "absolute",
          width: size * 0.8,
          height: size * 0.8,
          borderRadius: (size * 0.8) / 2,
          backgroundColor: color,
          top: size * 0.1,
          left: size * 0.1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: size / 6,
            fontWeight: "bold",
            color: "white",
            fontFamily: "Montserrat",
          }}
        >
          {Math.round(percentage)}%
        </Text>
      </View>

      {/* Label */}
      {label && (
        <View
          style={{
            position: "absolute",
            bottom: -size * 0.25,
            left: 0,
            right: 0,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: size / 10,
              fontWeight: "bold",
              fontFamily: "Montserrat",
              textAlign: "center",
            }}
          >
            {label}
          </Text>
        </View>
      )}
    </View>
  );
};

// Register Montserrat font from local files
Font.register({
  family: "Montserrat",
  fonts: [
    { src: "/fonts/Montserrat-Regular.ttf", fontWeight: 400 },
    { src: "/fonts/Montserrat-Bold.ttf", fontWeight: 700 },
    { src: "/fonts/Montserrat-Medium.ttf", fontWeight: 500 },
    { src: "/fonts/Montserrat-Light.ttf", fontWeight: 300 },
    {
      src: "/fonts/Montserrat-Italic.ttf",
      fontWeight: 400,
      fontStyle: "italic",
    },
    {
      src: "/fonts/Montserrat-BoldItalic.ttf",
      fontWeight: 700,
      fontStyle: "italic",
    },
  ],
});

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

// PDF Document component
const MyDocument = (props) => {
  const {
    userInfo,
    logoUrl,
    reportImageUrl,
    quizId,
    barcodeUrl,
    phoneIconUrl,
    emailIconUrl,
    webIconUrl,
    locationIconUrl,
    reportScores,
    chartImages,
    // PDF folder images
    founderImageUrl,
    instaIconUrl,
    fbIconUrl,
    linkedinIconUrl,
    whatsappIconUrl,
    callIconUrl,
    gmailIconUrl,
    phoneIconPdfUrl,
    mailIconPdfUrl,
    webIconPdfUrl,
    bgImageUrl,
  } = props;
  const today = new Date();
  const formattedDate = `${String(today.getDate()).padStart(2, "0")}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${today.getFullYear()}`;

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        {logoUrl && (
          <PDFImage
            src={logoUrl}
            style={{ ...styles.centerLogo, marginBottom: 40 }}
          />
        )}

        <Text style={styles.title}>SKILL ENHANCEMENT &</Text>
        <Text style={styles.title}>PSYCHOMETRIC ASSESSMENT</Text>

        <Text style={styles.broughtBy}>brought to you by Mending Mind</Text>

        {reportImageUrl && (
          <PDFImage src={reportImageUrl} style={styles.brainImage} />
        )}

        <Text style={styles.testAdmin}>Test Administrator:</Text>

        <View style={styles.formContainer}>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Name:</Text>
            <View style={styles.formInput}>
              <Text style={styles.formValue}>{userInfo?.name || "Test"}</Text>
            </View>
          </View>

          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Date:</Text>
            <View style={styles.formInput}>
              <Text style={styles.formValue}>{formattedDate}</Text>
            </View>
          </View>
        </View>
      </Page>

      {/* Content Page 1 */}
      <Page size="A4" style={styles.contentPage}>
        {/* Disclaimer at the top */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            Note: This assessment is intended for self-awareness and
            developmental insights. For clinical concerns or diagnostic clarity,
            we recommend consulting a qualified mental health professional.
          </Text>
        </View>

        {/* Header with logo and barcode */}
        <View style={styles.headerContainer}>
          <View style={{ width: "20%" }} />
          <View style={styles.centerLogoContainer}>
            {logoUrl && <PDFImage src={logoUrl} style={styles.centerLogo} />}
          </View>
          <View style={styles.barcodeContainer}>
            {barcodeUrl ? (
              <PDFImage src={barcodeUrl} style={styles.barcodeImage} />
            ) : (
              <View
                style={{
                  width: 150,
                  height: 60,
                  backgroundColor: "#f0f0f0",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Montserrat",
                    fontSize: 12,
                    fontWeight: "bold",
                  }}
                >
                  ID: {quizId}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Main title */}
        <View style={styles.mainTitleContainer}>
          <Text style={styles.mainSubtitle}>
            Treatment | Therapy | Transformation
          </Text>
        </View>

        {/* Contact information with icons */}
        <View style={styles.contactInfoContainer}>
          <View style={styles.contactItem}>
            {/* Phone icon */}
            {phoneIconUrl ? (
              <PDFImage src={phoneIconUrl} style={styles.contactIcon} />
            ) : (
              <Text
                style={{
                  fontFamily: "Montserrat",
                  fontSize: 14,
                  marginRight: 5,
                }}
              >
                ☎
              </Text>
            )}
            <Text style={styles.contactText}>+91-8433805514</Text>
          </View>
          <View style={styles.contactItem}>
            {/* Email icon */}
            {emailIconUrl ? (
              <PDFImage src={emailIconUrl} style={styles.contactIcon} />
            ) : (
              <Text
                style={{
                  fontFamily: "Montserrat",
                  fontSize: 14,
                  marginRight: 5,
                }}
              >
                ✉
              </Text>
            )}
            <Text style={styles.contactText}>support@mendingmind.org</Text>
          </View>
          <View style={styles.contactItem}>
            {/* Website icon */}
            {webIconUrl ? (
              <PDFImage src={webIconUrl} style={styles.contactIcon} />
            ) : (
              <Text
                style={{
                  fontFamily: "Montserrat",
                  fontSize: 14,
                  marginRight: 5,
                }}
              >
                🌐
              </Text>
            )}
            <Text style={styles.contactText}>mendingmind.org</Text>
          </View>
        </View>

        {/* Horizontal line */}
        <View style={styles.horizontalLine} />

        {/* Address with location icon */}
        <View style={styles.addressContainer}>
          <View style={styles.contactItem}>
            {/* Location icon */}
            {locationIconUrl ? (
              <PDFImage src={locationIconUrl} style={styles.contactIcon} />
            ) : (
              <Text
                style={{
                  fontFamily: "Montserrat",
                  fontSize: 14,
                  marginRight: 5,
                }}
              >
                📍
              </Text>
            )}
            <Text style={styles.addressText}>
              Shingar vastu building, Gr floor, Flat no 001, JN Road, Mulund
              west, Mumbai 400080
            </Text>
          </View>
        </View>

        {/* Horizontal line */}
        <View style={styles.horizontalLine} />

        {/* Mental Health Evaluation title */}
        <View style={styles.evaluationTitleContainer}>
          <Text style={styles.evaluationTitle}>Mental Health Evaluation</Text>
        </View>

        {/* User info box */}
        <View style={styles.userInfoBox}>
          <View style={styles.userInfoLeft}>
            <View style={styles.userInfoItem}>
              <Text style={styles.userInfoLabel}>Name: </Text>
              <Text style={styles.userInfoValue}>
                {userInfo?.name || "N/A"}
              </Text>
            </View>
            <View style={styles.userInfoItem}>
              <Text style={styles.userInfoLabel}>Age: </Text>
              <Text style={styles.userInfoValue}>{userInfo?.age || "N/A"}</Text>
            </View>
            <View style={styles.userInfoItem}>
              <Text style={styles.userInfoLabel}>Sex: </Text>
              <Text style={styles.userInfoValue}>
                {userInfo?.gender || "N/A"}
              </Text>
            </View>
          </View>
          <View style={styles.userInfoRight}>
            <View style={styles.userInfoItem}>
              <Text style={styles.userInfoLabel}>ID: </Text>
              <Text style={styles.userInfoValue}>{quizId}</Text>
            </View>
            <View style={styles.userInfoItem}>
              <Text style={styles.userInfoValue}>{formattedDate}</Text>
            </View>
            <View style={styles.userInfoItem}>
              <Text style={styles.userInfoLabel}>Report generated on: </Text>
            </View>
          </View>
        </View>

        {/* About the test section */}
        <View style={styles.aboutTestContainer}>
          <Text style={styles.aboutTestTitle}>About the Test:</Text>
          <Text style={styles.aboutTestText}>
            The assessment combines five tools to offer insights into
            personality, stress, resilience, and decision-making. BFI-10 covers
            core traits, PSS gauges stress levels, DSS reveals decision styles,
            CD-RISC measures resilience, and TOSJS evaluates ethical judgment in
            tax scenarios.
          </Text>
        </View>

        {/* Results introduction */}
        <View style={styles.resultsIntroContainer}>
          <Text style={styles.resultsIntroText}>
            Based on how you answered the questions, your results are as
            follows:
          </Text>
        </View>

        {/* BFI-10 Personality Test Section */}
        <View style={styles.testSectionContainer}>
          <Text style={styles.testSectionTitle}>PERSONALITY TRAITS</Text>
          {/* Personality chart with description */}
          {/* <View style={{ flexDirection: "row", height: 270 }}>
            <View style={{ flex: 3 }}>
              {chartImages?.personalityChart ? (
                <PDFImage
                  src={chartImages.personalityChart}
                  style={{
                    width: 230,
                    height: 240,
                    objectFit: "contain",
                    marginLeft: -20,
                  }}
                />
              ) : (
                <View style={styles.pieChartPlaceholder}>
                  <Text style={styles.pieChartText}>Personality Profile</Text>
                </View>
              )}
            </View>

            <View
              style={{
                flex: 4,
                paddingLeft: 20,
                // paddingRight: 2,
                // marginLeft: -20,
                alignItems: "center",
                justifyContent: "center",
                maxWidth: 400,
              }}
            >
              <PersonalityTraitDisplay
                trait="Extraversion"
                score={reportScores?.personality?.extraversion || 7}
              />
            </View>
          </View> */}

          {/* Personality traits with visual scales and descriptions */}
          <View style={styles.personalityDescriptionContainer}>
            <View style={{ marginVertical: 20 }}>
              <PersonalityTraitDisplay
                trait="Extraversion"
                score={reportScores?.personality?.extraversion || 7}
              />
            </View>
            {/* Agreeableness */}
            <PersonalityTraitDisplay
              trait="Agreeableness"
              score={reportScores?.personality?.agreeableness || 8}
            />

            {/* Conscientiousness */}
            <PersonalityTraitDisplay
              trait="Conscientiousness"
              score={reportScores?.personality?.conscientiousness || 6}
            />

            {/* Neuroticism */}
            <PersonalityTraitDisplay
              trait="Neuroticism"
              score={reportScores?.personality?.neuroticism || 4}
            />

            {/* Openness */}
            <PersonalityTraitDisplay
              trait="Openness"
              score={reportScores?.personality?.openness || 9}
            />
          </View>
        </View>

        {/* PSS Stress Assessment Section */}
        <View style={styles.testSectionContainer}>
          <Text style={styles.testSectionTitle}>
            Perceived Stress Scale (PSS)
          </Text>

          {/* Stress radial bar chart visualization */}
          <StressScaleDisplay
            score={reportScores?.stress || 14}
            chartImage={chartImages?.stressChart}
          />
        </View>

        {/* Decision Style Assessment Section */}
        <View style={styles.testSectionContainer}>
          <Text style={styles.testSectionTitle}>
            Decision Making Style Assessment
          </Text>

          {/* Decision style visualization with chart */}
          <DecisionStyleDisplay
            rationalScore={reportScores?.decisionStyle?.rational || 18}
            intuitiveScore={reportScores?.decisionStyle?.intuitive || 22}
            chartImage={chartImages?.decisionChart}
          />
        </View>

        {/* Resilience Scale Section */}
        <View style={styles.testSectionContainer}>
          <Text style={styles.testSectionTitle}>Resilience Assessment</Text>

          {/* Resilience scale visualization with horizontal bar */}
          <ResilienceScaleDisplay
            score={reportScores?.resilience || 65}
            chartImage={chartImages?.resilienceChart}
          />
        </View>

        {/* Taxpayer Situational Judgement Test Section */}
        <View style={styles.testSectionContainer}>
          <Text style={styles.testSectionTitle}>
            Taxpayer Situational Judgement Test
          </Text>

          {/* Taxpayer judgement test results without charts */}
          <TaxpayerJudgementDisplay
            score={reportScores?.taxpayerJudgement || 4}
          />
        </View>
      </Page>
      <Page
        size="A4"
        style={{
          padding: 30,
        }}
      >
        {/* Logo at the top center */}
        <View style={{ alignItems: "center" }}>
          {logoUrl && (
            <PDFImage
              src={logoUrl}
              style={{
                width: 150,
                height: 60,
                objectFit: "contain",
                marginBottom: 20,
              }}
            />
          )}
        </View>

        {/* Final Reflections Section with Bulb Icon and Title */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 15,
            marginLeft: 20,
          }}
        >
          {logoUrl && (
            <PDFImage
              src="/bulb.png"
              style={{ width: 25, height: 25, marginRight: 8 }}
            />
          )}
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              fontFamily: "Montserrat",
              color: "#F0C93B",
            }}
          >
            Final Reflections
          </Text>
        </View>

        {/* Numbered List Container */}
        <View
          style={{
            padding: 20,
            backgroundColor: "#FFF8E1",
            borderRadius: 8,
            margin: 20,
            borderLeft: "3px solid #F0C93B",
          }}
        >
          {/* Item 1 */}
          <View style={{ flexDirection: "row", marginBottom: 12 }}>
            <Text
              style={{
                width: 16,
                fontFamily: "Montserrat",
                fontWeight: "bold",
                fontSize: 12,
                color: "#222",
              }}
            >
              1.
            </Text>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: "Montserrat",
                  fontWeight: "bold",
                  color: "#222",
                  fontSize: 12,
                }}
              >
                Self-awareness sparks growth:
              </Text>
              <Text
                style={{
                  fontFamily: "Montserrat",
                  color: "#333",
                  fontSize: 11,
                  lineHeight: 1.4,
                }}
              >
                Noticing patterns is the first step toward change.
              </Text>
            </View>
          </View>

          {/* Item 2 */}
          <View style={{ flexDirection: "row", marginBottom: 12 }}>
            <Text
              style={{
                width: 16,
                fontFamily: "Montserrat",
                fontWeight: "bold",
                fontSize: 12,
                color: "#222",
              }}
            >
              2.
            </Text>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: "Montserrat",
                  fontWeight: "bold",
                  color: "#222",
                  fontSize: 12,
                }}
              >
                There's no perfect score:
              </Text>
              <Text
                style={{
                  fontFamily: "Montserrat",
                  color: "#333",
                  fontSize: 11,
                  lineHeight: 1.4,
                }}
              >
                This is about progress, not perfection.
              </Text>
            </View>
          </View>

          {/* Item 3 */}
          <View style={{ flexDirection: "row", marginBottom: 12 }}>
            <Text
              style={{
                width: 16,
                fontFamily: "Montserrat",
                fontWeight: "bold",
                fontSize: 12,
                color: "#222",
              }}
            >
              3.
            </Text>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: "Montserrat",
                  fontWeight: "bold",
                  color: "#222",
                  fontSize: 12,
                }}
              >
                Small steps shape big shifts:
              </Text>
              <Text
                style={{
                  fontFamily: "Montserrat",
                  color: "#333",
                  fontSize: 11,
                  lineHeight: 1.4,
                }}
              >
                Tiny actions lead to long-term impact.
              </Text>
            </View>
          </View>

          {/* Item 4 */}
          <View style={{ flexDirection: "row", marginBottom: 12 }}>
            <Text
              style={{
                width: 16,
                fontFamily: "Montserrat",
                fontWeight: "bold",
                fontSize: 12,
                color: "#222",
              }}
            >
              4.
            </Text>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: "Montserrat",
                  fontWeight: "bold",
                  color: "#222",
                  fontSize: 12,
                }}
              >
                Support builds strength:
              </Text>
              <Text
                style={{
                  fontFamily: "Montserrat",
                  color: "#333",
                  fontSize: 11,
                  lineHeight: 1.4,
                }}
              >
                You don't have to do it all alone.
              </Text>
            </View>
          </View>

          {/* Item 5 */}
          <View style={{ flexDirection: "row", marginBottom: 12 }}>
            <Text
              style={{
                width: 16,
                fontFamily: "Montserrat",
                fontWeight: "bold",
                fontSize: 12,
                color: "#222",
              }}
            >
              5.
            </Text>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: "Montserrat",
                  fontWeight: "bold",
                  color: "#222",
                  fontSize: 12,
                }}
              >
                Flexibility is power:
              </Text>
              <Text
                style={{
                  fontFamily: "Montserrat",
                  color: "#333",
                  fontSize: 11,
                  lineHeight: 1.4,
                }}
              >
                Adapting doesn't mean losing direction.
              </Text>
            </View>
          </View>

          {/* Item 6 */}
          <View style={{ flexDirection: "row", marginBottom: 12 }}>
            <Text
              style={{
                width: 16,
                fontFamily: "Montserrat",
                fontWeight: "bold",
                fontSize: 12,
                color: "#222",
              }}
            >
              6.
            </Text>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: "Montserrat",
                  fontWeight: "bold",
                  color: "#222",
                  fontSize: 12,
                }}
              >
                You already have what you need:
              </Text>
              <Text
                style={{
                  fontFamily: "Montserrat",
                  color: "#333",
                  fontSize: 11,
                  lineHeight: 1.4,
                }}
              >
                Resilience, insight, and potential are all within you.
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 20,
            marginBottom: 30,
          }}
        >
          <View style={{ flex: 1, height: 1, backgroundColor: "#F0C93B" }} />
          <Text
            style={{
              paddingHorizontal: 10,
              fontSize: 10,
              fontFamily: "Montserrat",
              color: "#333",
            }}
          >
            For inquiry click on the WhatsApp icon
          </Text>
          <View style={{ flex: 1, height: 1, backgroundColor: "#F0C93B" }} />
        </View>

        {/* Main content area */}
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 20,
            // marginTop: 30,
          }}
        >
          {/* Left side - Illustration */}
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <PDFImage
              src="/pdf/illustration.png"
              style={{
                width: 100,
                height: 100,
                objectFit: "contain",
              }}
            />
          </View>

          {/* Middle - Contact info */}
          <View style={{ flex: 2 }}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                fontFamily: "Montserrat",
                color: "#333",
                marginBottom: 5,
              }}
            >
              For collaborations Contact:
            </Text>
            {/* <Link src="mailto:kinjaljain@mendingmind.org">
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "Montserrat",
                  color: "#333",
                  marginBottom: 3,
                }}
              >
                kinjaljain@mendingmind.org
              </Text>
            </Link> */}
            <Link src="mailto:support@mendingmind.org">
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "Montserrat",
                  color: "#333",
                  marginBottom: 20,
                }}
              >
                support@mendingmind.org
              </Text>
            </Link>
          </View>

          {/* Right side - Founder image */}
          {/* <View
            style={{
              flex: 1,
              alignItems: "center",
              position: "absolute",
              bottom: -70,
              right: 12,
            }}
          >
            {founderImageUrl ? (
              <PDFImage
                src={founderImageUrl}
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: 100,
                  border: "2px solid #F0C93B",
                }}
              />
            ) : (
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: "#f0f0f0",
                  border: "2px solid #F0C93B",
                }}
              />
            )}
          </View> */}
        </View>

        {/* Social media section */}
        <View
          style={{
            backgroundColor: "#F0C93B",
            marginTop: "auto",
            borderRadius: 8,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              padding: 15,
              marginTop: "auto",
              backgroundColor: "#F0C93B",
              borderRadius: 8,
            }}
          >
            {/* Follow us section */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "bold",
                  fontFamily: "Montserrat",
                  color: "#333",
                  marginBottom: 10,
                }}
              >
                Follow us on:
              </Text>
              <View style={{ flexDirection: "row", gap: 10 }}>
                {/* Instagram */}
                <Link src="https://www.instagram.com/mending__mind/">
                  {instaIconUrl ? (
                    <PDFImage
                      src={instaIconUrl}
                      style={{ width: 20, height: 20 }}
                    />
                  ) : (
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        backgroundColor: "#f0f0f0",
                      }}
                    />
                  )}
                </Link>

                {/* Facebook */}
                <Link src="https://www.facebook.com/mendingmindfoundation/">
                  {fbIconUrl ? (
                    <PDFImage
                      src={fbIconUrl}
                      style={{ width: 20, height: 20 }}
                    />
                  ) : (
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        backgroundColor: "#f0f0f0",
                      }}
                    />
                  )}
                </Link>

                {/* LinkedIn */}
                <Link src="https://www.linkedin.com/company/mendingmind/">
                  {linkedinIconUrl ? (
                    <PDFImage
                      src={linkedinIconUrl}
                      style={{ width: 20, height: 20 }}
                    />
                  ) : (
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        backgroundColor: "#f0f0f0",
                      }}
                    />
                  )}
                </Link>
              </View>
            </View>

            {/* Connect with us section */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "bold",
                  fontFamily: "Montserrat",
                  color: "#333",
                  marginBottom: 10,
                }}
              >
                Connect with us:
              </Text>
              <View style={{ flexDirection: "row", gap: 10 }}>
                {/* WhatsApp */}
                <Link src="https://api.whatsapp.com/send?phone=918433805514">
                  {whatsappIconUrl ? (
                    <PDFImage
                      src={whatsappIconUrl}
                      style={{ width: 20, height: 20 }}
                    />
                  ) : (
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        backgroundColor: "#f0f0f0",
                      }}
                    />
                  )}
                </Link>

                <Link src="tel:+918433805514">
                  {callIconUrl ? (
                    <PDFImage
                      src={callIconUrl}
                      style={{ width: 20, height: 20 }}
                    />
                  ) : (
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        backgroundColor: "#f0f0f0",
                      }}
                    />
                  )}
                </Link>

                <Link src="mailto:support@mendingmind.org">
                  {gmailIconUrl ? (
                    <PDFImage
                      src={gmailIconUrl}
                      style={{ width: 20, height: 20 }}
                    />
                  ) : (
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        backgroundColor: "#f0f0f0",
                      }}
                    />
                  )}
                </Link>
              </View>
            </View>

            {/* Founder section
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Text
              style={{
                fontSize: 11,
                fontFamily: "Montserrat",
                color: "#333",
              }}
            >
              Founder,
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                fontFamily: "Montserrat",
                color: "#333",
              }}
            >
              Kinjal M Jain
            </Text>
          </View> */}
          </View>

          {/* Contact details */}
          <View
            style={{
              flexDirection: "row",
              padding: 15,
              paddingTop: 5,
              backgroundColor: "#F0C93B",
            }}
          >
            <View
              style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            >
              {phoneIconUrl ? (
                <PDFImage
                  src={phoneIconUrl}
                  style={{ width: 15, height: 15, marginRight: 5 }}
                />
              ) : (
                <View
                  style={{
                    width: 15,
                    height: 15,
                    marginRight: 5,
                    backgroundColor: "#f0f0f0",
                  }}
                />
              )}
              <Link src="tel:+918433805514">
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: "Montserrat",
                    color: "#333",
                  }}
                >
                  +91-8433805514
                </Text>
              </Link>
            </View>

            <View
              style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            >
              {emailIconUrl ? (
                <PDFImage
                  src={emailIconUrl}
                  style={{ width: 15, height: 15, marginRight: 5 }}
                />
              ) : (
                <View
                  style={{
                    width: 15,
                    height: 15,
                    marginRight: 5,
                    backgroundColor: "#f0f0f0",
                  }}
                />
              )}
              <Link src="mailto:support@mendingmind.org">
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: "Montserrat",
                    color: "#333",
                  }}
                >
                  support@mendingmind.org
                </Text>
              </Link>
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              {webIconUrl ? (
                <PDFImage
                  src={webIconUrl}
                  style={{ width: 15, height: 15, marginRight: 5 }}
                />
              ) : (
                <View
                  style={{
                    width: 15,
                    height: 15,
                    marginRight: 5,
                    backgroundColor: "#f0f0f0",
                  }}
                />
              )}
              <Link src="https://mendingmind.org">
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: "Montserrat",
                    color: "#333",
                  }}
                >
                  mendingmind.org
                </Text>
              </Link>
            </View>
          </View>
        </View>
        {/* {bgImageUrl && (
          <PDFImage
            src={bgImageUrl}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "auto",
              zIndex: 21,
              opacity: 1,
            }}
          />
        )} */}
      </Page>
    </Document>
  );
};

const PDFViewer = ({ userInfo, reportScores, refreshTrigger = 0 }) => {
  const [isClient, setIsClient] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [logoUrl, setLogoUrl] = useState(null);
  const [reportImageUrl, setReportImageUrl] = useState(null);
  const [barcodeUrl, setBarcodeUrl] = useState(null);
  const [phoneIconUrl, setPhoneIconUrl] = useState(null);
  const [emailIconUrl, setEmailIconUrl] = useState(null);
  const [webIconUrl, setWebIconUrl] = useState(null);
  const [locationIconUrl, setLocationIconUrl] = useState(null);
  const [chartImages, setChartImages] = useState(null);

  // PDF folder images
  const [founderImageUrl, setFounderImageUrl] = useState(null);
  const [instaIconUrl, setInstaIconUrl] = useState(null);
  const [fbIconUrl, setFbIconUrl] = useState(null);
  const [linkedinIconUrl, setLinkedinIconUrl] = useState(null);
  const [whatsappIconUrl, setWhatsappIconUrl] = useState(null);
  const [callIconUrl, setCallIconUrl] = useState(null);
  const [gmailIconUrl, setGmailIconUrl] = useState(null);
  const [phoneIconPdfUrl, setPhoneIconPdfUrl] = useState(null);
  const [mailIconPdfUrl, setMailIconPdfUrl] = useState(null);
  const [webIconPdfUrl, setWebIconPdfUrl] = useState(null);
  const [bgImageUrl, setBgImageUrl] = useState(null);
  const quizId = useMemo(() => generateQuizId(), []);
  // Use useRef to track if we've already set the chart images
  const chartImagesSetRef = useRef(false);

  // Generate barcode using JsBarcode directly
  useEffect(() => {
    if (typeof window !== "undefined" && quizId) {
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
        setBarcodeUrl(dataUrl);
      } catch (error) {
        // Set a fallback empty image
        setBarcodeUrl(
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="
        );
      }
    }
  }, [quizId]);

  // Load images
  useEffect(() => {
    const loadImages = async () => {
      try {
        // Helper function to load an image and convert to data URL
        const loadImageAsDataUrl = async (path) => {
          const response = await fetch(path);
          const blob = await response.blob();
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
        };

        // Load all images in parallel
        const [
          logoDataUrl,
          reportDataUrl,
          phoneIconDataUrl,
          emailIconDataUrl,
          webIconDataUrl,
          locationIconDataUrl,
          // Load PDF folder images
          founderImageUrl,
          instaIconUrl,
          fbIconUrl,
          linkedinIconUrl,
          whatsappIconUrl,
          callIconUrl,
          gmailIconUrl,
          phoneIconPdfUrl,
          mailIconPdfUrl,
          webIconPdfUrl,
          bgImageUrl,
        ] = await Promise.all([
          loadImageAsDataUrl("/Mind_Logo.png"),
          loadImageAsDataUrl("/report.png"),
          loadImageAsDataUrl("/icons/call.png"),
          loadImageAsDataUrl("/icons/mail.png"),
          loadImageAsDataUrl("/icons/web.png"),
          loadImageAsDataUrl("/icons/location.png"),
          // PDF folder images
          loadImageAsDataUrl("/pdf/founder.jpg"),
          loadImageAsDataUrl("/pdf/insta.png"),
          loadImageAsDataUrl("/pdf/fb.png"),
          loadImageAsDataUrl("/pdf/linkedin.png"),
          loadImageAsDataUrl("/pdf/whatsapp.png"),
          loadImageAsDataUrl("/pdf/call.png"),
          loadImageAsDataUrl("/pdf/gmail.png"),
          loadImageAsDataUrl("/pdf/phone.png"),
          loadImageAsDataUrl("/pdf/mail.png"),
          loadImageAsDataUrl("/pdf/10.png"),
          loadImageAsDataUrl("/pdf/bg.png"),
        ]);

        // Set all image URLs
        setLogoUrl(logoDataUrl);
        setReportImageUrl(reportDataUrl);
        setPhoneIconUrl(phoneIconDataUrl);
        setEmailIconUrl(emailIconDataUrl);
        setWebIconUrl(webIconDataUrl);
        setLocationIconUrl(locationIconDataUrl);

        // Set PDF folder images
        setFounderImageUrl(founderImageUrl);
        setInstaIconUrl(instaIconUrl);
        setFbIconUrl(fbIconUrl);
        setLinkedinIconUrl(linkedinIconUrl);
        setWhatsappIconUrl(whatsappIconUrl);
        setCallIconUrl(callIconUrl);
        setGmailIconUrl(gmailIconUrl);
        setPhoneIconPdfUrl(phoneIconPdfUrl);
        setMailIconPdfUrl(mailIconPdfUrl);
        setWebIconPdfUrl(webIconPdfUrl);
        setBgImageUrl(bgImageUrl);
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };

    if (typeof window !== "undefined") {
      loadImages();
    }
  }, []);

  // Generate PDF blob for download
  useEffect(() => {
    let timeoutId;

    const generatePdfBlob = async () => {
      try {
        // Check if all required assets are loaded
        if (!logoUrl || !reportImageUrl || !barcodeUrl) return;

        setIsLoading(true);

        // Create PDF with a small delay to ensure all assets are ready
        await new Promise((resolve) => setTimeout(resolve, 200));

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

        setPdfBlob(blob);
        window.pdfBlob = blob; // Make it available globally for download
      } catch (error) {
        // Handle error silently
      } finally {
        setIsLoading(false);
      }
    };

    // Only generate PDF when all required assets are loaded
    // This prevents unnecessary re-renders
    const allAssetsLoaded =
      logoUrl &&
      reportImageUrl &&
      barcodeUrl &&
      chartImages &&
      // PDF folder images
      founderImageUrl &&
      instaIconUrl &&
      fbIconUrl &&
      linkedinIconUrl &&
      whatsappIconUrl &&
      callIconUrl &&
      gmailIconUrl &&
      phoneIconPdfUrl &&
      mailIconPdfUrl &&
      webIconPdfUrl &&
      bgImageUrl;

    if (allAssetsLoaded) {
      // Use a flag to prevent multiple PDF generations
      if (!pdfBlob || refreshTrigger) {
        timeoutId = setTimeout(() => {
          generatePdfBlob();
        }, 300);
      }
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [
    userInfo,
    reportScores,
    refreshTrigger,
    logoUrl,
    reportImageUrl,
    barcodeUrl,
    quizId,
    phoneIconUrl,
    emailIconUrl,
    webIconUrl,
    locationIconUrl,
    chartImages,
    // PDF folder images
    founderImageUrl,
    instaIconUrl,
    fbIconUrl,
    linkedinIconUrl,
    whatsappIconUrl,
    callIconUrl,
    gmailIconUrl,
    phoneIconPdfUrl,
    mailIconPdfUrl,
    webIconPdfUrl,
    pdfBlob, // Add pdfBlob to dependencies to prevent regeneration if it already exists
  ]);

  // Check if we're in the browser
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Download PDF function
  const downloadPdf = () => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `MendingMind_Assessment_${quizId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  if (!isClient) {
    return (
      <div className="w-full h-full flex flex-col items-center">
        <div className="flex flex-col items-center justify-center p-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B4E0E0] mb-4"></div>
          <p className="text-gray-600">Preparing PDF viewer...</p>
        </div>
      </div>
    );
  }

  // Handle chart images generation

  const handleChartsGenerated = (images) => {
    // Only log and update state if we haven't already done so
    if (!chartImagesSetRef.current) {
      // console.log("Chart images generated:", images);
      setChartImages(images);
      chartImagesSetRef.current = true;
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      {/* Chart image generator component (hidden) */}
      {isClient && (
        <ChartImageGenerator
          reportScores={reportScores}
          onChartsGenerated={handleChartsGenerated}
        />
      )}

      {isLoading || !logoUrl || !reportImageUrl ? (
        <div className="flex flex-col items-center justify-center p-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B4E0E0] mb-4"></div>
          <p className="text-gray-600">Generating PDF preview...</p>
        </div>
      ) : (
        <>
          <div className="w-full mb-4 flex justify-end">
            <button
              onClick={downloadPdf}
              className="bg-[#F0C93B] hover:bg-[#e0b92b] text-white px-4 py-2 rounded-md font-medium"
            >
              Download PDF
            </button>
          </div>
          <ReactPDFViewer style={{ width: "100%", height: 800 }}>
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
          </ReactPDFViewer>
        </>
      )}
    </div>
  );
};

export default PDFViewer;
