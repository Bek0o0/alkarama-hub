import { useParams } from "react-router-dom";

const mockReports = [
  {
    id: "1",
    title: "Displacement in El Geneina",
    date: "June 2025",
    content:
      "Over 100,000 people have been displaced due to ethnic violence in West Darfur. Community shelters are overwhelmed. Food, water, and medical assistance are critically low.",
  },
  {
    id: "2",
    title: "Access to Water in Nyala",
    date: "May 2025",
    content:
      "Reports from South Darfur show that access to clean water has dropped by 60%. Community groups are requesting urgent support for water purification units.",
  },
  {
    id: "3",
    title: "Attacks on Civilian Hospitals",
    date: "April 2025",
    content:
      "Armed groups have targeted multiple hospitals in Khartoum and Omdurman. Medical professionals report shortages in supplies and evacuation of key staff.",
  },
];

const ReportDetail = () => {
  const { id } = useParams();
  const report = mockReports.find((r) => r.id === id);

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4">
        <div className="bg-white/90 p-8 rounded-xl shadow text-center text-red-600 text-lg font-semibold">
          Report not found.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-20 px-4">
      <div className="bg-white/90 p-8 rounded-xl shadow">
        <h1 className="text-3xl font-bold text-primary mb-2">{report.title}</h1>
        <p className="text-sm text-gray-500 mb-4">{report.date}</p>
        <p className="text-textDark leading-relaxed">{report.content}</p>
      </div>
    </div>
  );
};

export default ReportDetail;
