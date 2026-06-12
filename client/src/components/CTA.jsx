import { Link } from "react-router-dom";

export default function CTA() {
    return (
        <section className="w-full bg-black text-white font-mono py-20 px-4 sm:px-8 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            </div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight mb-6 leading-none">
                    Ready to create <br className="hidden sm:block" />
                    <span className="text-yellow-400">magic?</span>
                </h2>
                
                <p className="text-sm sm:text-lg text-zinc-400 font-bold uppercase tracking-wide max-w-2xl mx-auto mb-10 leading-relaxed">
                    Join thousands of creators using Clippi to enhance, edit, and transform their visuals in seconds.
                </p>
                
                <Link
                    to="/login"
                    className="inline-block bg-yellow-400 text-black border-4 border-yellow-400 text-lg font-black uppercase px-10 py-4 hover:bg-white hover:border-white transition-all shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] active:translate-x-2 active:translate-y-2 active:shadow-none"
                >
                    Start for free
                </Link>
                
                <p className="text-xs text-zinc-500 font-bold uppercase mt-6 tracking-widest">
                    No credit card required.
                </p>
            </div>
        </section>
    );
}
