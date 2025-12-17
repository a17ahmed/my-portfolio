import { Navbar, Footer } from "@/components/shared";
import {
  Hero,
  About,
  Skills,
  Projects,
  Reviews,
  Blog,
  GitHub,
  Contact,
} from "@/components/sections";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Reviews />
        <GitHub />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
