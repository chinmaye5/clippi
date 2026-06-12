import { Link } from 'react-router-dom';

const VIDEO_ID = '6ktXlBDf4hQ';

export default function Hero() {
    return (
        <section className="w-full bg-zinc-50 font-mono px-4 pt-10 pb-16 sm:pt-16 sm:pb-24 flex flex-col items-center text-center gap-4 sm:gap-6 relative overflow-hidden">
            {/* Ambient Glows for Depth - Subdued for white bg */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-20 left-1/4 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase text-black leading-[1.05] max-w-3xl relative z-10">
                Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600">stunning visuals</span><br />
                in seconds
            </h1>

            {/* Subtext */}
            <p className="text-zinc-600 font-bold text-sm sm:text-base max-w-md leading-relaxed relative z-10 uppercase tracking-tight">
                Remove backgrounds, upscale resolution, and expand bounds cleanly.
                change backgrounds, text to image and remove text from image
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-2 relative z-10">
                <Link
                    to="/login"
                    className="bg-black text-white border-4 border-black text-sm font-black uppercase px-8 py-3 hover:bg-white hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                    Get Started →
                </Link>
            </div>

            {/* Trust */}
            <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest relative z-10 mt-2 mb-4">
                No credit card · Free tier available
            </p>

            {/* Video — wider, rounded corners, responsive */}
            <div className="w-full max-w-5xl mx-auto mt-2 px-2 sm:px-4 relative z-10">
                <div
                    className="relative w-full overflow-hidden rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.15)] border border-black/10 bg-white/40 backdrop-blur-sm"
                    style={{ paddingBottom: '56.25%' }}
                >
                    <iframe
                        className="absolute inset-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${VIDEO_ID}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&start=13`}
                        allow="autoplay; fullscreen"
                        allowFullScreen
                        loading="lazy"
                        title="Product demo"
                    />
                </div>
            </div>

        </section>
    );
}