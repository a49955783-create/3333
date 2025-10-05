import { useState, useEffect } from "react";
import Tesseract from "tesseract.js";

export default function UnitTable() {
  const [rows, setRows] = useState([]);
  const [progress, setProgress] = useState(0);
  const [officer, setOfficer] = useState("");
  const [officerCode, setOfficerCode] = useState("");
  const [deputy, setDeputy] = useState("");
  const [deputyCode, setDeputyCode] = useState("");
  const [period, setPeriod] = useState("");
  const [periodCode, setPeriodCode] = useState("");
  const [result, setResult] = useState("");

  // 🖼️ OCR
  const handleImage = (file) => {
    setProgress(0);
    Tesseract.recognize(file, "ara+eng", {
      logger: (m) => {
        if (m.status === "recognizing text") {
          setProgress(Math.round(m.progress * 100));
        }
      },
    }).then(({ data: { text } }) => {
      const cleanText = text.replace(/[^\u0621-\u064Aa-zA-Z0-9\s]/g, "");
      const lines = cleanText.split("\n").filter((l) => l.trim() !== "");
      const newRows = lines.map((line, i) => {
        const parts = line.trim().split(" ");
        const code = parts.pop();
        const name = parts.join(" ");
        return {
          id: i + 1,
          name,
          code,
          status: "في الخدمة",
          location: "",
          partner: null,
        };
      });
      setRows(newRows);
      setProgress(100);
    });
  };

  // 📋 لصق Ctrl+V
  useEffect(() => {
    const handlePaste = (e) => {
      if (e.clipboardData.files.length > 0) {
        const file = e.clipboardData.files[0];
        handleImage(file);
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  // ✏️ تعديل صف
  const updateRow = (id, field, value) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  // ➕ إضافة صف
  const addRow = () => {
    setRows([
      ...rows,
      { id: Date.now(), name: "", code: "", status: "في الخدمة", location: "", partner: null },
    ]);
  };

  // 🔗 دمج (مشتركة)
  const addPartner = (id, partnerId) => {
    const main = rows.find((r) => r.id === id);
    const partner = rows.find((r) => r.id == partnerId);
    if (main && partner && main.id !== partner.id) {
      main.partner = partner;
      setRows([...rows]);
    }
  };

  // 🗑️ حذف صف
  const deleteRow = (id) => setRows(rows.filter((r) => r.id !== id));

  // 📄 النتيجة النهائية التلقائية
  useEffect(() => {
    if (!officer || !officerCode) return;

    const inField = rows.filter((r) => r.status === "في الخدمة");
    const shared = rows.filter((r) => r.partner);
    const speed = rows.filter((r) => r.status === "سبيد يونت");
    const bike = rows.filter((r) => r.status === "دباب");
    const off = rows.filter((r) => r.status === "خارج الخدمة");

    const render = (title, list, joiner = "\n") =>
      list.length > 0 ? `${title}:\n${list.join(joiner)}\n\n` : "";

    const formatRow = (r) => {
      const loc = r.location ? ` - (${r.location})` : "";
      const st = r.status && r.status !== "في الخدمة" ? ` (${r.status})` : "";
      if (r.partner) {
        const p = r.partner;
        return `${r.name} ${r.code} + ${p.name} ${p.code}${st}${loc}`;
      }
      return `${r.name} ${r.code}${st}${loc}`;
    };

    const text = `
📌 استلام العمليات 📌

المستلم: ${officer} ${officerCode}
النائب: ${deputy} ${deputyCode}
مسؤول الفترة: ${period} ${periodCode}

عدد واسماء الوحدات في الميدان: (${inField.length})
${inField.map(formatRow).join("\n")}

${render("وحدات مشتركة", shared.map(formatRow))}
${render("وحدات سبيد يونت", speed.map(formatRow))}
${render("وحدات دباب", bike.map(formatRow))}
${render("خارج الخدمة", off.map(formatRow))}
`;
    setResult(text.trim());
  }, [rows, officer, officerCode, deputy, deputyCode, period, periodCode]);

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    alert("✅ تم نسخ النتيجة بنجاح!");
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-gray-900 bg-opacity-70 rounded-lg shadow-lg">
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <input placeholder="اسم العمليات" className="p-2 rounded text-black" value={officer} onChange={(e) => setOfficer(e.target.value)} />
        <input placeholder="كود العمليات" className="p-2 rounded text-black" value={officerCode} onChange={(e) => setOfficerCode(e.target.value)} />
        <input placeholder="اسم النائب" className="p-2 rounded text-black" value={deputy} onChange={(e) => setDeputy(e.target.value)} />
        <input placeholder="كود النائب" className="p-2 rounded text-black" value={deputyCode} onChange={(e) => setDeputyCode(e.target.value)} />
        <input placeholder="مسؤول الفترة" className="p-2 rounded text-black" value={period} onChange={(e) => setPeriod(e.target.value)} />
        <input placeholder="كود مسؤول الفترة" className="p-2 rounded text-black" value={periodCode} onChange={(e) => setPeriodCode(e.target.value)} />
      </div>

      {/* رفع الصور */}
      <div
        onDrop={(e) => {
          e.preventDefault();
          handleImage(e.dataTransfer.files[0]);
        }}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-blue-400 rounded-lg p-6 text-center mb-4 cursor-pointer hover:bg-blue-800/20"
        onClick={() => document.getElementById("fileInput").click()}
      >
        {progress === 0 ? <p>📤 اسحب أو ارفع صورة هنا أو الصقها بـ Ctrl+V</p> : <p>جارٍ القراءة... {progress}%</p>}
        <input type="file" id="fileInput" hidden onChange={(e) => handleImage(e.target.files[0])} />
      </div>

      {/* الجدول */}
      <table className="w-full text-sm text-left border border-gray-700 rounded overflow-hidden">
        <thead className="bg-blue-800 text-white">
          <tr>
            <th className="p-2">الاسم</th>
            <th className="p-2">الكود</th>
            <th className="p-2">الحالة</th>
            <th className="p-2">الموقع</th>
            <th className="p-2">التحكم</th>
          </tr>
        </thead>
        <tbody className="bg-gray-800">
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-gray-700">
              <td><input value={r.name} onChange={(e) => updateRow(r.id, "name", e.target.value)} className="p-1 rounded text-black w-full" /></td>
              <td><input value={r.code} onChange={(e) => updateRow(r.id, "code", e.target.value)} className="p-1 rounded text-black w-full" /></td>
              <td>
                <select value={r.status} onChange={(e) => updateRow(r.id, "status", e.target.value)} className="p-1 rounded text-black w-full">
                  <option>في الخدمة</option>
                  <option>مشغول</option>
                  <option>مشغول - تدريب</option>
                  <option>مشغول - اختبار</option>
                  <option>سبيد يونت</option>
                  <option>دباب</option>
                  <option>خارج الخدمة</option>
                  <option>مشتركة</option>
                </select>
              </td>
              <td>
                <select value={r.location} onChange={(e) => updateRow(r.id, "location", e.target.value)} className="p-1 rounded text-black w-full">
                  <option value="">—</option>
                  <option>الشمال</option>
                  <option>الجنوب</option>
                  <option>الشرق</option>
                  <option>الوسط</option>
                  <option>الغرب</option>
                  <option>ساندي</option>
                  <option>بوليتو</option>
                </select>
              </td>
              <td className="flex gap-2">
                <button onClick={() => deleteRow(r.id)} className="bg-red-600 px-2 py-1 rounded">حذف</button>
                <button onClick={() => addPartner(r.id, prompt("أدخل رقم السطر للشريك:"))} className="bg-yellow-600 px-2 py-1 rounded">إضافة شريك</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={addRow} className="mt-4 bg-green-600 px-4 py-2 rounded text-white">➕ إضافة سطر جديد</button>

      {/* النتيجة */}
      <div className="mt-6 bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-2">📄 النتيجة النهائية</h2>
        <textarea value={result} readOnly className="w-full h-60 p-2 rounded text-black" />
        <button onClick={copyResult} className="mt-2 bg-blue-600 px-4 py-2 rounded text-white">📋 نسخ النتيجة</button>
      </div>
    </div>
  );
}
