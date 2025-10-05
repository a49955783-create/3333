import { useEffect, useState } from "react";

export default function Intro() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center bg-black transition-opacity duration-700 ${
        showIntro ? "opacity-100 z-50" : "opacity-0 -z-10"
      }`}
    >
      <img
        src="/logo-police.png"
        alt="شعار الشرطة"
        className="w-40 animate-pulse drop-shadow-[0_0_25px_rgba(0,150,255,0.8)]"
      />
      <h1 className="text-2xl mt-4 font-bold text-blue-400 drop-shadow-[0_0_20px_rgba(255,255,255,0.9)]">
        تحديث مركز العمليات للشرطة
      </h1>
    </div>
  );
}
