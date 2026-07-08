import { AccessRequestProvider } from "@/components/access/AccessRequest";
import { Nav } from "@/components/marketing/Nav";
import { Hero } from "@/components/marketing/Hero";
import { Problem } from "@/components/marketing/Problem";
import { Features } from "@/components/marketing/Features";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { ConceptArt } from "@/components/marketing/ConceptArt";
import { Pricing } from "@/components/marketing/Pricing";
import { Faq } from "@/components/marketing/Faq";
import { SocialTeaser } from "@/components/marketing/SocialTeaser";
import { SecondCta } from "@/components/marketing/SecondCta";
import { Footer } from "@/components/marketing/Footer";

export default function Home() {
  return (
    <AccessRequestProvider>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Features />
        <HowItWorks />
        <ConceptArt />
        <Pricing />
        <Faq />
        <SocialTeaser />
        <SecondCta />
      </main>
      <Footer />
    </AccessRequestProvider>
  );
}
