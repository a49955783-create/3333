'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen text-white">
      {/* الانترو */}
      {showIntro ? (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black z-50">
          <img
            src="/logo-police.png"
            alt="شعار الشرطة"
            className="w-48 h-auto animate-pulse drop-shadow-[0_0_15px_rgba(0,150,255,0.8)]"
          />
          <h1 className="text-3xl font-bold mt-4 drop-shadow-[0_0_10px_rgba(0,150,255,0.8)]">
            تحديث مركز العمليات للشرطة
          </h1>
        </div>
      ) : (
        <>
          {/* الخلفية */}
          <div
            className="min-h-screen bg-cover bg-center flex flex-col items-center"
            style={{ backgroundImage: "url('/background-police.png')" }}
          >
            {/* العنوان + الشعار */}
            <header className="flex items-center gap-3 pt-6">
              <img
                src="/logo-police.png"
                alt="شعار الشرطة"
                className="w-12 h-auto drop-shadow-[0_0_10px_rgba(0,150,255,0.7)]"
              />
              <h1 className="text-2xl font-bold tracking-wide">
                تحديث مركز العمليات للشرطة
              </h1>
            </header>

            {/* نموذج أو محتوى الموقع */}
            <main className="mt-10 w-[90%] max-w-3xl bg-black/60 backdrop-blur-md rounded-2xl p-6 shadow-xl">
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                📋 النتيجة النهائية
              </h2>
              <p className="text-gray-200">
                استلام العمليات - النائب: علي محمد (213) - المستلم: صادق علي (211)
              </p>
            </main>
          </div>
        </>
      )}
    </div>
  );
}
