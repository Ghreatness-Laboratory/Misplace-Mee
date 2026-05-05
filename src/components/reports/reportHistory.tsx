import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { ACCESS_TOKEN, CSRF_TOKEN } from "../../constants";
import useFetch, { BASE_URL } from "../../hooks/useFetch";
import { ReportProps } from "../../types/report.types";
import { getCategoryColor, getCategoryEmoji } from "../common/filter";
import Loader from "../common/loader";
import EditReportModal from "./editReportModal";

const ReportsHistory: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 8;

  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [editingReport, setEditingReport] = useState<ReportProps | null>(null);

  const { data: reports, error } = useFetch<ReportProps[]>("/reports/");
  const [reportList, setReportList] = useState<ReportProps[]>([]);

  useEffect(() => {
    if (reports) setReportList(reports.map((r) => ({ ...r, id: r.id ?? 0 })));
  }, [reports]);

  const filteredItems = useMemo(
    () =>
      reportList.filter(
        (r) =>
          r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (r.description ?? "").toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [reportList, searchTerm]
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this report? This cannot be undone.")) return;
    setDeleting(true);
    setActionError(null);

    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (!CSRF_TOKEN || !accessToken) {
      setActionError("Authentication error. Please log in again.");
      setDeleting(false);
      return;
    }

    try {
      await axios.delete(`${BASE_URL}/reports/${id}`, {
        headers: {
          accept: "application/json",
          "X-CSRFTOKEN": CSRF_TOKEN,
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setReportList((prev) => prev.filter((r) => r.id !== id));
    } catch {
      setActionError("Failed to delete. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleSaved = (updated: ReportProps) => {
    setReportList((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  if (!reports && !error) return <Loader />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-red-500 text-center p-8">
        <h1 className="text-3xl font-bold mb-2">Oops!</h1>
        <p className="text-lg">Something went wrong while fetching the reports.</p>
        <p className="text-base mt-1">Error {error.status}: {error.message}</p>
        <button
          className="mt-4 py-2 px-6 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
  }

  return (
    <>
      <EditReportModal
        report={editingReport}
        onClose={() => setEditingReport(null)}
        onSaved={handleSaved}
      />

      <section>
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="relative max-w-sm w-full">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 512 512" fill="currentColor">
                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by title, location or description…"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {actionError && (
              <span className="text-red-600 text-sm bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg">
                {actionError}
              </span>
            )}
            {deleting && (
              <span className="text-red-500 text-sm bg-red-50 px-3 py-1.5 rounded-lg animate-pulse">
                Deleting…
              </span>
            )}
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg font-medium">
              {filteredItems.length} report{filteredItems.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center py-16">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No reports found</h3>
            <p className="text-gray-500">
              {searchTerm ? "No results match your search." : "No reports have been submitted yet."}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden overflow-x-auto">
              <table className="w-full min-w-[750px] divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-[35%]">Item</th>
                    <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                    <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</th>
                    <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                    <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginatedItems.map((report) => (
                    <tr
                      key={report.id}
                      className="hover:bg-blue-50/30 transition-colors"
                    >
                      {/* Item thumbnail + title + phone */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            className="w-14 h-14 object-cover rounded-xl flex-shrink-0 border border-gray-100"
                            src={report.image}
                            alt={report.title}
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 text-sm truncate max-w-[200px]">
                              {report.title}
                            </p>
                            {report.description && (
                              <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[200px]">
                                {report.description}
                              </p>
                            )}
                            {report.phone_number && (
                              <p className="text-xs text-blue-500 mt-0.5">+234 {report.phone_number}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-4">
                        {report.category ? (
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(report.category)}`}>
                            {getCategoryEmoji(report.category)} {report.category}
                          </span>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        {report.status ? (
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                            report.status.toLowerCase() === "found"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-600"
                          }`}>
                            {report.status}
                          </span>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>

                      {/* Location */}
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 384 512" fill="currentColor" className="text-blue-400 flex-shrink-0">
                            <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                          </svg>
                          <span className="truncate max-w-[120px]">{report.location}</span>
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {report.date_reported}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {/* Edit — opens full modal */}
                          <button
                            onClick={() => setEditingReport(report)}
                            title="Edit all fields"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-xs font-semibold"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 512 512" fill="currentColor">
                              <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32L64 160c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z" />
                            </svg>
                            Edit
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(report.id)}
                            disabled={deleting}
                            title="Delete report"
                            className="p-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors disabled:opacity-40"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 448 512" fill="currentColor">
                              <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:border-blue-400 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={currentPage === 1}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                      currentPage === page
                        ? "bg-blue-600 text-white shadow-sm"
                        : "border border-gray-200 bg-white text-gray-600 hover:border-blue-400 hover:text-blue-600"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:border-blue-400 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={currentPage === totalPages}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
};

export default ReportsHistory;
