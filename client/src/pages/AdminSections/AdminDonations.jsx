import React, { useEffect, useState } from "react";

const AdminDonations = () => {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/donations")
      .then((res) => res.json())
      .then((data) => setDonations(data.reverse()))
      .catch((err) => {
        console.error("Failed to load donations:", err);
      });
  }, []);

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-6 text-textDark text-center">
        Donation History
      </h2>

      {donations.length === 0 ? (
        <p className="text-center text-gray-500 italic">No donations recorded yet.</p>
      ) : (
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
            <tr>
              <th className="py-3 px-4">Project ID</th>
              <th className="py-3 px-4">Donor Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">DOB</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Method</th>
              <th className="py-3 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{donation.projectId}</td>
                <td className="py-2 px-4">{donation.donorName || "N/A"}</td>
                <td className="py-2 px-4">{donation.donorEmail}</td>
                <td className="py-2 px-4">{donation.donorDOB}</td>
                <td className="py-2 px-4">${donation.amount}</td>
                <td className="py-2 px-4">{donation.method}</td>
                <td className="py-2 px-4">
                  {new Date(donation.date).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDonations;
