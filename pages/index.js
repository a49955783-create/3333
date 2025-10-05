import { useState } from "react";
import Intro from "../components/Intro";
import UnitTable from "../components/UnitTable";

export default function Home() {
  const [formData, setFormData] = useState({});
  const [finalResult, setFinalResult] = useState("");

  const generateResult = () => {
    const { receiverName, receiverCode, deputyName, deputyCode, supervisorName, supervisorCode } =
      formData;

    const text = `📌 استلام العمليات 📌
المستلم: ${receiverName || "-"} ${receiverCode || "-"}
النائب: ${deputyName || "-"} ${deputyCode || "-"}
مسؤول الفترة: ${supervisorName || "-"} ${supervisorCode || "-"}`;
    setFinalResult(text);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(finalResult);
    alert("✅ تم نسخ النتيجة بنجاح!");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white p-10"
      style={{ backgroundImage: "url('/background-police.png')" }}
    >
      <Intro />

      <div className="max-w-5xl mx-auto bg-[#0e1117]/80 p-8 rounded-2xl shadow-lg mt-20">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-gray-100">📄 النتيجة النهائية</h2>
          <button
            onClick={copyToClipboard}
            className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-md text-sm font-semibold"
          >
            نسخ النتيجة
          </button>
        </div>

        <textarea
          readOnly
          value={finalResult}
          className="w-full h-40 bg-[#181c24] border border-gray-700 rounded-md p-3 text-sm text-gray-100 resize-none"
        ></textarea>

        <p className="text-xs text-gray-400 mt-2 text-right">
          المستلم يُحتسب ضمن العدد ولا يُعرض ضمن قائمة الميدان.
        </p>
      </div>

      <UnitTable formData={formData} setFormData={setFormData} />

      <div className="flex justify-center mt-10">
        <button
          onClick={generateResult}
          className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg text-sm font-semibold"
        >
          توليد النتيجة النهائية
        </button>
      </div>
    </div>
  );
}
