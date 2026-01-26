import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "SkillSwap",
  description: "Skill exchange platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
