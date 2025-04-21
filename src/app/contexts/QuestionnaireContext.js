"use client";

import { createContext, useContext, useState } from "react";

// Function to update question numbers to be continuous across sections
const updateQuestionNumbers = (questionsArray) => {
  let currentNumber = 1;

  return questionsArray.map((question) => {
    // Skip section headers
    if (question.type === "section_start") {
      return question;
    }

    // Format the number with leading zero if needed
    const formattedNumber =
      currentNumber < 10 ? `0${currentNumber}` : `${currentNumber}`;

    // Create a new question object with updated number
    const updatedQuestion = {
      ...question,
      en: {
        ...question.en,
        number: formattedNumber,
      },
      hi: {
        ...question.hi,
        number: formattedNumber,
      },
    };

    // Increment the counter for the next question
    currentNumber++;

    return updatedQuestion;
  });
};

// Define the sections and questions with translations
const commonOptions = {
  en: [
    { value: 1, label: "Disagree strongly" },
    { value: 2, label: "Disagree a little" },
    { value: 3, label: "Neither agree nor disagree" },
    { value: 4, label: "Agree a little" },
    { value: 5, label: "Agree strongly" },
  ],
  hi: [
    { value: 1, label: "पूरी तरह असहमत" },
    { value: 2, label: "थोड़ा असहमत" },
    { value: 3, label: "न सहमत न असहमत" },
    { value: 4, label: "थोड़ा सहमत" },
    { value: 5, label: "पूरी तरह सहमत" },
  ],
};

const pssOptions = {
  en: [
    { value: 0, label: "Never" },
    { value: 1, label: "Almost never" },
    { value: 2, label: "Sometimes" },
    { value: 3, label: "Fairly often" },
    { value: 4, label: "Very often" },
  ],
  hi: [
    { value: 0, label: "कभी नहीं" },
    { value: 1, label: "लगभग कभी नहीं" },
    { value: 2, label: "कभी-कभी" },
    { value: 3, label: "काफी अक्सर" },
    { value: 4, label: "बहुत अक्सर" },
  ],
};

const cbicQuestions = [
  {
    id: "cbic_1",
    isReversed: false,
    category: "Empathy",
    en: {
      number: "01",
      image: "/c1.svg",
      text: "When taxpayers approach with questions outside their scope of understanding, it's more efficient to redirect than over-explain.",
      options: commonOptions.en,
    },
    hi: {
      number: "01",
      text: "जब करदाता अपनी समझ के दायरे से बाहर के प्रश्नों के साथ संपर्क करते हैं, तो अधिक समझाने की तुलना में उन्हें पुनःनिर्देशित करना अधिक कुशल है।",
      options: commonOptions.hi,
    },
  },
  {
    id: "cbic_2",
    isReversed: false,
    category: "Empathy",
    en: {
      number: "02",
      image: "/c2.svg",
      text: "In high-pressure hours, offering time to a confused taxpayer can set a tone of inefficiency for the day.",
      options: commonOptions.en,
    },
    hi: {
      number: "02",
      text: "उच्च दबाव वाले घंटों में, एक भ्रमित करदाता को समय देने से दिन के लिए अकुशलता का स्वर सेट हो सकता है।",
      options: commonOptions.hi,
    },
  },
  {
    id: "cbic_3",
    isReversed: false,
    category: "Emotional",
    en: {
      number: "03",
      image: "/c3.svg",
      text: "A calm response can feel inadequate when a taxpayer is aggressively challenging an unavoidable penalty.",
      options: commonOptions.en,
    },
    hi: {
      number: "03",
      text: "जब कोई करदाता आक्रामक रूप से एक अपरिहार्य जुर्माने को चुनौती दे रहा हो, तो शांत प्रतिक्रिया अपर्याप्त महसूस हो सकती है।",
      options: commonOptions.hi,
    },
  },
  {
    id: "cbic_4",
    isReversed: false,
    category: "Empathy",
    en: {
      number: "04",
      image: "/c4.svg",
      text: "Repeatedly clarifying the same rule to a taxpayer often reflects on how the system communicates — not just the person's capacity.",
      options: commonOptions.en,
    },
    hi: {
      number: "04",
      text: "बार-बार किसी करदाता को एक ही नियम को स्पष्ट करना अक्सर इस बात को दर्शाता है कि सिस्टम कैसे संवाद करता है - न कि सिर्फ व्यक्ति की क्षमता।",
      options: commonOptions.hi,
    },
  },
  {
    id: "cbic_5",
    isReversed: false,
    category: "Decision",
    en: {
      number: "05",
      image: "/c5.svg",
      text: "When a taxpayer insists they've 'heard differently' from another officer, it's often simpler not to contradict openly.",
      options: commonOptions.en,
    },
    hi: {
      number: "05",
      text: "जब कोई करदाता जोर देता है कि उन्होंने किसी अन्य अधिकारी से 'अलग सुना' है, तो अक्सर खुले तौर पर विरोध न करना अधिक सरल होता है।",
      options: commonOptions.hi,
    },
  },
  {
    id: "cbic_6",
    isReversed: false,
    category: "Empathy",
    en: {
      number: "06",
      image: "/c6.svg",
      text: "Taxpayers who lack preparation slow down processes and must be nudged to take more responsibility.",
      options: commonOptions.en,
    },
    hi: {
      number: "06",
      text: "तैयारी की कमी वाले करदाता प्रक्रियाओं को धीमा कर देते हैं और उन्हें अधिक जिम्मेदारी लेने के लिए प्रेरित किया जाना चाहिए।",
      options: commonOptions.hi,
    },
  },
  {
    id: "cbic_7",
    isReversed: false,
    category: "Emotional",
    en: {
      number: "07",
      image: "/c7.svg",
      text: "Not all confusion at the helpdesk needs a detailed answer — some questions correct themselves with a bit of firmness.",
      options: commonOptions.en,
    },
    hi: {
      number: "07",
      text: "हेल्पडेस्क पर सभी भ्रम को विस्तृत उत्तर की आवश्यकता नहीं होती है - कुछ प्रश्न थोड़ी दृढ़ता के साथ स्वयं ही सही हो जाते हैं।",
      options: commonOptions.hi,
    },
  },
  {
    id: "cbic_8",
    isReversed: false,
    category: "Emotional",
    en: {
      number: "08",
      image: "/c8.png",
      text: "Maintaining composure with emotionally reactive taxpayers sometimes means avoiding engagement until they settle.",
      options: commonOptions.en,
    },
    hi: {
      number: "08",
      text: "भावनात्मक रूप से प्रतिक्रियाशील करदाताओं के साथ संयम बनाए रखने का अर्थ कभी-कभी उनके शांत होने तक जुड़ाव से बचना होता है।",
      options: commonOptions.hi,
    },
  },
  {
    id: "cbic_9",
    isReversed: false,
    category: "Decision",
    en: {
      number: "09",
      image: "/c9.svg",
      text: "Overexplaining even simple rules can sometimes make taxpayers overthink and doubt the process.",
      options: commonOptions.en,
    },
    hi: {
      number: "09",
      text: "यहां तक कि सरल नियमों को भी अतिसमझाना कभी-कभी करदाताओं को अतिसोच और प्रक्रिया पर संदेह कर सकता है।",
      options: commonOptions.hi,
    },
  },
  {
    id: "cbic_10",
    isReversed: false,
    category: "Decision",
    en: {
      number: "10",
      image: "/c10.svg",
      text: "At the end of a busy day, choosing which queries to 'filter' is part of staying efficient.",
      options: commonOptions.en,
    },
    hi: {
      number: "10",
      text: "एक व्यस्त दिन के अंत में, यह चुनना कि किन प्रश्नों को 'फिल्टर' करना है, कुशल बने रहने का हिस्सा है।",
      options: commonOptions.hi,
    },
  },
];

const resilienceQuestions = [
  {
    id: "resilience_1",
    isReversed: false,
    category: "Resilience",
    en: {
      number: "01",
      image: "/r1.svg",
      text: "I am able to adapt when changes occur.",
      options: commonOptions.en,
    },
    hi: {
      number: "01",
      text: "मैं परिवर्तन होने पर अनुकूल होने में सक्षम हूं।",
      options: commonOptions.hi,
    },
  },
  {
    id: "resilience_2",
    isReversed: false,
    category: "Resilience",
    en: {
      number: "02",
      image: "/r2.svg",
      text: "I have one close and secure relationship.",
      options: commonOptions.en,
    },
    hi: {
      number: "02",
      text: "मेरा एक करीबी और सुरक्षित रिश्ता है।",
      options: commonOptions.hi,
    },
  },
  {
    id: "resilience_3",
    isReversed: false,
    category: "Resilience",
    en: {
      number: "03",
      image: "/r3.svg",
      text: "Sometimes fate or God helps me.",
      options: commonOptions.en,
    },
    hi: {
      number: "03",
      text: "कभी-कभी नियति या ईश्वर मेरी मदद करते हैं।",
      options: commonOptions.hi,
    },
  },
  {
    id: "resilience_4",
    isReversed: false,
    category: "Resilience",
    en: {
      number: "04",
      image: "/r4.svg",
      text: "I can deal with whatever comes my way.",
      options: commonOptions.en,
    },
    hi: {
      number: "04",
      text: "मैं जो भी मेरे रास्ते में आता है उससे निपट सकता/सकती हूं।",
      options: commonOptions.hi,
    },
  },
  {
    id: "resilience_5",
    isReversed: false,
    category: "Resilience",
    en: {
      number: "05",
      image: "/r5.svg",
      text: "Past successes give me confidence.",
      options: commonOptions.en,
    },
    hi: {
      number: "05",
      text: "पिछली सफलताएं मुझे आत्मविश्वास देती हैं।",
      options: commonOptions.hi,
    },
  },
  {
    id: "resilience_6",
    isReversed: false,
    category: "Resilience",
    en: {
      number: "06",
      image: "/r6.png",
      text: "I try to see the humorous side of things when I am faced with problems.",
      options: commonOptions.en,
    },
    hi: {
      number: "06",
      text: "जब मैं समस्याओं का सामना करता/करती हूं, तो मैं चीजों के हास्यपूर्ण पहलू को देखने की कोशिश करता/करती हूं।",
      options: commonOptions.hi,
    },
  },
  {
    id: "resilience_7",
    isReversed: false,
    category: "Resilience",
    en: {
      number: "07",
      image: "/r7.svg",
      text: "Having to cope with stress can make me stronger.",
      options: commonOptions.en,
    },
    hi: {
      number: "07",
      text: "तनाव से निपटना मुझे मजबूत बना सकता है।",
      options: commonOptions.hi,
    },
  },
  {
    id: "resilience_8",
    isReversed: false,
    category: "Resilience",
    en: {
      number: "08",
      image: "/r8.svg",
      text: "I tend to bounce back after illness, injury or other hardships.",
      options: commonOptions.en,
    },
    hi: {
      number: "08",
      text: "बीमारी, चोट या अन्य कठिनाइयों के बाद मैं वापस उभरने की प्रवृत्ति रखता/रखती हूं।",
      options: commonOptions.hi,
    },
  },
  {
    id: "resilience_9",
    isReversed: false,
    category: "Resilience",
    en: {
      number: "09",
      image: "/r9.svg",
      text: "I believe most things happen for a reason.",
      options: commonOptions.en,
    },
    hi: {
      number: "09",
      text: "मेरा मानना है कि अधिकांश चीजें किसी कारण से होती हैं।",
      options: commonOptions.hi,
    },
  },
  {
    id: "resilience_10",
    isReversed: false,
    category: "Resilience",
    en: {
      number: "10",
      image: "/r10.svg",
      text: "I make my best effort, no matter what.",
      options: commonOptions.en,
    },
    hi: {
      number: "10",
      text: "मैं चाहे जो भी हो, अपना सर्वश्रेष्ठ प्रयास करता/करती हूं।",
      options: commonOptions.hi,
    },
  },
  {
    id: "resilience_11",
    isReversed: false,
    category: "Resilience",
    en: {
      number: "11",
      image: "/r11.svg",
      text: "I believe I can achieve my goals, even if there are obstacles.",
      options: commonOptions.en,
    },
    hi: {
      number: "11",
      text: "मेरा मानना है कि मैं अपने लक्ष्यों को प्राप्त कर सकता/सकती हूं, भले ही बाधाएं हों।",
      options: commonOptions.hi,
    },
  },
  {
    id: "resilience_12",
    isReversed: false,
    category: "Resilience",
    en: {
      number: "12",
      image: "/r12.svg",
      text: "Even when hopeless, I do not give up.",
      options: commonOptions.en,
    },
    hi: {
      number: "12",
      text: "भले ही निराशाजनक स्थिति हो, मैं हार नहीं मानता/मानती।",
      options: commonOptions.hi,
    },
  },
  {
    id: "resilience_13",
    isReversed: false,
    category: "Resilience",
    en: {
      number: "13",
      image: "/r13.svg",
      text: "In times of stress, I know where to find help.",
      options: commonOptions.en,
    },
    hi: {
      number: "13",
      text: "तनाव के समय में, मुझे पता है कि मदद कहां से प्राप्त करनी है।",
      options: commonOptions.hi,
    },
  },
  {
    id: "resilience_14",
    isReversed: false,
    category: "Resilience",
    en: {
      number: "14",
      image: "/r14.svg",
      text: "Under pressure, I stay focused and think clearly.",
      options: commonOptions.en,
    },
    hi: {
      number: "14",
      text: "दबाव में, मैं केंद्रित रहता/रहती हूं और स्पष्ट रूप से सोचता/सोचती हूं।",
      options: commonOptions.hi,
    },
  },
  {
    id: "resilience_15",
    isReversed: false,
    category: "Resilience",
    en: {
      number: "15",
      image: "/r15.svg",
      text: "I prefer to take the lead in problem-solving.",
      options: commonOptions.en,
    },
    hi: {
      number: "15",
      text: "मैं समस्या-समाधान में नेतृत्व लेना पसंद करता/करती हूं।",
      options: commonOptions.hi,
    },
  },
  {
    id: "resilience_16",
    isReversed: false,
    category: "Resilience",
    en: {
      number: "16",
      image: "/r16.svg",
      text: "I am not easily discouraged by failure.",
      options: commonOptions.en,
    },
    hi: {
      number: "16",
      text: "मैं विफलता से आसानी से निराश नहीं होता/होती।",
      options: commonOptions.hi,
    },
  },
  {
    id: "resilience_17",
    isReversed: false,
    category: "Resilience",
    en: {
      number: "17",
      image: "/r17.svg",
      text: "I think of myself as a strong person when dealing with life's challenges and difficulties.",
      options: commonOptions.en,
    },
    hi: {
      number: "17",
      text: "जीवन की चुनौतियों और कठिनाइयों से निपटते समय मैं अपने आप को एक मजबूत व्यक्ति के रूप में देखता/देखती हूं।",
      options: commonOptions.hi,
    },
  },
  {
    id: "resilience_18",
    isReversed: false,
    category: "Resilience",
    en: {
      number: "18",
      image: "/r18.svg",
      text: "I make unpopular or difficult decisions.",
      options: commonOptions.en,
    },
    hi: {
      number: "18",
      text: "मैं अलोकप्रिय या कठिन निर्णय लेता/लेती हूं।",
      options: commonOptions.hi,
    },
  },
  {
    id: "resilience_19",
    isReversed: false,
    category: "Resilience",
    en: {
      number: "19",
      image: "/r19.svg",
      text: "I am able to handle unpleasant or painful feelings like sadness, fear, and anger.",
      options: commonOptions.en,
    },
    hi: {
      number: "19",
      text: "मैं उदासी, भय और क्रोध जैसी अप्रिय या दर्दनाक भावनाओं को संभालने में सक्षम हूं।",
      options: commonOptions.hi,
    },
  },
  {
    id: "resilience_20",
    isReversed: false,
    category: "Resilience",
    en: {
      number: "20",
      image: "/r20.svg",
      text: "I have to act on a hunch.",
      options: commonOptions.en,
    },
    hi: {
      number: "20",
      text: "मुझे अपनी अंतर्ज्ञान पर कार्य करना पड़ता है।",
      options: commonOptions.hi,
    },
  },
  {
    id: "resilience_21",
    isReversed: false,
    category: "Resilience",
    en: {
      number: "21",
      image: "/r21.svg",
      text: "I have a strong sense of purpose in life.",
      options: commonOptions.en,
    },
    hi: {
      number: "21",
      text: "मेरे जीवन में एक मजबूत उद्देश्य की भावना है।",
      options: commonOptions.hi,
    },
  },
  {
    id: "resilience_22",
    isReversed: false,
    category: "Resilience",
    en: {
      number: "22",
      image: "/r22.svg",
      text: "I feel like I am in control.",
      options: commonOptions.en,
    },
    hi: {
      number: "22",
      text: "मुझे लगता है कि मैं नियंत्रण में हूं।",
      options: commonOptions.hi,
    },
  },
  {
    id: "resilience_23",
    isReversed: false,
    category: "Resilience",
    en: {
      number: "23",
      image: "/r23.svg",
      text: "I like challenges.",
      options: commonOptions.en,
    },
    hi: {
      number: "23",
      text: "मुझे चुनौतियां पसंद हैं।",
      options: commonOptions.hi,
    },
  },
  {
    id: "resilience_24",
    isReversed: false,
    category: "Resilience",
    en: {
      number: "24",
      image: "/r24.svg",
      text: "I work to attain goals.",
      options: commonOptions.en,
    },
    hi: {
      number: "24",
      text: "मैं लक्ष्यों को प्राप्त करने के लिए काम करता/करती हूं।",
      options: commonOptions.hi,
    },
  },
  {
    id: "resilience_25",
    isReversed: false,
    category: "Resilience",
    en: {
      image: "/r25.svg",
      number: "25",
      text: "I take pride in my achievements.",
      options: commonOptions.en,
    },
    hi: {
      number: "25",
      text: "मैं अपनी उपलब्धियों पर गर्व करता/करती हूं।",
      options: commonOptions.hi,
    },
  },
];

const decisionStyleQuestions = [
  {
    id: "decision_1",
    isReversed: false,
    category: "Rational",
    en: {
      number: "01",
      image: "/d1.svg",
      text: "I prefer to gather all the necessary information before committing to a decision.",
      options: commonOptions.en,
    },
    hi: {
      number: "01",
      text: "मैं किसी निर्णय पर प्रतिबद्ध होने से पहले सभी आवश्यक जानकारी इकट्ठा करना पसंद करता/करती हूं।",
      options: commonOptions.hi,
    },
  },
  {
    id: "decision_2",
    isReversed: false,
    category: "Rational",
    en: {
      number: "02",
      image: "/d2.svg",
      text: "I thoroughly evaluate decision alternatives before making a final choice.",
      options: commonOptions.en,
    },
    hi: {
      number: "02",
      text: "मैं अंतिम विकल्प चुनने से पहले निर्णय विकल्पों का पूरी तरह से मूल्यांकन करता/करती हूं।",
      options: commonOptions.hi,
    },
  },
  {
    id: "decision_3",
    isReversed: false,
    category: "Rational",
    en: {
      number: "03",
      image: "/d3.svg",
      text: "In decision making, I take time to contemplate the pros/cons or risks/benefits of a situation.",
      options: commonOptions.en,
    },
    hi: {
      number: "03",
      text: "निर्णय लेने में, मैं किसी स्थिति के फायदे/नुकसान या जोखिम/लाभ पर विचार करने के लिए समय लेता/लेती हूं।",
      options: commonOptions.hi,
    },
  },
  {
    id: "decision_4",
    isReversed: false,
    category: "Rational",
    en: {
      number: "04",
      image: "/d4.svg",

      text: "Investigating the facts is an important part of my decision making process.",
      options: commonOptions.en,
    },
    hi: {
      number: "04",
      text: "तथ्यों की जांच करना मेरी निर्णय लेने की प्रक्रिया का एक महत्वपूर्ण हिस्सा है।",
      options: commonOptions.hi,
    },
  },
  {
    id: "decision_5",
    isReversed: false,
    category: "Rational",
    en: {
      number: "05",
      image: "/d5.svg",
      text: "I weigh a number of different factors when making decisions.",
      options: commonOptions.en,
    },
    hi: {
      number: "05",
      text: "निर्णय लेते समय मैं कई अलग-अलग कारकों पर विचार करता/करती हूं।",
      options: commonOptions.hi,
    },
  },
  {
    id: "decision_6",
    isReversed: false,
    category: "Intuitive",
    en: {
      number: "06",
      image: "/d6.svg",
      text: "When making decisions, I rely mainly on my gut feelings.",
      options: commonOptions.en,
    },
    hi: {
      number: "06",
      text: "निर्णय लेते समय, मैं मुख्य रूप से अपनी अंतर्ज्ञान पर भरोसा करता/करती हूं।",
      options: commonOptions.hi,
    },
  },
  {
    id: "decision_7",
    isReversed: false,
    category: "Intuitive",
    en: {
      number: "07",
      image: "/d7.svg",
      text: "My initial hunch about decisions is generally what I follow.",
      options: commonOptions.en,
    },
    hi: {
      number: "07",
      text: "निर्णयों के बारे में मेरा प्रारंभिक अनुमान आमतौर पर वही होता है जिसका मैं पालन करता/करती हूं।",
      options: commonOptions.hi,
    },
  },
  {
    id: "decision_8",
    isReversed: false,
    category: "Intuitive",
    en: {
      number: "08",
      image: "/d8.svg",
      text: "I make decisions based on intuition.",
      options: commonOptions.en,
    },
    hi: {
      number: "08",
      text: "मैं अंतर्ज्ञान के आधार पर निर्णय लेता/लेती हूं।",
      options: commonOptions.hi,
    },
  },
  {
    id: "decision_9",
    isReversed: false,
    category: "Intuitive",
    en: {
      number: "09",
      image: "/d9.svg",
      text: "I rely on my first impressions when making decisions.",
      options: commonOptions.en,
    },
    hi: {
      number: "09",
      text: "निर्णय लेते समय मैं अपने पहले प्रभाव पर भरोसा करता/करती हूं।",
      options: commonOptions.hi,
    },
  },
  {
    id: "decision_10",
    isReversed: false,
    category: "Intuitive",
    en: {
      number: "10",
      image: "/d10.svg",
      text: "I weigh feelings more than analysis in making decisions.",
      options: commonOptions.en,
    },
    hi: {
      number: "10",
      text: "निर्णय लेने में मैं विश्लेषण की तुलना में भावनाओं को अधिक महत्व देता/देती हूं।",
      options: commonOptions.hi,
    },
  },
];

const pssQuestions = [
  {
    id: "pss_1",
    isReversed: false,
    category: "Perceived Stress",
    en: {
      number: "01",
      image: "/ps1.svg",

      text: "In the last month, how often have you been upset because of something that happened unexpectedly?",
      options: pssOptions.en,
    },
    hi: {
      number: "01",
      text: "पिछले महीने में, आप कितनी बार किसी अप्रत्याशित घटना के कारण परेशान हुए हैं?",
      options: pssOptions.hi,
    },
  },
  {
    id: "pss_2",
    isReversed: false,
    category: "Perceived Stress",
    en: {
      number: "02",
      image: "/ps2.svg",

      text: "In the last month, how often have you felt that you were unable to control the important things in your life?",
      options: pssOptions.en,
    },
    hi: {
      number: "02",
      text: "पिछले महीने में, आपने कितनी बार महसूस किया है कि आप अपने जीवन की महत्वपूर्ण चीजों को नियंत्रित करने में असमर्थ थे?",
      options: pssOptions.hi,
    },
  },
  {
    id: "pss_3",
    isReversed: false,
    category: "Perceived Stress",
    en: {
      number: "03",
      image: "/ps3.svg",

      text: "In the last month, how often have you felt nervous and stressed?",
      options: pssOptions.en,
    },
    hi: {
      number: "03",
      text: "पिछले महीने में, आपने कितनी बार घबराहट और तनाव महसूस किया है?",
      options: pssOptions.hi,
    },
  },
  {
    id: "pss_4",
    isReversed: true,
    category: "Perceived Stress",
    en: {
      number: "04",
      image: "/ps4.svg",

      text: "In the last month, how often have you felt confident about your ability to handle your personal problems?",
      options: pssOptions.en,
    },
    hi: {
      number: "04",
      text: "पिछले महीने में, आपने कितनी बार अपनी व्यक्तिगत समस्याओं को संभालने की अपनी क्षमता के बारे में आत्मविश्वास महसूस किया है?",
      options: pssOptions.hi,
    },
  },
  {
    id: "pss_5",
    isReversed: true,
    category: "Perceived Stress",
    en: {
      number: "05",
      image: "/ps5.svg",

      text: "In the last month, how often have you felt that things were going your way?",
      options: pssOptions.en,
    },
    hi: {
      number: "05",
      text: "पिछले महीने में, आपने कितनी बार महसूस किया है कि चीजें आपके अनुकूल हो रही हैं?",
      options: pssOptions.hi,
    },
  },
  {
    id: "pss_6",
    isReversed: false,
    category: "Perceived Stress",
    en: {
      number: "06",
      image: "/ps6.svg",

      text: "In the last month, how often have you found that you could not cope with all the things that you had to do?",
      options: pssOptions.en,
    },
    hi: {
      number: "06",
      text: "पिछले महीने में, आपने कितनी बार पाया है कि आप उन सभी चीजों से निपट नहीं सकते थे जो आपको करनी थीं?",
      options: pssOptions.hi,
    },
  },
  {
    id: "pss_7",
    isReversed: true,
    category: "Perceived Stress",
    en: {
      number: "07",
      image: "/ps7.svg",

      text: "In the last month, how often have you been able to control irritations in your life?",
      options: pssOptions.en,
    },
    hi: {
      number: "07",
      text: "पिछले महीने में, आप कितनी बार अपने जीवन में चिड़चिड़ापन को नियंत्रित करने में सक्षम रहे हैं?",
      options: pssOptions.hi,
    },
  },
  {
    id: "pss_8",
    isReversed: true,
    category: "Perceived Stress",
    en: {
      number: "08",
      image: "/ps8.svg",

      text: "In the last month, how often have you felt that you were on top of things?",
      options: pssOptions.en,
    },
    hi: {
      number: "08",
      text: "पिछले महीने में, आपने कितनी बार महसूस किया है कि आप चीजों पर नियंत्रण रखते हैं?",
      options: pssOptions.hi,
    },
  },
  {
    id: "pss_9",
    isReversed: false,
    category: "Perceived Stress",
    en: {
      number: "09",
      image: "/ps9.svg",
      text: "In the last month, how often have you been angered because of things that happened that were outside of your control?",
      options: pssOptions.en,
    },
    hi: {
      number: "09",
      text: "पिछले महीने में, आप कितनी बार उन चीजों के कारण क्रोधित हुए हैं जो आपके नियंत्रण से बाहर थीं?",
      options: pssOptions.hi,
    },
  },
  {
    id: "pss_10",
    isReversed: false,
    category: "Perceived Stress",
    en: {
      number: "10",
      image: "/ps10.svg",
      text: "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?",
      options: pssOptions.en,
    },
    hi: {
      number: "10",
      text: "पिछले महीने में, आपने कितनी बार महसूस किया है कि कठिनाइयां इतनी अधिक हो गई हैं कि आप उन्हें पार नहीं कर सकते?",
      options: pssOptions.hi,
    },
  },
];

const bfiQuestions = [
  {
    id: "bfi_1",
    isReversed: true,
    category: "Extraversion",
    en: {
      number: "01",
      image: "/bf1.svg",
      text: "I see myself as someone who is reserved",
      options: commonOptions.en,
    },
    hi: {
      number: "01",
      image: "/bf1.svg",

      text: "मैं खुद को एक संकोची व्यक्ति के रूप में देखता/देखती हूं",
      options: commonOptions.hi,
    },
  },
  {
    id: "bfi_2",
    isReversed: false,
    category: "Agreeableness",
    en: {
      number: "02",
      image: "/bf2.svg",
      text: "I see myself as someone who is generally trusting",
      options: commonOptions.en,
    },
    hi: {
      number: "02",
      image: "/bf2.svg",

      text: "मैं खुद को एक आमतौर पर विश्वास करने वाले व्यक्ति के रूप में देखता/देखती हूं",
      options: commonOptions.hi,
    },
  },
  {
    id: "bfi_3",
    isReversed: true,
    category: "Conscientiousness",
    en: {
      number: "03",
      image: "/bf3.svg",

      text: "I see myself as someone who tends to be lazy",
      options: commonOptions.en,
    },
    hi: {
      number: "03",
      image: "/bf3.svg",

      text: "मैं खुद को एक आलसी होने की प्रवृत्ति वाले व्यक्ति के रूप में देखता/देखती हूं",
      options: commonOptions.hi,
    },
  },
  {
    id: "bfi_4",
    isReversed: true,
    category: "Neuroticism",
    en: {
      number: "04",
      image: "/bf4.svg",
      text: "I see myself as someone who is relaxed, handles stress well",
      options: commonOptions.en,
    },
    hi: {
      number: "04",
      image: "/bf4.svg",
      text: "मैं खुद को एक शांत और तनाव को अच्छी तरह से संभालने वाले व्यक्ति के रूप में देखता/देखती हूं",
      options: commonOptions.hi,
    },
  },
  {
    id: "bfi_5",
    isReversed: true,
    category: "Openness",
    en: {
      number: "05",
      image: "/bf5.svg",
      image: "/bf5.svg",
      text: "I see myself as someone who has few artistic interests",
      options: commonOptions.en,
    },
    hi: {
      number: "05",
      image: "/bf5.svg",
      text: "मैं खुद को कम कलात्मक रुचियों वाले व्यक्ति के रूप में देखता/देखती हूं",
      options: commonOptions.hi,
    },
  },
  {
    id: "bfi_6",
    isReversed: false,
    category: "Extraversion",
    en: {
      number: "06",
      image: "/bf6.svg",
      text: "I see myself as someone who is outgoing, sociable",
      options: commonOptions.en,
    },
    hi: {
      number: "06",
      image: "/bf6.svg",
      text: "मैं खुद को एक बहिर्मुखी, मिलनसार व्यक्ति के रूप में देखता/देखती हूं",
      options: commonOptions.hi,
    },
  },
  {
    id: "bfi_7",
    isReversed: true,
    category: "Agreeableness",
    en: {
      number: "07",
      image: "/bf7.svg",
      text: "I see myself as someone who tends to find fault with others",
      options: commonOptions.en,
    },
    hi: {
      number: "07",
      text: "मैं खुद को दूसरों में दोष ढूंढने की प्रवृत्ति वाले व्यक्ति के रूप में देखता/देखती हूं",
      options: commonOptions.hi,
    },
  },
  {
    id: "bfi_8",
    isReversed: false,
    category: "Conscientiousness",
    en: {
      number: "08",
      image: "/bf8.svg",

      text: "I see myself as someone who does a thorough job",
      options: commonOptions.en,
    },
    hi: {
      number: "08",
      text: "मैं खुद को काम को पूरी तरह से करने वाले व्यक्ति के रूप में देखता/देखती हूं",
      options: commonOptions.hi,
    },
  },
  {
    id: "bfi_9",
    isReversed: false,
    category: "Neuroticism",
    en: {
      number: "09",
      image: "/bf9.svg",

      text: "I see myself as someone who gets nervous easily",
      options: commonOptions.en,
    },
    hi: {
      number: "09",
      text: "मैं खुद को आसानी से घबरा जाने वाले व्यक्ति के रूप में देखता/देखती हूं",
      options: commonOptions.hi,
    },
  },
  {
    id: "bfi_10",
    isReversed: false,
    category: "Openness",
    en: {
      number: "10",
      image: "/bf10.svg",

      text: "I see myself as someone who has an active imagination",
      options: commonOptions.en,
    },
    hi: {
      number: "10",
      text: "मैं खुद को सक्रिय कल्पना शक्ति वाले व्यक्ति के रूप में देखता/देखती हूं",
      options: commonOptions.hi,
    },
  },
];

// Define the base questions array
const baseQuestions = [
  {
    id: "section1",
    type: "section_start",
    en: {
      title: "SKILL PROFILING",
      subtitle: "An opportunity to reflect on your skills and potential.",
      image: "/begin.svg",
    },
    hi: {
      title:
        "आइए शुरू करें—कृपया प्रत्येक प्रश्न का उत्तर सोच-समझकर और अपनी गति से दें।",
      image: "/begin.svg",
    },
  },
  ...bfiQuestions,
  ...pssQuestions,
  {
    id: "section3",
    type: "section_start",
    en: {
      title: "You're halfway through—great progress.",
      // subtitle:
      //   "Please indicate how well these statements describe your decision-making style",
      image: "/personality.svg",
    },
    hi: {
      title: "आप आधे रास्ते तक पहुंच गए हैं—बहुत अच्छी प्रगति।",
      // subtitle:
      //   "कृपया बताएं कि ये कथन आपकी निर्णय लेने की शैली का कितना अच्छी तरह वर्णन करते हैं",
      // image: "/personality.svg",
    },
  },
  ...decisionStyleQuestions,
  {
    id: "section4",
    type: "section_start",
    en: {
      title: "Please keep going—we're almost done.",
      subtitle:
        "Please indicate how much you agree with the following statements as they apply to you over the last month",
      image: "/resilience.svg",
    },
    hi: {
      title: "कृपया जारी रखें—हम लगभग समाप्त हो गए हैं।",
      subtitle:
        "कृपया बताएं कि आप पिछले महीने में आप पर लागू होने वाले निम्नलिखित कथनों से कितना सहमत हैं",
      image: "/resilience.svg",
    },
  },
  ...resilienceQuestions,

  ...cbicQuestions,
];

// Apply continuous numbering to questions
const questions = updateQuestionNumbers(baseQuestions);

const QuestionnaireContext = createContext();

export function QuestionnaireProvider({ children }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [scores, setScores] = useState({
    personality: {
      extraversion: 0,
      agreeableness: 0,
      conscientiousness: 0,
      neuroticism: 0,
      openness: 0,
    },
    stress: 0,
    decisionStyle: {
      rational: 0,
      intuitive: 0,
    },
    resilience: 0,
    cbic: {
      empathy: 0,
      emotional: 0,
      decision: 0,
    },
  });
  const totalQuestions = questions.length;

  // Calculate scores based on answers
  const calculateScores = (allAnswers) => {
    const newScores = {
      personality: {
        extraversion: 0,
        agreeableness: 0,
        conscientiousness: 0,
        neuroticism: 0,
        openness: 0,
      },
      stress: 0,
      decisionStyle: {
        rational: 0,
        intuitive: 0,
      },
      resilience: 0,
      cbic: {
        empathy: 0,
        emotional: 0,
        decision: 0,
      },
    };

    // Process each answer
    allAnswers.forEach((answer) => {
      if (!answer) return;

      const { questionId, value } = answer;

      // Find the question
      const questionObj = [
        ...bfiQuestions,
        ...pssQuestions,
        ...decisionStyleQuestions,
        ...resilienceQuestions,
        ...cbicQuestions,
      ].find((q) => q.id === questionId);

      if (!questionObj) return;

      // Calculate score based on question type
      if (questionId.startsWith("bfi_")) {
        // BFI-10 scoring
        const trait = questionObj.category;
        const score = questionObj.isReversed ? 6 - value : value;

        if (trait in newScores.personality) {
          newScores.personality[trait.toLowerCase()] += score;
        }
      } else if (questionId.startsWith("pss_")) {
        // PSS-10 scoring
        const score = questionObj.isReversed ? 4 - value : value;
        newScores.stress += score;
      } else if (questionId.startsWith("decision_")) {
        // Decision Style scoring
        const style = questionObj.category;
        if (style === "Rational") {
          newScores.decisionStyle.rational += value;
        } else if (style === "Intuitive") {
          newScores.decisionStyle.intuitive += value;
        }
      } else if (questionId.startsWith("resilience_")) {
        // CD-RISC-25 scoring
        newScores.resilience += value;
      } else if (questionId.startsWith("cbic_")) {
        // CBIC Officer Assessment scoring
        const category = questionObj.category;
        if (category === "Empathy") {
          newScores.cbic.empathy += value;
        } else if (category === "Emotional") {
          newScores.cbic.emotional += value;
        } else if (category === "Decision") {
          newScores.cbic.decision += value;
        }
      }
    });

    return newScores;
  };

  const handleAnswer = (questionId, value) => {
    // Save the answer
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = { questionId, value };
    setAnswers(newAnswers);

    // Calculate scores
    const newScores = calculateScores(newAnswers);
    setScores(newScores);

    // Move to next question
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Handle completion of questionnaire
      console.log("Questionnaire completed", newAnswers);
      console.log("Final scores:", newScores);
      // You can add logic to submit answers or show results
    }
  };

  const resetQuestionnaire = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setScores({
      personality: {
        extraversion: 0,
        agreeableness: 0,
        conscientiousness: 0,
        neuroticism: 0,
        openness: 0,
      },
      stress: 0,
      decisionStyle: {
        rational: 0,
        intuitive: 0,
      },
      resilience: 0,
      cbic: {
        empathy: 0,
        emotional: 0,
        decision: 0,
      },
    });
  };

  return (
    <QuestionnaireContext.Provider
      value={{
        questions,
        currentQuestion,
        setCurrentQuestion,
        answers,
        setAnswers,
        scores,
        handleAnswer,
        resetQuestionnaire,
        totalQuestions,
      }}
    >
      {children}
    </QuestionnaireContext.Provider>
  );
}

export function useQuestionnaire() {
  const context = useContext(QuestionnaireContext);
  if (!context) {
    // For static rendering, return a default context instead of throwing an error
    if (typeof window === "undefined") {
      return {
        questions: [],
        currentQuestion: 0,
        setCurrentQuestion: () => {},
        answers: [],
        setAnswers: () => {},
        scores: {},
        handleAnswer: () => {},
        resetQuestionnaire: () => {},
        totalQuestions: 0,
      };
    }
    throw new Error(
      "useQuestionnaire must be used within a QuestionnaireProvider"
    );
  }
  return context;
}
