import type { Viewport } from "next";
import {
  DM_Sans,
  Inter,
  Lato,
  Merriweather,
  Montserrat,
  Nunito_Sans,
  Outfit,
  Playfair_Display,
  Plus_Jakarta_Sans,
  Poppins,
  Roboto,
  Rubik,
} from "next/font/google";
import Script from "next/script";

import { ToastProvider } from "@/components/feedback/toast";
import { CustomizationProvider } from "@/features/customization/components/CustomizationProvider";
import { themeInitializationScript } from "@/features/theme/lib/theme-script";

import "./globals.css";
import { generateMetadata } from "@/utils/metadata";

const outfitSans = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
});

const interSans = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

const robotoSans = Roboto({
  variable: "--font-roboto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const poppinsSans = Poppins({
  variable: "--font-poppins-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const montserratSans = Montserrat({
  variable: "--font-montserrat-sans",
  subsets: ["latin"],
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

const latoSans = Lato({
  variable: "--font-lato-sans",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const rubikSans = Rubik({
  variable: "--font-rubik-sans",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const merriweatherSerif = Merriweather({
  variable: "--font-merriweather-serif",
  subsets: ["latin"],
});

const playfairSerif = Playfair_Display({
  variable: "--font-playfair-serif",
  subsets: ["latin"],
});

export const metadata = generateMetadata({
  title: "LowSolutions POS",
  description: "Product workspace",
});

export const viewport: Viewport = {
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${outfitSans.variable} ${interSans.variable} ${robotoSans.variable} ${poppinsSans.variable} ${montserratSans.variable} ${nunitoSans.variable} ${latoSans.variable} ${dmSans.variable} ${rubikSans.variable} ${plusJakartaSans.variable} ${merriweatherSerif.variable} ${playfairSerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <Script
          id="theme-initialization"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitializationScript }}
        />
        <ToastProvider position="bottom-center">
          <CustomizationProvider />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
