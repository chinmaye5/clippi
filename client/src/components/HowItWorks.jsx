import { Upload, Zap, Download } from "lucide-react";

const STEPS = [
    {
        icon: Upload,
        title: "1. Upload",
        description: "Upload your image or type a prompt. We support all major image formats.",
        color: "bg-blue-300"
    },
    {
        icon: Zap,
        title: "2. AI Magic",
        description: "Our advanced AI models process your request in seconds with incredible accuracy.",
        color: "bg-fuchsia-300"
    },
    {
        icon: Download,
        title: "3. Download",
        description: "Instantly download your high-resolution result and use it anywhere.",
        color: "bg-emerald-300"
    }
];

export default function HowItWorks() {
    return (
        <section className="w-full max-w-7xl mx-auto p-4 sm:p-8 font-mono py-16 sm:py-24" id="steps">
            <div className="mb-10 text-center">
                <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black mb-4">
                    How it works
                </h2>
                <p className="text-sm sm:text-base text-zinc-600 font-bold uppercase max-w-2xl mx-auto">
                    Three simple steps to create stunning visuals
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                {/* Connecting line for desktop */}
                <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-1 bg-black z-0"></div>

                {STEPS.map((step, idx) => {
                    const Icon = step.icon;
                    return (
                        <div key={idx} className="flex flex-col items-center text-center relative z-10 group">
                            <div className={`w-24 h-24 border-4 border-black ${step.color} shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mb-6 group-hover:-translate-y-2 group-hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all`}>
                                <Icon size={40} strokeWidth={2.5} className="text-black" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tight mb-3 bg-white px-2">
                                {step.title}
                            </h3>
                            <p className="text-sm font-bold text-zinc-600 px-4 leading-relaxed bg-white">
                                {step.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
