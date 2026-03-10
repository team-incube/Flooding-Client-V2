import type { Metadata } from "next";
import "@sun-typeface/suit/fonts/variable/woff2/SUIT-Variable.css";
import "./globals.css";

import Providers from "./providers";

export const metadata: Metadata = {
  title: "플러딩 | 광주소마고 통합 관리 시스템",
  description:
    "광주소마고 통합 관리 시스템 플러딩의 공식 웹사이트입니다. 플러딩은 광주소마고의 기숙사, 홈베이스, 동아리 관리와 같은 다양한 기능을 통합, 제공하여 학생들의 편리한 생활을 지원합니다",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body className="antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `
    (function() {
      var stored = localStorage.getItem('theme');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', stored ? stored === 'dark' : prefersDark);
    })();
  `,
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
