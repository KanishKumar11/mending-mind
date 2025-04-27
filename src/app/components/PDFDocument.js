"use client";

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Link,
} from "@react-pdf/renderer";
import { Image as PDFImage } from "@react-pdf/renderer";
import { styles } from "./pdfStyles";
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

// PDF Document component
export const MyDocument = (props) => {
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
            <Link src="tel:+918433805514" style={styles.contactText}>
              +91-8433805514
            </Link>
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
            <Link
              src="mailto:support@mendingmind.org"
              style={styles.contactText}
            >
              support@mendingmind.org
            </Link>
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
            <Link src="https://mendingmind.org" style={styles.contactText}>
              mendingmind.org
            </Link>
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
          <Text style={styles.testSectionTitle}>
            BFI-10 Personality Assessment
          </Text>
          {/* Personality chart with description */}
          <View style={{ flexDirection: "row", marginBottom: 15 }}>
            {/* Left side - Personality chart */}
            <View style={{ flex: 3 }}>
              {chartImages?.personalityChart ? (
                <PDFImage
                  src={chartImages.personalityChart}
                  style={{ width: "100%", height: 230, objectFit: "contain" }}
                />
              ) : (
                /* Fallback if chart image is not available */
                <View style={styles.pieChartPlaceholder}>
                  <Text style={styles.pieChartText}>Personality Profile</Text>
                </View>
              )}
            </View>

            {/* Right side - Description */}
            <View
              style={{
                flex: 2,
                paddingLeft: 15,
                paddingRight: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "bold",
                  fontFamily: "Montserrat",
                  color: "#333",
                  marginBottom: 8,
                  textAlign: "center",
                }}
              >
                Understanding Your Personality Profile
              </Text>

              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "Montserrat",
                  color: "#333",
                  marginBottom: 8,
                  lineHeight: 1.4,

                  textAlign: "center",
                }}
              >
                {(() => {
                  // Get personality scores
                  const extraversion =
                    reportScores?.personality?.extraversion || 5;
                  const agreeableness =
                    reportScores?.personality?.agreeableness || 5;
                  const conscientiousness =
                    reportScores?.personality?.conscientiousness || 5;
                  const neuroticism =
                    reportScores?.personality?.neuroticism || 5;
                  const openness = reportScores?.personality?.openness || 5;

                  // Generate personalized summary based on dominant traits
                  let summary = "";

                  // Check for high extraversion
                  if (extraversion >= 7) {
                    summary +=
                      "You tend to be sociable, energetic, and outgoing. ";
                  } else if (extraversion <= 3) {
                    summary +=
                      "You value your personal space and time for reflection. ";
                  }

                  // Check for high agreeableness
                  if (agreeableness >= 7) {
                    summary +=
                      "You are compassionate, cooperative, and considerate of others. ";
                  } else if (agreeableness <= 3) {
                    summary +=
                      "You tend to be direct, straightforward, and analytical in your approach. ";
                  }

                  // Check for high conscientiousness
                  if (conscientiousness >= 7) {
                    summary +=
                      "You are organized, responsible, and detail-oriented. ";
                  } else if (conscientiousness <= 3) {
                    summary +=
                      "You prefer flexibility and spontaneity over rigid structure. ";
                  }

                  // Check for high neuroticism
                  if (neuroticism >= 7) {
                    summary +=
                      "You experience emotions deeply and are sensitive to stressors. ";
                  } else if (neuroticism <= 3) {
                    summary +=
                      "You tend to remain calm and emotionally stable under pressure. ";
                  }

                  // Check for high openness
                  if (openness >= 7) {
                    summary +=
                      "You are curious, creative, and open to new experiences.";
                  } else if (openness <= 3) {
                    summary +=
                      "You value tradition, practicality, and concrete thinking.";
                  }

                  return (
                    summary ||
                    "Your personality profile shows a balanced distribution of traits."
                  );
                })()}
              </Text>
            </View>
          </View>

          {/* Individual personality traits */}
          <PersonalityTraitDisplay
            reportScores={reportScores}
            chartImages={chartImages}
          />
        </View>

        {/* Perceived Stress Scale Section */}
        <View style={styles.testSectionContainer}>
          <Text style={styles.testSectionTitle}>
            Perceived Stress Scale (PSS)
          </Text>

          {/* Stress scale visualization */}
          <StressScaleDisplay
            score={reportScores?.stress || 14}
            chartImage={chartImages?.stressChart}
          />
        </View>
      </Page>

      {/* Content Page 2 */}
      <Page size="A4" style={styles.contentPage}>
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

        {/* Decision-Making Style Section */}
        <View style={styles.testSectionContainer}>
          <Text style={styles.testSectionTitle}>
            Decision-Making Style Scale
          </Text>

          {/* Decision style visualization */}
          <DecisionStyleDisplay
            rational={reportScores?.decisionStyle?.rational || 15}
            intuitive={reportScores?.decisionStyle?.intuitive || 15}
            chartImage={chartImages?.decisionStyleChart}
          />
        </View>

        {/* Resilience Scale Section */}
        <View style={styles.testSectionContainer}>
          <Text style={styles.testSectionTitle}>
            Connor-Davidson Resilience Scale
          </Text>

          {/* Resilience scale visualization */}
          <ResilienceScaleDisplay
            score={reportScores?.resilience || 50}
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

        {/* Final Reflections Section */}
        <View
          style={{
            marginTop: 20,
            marginBottom: 30,
            padding: 20,
            backgroundColor: "#F9F9F9",
            borderRadius: 8,
            borderLeft: "4px solid #F0C93B",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              fontFamily: "Montserrat",
              color: "#333",
              marginBottom: 15,
              textAlign: "center",
            }}
          >
            Final Reflections
          </Text>

          <Text
            style={{
              fontSize: 11,
              fontFamily: "Montserrat",
              color: "#333",
              marginBottom: 10,
              lineHeight: 1.5,
            }}
          >
            • Remember that these assessments offer a snapshot of your current
            mental state and tendencies, not fixed traits.
          </Text>

          <Text
            style={{
              fontSize: 11,
              fontFamily: "Montserrat",
              color: "#333",
              marginBottom: 10,
              lineHeight: 1.5,
            }}
          >
            • Your results can change over time as you grow, learn, and
            experience life's challenges and joys.
          </Text>

          <Text
            style={{
              fontSize: 11,
              fontFamily: "Montserrat",
              color: "#333",
              marginBottom: 10,
              lineHeight: 1.5,
            }}
          >
            • Consider these insights as starting points for self-reflection and
            personal development, not as limitations or labels.
          </Text>

          <Text
            style={{
              fontSize: 11,
              fontFamily: "Montserrat",
              color: "#333",
              marginBottom: 10,
              lineHeight: 1.5,
            }}
          >
            • If any areas concern you, remember that seeking support is a sign
            of strength, not weakness.
          </Text>

          <Text
            style={{
              fontSize: 11,
              fontFamily: "Montserrat",
              color: "#333",
              marginBottom: 10,
              lineHeight: 1.5,
            }}
          >
            • We at Mending Mind are here to support your journey toward greater
            mental wellbeing and personal growth.
          </Text>
        </View>

        {/* Founder's Note */}
        <View
          style={{
            flexDirection: "row",
            marginTop: 20,
            marginBottom: 30,
            padding: 15,
            backgroundColor: "#F5F5F5",
            borderRadius: 8,
          }}
        >
          {/* Founder's Image */}
          <View style={{ width: "25%", alignItems: "center" }}>
            {founderImageUrl && (
              <PDFImage
                src={founderImageUrl}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  objectFit: "cover",
                }}
              />
            )}
            <Text
              style={{
                fontSize: 10,
                fontWeight: "bold",
                fontFamily: "Montserrat",
                marginTop: 5,
                textAlign: "center",
              }}
            >
              Dr. Priyanka Dang
            </Text>
            <Text
              style={{
                fontSize: 8,
                fontFamily: "Montserrat",
                fontStyle: "italic",
                textAlign: "center",
              }}
            >
              Founder, Mending Mind
            </Text>
          </View>

          {/* Founder's Message */}
          <View style={{ width: "75%", paddingLeft: 15 }}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                fontFamily: "Montserrat",
                marginBottom: 8,
              }}
            >
              A Note from Our Founder
            </Text>
            <Text
              style={{
                fontSize: 10,
                fontFamily: "Montserrat",
                lineHeight: 1.5,
                fontStyle: "italic",
              }}
            >
              "At Mending Mind, we believe that understanding yourself is the
              first step toward growth and healing. This assessment is designed
              to give you insights into your mental patterns and strengths. My
              team and I are committed to supporting you on your journey to
              better mental health through evidence-based approaches and
              compassionate care. Remember, seeking help is a sign of courage,
              not weakness."
            </Text>
          </View>
        </View>

        {/* Contact Information */}
        <View
          style={{
            marginTop: 20,
            padding: 15,
            backgroundColor: "#F0C93B",
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              fontFamily: "Montserrat",
              color: "#333",
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            Connect With Us
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            {/* Left side - Contact info */}
            <View style={{ width: "60%" }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                {phoneIconPdfUrl && (
                  <PDFImage
                    src={phoneIconPdfUrl}
                    style={{ width: 15, height: 15, marginRight: 5 }}
                  />
                )}
                <Link
                  src="tel:+918433805514"
                  style={{
                    fontSize: 10,
                    fontFamily: "Montserrat",
                    color: "#333",
                  }}
                >
                  +91-8433805514
                </Link>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                {mailIconPdfUrl && (
                  <PDFImage
                    src={mailIconPdfUrl}
                    style={{ width: 15, height: 15, marginRight: 5 }}
                  />
                )}
                <Link
                  src="mailto:support@mendingmind.org"
                  style={{
                    fontSize: 10,
                    fontFamily: "Montserrat",
                    color: "#333",
                  }}
                >
                  support@mendingmind.org
                </Link>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                {webIconPdfUrl && (
                  <PDFImage
                    src={webIconPdfUrl}
                    style={{ width: 15, height: 15, marginRight: 5 }}
                  />
                )}
                <Link
                  src="https://mendingmind.org"
                  style={{
                    fontSize: 10,
                    fontFamily: "Montserrat",
                    color: "#333",
                  }}
                >
                  mendingmind.org
                </Link>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                {locationIconUrl && (
                  <PDFImage
                    src={locationIconUrl}
                    style={{ width: 15, height: 15, marginRight: 5 }}
                  />
                )}
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: "Montserrat",
                    color: "#333",
                  }}
                >
                  Shingar vastu building, Gr floor, Flat no 001, JN Road, Mulund
                  west, Mumbai 400080
                </Text>
              </View>
            </View>

            {/* Right side - Social media */}
            <View
              style={{
                width: "35%",
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  marginBottom: 10,
                }}
              >
                <View style={{ marginHorizontal: 5 }}>
                  <Link src="https://www.instagram.com/mending__mind/">
                    {instaIconUrl && (
                      <PDFImage
                        src={instaIconUrl}
                        style={{ width: 20, height: 20 }}
                      />
                    )}
                  </Link>
                </View>
                <View style={{ marginHorizontal: 5 }}>
                  <Link src="https://www.facebook.com/mendingmindfoundation/">
                    {fbIconUrl && (
                      <PDFImage
                        src={fbIconUrl}
                        style={{ width: 20, height: 20 }}
                      />
                    )}
                  </Link>
                </View>
                <View style={{ marginHorizontal: 5 }}>
                  <Link src="https://www.linkedin.com/company/mendingmind/">
                    {linkedinIconUrl && (
                      <PDFImage
                        src={linkedinIconUrl}
                        style={{ width: 20, height: 20 }}
                      />
                    )}
                  </Link>
                </View>
                <View style={{ marginHorizontal: 5 }}>
                  <Link src="https://api.whatsapp.com/send?phone=918433805514">
                    {whatsappIconUrl && (
                      <PDFImage
                        src={whatsappIconUrl}
                        style={{ width: 20, height: 20 }}
                      />
                    )}
                  </Link>
                </View>
              </View>

              <Text
                style={{
                  fontSize: 9,
                  fontFamily: "Montserrat",
                  color: "#333",
                  marginTop: 5,
                  textAlign: "right",
                }}
              >
                Follow us on social media for mental health tips, resources, and
                updates.
              </Text>
            </View>
          </View>
        </View>

        {/* Background image at the bottom */}
        {bgImageUrl && (
          <PDFImage
            src={bgImageUrl}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "auto",
              zIndex: -1,
              opacity: 0.8,
            }}
          />
        )}
      </Page>
    </Document>
  );
};

export default MyDocument;
