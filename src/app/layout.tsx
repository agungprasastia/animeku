import '../styles/globals.css';
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "AnimeKu",
  description: "Ini adalah situs web untuk mendapatkan informasi tentang anime favorit Anda.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-black">
        <Navbar />
        <div className="max-w-6xl mx-auto p-6">{children}</div>
      </body>
    </html>
  );
}
