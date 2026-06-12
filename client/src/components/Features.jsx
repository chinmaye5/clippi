import { Link } from 'react-router-dom';

const FEATURES = [
    {
        title: "Text to Image",
        description: "Generate stunning images from your imagination using AI.",
        link: "/text-to-image",
        videoUrl: "https://static.clipdrop.co/web/homepage/tools/StableDiffusion-1.0.webm#t=0.1",
        color: "bg-violet-300"
    },
    {
        title: "Remove Background",
        description: "Extract the main subject from a picture with incredible accuracy.",
        link: "/remove-background",
        videoUrl: "https://static.clipdrop.co/web/homepage/tools/RemoveBG.webm#t=0.1",
        color: "bg-cyan-300"
    },
    {
        title: "Replace Background",
        description: "Teleport anything, anywhere with AI background generation.",
        link: "/replace-background",
        videoUrl: "https://static.clipdrop.co/web/homepage/tools/ReplaceBackground.webm#t=0.1",
        color: "bg-blue-300"
    },
    {
        title: "Remove Text",
        description: "Clean up your images by erasing unwanted text instantly.",
        link: "/remove-text",
        videoUrl: "https://static.clipdrop.co/web/homepage/tools/TextRemover.webm#t=0.1",
        color: "bg-orange-300"
    },
    {
        title: "Upscale",
        description: "Enhance your image quality and enlarge it without losing details.",
        link: "/upscale",
        videoUrl: "https://static.clipdrop.co/web/homepage/tools/Enhance.webm#t=0.1",
        color: "bg-emerald-300"
    },
    {
        title: "Uncrop",
        description: "Expand your photos to any format with AI outpainting.",
        link: "/uncrop",
        videoUrl: "https://static.clipdrop.co/web/homepage/tools/Uncrop.webm#t=0.1",
        color: "bg-pink-300"
    }
];

import { useRef } from 'react';

function FeatureCard({ feature }) {
    const videoRef = useRef(null);

    const handleMouseEnter = () => {
        if (videoRef.current) {
            videoRef.current.play().catch(() => { }); // Catch error if browser blocks autoplay
        }
    };

    const handleMouseLeave = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            // Optional: videoRef.current.currentTime = 0; // Reset video to start
        }
    };

    return (
        <Link
            to={feature.link}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col group transition-all hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] overflow-hidden`}
        >
            {/* Video Container */}
            <div className={`w-full aspect-[4/3] border-b-4 border-black relative ${feature.color} flex items-center justify-center overflow-hidden`}>
                <video
                    ref={videoRef}
                    src={feature.videoUrl}
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    className="w-[90%] h-[90%] object-contain group-hover:scale-105 transition-transform duration-500"
                />

                {/* Play icon overlay that disappears on hover */}
                <div className="absolute inset-0 bg-black/10 group-hover:opacity-0 transition-opacity flex items-center justify-center pointer-events-none">
                    <div className="bg-white/80 p-3 rounded-full text-black shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="ml-1"><path d="M5 3l14 9-14 9V3z" /></svg>
                    </div>
                </div>
            </div>

            {/* Info Container */}
            <div className="p-4 bg-white flex flex-col justify-between flex-1">
                <div>
                    <h4 className="text-black font-black uppercase text-lg tracking-tight mb-2 group-hover:underline">
                        {feature.title}
                    </h4>
                    <p className="text-xs font-bold text-zinc-600 leading-relaxed mb-4">
                        {feature.description}
                    </p>
                </div>
                <div className="mt-auto flex justify-end">
                    <span className="bg-black text-white text-[10px] font-black uppercase px-3 py-1.5 transition-colors group-hover:bg-zinc-800">
                        Open Tool ↗
                    </span>
                </div>
            </div>
        </Link>
    );
}

export default function Features() {
    return (
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-8 font-mono" id='tools'>
            <div className="mb-6 border-b-4 border-black pb-2">
                <h3 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-black">AI Tools</h3>
                <p className="text-xs sm:text-sm text-zinc-600 font-bold uppercase mt-1">Select a tool below to get started</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {FEATURES.map((feature, idx) => (
                    <FeatureCard key={idx} feature={feature} />
                ))}
            </div>
        </div>
    );
}
