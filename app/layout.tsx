import type { Metadata } from "next";
import { Unbounded, Manrope } from "next/font/google";
import Script from "next/script";
import { SITE_URL } from "@/lib/constants";
import "./globals.css";

const display = Unbounded({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "700", "800"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
});

const title = "TÜRKSOY STUDENTS — единая платформа для студентов тюркского мира";
const description =
  "Фестивали и связи тюркского мира — в одном месте. Зарегистрируйтесь и узнайте о запуске первыми.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  openGraph: {
    title,
    description,
    url: SITE_URL,
    siteName: "TÜRKSOY STUDENTS",
    locale: "ru_RU",
    type: "website",
  },
};

const YM_COUNTER_ID = process.env.NEXT_PUBLIC_YM_COUNTER_ID;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {YM_COUNTER_ID && (
          <Script id="yandex-metrika" strategy="afterInteractive">
            {`
              (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

              ym(${YM_COUNTER_ID}, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true });
            `}
          </Script>
        )}
      </body>
    </html>
  );
}
