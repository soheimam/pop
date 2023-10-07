import NavBar from "@/components/NavBar";
import "@/styles/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  manifest: "/manifest.json",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-blue-50 mx-10  lg:mx-24`}>
        {children}
      </body>
      <NavBar />
    </html>
  );
}
