import Navbar from "../components/Home/Navbar";
import Hero from "../components/Home/Hero";
import Features from "../components/Home/Features";
import HowItWorks from "../components/Home/HowItWorks";
import Testimonials from "../components/Home/Testimonials";
import Pricing from "../components/Home/Pricing";
import CTA from "../components/Home/CTA";
import Footer from "../components/Home/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-emerald-500 selection:text-white flex flex-col w-full overflow-x-hidden">
      <Navbar />
      <main className="flex-1 w-full">
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
