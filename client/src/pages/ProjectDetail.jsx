import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

export default function ProjectDetail() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donationAmount, setDonationAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("mbook");
  const [invoice, setInvoice] = useState(null);
  const [user, setUser] = useState(null);

  const role = useMemo(() => localStorage.getItem("userRole"), []);
  const email = useMemo(() => localStorage.getItem("userEmail"), []);

  const pick = useCallback(
    (obj, baseKey) => {
      const lang = i18n.language || "en";
      const ar = obj[`${baseKey}_ar`];
      const en = obj[`${baseKey}_en`];
      if (lang === "ar") return ar || obj[baseKey] || en || "";
      return en || obj[baseKey] || ar || "";
    },
    [i18n.language]
  );

  const fetchProject = useCallback(() => {
    setLoading(true);
    fetch(`http://localhost:5000/projects/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading project:", err);
        setProject(null);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    const e = localStorage.getItem("userEmail");
    if (e) {
      fetch(`http://localhost:5000/users?email=${e}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) setUser(data[0]);
        });
    }
  }, []);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const handleDonate = async () => {
    if (!user) {
      alert(t("projectDetail.alert.mustLoginDonate"));
      navigate("/login");
      return;
    }

    const amount = parseFloat(donationAmount);
    if (isNaN(amount) || amount <= 0) {
      alert(t("projectDetail.alert.enterValidAmount"));
      return;
    }

    if (!invoice) {
      alert(t("projectDetail.alert.uploadInvoiceFirst"));
      return;
    }

    const updatedAmount = (project.donated || 0) + amount;

    try {
      await fetch(`http://localhost:5000/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donated: updatedAmount }),
      });

      const donation = {
        id: Date.now().toString(),
        projectId: id,
        amount,
        currency: "USD",
        method: paymentMethod,
        invoice: invoice.name,
        donorEmail: user.email,
        donorName: user.fullName || "N/A",
        donorDob: user.dob || "N/A",
        timestamp: new Date().toISOString(),
      };

      await fetch("http://localhost:5000/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donation),
      });

      alert(t("projectDetail.alert.donateOk"));
      setDonationAmount("");
      setInvoice(null);
      fetchProject();
    } catch (err) {
      console.error("Donation failed:", err);
      alert(t("projectDetail.alert.donateFail"));
    }
  };

  const expressInterest = async () => {
    if (role !== "user" || !email) return;
    const payload = {
      id: Date.now().toString(),
      projectId: id,
      userEmail: email,
      createdAt: new Date().toISOString(),
    };
    try {
      await fetch("http://localhost:5000/interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      alert(t("projectDetail.alert.interestOk"));
    } catch (e) {
      console.error(e);
      alert(t("projectDetail.alert.interestFail"));
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-gray-600"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {t("projectDetail.loading")}
      </div>
    );
  }

  if (!project) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-red-600 font-semibold"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {t("projectDetail.notFound")}
      </div>
    );
  }

  const { cost = 0, donated = 0, status = "Planned", imageUrl } = project;
  const title = pick(project, "title");
  const summary = pick(project, "summary");
  const remaining = Math.max(cost - donated, 0);
  const progress = cost ? Math.min((donated / cost) * 100, 100) : 0;

  const renderBankDetails = () => {
    switch (paymentMethod) {
      case "mbook":
        return (
          <div className="bg-blue-50 border p-4 rounded text-sm">
            <p><strong>{t("projectDetail.mbok.title")}</strong></p>
            <p>{t("projectDetail.bank.accountName")} <strong>Alkarama Hub</strong></p>
            <p>{t("projectDetail.bank.accountNumber")} <strong>1234-5678-9012</strong></p>
            <p>{t("projectDetail.bank.bank")} <strong>Bank of Khartoum</strong></p>
            <p className="mt-2 italic text-gray-600">{t("projectDetail.bank.uploadNote")}</p>
          </div>
        );
      case "fawry":
        return (
          <div className="bg-yellow-50 border p-4 rounded text-sm">
            <p><strong>{t("projectDetail.fawry.title")}</strong></p>
            <p>{t("projectDetail.bank.accountName")} <strong>Alkarama Hub</strong></p>
            <p>{t("projectDetail.bank.accountNumber")} <strong>9876-5432-1098</strong></p>
            <p>{t("projectDetail.bank.bank")} <strong>Fawry</strong></p>
            <p className="mt-2 italic text-gray-600">{t("projectDetail.bank.uploadNote")}</p>
          </div>
        );
      case "cash":
        return (
          <div className="bg-green-50 border p-4 rounded text-sm">
            <p><strong>{t("projectDetail.cash.title")}</strong></p>
            <p className="mt-2 italic text-gray-600">{t("projectDetail.cash.note")}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-20 px-4" dir={isRTL ? "rtl" : "ltr"}>
      <div className="bg-white/90 shadow-soft rounded-xl p-10 space-y-6">
        {imageUrl && (
          <img src={imageUrl} alt="" className="w-full h-48 object-cover rounded" />
        )}

        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Sudan Emblem" className="w-8 h-8 object-contain" />
          <h1 className="text-3xl font-extrabold text-brandNavy">{title}</h1>
        </div>

        <p className="text-textDark text-lg">{summary}</p>

        <div className="bg-gray-100 rounded p-4">
          <p><strong>{t("projectDetail.status")} </strong>{status}</p>
          <p><strong>{t("projectDetail.estimatedCost")} </strong>${cost.toLocaleString()}</p>
          <p><strong>{t("projectDetail.donated")} </strong>${donated.toLocaleString()}</p>
          <div className="w-full bg-gray-300 h-2 rounded mt-2">
            <div className="bg-green-600 h-2 rounded" style={{ width: `${progress}%` }} />
          </div>
          <p className="italic text-sm mt-1">
            {t("projectDetail.stillNeeded", { amount: remaining.toLocaleString() })}
          </p>
        </div>

        {role === "user" && (
          <div className="flex gap-3">
            <button onClick={expressInterest} className="btn-outline">
              {t("projectDetail.imInterestedVolunteer")}
            </button>
          </div>
        )}

        {/* Donation Form */}
        <div className="mt-6 space-y-4">
          <label className="label">{t("projectDetail.donationAmountUSD")}</label>
          <input
            type="number"
            min="1"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            className="input w-full"
            placeholder={t("projectDetail.enterAmount")}
          />

          <label className="label">{t("projectDetail.paymentMethod")}</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="input w-full"
          >
            <option value="mbook">{t("projectDetail.methods.mbok")}</option>
            <option value="fawry">{t("projectDetail.methods.fawry")}</option>
            <option value="cash">{t("projectDetail.methods.cash")}</option>
          </select>

          {renderBankDetails()}

          <label className="label mt-4">{t("projectDetail.uploadInvoice")}</label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setInvoice(e.target.files[0])}
            className="input w-full"
          />

          <button onClick={handleDonate} className="btn-primary w-full">
            {t("projectDetail.submitDonation")}
          </button>
        </div>
      </div>
    </div>
  );
}
