"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export default function Home() {
  const slides = Array.from(
    { length: 14 },
    (_, i) => `/slides/slide${i + 1}.png`
  );

  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);

  const touchStartX = useRef(0);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => Math.min(prev + 1, slides.length - 1));
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => Math.max(prev - 1, 0));
  }, []);

  const goFullScreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      console.log("当前设备暂不支持全屏模式");
    }
  };

  const startPresentation = () => {
    setLoading(true);

    setTimeout(() => {
      setStarted(true);
      setLoading(false);
    }, 1400);
  };

  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(
        window.innerHeight > window.innerWidth && window.innerWidth < 768
      );
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
  }, [started, nextSlide, prevSlide]);

  useEffect(() => {
    if (!autoPlay || !started) return;

    const timer = setInterval(() => {
      setCurrent((prev) => {
        if (prev >= slides.length - 1) return prev;
        return prev + 1;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [autoPlay, started, slides.length]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const distance = touchStartX.current - touchEndX;

    if (distance > 50) nextSlide();
    if (distance < -50) prevSlide();
  };

  if (loading) {
    return (
      <main className="w-full h-screen bg-[#020817] text-white flex items-center justify-center overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1d4ed8_0%,transparent_38%)] opacity-30" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(59,130,246,0.12),transparent)] animate-scan" />

        <div className="relative z-10 text-center px-6">
          <div className="mx-auto w-20 h-20 rounded-full border-4 border-blue-400/30 border-t-blue-400 animate-spin" />

          <h2 className="mt-8 text-2xl md:text-3xl font-bold tracking-[6px] md:tracking-[8px]">
            正在进入展示
          </h2>

          <p className="mt-4 text-blue-200 tracking-[3px] md:tracking-[4px]">
            PRESENTATION LOADING
          </p>

          <div className="mt-10 w-72 md:w-80 h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-blue-400 animate-loadingBar" />
          </div>
        </div>
      </main>
    );
  }

if (!started) {
  return (
    <main className="w-full min-h-screen bg-[#020817] text-white overflow-x-hidden relative">
      {/* 背景光效 */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.35),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(14,165,233,0.25),transparent_35%)]" />
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* 顶部导航 */}
      <header className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-6 md:px-16 py-6 md:py-8">
        <div>
          <div className="text-xs md:text-sm text-blue-300 tracking-[4px] md:tracking-[6px]">
            WEB PRESENTATION
          </div>
          <div className="mt-2 text-lg md:text-xl font-semibold">
            PPT SHOWCASE SYSTEM
          </div>
        </div>

        <div className="text-sm text-white/60">
          Online Project Exhibition
        </div>
      </header>

      {/* 首屏入口 */}
      <section className="relative z-10 min-h-[calc(100vh-120px)] flex flex-col md:flex-row items-center px-6 md:px-16 py-8 md:py-0 gap-10">
        {/* 左侧文案 */}
        <div className="w-full md:w-1/2">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-blue-400/40 bg-blue-500/10 text-blue-200 mb-8 text-sm md:text-base">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            已部署上线 · 可在线访问
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-tight">
            挑战杯项目
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-200">
              在线展示网站
            </span>
          </h1>

          <p className="mt-6 md:mt-8 text-base md:text-xl leading-8 md:leading-10 text-white/70 max-w-2xl">
            将传统 PPT 升级为网页演示系统，支持全屏播放、键盘翻页、
            手机横屏观看、自动播放、进度展示与线上分享，让项目汇报更正式、更高级。
          </p>

          <div className="mt-8 md:mt-12 flex flex-wrap items-center gap-4 md:gap-5">
            <button
              onClick={startPresentation}
              className="px-8 md:px-10 py-3 md:py-4 rounded-full bg-white text-black font-bold text-base md:text-lg hover:scale-105 transition"
            >
              进入展示
            </button>

            <button
              onClick={goFullScreen}
              className="px-8 md:px-10 py-3 md:py-4 rounded-full border border-white/30 text-white font-bold text-base md:text-lg hover:bg-white/10 transition"
            >
              全屏模式
            </button>
          </div>

          <div className="mt-8 md:mt-12 flex flex-wrap gap-8 md:gap-10 text-white/60">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white">
                14
              </div>
              <div className="mt-2 text-sm md:text-base">展示页数</div>
            </div>

            <div>
              <div className="text-3xl md:text-4xl font-bold text-white">
                Next.js
              </div>
              <div className="mt-2 text-sm md:text-base">开发框架</div>
            </div>

            <div>
              <div className="text-3xl md:text-4xl font-bold text-white">
                Vercel
              </div>
              <div className="mt-2 text-sm md:text-base">线上部署</div>
            </div>
          </div>
        </div>

        {/* 右侧预览卡片 */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-[680px] rounded-[24px] md:rounded-[32px] bg-white/10 border border-white/20 p-3 md:p-4 shadow-2xl backdrop-blur-xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-300 rounded-[28px] md:rounded-[36px] blur-2xl opacity-30" />

            <div className="relative rounded-[18px] md:rounded-[24px] overflow-hidden bg-black border border-white/10">
              <img
                src="/slides/slide1.png"
                className="w-full object-cover"
                alt="项目预览"
              />

              <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 right-3 md:right-4 flex items-center justify-between bg-black/60 backdrop-blur-md rounded-full px-4 md:px-5 py-2 md:py-3">
                <span className="text-xs md:text-sm text-white/80">
                  Preview
                </span>
                <span className="text-xs md:text-sm text-white/80">
                  1 / {slides.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 项目简介区 */}
      <section className="relative z-10 px-6 md:px-16 py-20 md:py-28 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <div className="text-blue-300 tracking-[6px] text-sm mb-4">
              PROJECT OVERVIEW
            </div>
            <h2 className="text-3xl md:text-5xl font-black">
              项目简介
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl bg-white/8 border border-white/15 p-7 backdrop-blur-md">
              <div className="text-blue-300 text-sm mb-4">01</div>
              <h3 className="text-2xl font-bold mb-4">项目定位</h3>
              <p className="text-white/65 leading-8">
                面向答辩、汇报、路演和项目展示场景，将 PPT 内容转化为网页式展示系统，
                让作品具备更强的传播性与展示感。
              </p>
            </div>

            <div className="rounded-3xl bg-white/8 border border-white/15 p-7 backdrop-blur-md">
              <div className="text-blue-300 text-sm mb-4">02</div>
              <h3 className="text-2xl font-bold mb-4">核心目标</h3>
              <p className="text-white/65 leading-8">
                通过网页化展示，实现线上访问、跨设备浏览、全屏演示和快速分享，
                降低传统 PPT 文件传输与播放限制。
              </p>
            </div>

            <div className="rounded-3xl bg-white/8 border border-white/15 p-7 backdrop-blur-md">
              <div className="text-blue-300 text-sm mb-4">03</div>
              <h3 className="text-2xl font-bold mb-4">使用场景</h3>
              <p className="text-white/65 leading-8">
                适用于挑战杯、创新创业大赛、课程汇报、作品集展示、项目路演和线上宣传等场景。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 功能亮点区 */}
      <section className="relative z-10 px-6 md:px-16 py-20 md:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <div className="text-blue-300 tracking-[6px] text-sm mb-4">
              FEATURES
            </div>
            <h2 className="text-3xl md:text-5xl font-black">
              展示亮点
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                title: "全屏汇报",
                desc: "支持 F 键或按钮进入全屏，适合现场答辩与大屏展示。",
                icon: "⛶",
              },
              {
                title: "键盘翻页",
                desc: "支持方向键与空格操作，汇报时不依赖鼠标。",
                icon: "⌨",
              },
              {
                title: "移动端适配",
                desc: "手机竖屏提示横屏观看，横屏后正常展示 PPT。",
                icon: "📱",
              },
              {
                title: "线上分享",
                desc: "通过 Vercel 部署生成公网链接，可直接发送给评委或老师。",
                icon: "🔗",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group rounded-3xl bg-gradient-to-b from-white/12 to-white/5 border border-white/15 p-6 backdrop-blur-md hover:-translate-y-2 transition"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-400/15 border border-blue-300/30 flex items-center justify-center text-3xl mb-6">
                  {item.icon}
                </div>

                <h3 className="text-xl font-bold mb-3">
                  {item.title}
                </h3>

                <p className="text-white/60 leading-7 text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 使用说明 / 答辩模式区 */}
      <section className="relative z-10 px-6 md:px-16 py-20 md:py-28 border-t border-white/10">
        <div className="max-w-6xl mx-auto rounded-[32px] bg-white/8 border border-white/15 p-8 md:p-12 backdrop-blur-xl overflow-hidden relative">
          <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/20 blur-3xl rounded-full" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="text-blue-300 tracking-[6px] text-sm mb-4">
                PRESENTATION MODE
              </div>

              <h2 className="text-3xl md:text-5xl font-black leading-tight">
                操作说明与答辩模式
              </h2>

              <p className="mt-6 text-white/65 leading-8">
                汇报时建议进入全屏模式，使用方向键或空格进行翻页。
                手机访问时请横屏观看，以获得最佳 16:9 展示效果。
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={() => {
                    setCurrent(0);
                    startPresentation();
                  }}
                  className="px-8 py-3 rounded-full bg-blue-400 text-black font-bold hover:scale-105 transition"
                >
                  从第一页开始答辩
                </button>

                <button
                  onClick={startPresentation}
                  className="px-8 py-3 rounded-full border border-white/30 text-white font-bold hover:bg-white/10 transition"
                >
                  继续浏览
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-black/30 border border-white/10 p-5">
                <div className="text-2xl mb-3">→</div>
                <div className="font-bold mb-2">下一页</div>
                <div className="text-white/50 text-sm">方向右键 / 空格 / 右滑</div>
              </div>

              <div className="rounded-2xl bg-black/30 border border-white/10 p-5">
                <div className="text-2xl mb-3">←</div>
                <div className="font-bold mb-2">上一页</div>
                <div className="text-white/50 text-sm">方向左键 / 左滑</div>
              </div>

              <div className="rounded-2xl bg-black/30 border border-white/10 p-5">
                <div className="text-2xl mb-3">F</div>
                <div className="font-bold mb-2">全屏展示</div>
                <div className="text-white/50 text-sm">按 F 键或点击全屏按钮</div>
              </div>

              <div className="rounded-2xl bg-black/30 border border-white/10 p-5">
                <div className="text-2xl mb-3">Esc</div>
                <div className="font-bold mb-2">返回首页</div>
                <div className="text-white/50 text-sm">退出播放器并回到入口页</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 底部 */}
      <footer className="relative z-10 px-6 md:px-16 py-10 text-center text-white/40 border-t border-white/10">
        PPT Showcase System · Powered by Next.js & Vercel
      </footer>
    </main>
  );
}

  return (
    <main
      className="w-full h-screen bg-black flex items-center justify-center relative overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 手机竖屏提示 */}
      {isPortrait && (
        <div className="absolute inset-0 z-50 bg-black text-white flex flex-col items-center justify-center px-8 text-center">
          <div className="text-6xl mb-8">📱</div>

          <h2 className="text-3xl font-bold mb-4">请横屏观看</h2>

          <p className="text-white/70 leading-8">
            当前 PPT 为 16:9 横屏比例，横屏观看可以获得最佳展示效果。
          </p>

          <div className="mt-10 w-24 h-14 border-2 border-white/60 rounded-xl flex items-center justify-center rotate-90">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>

          <button
            onClick={() => setStarted(false)}
            className="mt-12 px-8 py-3 rounded-full border border-white/30 text-white"
          >
            返回首页
          </button>
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
        className="absolute top-4 md:top-6 left-4 md:left-6 bg-black/50 text-white px-4 md:px-5 py-2 rounded-full backdrop-blur-md hover:bg-white/20 transition text-sm md:text-base"
      >
        返回首页
      </button>

      {/* 左翻页 */}
      <button
        onClick={prevSlide}
        className="hidden md:block absolute left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-7xl"
      >
        ‹
      </button>

      {/* 右翻页 */}
      <button
        onClick={nextSlide}
        className="hidden md:block absolute right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-7xl"
      >
        ›
      </button>

      {/* 底部控制栏 */}
      <div className="absolute bottom-5 md:bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-white px-4 md:px-6 py-3 rounded-full flex items-center gap-3 md:gap-6 text-xs md:text-base whitespace-nowrap">
        <button onClick={prevSlide}>上一页</button>

        <span>
          {current + 1} / {slides.length}
        </span>

        <button onClick={nextSlide}>下一页</button>

        <button onClick={() => setAutoPlay(!autoPlay)}>
          {autoPlay ? "暂停" : "自动播放"}
        </button>

        <button onClick={goFullScreen}>全屏</button>
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