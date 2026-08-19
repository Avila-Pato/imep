import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import RevealLayout from "./components/RevealLayout";



const luxurious = localFont({
  src: "./fonts/LuxuriousRoman-Regular.ttf",
  variable: "--font-luxurious",
});

const pinyon = localFont({
  src: "./fonts/PinyonScript-Regular.ttf",
  variable: "--font-pinyon",
})

const voyage = localFont({
  src: "./fonts/Voyage-Regular.ttf",
  variable: "--font-voyager",
})

export const metadata: Metadata = {
  title: "Imep Central",
  description: "Templo Imep Central, un espacio de fe y comunidad en el corazón de la ciudad. Descubre nuestras actividades, servicios y eventos diseñados para fortalecer tu espíritu y conectar con otros creyentes. ¡Únete a nosotros en este viaje de crecimiento espiritual y camaradería!",
};


export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {

  return (
    <html
      lang="en"
      className={`${luxurious.variable} ${pinyon.variable} ${voyage.variable} h-full antialiased`}
      suppressHydrationWarning

    >
      <body className="min-h-full flex flex-col">
        {/* <RevealLayout> */}
          {/* </RevealLayout> */}
          {children}
        </body>
    </html>
  );
}
