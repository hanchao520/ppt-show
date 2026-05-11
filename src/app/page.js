"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const slides = Array.from({ length: 14 }, (_, i) => `/slides/slide${i + 1}.png`);

  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  

  const nextSlide = () => {
    setCurrent((prev) => Math.min(prev + 1, slides.length - 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => Math.max(prev - 1, 0));
  };

  const goFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  const startPresentation = () => {
    setLoading(true);

    setTimeout(() => {
      setStarted(true);
      setLoading(false);
    }, 1600);
  };

  useEffect(() => {
  const checkOrientation = () => {
    setIsPortrait(window.innerHeight > window.innerWidth && window.innerWidth < 768);
  };

  checkOrientation();

  window.addEventListener("resize", checkOrientation);
  window.addEventListener("orientationchange", checkOrientation);

  return () => {
    window.removeEventListener("resize", checkOrientation);
    window.removeEventListener("orientationchange", checkOrientation);
  };
}, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (!started) return;

      if (e.key === "ArrowRight" || e.key === " ") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "f" || e.key === "F") goFullScreen();
      if (e.key === "Escape") setStarted(false);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [started]);

  useEffect(() => {
    if (!autoPlay || !started) return;

    const timer = setInterval(() => {
      setCurrent((prev) => {
        if (prev >= slides.length - 1) return prev;
        return prev + 1;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [autoPlay, started]);

  if (loading) {
    return (
      <main className="w-full h-screen bg-[#020817] text-white flex items-center justify-center overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1d4ed8_0%,transparent_38%)] opacity-30" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(59,130,246,0.12),transparent)] animate-scan" />

        <div className="relative z-10 text-center">
          <div className="mx-auto w-20 h-20 rounded-full border-4 border-blue-400/30 border-t-blue-400 animate-spin" />

          <h2 className="mt-8 text-3xl font-bold tracking-[8px]">
            正在进入展示
          </h2>

          <p className="mt-4 text-blue-200 tracking-[4px]">
            PRESENTATION LOADING
          </p>

          <div className="mt-10 w-80 h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-blue-400 animate-loadingBar" />
          </div>
        </div>
      </main>
    );
  }

  if (!started) {
    return (
      <main className="w-full h-screen bg-[#020817] text-white overflow-hidden relative">
        {/* 背景光效 */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.35),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(14,165,233,0.25),transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />

        {/* 顶部导航 */}
        <header className="relative z-10 flex items-center justify-between px-16 py-8">
          <div>
            <div className="text-sm text-blue-300 tracking-[6px]">
              WEB PRESENTATION
            </div>
            <div className="mt-2 text-xl font-semibold">
              PPT SHOWCASE SYSTEM
            </div>
          </div>

          <div className="text-sm text-white/60">
            Online Project Exhibition
          </div>
        </header>

        {/* 主体 */}
        <section className="relative z-10 h-[calc(100vh-120px)] flex items-center px-16">
          <div className="w-1/2">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-blue-400/40 bg-blue-500/10 text-blue-200 mb-8">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              已部署上线 · 可在线访问
            </div>

            <h1 className="text-7xl font-black leading-tight">
              挑战杯项目
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-200">
                在线展示网站
              </span>
            </h1>

            <p className="mt-8 text-xl leading-10 text-white/70 max-w-2xl">
              将传统 PPT 升级为网页演示系统，支持全屏播放、键盘翻页、
              自动播放、进度展示与线上分享，让项目汇报更正式、更高级。
            </p>

            <div className="mt-12 flex items-center gap-5">
              <button
                onClick={startPresentation}
                className="px-10 py-4 rounded-full bg-white text-black font-bold text-lg hover:scale-105 transition"
              >
                进入展示
              </button>

              <button
                onClick={goFullScreen}
                className="px-10 py-4 rounded-full border border-white/30 text-white font-bold text-lg hover:bg-white/10 transition"
              >
                全屏模式
              </button>
            </div>

            <div className="mt-12 flex gap-10 text-white/60">
              <div>
                <div className="text-4xl font-bold text-white">14</div>
                <div className="mt-2">展示页数</div>
              </div>

              <div>
                <div className="text-4xl font-bold text-white">Next.js</div>
                <div className="mt-2">开发框架</div>
              </div>

              <div>
                <div className="text-4xl font-bold text-white">Vercel</div>
                <div className="mt-2">线上部署</div>
              </div>
            </div>
          </div>

          {/* 右侧预览卡片 */}
          <div className="w-1/2 flex justify-center">
            <div className="relative w-[680px] rounded-[32px] bg-white/10 border border-white/20 p-4 shadow-2xl backdrop-blur-xl">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-300 rounded-[36px] blur-2xl opacity-30" />

              <div className="relative rounded-[24px] overflow-hidden bg-black border border-white/10">
                <img
                  src="/slides/slide1.png"
                  className="w-full object-cover"
                  alt="项目预览"
                />

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black/60 backdrop-blur-md rounded-full px-5 py-3">
                  <span className="text-sm text-white/80">Preview</span>
                  <span className="text-sm text-white/80">1 / {slides.length}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="w-full h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {isPortrait && (
  <div className="absolute inset-0 z-50 bg-black text-white flex flex-col items-center justify-center px-8 text-center">
    <div className="text-6xl mb-8">📱</div>

    <h2 className="text-3xl font-bold mb-4">
      请横屏观看
    </h2>

    <p className="text-white/70 leading-8">
      当前 PPT 为 16:9 横屏比例，横屏观看可以获得最佳展示效果。
    </p>

    <div className="mt-10 w-24 h-14 border-2 border-white/60 rounded-xl flex items-center justify-center rotate-90">
      <div className="w-2 h-2 bg-white rounded-full" />
    </div>
  </div>
)}
      {/* 当前PPT */}
      <img
        key={current}
        src={slides[current]}
        className="w-full h-full object-contain animate-fadeIn"
        alt={`slide-${current + 1}`}
      />

      {/* 返回入口页 */}
      <button
        onClick={() => setStarted(false)}
        className="absolute top-6 left-6 bg-black/50 text-white px-5 py-2 rounded-full backdrop-blur-md hover:bg-white/20 transition"
      >
        返回首页
      </button>

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