import React, { useEffect, useState } from "react";

const AdminProfessionals = () => {
  const [professionals, setProfessionals] = useState([]);

  useEffect(() => {
    // Fetch users directly from backend (JSON Server)
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => {
        // Filter only verified users with complete professional info
        const filtered = data.filter(
          (u) =>
            u.verified &&
            u.profession &&
            u.expertise &&
            u.availability &&
            u.cv &&
            u.cvPreview
        );
        setProfessionals(filtered);
      })
      .catch((err) => {
        console.error("Failed to load users:", err);
      });
  }, []);

  return (
    <div className="bg-white/90 shadow p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-primary">Verified Professionals</h2>
      {professionals.length === 0 ? (
        <p className="text-gray-500 italic">No professional profiles found.</p>
      ) : (
        <div className="grid gap-6">
          {professionals.map((person, index) => (
            <div
              key={index}
              className="card border-l-4 border-green-700 bg-white/95"
            >
              <h3 className="text-lg font-bold text-green-800 mb-1">{person.fullName}</h3>
              <p><strong>Email:</strong> {person.email}</p>
              {person.country && <p><strong>Country:</strong> {person.country}</p>}
              <p><strong>Profession:</strong> {person.profession}</p>
              <p><strong>Expertise:</strong> {person.expertise}</p>
              <p><strong>Availability:</strong> {person.availability}</p>
              {person.cv && person.cvPreview && (
                <a
                  href={person.cvPreview}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  View CV
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProfessionals;
