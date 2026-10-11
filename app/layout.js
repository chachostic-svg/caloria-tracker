import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAuthProvider } from "@/components/GoogleAuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Caloria Tracker — учёт калорий",
  description:
    "Считайте съеденные и сожжённые калории, смотрите историю и диаграммы по дням",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <GoogleAuthProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </GoogleAuthProvider>
      </body>
    </html>
  );
}
