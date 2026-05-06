import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { getCategoryColor, getCategoryEmoji } from "../common/filter";

interface ReportPreviewProps {
  image?: File | null;
  title?: string;
  date_reported?: string;
  description: string;
  location?: string;
  phone_number?: string;
  category?: string;
  status?: string;
  onReportSubmit: () => void;
  onCancel: () => void;
  isOpen: boolean;
}

const ReportPreview: React.FC<ReportPreviewProps> = ({
  image, title, date_reported, description, location,
  phone_number, category, status, onCancel, onReportSubmit, isOpen,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (image instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreviewUrl(reader.result as string);
      reader.readAsDataURL(image);
    }
  }, [image]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  const handleReportSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setSubmissionError("Authentication error. Please log in again.");
        setIsSubmitting(false);
        return;
      }

      let imageUrl = "";
      if (image instanceof File) {
        const ext = image.name.split(".").pop();
        const path = `reports/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("report-images")
          .upload(path, image);
        if (uploadError) throw new Error(uploadError.message);
        const { data: urlData } = supabase.storage
          .from("report-images")
          .getPublicUrl(path);
        imageUrl = urlData.publicUrl;
      }

      const { error } = await supabase.from("reports").insert({
        title: title ?? "",
        description,
        location: location ?? "",
        phone_number: phone_number ?? "",
        date_reported,
        status: status ?? "Lost",
        category: category || null,
        image: imageUrl,
      });

      if (error) throw new Error(error.message);
      alert("Report submitted successfully!");
      onReportSubmit();
    } catch (err) {
      setSubmissionError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const formattedDate = date_reported
    ? new Date(date_reported).toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })
    : date_reported;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white w-full sm:max-w-lg sm:rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Preview Report</h3>
          <button onClick={onCancel} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          <div className="relative">
            {imagePreviewUrl ? (
              <img src={imagePreviewUrl} alt="Preview" className="w-full h-52 object-cover" />
            ) : (
              <div className="w-full h-52 bg-gray-100 flex items-center justify-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 640 512" fill="currentColor">
                  <path d="M480 80C480 35.8 515.8 0 560 0C604.2 0 640 35.8 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.4 435.3 7.2 425.9L151.2 125.9C160.1 107.8 178.5 96 198.7 96C218.9 96 237.3 107.8 246.2 125.9L333.1 304.3C339.7 318 355.1 326.6 371.5 326.6C382.7 326.6 393.4 322 401.3 313.6L420.4 292.5C428.4 284.1 438.9 280 449.6 280C463.7 280 476.6 286.9 484.5 298.6L572.6 431.3C582.1 445.1 576.1 464 560 464H48C21.5 464 0 442.5 0 416V456.1z"/>
                </svg>
              </div>
            )}
            {category && (
              <div className="absolute top-3 left-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-sm ${getCategoryColor(category)}`}>
                  <span>{getCategoryEmoji(category)}</span>
                  {category}
                </span>
              </div>
            )}
          </div>

          <div className="p-5 space-y-4">
            <h4 className="text-xl font-bold text-gray-900">{title}</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-2 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 384 512" fill="currentColor" className="text-blue-500 mt-0.5 flex-shrink-0">
                  <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/>
                </svg>
                <span>{location || "—"}</span>
              </div>
              <div className="flex items-start gap-2 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 448 512" fill="currentColor" className="text-blue-500 mt-0.5 flex-shrink-0">
                  <path d="M128 0c17.7 0 32 14.3 32 32l0 32 128 0 0-32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 32 48 0c26.5 0 48 21.5 48 48l0 48L0 160l0-48C0 85.5 21.5 64 48 64l48 0 0-32c0-17.7 14.3-32 32-32zM0 192l448 0 0 272c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 192zm64 80l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16z"/>
                </svg>
                <span>{formattedDate || "—"}</span>
              </div>
              <div className="flex items-start gap-2 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 512 512" fill="currentColor" className="text-blue-500 mt-0.5 flex-shrink-0">
                  <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/>
                </svg>
                <span>+234 {phone_number || "—"}</span>
              </div>
            </div>
            {description && (
              <div className="pt-2 border-t border-gray-100">
                <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
              </div>
            )}
            {submissionError && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 512 512" fill="currentColor" className="mt-0.5 flex-shrink-0">
                  <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24l0 112c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-112c0-13.3 10.7-24 24-24zm-24 224a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"/>
                </svg>
                {submissionError}
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleReportSubmit}
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting…" : "Confirm & Submit"}
              </button>
              <button
                onClick={onCancel}
                className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;
