import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FindDonor from "@/components/FindDonor";
import News from "@/components/News";
import BloodMap from "@/components/BloodMaps";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <FindDonor />
      <News />
      <BloodMap />
      <Faq/>
      <Footer />
    </main>
  );
}
