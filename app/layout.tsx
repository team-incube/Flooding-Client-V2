import "temporal-polyfill/global";
import type { Metadata } from "next";
import "@sun-typeface/suit/fonts/variable/woff2/SUIT-Variable.css";
import "./globals.css";

import Providers from "./providers";

export const metadata: Metadata = {
  title: "플러딩",
  description:
    "플러딩은 GSM의 학교생활과 기숙사 생활을 하나로 연결하는 통합 관리 시스템입니다. 동아리 개설과 모집, 자습 관리, 안마의자 예약, 기상음악 신청, AI 추천과 챗봇 기능을 한 곳에서 제공해 학생들의 편리한 생활을 지원합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
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
