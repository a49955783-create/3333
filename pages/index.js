import { useState, useEffect } from "react";
import Tesseract from "tesseract.js";

export default function PoliceOps() {
  const [showIntro, setShowIntro] = useState(true);
  const [progress, setProgress] = useState(0);
  const [rows, setRows] = useState([]);
  const [results, setResults] = useState("");
  const [officer, setOfficer] = useState("");
  const [officerCode, setOfficerCode] = useState("");
  const [deputy, setDeputy] = useState("");
  const [deputyCode, setDeputyCode] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [supervisorCode, setSupervisorCode] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleImage = (file) => {
    setProgress(0);
    Tesseract.recognize(file, "ara+eng", {
      logger: (info) => {
        if (info.status === "recognizing text") {
          setProgress(Math.round(info.progress * 100));
        }
      },
    }).then(({ data: { text } }) => {
      const lines = text.split("\n").filter((l) => l.trim());
      const newRows = lines.map((line, i) => ({
        id: i,
        name: line.replace(/[0-9]/g, "").trim(),
        code: line.replace(/\D/g, "").trim(),
        status: "في الخدمة",
        location: "",
      }));
      setRows(newRows);
      setResults("✅ تم استخراج الأسماء والكودات بنجاح!");
    });
  };

  useEffect(() => {
    const pasteHandler = (e) => {
      const item = e.clipboardData.items[0];
      if (item.type.indexOf("image") !== -1) {
        handleImage(item.getAsFile());
      }
    };
    window.addEventListener("paste", pasteHandler);
    return () => window.removeEventListener("paste", pasteHandler);
  }, []);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) handleImage(file);
  };

  const updateRow = (id, key, value) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [key]: value } : row))
    );
  };

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      { id: Date.now(), name: "", code: "", status: "في الخدمة", location: "" },
    ]);
  };

  const mergeRows = (i1, i2) => {
    const r1 = rows[i1];
    const r2 = rows[i2];
    const merged = {
      id: Date.now(),
      name: `${r1.name} ${r1.code} + ${r2.name} ${r2.code}`,
      code: "",
      status: "مشتركة",
      location: r1.location || r2.location,
    };
    const updated = rows.filter((_, i) => i !== i1 && i !== i2);
    setRows([...updated, merged]);
  };

  const deleteRow = (id) => setRows(rows.filter((r) => r.id !== id));

  const generateResult = () => {
    if (!officer.trim()) return "❗الرجاء كتابة اسم العمليات";

    const inField = rows.filter((r) => r.status === "في الخدمة");
    const busy = rows.filter((r) => r.status.includes("مشغول"));
    const speed = rows.filter((r) => r.status.includes("سبيد"));
    const bikes = rows.filter((r) => r.status.includes("دباب"));
    const shared = rows.filter((r) => r.status === "مشتركة");
    const off = rows.filter((r) => r.status === "خارج الخدمة");

    const format = (arr) =>
      arr
        .map(
          (r) =>
            `${r.name} ${r.code}${
              r.status && r.status !== "في الخدمة" ? ` (${r.status})` : ""
            }${r.location ? ` - (${r.location})` : ""}`
        )
        .join("\n");

    return `📌 استلام العمليات 📌

اسم العمليات: ${officer} ${officerCode}
النائب: ${deputy} ${deputyCode}
مسؤول الفترة: ${supervisor} ${supervisorCode}

عدد واسماء الوحدات في الميدان: (${inField.length})
${format(inField)}

${
  shared.length
    ? `وحدات مشتركة:\n${shared
        .map((r) => `${r.name}${r.location ? ` - (${r.location})` : ""}`)
        .join("\n")}`
    : ""
}

${speed.length ? `وحدات سبيد يونت:\n${format(speed)}` : ""}
${bikes.length ? `وحدات دباب:\n${format(bikes)}` : ""}
خارج الخدمة: (${off.length})
${format(off)}
`;
  };

  const copyResult = () => {
    navigator.clipboard.writeText(generateResult());
    alert("تم النسخ بنجاح ✅");
  };

  return (
    <div className="p-6 text-white">
      {showIntro ? (
        <div className="intro">
          <img src="/logo-police.png" alt="Police Logo" className="intro-logo glow" />
          <h1 className="intro-title glow">تحديث مركز العمليات للشرطة</h1>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <input placeholder="اسم العمليات" value={officer} onChange={(e) => setOfficer(e.target.value)} className="p-2 bg-gray-900 border border-gray-700 rounded" />
            <input placeholder="الكود" value={officerCode} onChange={(e) => setOfficerCode(e.target.value)} className="p-2 bg-gray-900 border border-gray-700 rounded" />
            <input placeholder="النائب" value={deputy} onChange={(e) => setDeputy(e.target.value)} className="p-2 bg-gray-900 border border-gray-700 rounded" />
            <input placeholder="كود النائب" value={deputyCode} onChange={(e) => setDeputyCode(e.target.value)} className="p-2 bg-gray-900 border border-gray-700 rounded" />
            <input placeholder="مسؤول الفترة" value={supervisor} onChange={(e) => setSupervisor(e.target.value)} className="p-2 bg-gray-900 border border-gray-700 rounded" />
            <input placeholder="كود المسؤول" value={supervisorCode} onChange={(e) => setSupervisorCode(e.target.value)} className="p-2 bg-gray-900 border border-gray-700 rounded" />
          </div>

          <div className="mb-4">
            <input type="file" accept="image/*" onChange={handleUpload} className="mb-2" />
            <p className="text-gray-400">يمكنك رفع صورة أو لصقها مباشرة بـ Ctrl+V</p>
            {progress > 0 && progress < 100 && <p className="text-blue-400 mt-2">جارٍ الاستخراج... {progress}%</p>}
          </div>

          <table className="w-full bg-gray-900 rounded-lg overflow-hidden shadow-lg">
            <thead>
              <tr className="bg-gray-800 text-blue-400">
                <th>الاسم</th>
                <th>الكود</th>
                <th>الحالة</th>
                <th>الموقع</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.id}>
                  <td><input value={row.name} onChange={(e) => updateRow(row.id, "name", e.target.value)} className="bg-transparent border-b border-gray-600 w-full" /></td>
                  <td><input value={row.code} onChange={(e) => updateRow(row.id, "code", e.target.value)} className="bg-transparent border-b border-gray-600 w-full" /></td>
                  <td>
                    <select value={row.status} onChange={(e) => updateRow(row.id, "status", e.target.value)} className="bg-gray-800 border border-gray-700 rounded px-2 py-1">
                      <option>في الخدمة</option>
                      <option>مشغول</option>
                      <option>مشغول - تدريب</option>
                      <option>مشغول - اختبار</option>
                      <option>سبيد يونت</option>
                      <option>دباب</option>
                      <option>مشتركة</option>
                      <option>خارج الخدمة</option>
                    </select>
                  </td>
                  <td>
                    <select value={row.location} onChange={(e) => updateRow(row.id, "location", e.target.value)} className="bg-gray-800 border border-gray-700 rounded px-2 py-1">
                      <option></option>
                      <option>الشمال</option>
                      <option>الجنوب</option>
                      <option>الشرق</option>
                      <option>الغرب</option>
                      <option>وسط</option>
                      <option>ساندي</option>
                      <option>بوليتو</option>
                    </select>
                  </td>
                  <td className="flex gap-2">
                    <button onClick={() => deleteRow(row.id)}>🗑️</button>
                    {i < rows.length - 1 && <button onClick={() => mergeRows(i, i + 1)}>🔗</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex gap-3 mt-4">
            <button onClick={addRow}>➕ إضافة</button>
            <button onClick={copyResult}>📋 نسخ النتيجة</button>
          </div>

          <textarea readOnly value={generateResult()} className="w-full mt-6 bg-gray-900 p-3 rounded-lg h-64 text-sm border border-gray-700" />
          {results && <p className="text-green-400 mt-2">{results}</p>}
        </>
      )}
    </div>
  );
}
