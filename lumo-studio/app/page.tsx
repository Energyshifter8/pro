import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Trust from "@/components/Trust";
import Goals from "@/components/Goals";
import Prizes from "@/components/Prizes";
import Sponsors from "@/components/Sponsors";
import Fee from "@/components/Fee";
import Feel from "@/components/Feel";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import FloatingNav from "@/components/FloatingNav";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <About />
      <Trust />
      <Goals />
      <Prizes />
      <Sponsors />
      <Fee />
      <Feel />
      <Faq />
      <Footer />
      <FloatingNav />
    </main>
  );
}
