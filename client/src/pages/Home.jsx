import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

export default function Home() {
    return (
        <div className="bg-zinc-50 min-h-screen font-mono flex flex-col">
            <div className="py-12 border-t-4 border-black">
                <Hero />
            </div>

            <div className="py-12 border-t-4 border-black">
                <Features />
            </div>

            <div className="border-t-4 border-black">
                <HowItWorks />
            </div>

            <div className="border-t-4 border-black">
                <CTA />
            </div>

            <Footer />
        </div>
    );
}