export default function UnitTable({ formData, setFormData }) {
  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  return (
    <div className="grid grid-cols-3 gap-6 text-center mt-8">
      {[
        { label: "المستلم", name: "receiver" },
        { label: "النائب", name: "deputy" },
        { label: "مسؤول الفترة", name: "supervisor" },
      ].map((person, index) => (
        <div key={index}>
          <label className="block text-gray-300 mb-2">{person.label} — الاسم</label>
          <input
            type="text"
            value={formData[`${person.name}Name`] || ""}
            onChange={(e) => handleChange(e, `${person.name}Name`)}
            className="w-full bg-[#181c24] text-white p-2 rounded-md text-center outline-none border border-gray-700"
          />
          <label className="block text-gray-400 mt-3">الكود</label>
          <input
            type="text"
            value={formData[`${person.name}Code`] || ""}
            onChange={(e) => handleChange(e, `${person.name}Code`)}
            className="w-full bg-[#181c24] text-white p-2 rounded-md text-center outline-none border border-gray-700"
          />
        </div>
      ))}
    </div>
  );
}
