import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rahayu Fashion Store — Koleksi Hijab, Busana Muslim Wanita, Baju Hamil & Anak Resmi",
  description: "Belanja koleksi terbaru Rahayu Fashion Store: Hijab Voal Ultrafine, Atasan & Bawahan Muslim Wanita, Celana Panjang & Legging, Baju Hamil Busui Friendly, serta Pakaian Anak & Bayi. Nikmati Promo Highlight & Gratis Ongkir se-Indonesia.",
  keywords: [
    "Rahayu Fashion Store",
    "Hijab Voal",
    "Atasan Muslim Wanita",
    "Bawahan Muslim",
    "Baju Hamil Busui",
    "Celana Legging Wanita",
    "Pakaian Anak Perempuan",
    "Pakaian Bayi",
    "Fashion Muslim Modern"
  ],
  authors: [{ name: "Rahayu Fashion Store" }],
  creator: "Rahayu Fashion Store",
  publisher: "Rahayu Fashion Store",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.rahayufashion.co.id"),
  openGraph: {
    title: "Rahayu Fashion Store — Refined Modesty for Modern Women",
    description: "Koleksi busana muslim wanita modern, hijab voal ultrafine, baju hamil busui friendly, dan koleksi anak.",
    url: "https://www.rahayufashion.co.id",
    siteName: "Rahayu Fashion Store",
    locale: "id_ID",
    type: "website",
  },
};

import { StoreProvider } from "@/context/StoreContext";
import CartDrawer from "@/components/CartDrawer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ClothingStore",
              "name": "Rahayu Fashion Store",
              "url": "https://www.rahayufashion.co.id",
              "description": "Marketplace & Official Store Brand Fashion Modern: Hijab, Busana Muslim Wanita, Baju Hamil, dan Koleksi Anak.",
              "priceRange": "Rp 79.000 - Rp 399.000",
              "sameAs": [
                "https://www.tiktok.com/@rahayufashion.store",
                "https://www.instagram.com/rahayufashion.id",
                "https://www.youtube.com/@rahayufashion",
                "https://www.facebook.com/rahayufashionstore"
              ]
            }),
          }}
        />
      </head>
      <body className="antialiased bg-white text-[#18181B] selection:bg-[#18181B] selection:text-white">
        <StoreProvider>
          {children}
          <CartDrawer />
        </StoreProvider>
      </body>
    </html>
  );
}
