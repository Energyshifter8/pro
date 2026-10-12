import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Cases from "@/components/Cases";
import Audit from "@/components/Audit";
import Feel from "@/components/Feel";
import Footer from "@/components/Footer";
import FloatingNav from "@/components/FloatingNav";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <About />
      <Services />
      <Cases />
      <Audit />
      <Feel />
      <Footer />
      <FloatingNav />
    </main>
  );
}
