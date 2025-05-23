import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata = {
  title: "Mending Mind - Skill Based Psychometric Assessment",
  description:
    "A comprehensive skill-based psychometric assessment tool by Mending Mind to evaluate personality traits, stress levels, decision-making styles, resilience, and taxpayer judgment capabilities.",
  metadataBase: "https://mending-mind.netlify.app",
  authors: [{ name: "Kanish Kumar", url: "https://kanishkumar.in" }],
  creator: "Mending Mind",
  publisher: "Mending Mind",
  keywords: [
    "Psychometric Assessment",
    "Skill Assessment",
    "Personality Test",
    "Stress Evaluation",
    "Decision Making",
    "Resilience Test",
    "Taxpayer Judgment",
    "Mending Mind",
  ],
  openGraph: {
    title: "Mending Mind - Skill Based Psychometric Assessment",
    description:
      "A comprehensive skill-based psychometric assessment tool by Mending Mind to evaluate personality traits, stress levels, decision-making styles, resilience, and taxpayer judgment capabilities.",
    url: "https://mending-mind.netlify.app",
    siteName: "Mending Mind",
    images: [
      {
        url: "/meta.png",
        width: 1200,
        height: 630,
        alt: "Mending Mind Psychometric Assessment",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mending Mind - Skill Based Psychometric Assessment",
    description:
      "A comprehensive skill-based psychometric assessment tool by Mending Mind to evaluate personality traits, stress levels, decision-making styles, resilience, and taxpayer judgment capabilities.",
    images: ["/meta.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${montserrat.className} font-montserrat antialiased`}>
        {children}
      </body>
    </html>
  );
}
