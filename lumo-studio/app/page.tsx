import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Trust from "@/components/Trust";
import Services from "@/components/Services";
import Cases from "@/components/Cases";
import ViewAll from "@/components/ViewAll";
import Audit from "@/components/Audit";
import Olympiad from "@/components/Olympiad";
import Feel from "@/components/Feel";
import Footer from "@/components/Footer";
import FloatingNav from "@/components/FloatingNav";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <About />
      <Trust />
      <Services />
      <Cases />
      <ViewAll />
      <Audit />
      <Olympiad />
      <Feel />
      <Footer />
      <FloatingNav />
    </main>
  );
}
