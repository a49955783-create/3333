import { useEffect } from "react";

export default function Intro({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 4000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white z-50">
      <img
        src="/logo-police.png"
        alt="Police Logo"
        className="w-40 h-40 mb-6 glow"
      />
      <h1 className="text-3xl font-bold tracking-wide glow">
        تحديث مركز عمليات الشرطة
      </h1>
    </div>
  );
}
