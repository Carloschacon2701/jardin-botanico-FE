import Navbar from "@/components/organisms/Navbar";
import Footer from "@/components/organisms/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
