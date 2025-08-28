import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function AdminUserView() {
  const { t } = useTranslation();
  const { id } = useParams(); // can be user.id OR email
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        let data = null;

        // If :id looks like an email, fetch by email query
        if (id && id.includes("@")) {
          const res = await fetch(
            `http://localhost:5000/users?email=${encodeURIComponent(id)}`
          );
          const list = await res.json();
          data = Array.isArray(list) && list.length ? list[0] : null;
        } else {
          const res = await fetch(`http://localhost:5000/users/${id}`);
          if (res.ok) data = await res.json();
        }

        setUser(data || null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">{t("common.loading")}</div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-gray-600">{t("admin.userView.notFound")}</p>
        <button className="btn-secondary mt-4" onClick={() => navigate(-1)}>
          {t("common.back")}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white/95 shadow-soft rounded-2xl p-6 border">
        <div className="flex items-center gap-3 mb-4">
          <img src="/logo.png" alt="Sudan Emblem" className="w-7 h-7 object-contain" />
          <h1 className="text-2xl font-extrabold text-brandNavy">
            {t("admin.userView.title")}
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p>
              <strong>{t("common.name")}:</strong> {user.fullName || "—"}
            </p>
            <p>
              <strong>{t("common.email")}:</strong> {user.email || "—"}
            </p>
            <p>
              <strong>{t("admin.professionals.profession")}:</strong>{" "}
              {user.profession || "—"}
            </p>
            <p>
              <strong>{t("admin.professionals.availability")}:</strong>{" "}
              {user.availability || "—"}
            </p>
            <p>
              <strong>{t("admin.professionals.location")}:</strong>{" "}
              {user.location || "—"}
            </p>
            <p>
              <strong>{t("admin.userView.verified")}:</strong>{" "}
              {user.verified ? t("common.yes") : t("common.no")}
            </p>
          </div>

          <div>
            <p>
              <strong>{t("admin.userView.expertise")}:</strong>
            </p>
            {Array.isArray(user.expertise) && user.expertise.length ? (
              <div className="mt-1 flex flex-wrap gap-2">
                {user.expertise.map((x) => (
                  <span
                    key={x}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
                  >
                    {x}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">{t("common.noneListed")}</p>
            )}

            <div className="mt-3">
              <p>
                <strong>{t("admin.userView.cv")}:</strong>{" "}
                {user.cv ? (
                  <a
                    href={user.cv}
                    className="text-brandBlue hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t("admin.userView.downloadCv")}
                  </a>
                ) : (
                  t("admin.userView.noCv")
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button className="btn-secondary" onClick={() => navigate(-1)}>
            {t("common.back")}
          </button>
          <Link className="btn-primary" to="/admin">
            {t("admin.userView.backToAdmin")}
          </Link>
        </div>
      </div>
    </div>
  );
}
