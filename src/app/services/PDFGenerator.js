"use client";

import { jsPDF } from "jspdf";
import "jspdf-autotable";

/**
 * PDFGenerator service for creating personalized Mind Scan reports
 * This service generates dynamic PDF reports based on user information and questionnaire answers
 */
export default class PDFGenerator {
  /**
   * Generate a personalized Mind Scan report PDF
   * @param {Object} userInfo - User's personal information
   * @param {Array} answers - Array of questionnaire answers
   * @param {String} language - Current language (en/hi)
   * @returns {Promise<Blob>} - PDF document as a Blob
   */
  static async generateReport(userInfo, quizAttempts, language) {
    // Create new PDF document
    const doc = new jsPDF();
    const reportId = `MSAQ${Math.random()
      .toString(36)
      .substring(2, 8)}${Math.random().toString(36).substring(2, 4)}`;
    const currentDate = new Date().toLocaleDateString();

    // Add logo and header
    this.addHeader(doc, language);

    // Add report metadata
    this.addReportMetadata(doc, reportId, currentDate, language);

    // Add user information section
    this.addUserInformation(doc, userInfo, language);

    // Add assessment summary and mental health metrics for each attempt
    quizAttempts.forEach((attempt, index) => {
      const attemptNumber = index + 1;
      const attemptLabel =
        language === "en"
          ? `Attempt ${attemptNumber}`
          : `प्रयास ${attemptNumber}`;

      // Add a page break before the second attempt's details if it's not the first page
      if (index > 0) {
        doc.addPage();
        // Re-add header on new page if desired, or ensure consistent layout
        // this.addHeader(doc, language); // Optional: if you want header on each attempt's page
      }

      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text(
        attemptLabel,
        20,
        doc.lastAutoTable.finalY
          ? doc.lastAutoTable.finalY + 10
          : index === 0
          ? 140
          : 40
      ); // Adjust Y position

      this.addAssessmentSummary(doc, attempt, language, attemptLabel);
      this.addMentalHealthMetrics(doc, attempt, language, attemptLabel);
    });

    // Add recommendations based on the latest attempt
    if (quizAttempts.length > 0) {
      this.addRecommendations(
        doc,
        quizAttempts[quizAttempts.length - 1],
        language
      );
    }

    // Add footer
    this.addFooter(doc, language);

    // Return the PDF as a blob
    return doc.output("blob");
  }

  /**
   * Add header with logo to the PDF
   * @param {jsPDF} doc - PDF document
   * @param {String} language - Current language
   */
  static addHeader(doc, language) {
    // Add logo (in a real implementation, you would use an image)
    doc.setFontSize(24);
    doc.setTextColor(33, 33, 33);
    doc.text("MINDSCAN", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(
      language === "en"
        ? "a mental health checkup camp"
        : "एक मानसिक स्वास्थ्य जांच शिविर",
      105,
      28,
      { align: "center" }
    );

    doc.setFontSize(10);
    doc.text(
      language === "en"
        ? "brought to you by Mending Mind"
        : "मेंडिंग माइंड द्वारा प्रस्तुत",
      105,
      35,
      { align: "center" }
    );

    // Add horizontal line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 40, 190, 40);
  }

  /**
   * Add report metadata (ID, date)
   * @param {jsPDF} doc - PDF document
   * @param {String} reportId - Unique report ID
   * @param {String} date - Current date
   * @param {String} language - Current language
   */
  static addReportMetadata(doc, reportId, date, language) {
    doc.setFontSize(18);
    doc.setTextColor(33, 33, 33);
    doc.text(
      language === "en" ? "Your Mind Scan Report" : "आपकी माइंड स्कैन रिपोर्ट",
      105,
      55,
      { align: "center" }
    );

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `${language === "en" ? "Report ID" : "रिपोर्ट आईडी"}: ${reportId}`,
      105,
      63,
      { align: "center" }
    );
    doc.text(`${language === "en" ? "Date" : "दिनांक"}: ${date}`, 105, 70, {
      align: "center",
    });
  }

  /**
   * Add user information section
   * @param {jsPDF} doc - PDF document
   * @param {Object} userInfo - User's personal information
   * @param {String} language - Current language
   */
  static addUserInformation(doc, userInfo, language) {
    doc.setFontSize(14);
    doc.setTextColor(33, 33, 33);
    doc.text(
      language === "en" ? "Personal Information" : "व्यक्तिगत जानकारी",
      20,
      85
    );

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);

    // Create a table for user information
    const userData = [
      [language === "en" ? "Name" : "नाम", userInfo.name],
      [language === "en" ? "Age" : "उम्र", userInfo.age],
      [language === "en" ? "Gender" : "लिंग", userInfo.gender],
      [language === "en" ? "Email" : "ईमेल", userInfo.emailId],
    ];

    doc.autoTable({
      startY: 90,
      head: [],
      body: userData,
      theme: "plain",
      styles: { fontSize: 10 },
      columnStyles: { 0: { fontStyle: "bold", cellWidth: 40 } },
    });
  }

  /**
   * Add assessment summary section
   * @param {jsPDF} doc - PDF document
   * @param {Array} answers - Array of questionnaire answers
   * @param {String} language - Current language
   */
  static addAssessmentSummary(doc, attemptData, language, attemptLabel) {
    const finalY = doc.lastAutoTable.finalY || 130;

    doc.setFontSize(14);
    doc.setTextColor(33, 33, 33);
    doc.text(
      language === "en" ? "Assessment Summary" : "मूल्यांकन सारांश",
      20,
      finalY + 15
    );

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `${attemptLabel}: ${
        language === "en"
          ? "Summary of your responses for this attempt."
          : "इस प्रयास के लिए आपकी प्रतिक्रियाओं का सारांश।"
      }`,
      20,
      finalY + 25,
      { maxWidth: 170 }
    );
    // Note: The original generic thank you message might be better placed once, or rephrased per attempt.
    // For now, replacing it with attempt-specific summary line.
  }

  /**
   * Add mental health metrics based on answers
   * @param {jsPDF} doc - PDF document
   * @param {Array} answers - Array of questionnaire answers
   * @param {String} language - Current language
   */
  static addMentalHealthMetrics(doc, attemptData, language, attemptLabel) {
    const finalY = doc.lastAutoTable.finalY || 150;

    doc.setFontSize(14);
    doc.setTextColor(33, 33, 33);
    doc.text(
      `${attemptLabel}: ${
        language === "en"
          ? "Mental Health Metrics"
          : "मानसिक स्वास्थ्य मेट्रिक्स"
      }`,
      20,
      finalY + 10 // Adjusted Y position relative to previous section
    );
    // Ensure that the content for metrics uses attemptData instead of a generic 'answers'
    // This part of the code (actual metrics generation) is not shown in the provided snippet
    // but would need to be adapted to use 'attemptData'. Example:
    // const stressLevel = attemptData.stress; // Assuming 'stress' is a key in attemptData
    // doc.text(`Stress Level: ${stressLevel}`, 20, finalY + 20);
    // ... and so on for other metrics

    // Calculate metrics based on answers
    // This is a simplified example - in a real implementation, you would have more sophisticated scoring
    const stressScore = this.calculateMetric(answers, [1, 2, 3, 4, 5]);
    const socialScore = this.calculateMetric(answers, [6, 7, 8, 9]);
    const anxietyScore = this.calculateMetric(answers, [10, 11, 12]);

    // Create a table for metrics
    const metricsData = [
      [
        language === "en" ? "Stress Level" : "तनाव स्तर",
        this.getScoreLabel(stressScore, language),
      ],
      [
        language === "en" ? "Social Well-being" : "सामाजिक कल्याण",
        this.getScoreLabel(socialScore, language),
      ],
      [
        language === "en" ? "Anxiety Level" : "चिंता स्तर",
        this.getScoreLabel(anxietyScore, language),
      ],
    ];

    doc.autoTable({
      startY: finalY + 45,
      head: [],
      body: metricsData,
      theme: "grid",
      styles: { fontSize: 10 },
      columnStyles: { 0: { fontStyle: "bold" } },
    });
  }

  /**
   * Calculate a metric score based on specific question answers
   * @param {Array} answers - All answers
   * @param {Array} questionIds - IDs of questions to include in this metric
   * @returns {Number} - Calculated score (0-100)
   */
  static calculateMetric(answers, questionIds) {
    // This is a simplified calculation
    // In a real implementation, you would have more sophisticated scoring algorithms
    const relevantAnswers = answers.filter((a) =>
      questionIds.includes(a.questionId)
    );
    if (relevantAnswers.length === 0) return 50; // Default score

    const totalScore = relevantAnswers.reduce(
      (sum, answer) => sum + answer.value,
      0
    );
    const maxPossibleScore = relevantAnswers.length * 3; // Assuming max value per question is 3

    return Math.round((totalScore / maxPossibleScore) * 100);
  }

  /**
   * Get a label for a score
   * @param {Number} score - Numeric score
   * @param {String} language - Current language
   * @returns {String} - Score label
   */
  static getScoreLabel(score, language) {
    if (score < 30) {
      return language === "en" ? "Low" : "कम";
    } else if (score < 70) {
      return language === "en" ? "Moderate" : "मध्यम";
    } else {
      return language === "en" ? "High" : "उच्च";
    }
  }

  /**
   * Add recommendations based on assessment
   * @param {jsPDF} doc - PDF document
   * @param {Array} answers - Array of questionnaire answers
   * @param {String} language - Current language
   */
  static addRecommendations(doc, answers, language) {
    const finalY = doc.lastAutoTable.finalY || 180;

    doc.setFontSize(14);
    doc.setTextColor(33, 33, 33);
    doc.text(
      language === "en" ? "Recommendations" : "सिफारिशें",
      20,
      finalY + 15
    );

    // Generate recommendations based on answers
    // This is a simplified example - in a real implementation, you would have more sophisticated recommendation logic
    const recommendations = this.generateRecommendations(answers, language);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);

    recommendations.forEach((recommendation, index) => {
      doc.text(
        `${index + 1}. ${recommendation}`,
        20,
        finalY + 25 + index * 10,
        { maxWidth: 170 }
      );
    });
  }

  /**
   * Generate recommendations based on answers
   * @param {Array} answers - Array of questionnaire answers
   * @param {String} language - Current language
   * @returns {Array} - Array of recommendation strings
   */
  static generateRecommendations(answers, language) {
    // This is a simplified example - in a real implementation, you would have more sophisticated recommendation logic
    const stressScore = this.calculateMetric(answers, [1, 2, 3, 4, 5]);
    const socialScore = this.calculateMetric(answers, [6, 7, 8, 9]);
    const anxietyScore = this.calculateMetric(answers, [10, 11, 12]);

    const recommendations = [];

    if (stressScore > 50) {
      recommendations.push(
        language === "en"
          ? "Consider practicing mindfulness or meditation to help manage stress levels."
          : "तनाव के स्तर को प्रबंधित करने में मदद के लिए माइंडफुलनेस या ध्यान का अभ्यास करने पर विचार करें।"
      );
    }

    if (socialScore < 50) {
      recommendations.push(
        language === "en"
          ? "Try to strengthen your social connections by spending more quality time with family and friends."
          : "परिवार और दोस्तों के साथ अधिक गुणवत्तापूर्ण समय बिताकर अपने सामाजिक संबंधों को मजबूत करने का प्रयास करें।"
      );
    }

    if (anxietyScore > 50) {
      recommendations.push(
        language === "en"
          ? "Consider speaking with a mental health professional about strategies to manage anxiety."
          : "चिंता को प्रबंधित करने के लिए रणनीतियों के बारे में मानसिक स्वास्थ्य पेशेवर से बात करने पर विचार करें।"
      );
    }

    // Add general recommendations
    recommendations.push(
      language === "en"
        ? "Maintain a regular sleep schedule and aim for 7-8 hours of sleep each night."
        : "नियमित नींद का कार्यक्रम बनाए रखें और हर रात 7-8 घंटे की नींद लेने का लक्ष्य रखें।"
    );

    recommendations.push(
      language === "en"
        ? "Engage in regular physical activity, even if its just a short walk each day."
        : "नियमित शारीरिक गतिविधि में शामिल हों, भले ही यह हर दिन एक छोटी सी सैर ही क्यों न हो।"
    );

    return recommendations;
  }

  /**
   * Add footer to the PDF
   * @param {jsPDF} doc - PDF document
   * @param {String} language - Current language
   */
  static addFooter(doc, language) {
    // Add page number
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `${language === "en" ? "Page" : "पृष्ठ"} ${i} ${
          language === "en" ? "of" : "का"
        } ${pageCount}`,
        105,
        285,
        { align: "center" }
      );

      // Add disclaimer
      if (i === pageCount) {
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          language === "en"
            ? "Disclaimer: This assessment is not a clinical diagnosis. Please consult with a healthcare professional for medical advice."
            : "अस्वीकरण: यह आकलन एक नैदानिक निदान नहीं है। कृपया चिकित्सा सलाह के लिए स्वास्थ्य देखभाल पेशेवर से परामर्श करें।",
          105,
          290,
          { align: "center", maxWidth: 170 }
        );
      }
    }
  }
}
