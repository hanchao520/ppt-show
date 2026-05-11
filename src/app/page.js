"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const slides = Array.from({ length: 14 }, (_, i) => `/slides/slide${i + 1}.png`);

  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  const nextSlide = () => {
    setCurrent((prev) => Math.min(prev + 1, slides.length - 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => Math.max(prev - 1, 0));
  };

  const goFullScreen = () => {
    document.documentElement.requestFullscreen();
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight" || e.key === " ") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "f" || e.key === "F") goFullScreen();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrent((prev) => {
        if (prev >= slides.length - 1) return prev;
        return prev + 1;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [autoPlay]);

  return (
    <main className="w-full h-screen bg-black flex items-center justify-center relative overflow-hidden">

      {/* 当前PPT */}
      <img
        key={current}
        src={slides[current]}
        className="w-full h-full object-contain animate-fadeIn"
        alt={`slide-${current + 1}`}
      />

      {/* 左翻页 */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-7xl"
      >
        ‹
      </button>

      {/* 右翻页 */}
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-7xl"
      >
        ›
      </button>

      {/* 底部控制栏 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-white px-6 py-3 rounded-full flex items-center gap-6">
        <button onClick={prevSlide}>上一页</button>

        <span>
          {current + 1} / {slides.length}
        </span>

        <button onClick={nextSlide}>下一页</button>

        <button onClick={() => setAutoPlay(!autoPlay)}>
          {autoPlay ? "暂停" : "自动播放"}
        </button>

        <button onClick={goFullScreen}>
          全屏
        </button>
      </div>

      {/* 进度条 */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div
          className="h-full bg-blue-500 transition-all duration-500"
          style={{ width: `${((current + 1) / slides.length) * 100}%` }}
        />
      </div>

    </main>
  );
}