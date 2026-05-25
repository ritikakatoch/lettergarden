import type { Metadata } from "next";
import "./globals.css";

import {
  Playfair_Display,
  Poppins,
  Dancing_Script,
  Caveat,
  Cormorant_Garamond,
  Homemade_Apple,
  Pacifico,
  Indie_Flower,
  Shadows_Into_Light,
  Great_Vibes,
  Reenie_Beanie,
  Cedarville_Cursive,
} from "next/font/google";

const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });
const dancing = Dancing_Script({ variable: "--font-dancing", subsets: ["latin"] });
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"] });
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"]
});
const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });
const homemade = Homemade_Apple({ variable: "--font-homemade", subsets: ["latin"], weight: "400" });
const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: "400",
});
const reenieBeanie = Reenie_Beanie({
  variable: "--font-reeniebeanie",
  subsets: ["latin"],
  weight: "400",
});

const indie = Indie_Flower({
  variable: "--font-indie",
  subsets: ["latin"],
  weight: "400",
});

const cedarville = Cedarville_Cursive({
  variable: "--font-cedarville",
  subsets: ["latin"],
  weight: "400",
});

const shadows = Shadows_Into_Light({
  variable: "--font-shadows",
  subsets: ["latin"],
  weight: "400",
});

const greatVibes = Great_Vibes({
  variable: "--font-greatvibes",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "LetterGarden — A little Garden of Letters",
  description: "A garden where you can leave public, heartfelt letters decorated with flowers.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`
    ${playfair.variable}
    ${dancing.variable}
    ${caveat.variable}
    ${cormorant.variable}
    ${poppins.variable}
    ${homemade.variable}
    ${pacifico.variable}
    ${indie.variable}
    ${shadows.variable}
    ${greatVibes.variable}
    ${reenieBeanie.variable}
    ${cedarville.variable}

    h-full antialiased
  `}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#FDFCFB] text-[#3b3833] selection:bg-rose-100">
        {children}
      </body>
    </html>
  );
}
