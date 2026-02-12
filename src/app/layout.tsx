import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Nicolaas Labuschagne | Systems Architect & Creative Director",
  description: "Portfolio of Nicolaas Labuschagne, a Full Stack Developer specializing in technical rigor and creative expression.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${montserrat.variable} font-montserrat antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
