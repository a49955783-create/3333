import { useState } from "react";
import Intro from "../components/Intro";
import UnitTable from "../components/UnitTable";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <main className="min-h-screen flex flex-col items-center justify-start pt-10 text-white relative">
      {/* الانترو */}
      {showIntro && <Intro onFinish={() => setShowIntro(false)} />}

      {/* المحتوى الرئيسي */}
      {!showIntro && (
        <div className="w-full max-w-7xl px-4">
          {/* الشعار والعنوان */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <img
              src="/logo-police.png"
              alt="Police Logo"
              className="w-20 h-20 object-contain glow"
            />
            <h1 className="text-3xl md:text-4xl font-bold text-center">
              تحديث مركز عمليات الشرطة
            </h1>
          </div>

          {/* الجدول */}
          <UnitTable />
        </div>
      )}
    </main>
  );
}
