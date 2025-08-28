import React from "react";

const MAP = {
  pending:   { cls: "bg-yellow-100 text-yellow-700", label: "In Review" },
  in_review: { cls: "bg-yellow-100 text-yellow-700", label: "In Review" },
  resolved:  { cls: "bg-green-100 text-green-700",  label: "Resolved" },
  declined:  { cls: "bg-red-100 text-red-700",      label: "Declined" },
  public:    { cls: "bg-blue-100 text-blue-700",    label: "Posted Publicly" },
};

export default function StatusBadge({ value }) {
  const key = (value || "").toString().toLowerCase();
  const { cls, label } = MAP[key] || { cls: "bg-gray-100 text-gray-700", label: "Unknown" };
  return <span className={`inline-block px-2 py-1 text-xs rounded-full font-semibold ${cls}`}>{label}</span>;
}
