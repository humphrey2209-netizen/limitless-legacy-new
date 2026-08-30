import "@/styles/globals.css";

import localFont from "next/font/local";
import { type Metadata } from "next";

import { Footer } from "@/app/_components/footer";
import { Header } from "@/app/_components/header";
import { TRPCReactProvider } from "@/trpc/react";

const nunito = localFont({
  src: "../fonts/Nunito-VariableFont_wght.woff2",
  weight: "500 800",
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Limitless Legacy | Personalized Learning Support",
  description:
    "Limitless Legacy provides practical learning support, parent guidance, and supportive resources for families, students, and educators.",
  openGraph: {
    title: "Limitless Legacy | Personalized Learning Support",
    description:
      "Practical support tools, parent guidance, and learning resources designed to help every child grow with confidence.",
    images: [{ url: "/limitless-logo.png" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Limitless Legacy | Personalized Learning Support",
    description:
      "Practical support tools, parent guidance, and learning resources for families and educators.",
  },
  icons: [{ rel: "icon", url: "/limitless-logo.png" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={nunito.variable}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <TRPCReactProvider>
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
