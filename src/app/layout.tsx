import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

// Facebook Pixel ID from environment variable
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || '';

export const metadata: Metadata = {
  title: "Crecimiento Libre de Impuestos | Retiro Seguro en EE.UU.",
  description:
    "Descubre cómo construir tu retiro en Estados Unidos con crecimiento libre de impuestos federales. Consulta gratuita con especialistas bilingües.",
  keywords: [
    "retiro",
    "impuestos",
    "seguro de vida",
    "IUL",
    "latinos",
    "inmigrantes",
    "ahorro",
    "inversión",
  ],
  openGraph: {
    title: "Crecimiento Libre de Impuestos | Retiro Seguro en EE.UU.",
    description:
      "Descubre cómo construir tu retiro en Estados Unidos con crecimiento libre de impuestos federales.",
    type: "website",
    locale: "es_MX",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Facebook Pixel - Base Code (only renders if pixel ID is configured) */}
        {FB_PIXEL_ID && (
          <>
            <Script id="facebook-pixel" strategy="afterInteractive">
              {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${FB_PIXEL_ID}');
                fbq('track', 'PageView');
              `}
            </Script>
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}
      </head>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
