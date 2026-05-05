import axios from "axios";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import Select, { SingleValue } from "react-select";
import { ACCESS_TOKEN, CSRF_TOKEN } from "../../constants";
import { BASE_URL } from "../../hooks/useFetch";
import { ReportProps } from "../../types/report.types";
import { CATEGORIES } from "../common/filter";

interface EditReportModalProps {
  report: ReportProps | null;
  onClose: () => void;
  onSaved: (updated: ReportProps) => void;
}

type Option = { value: string; label: string };

const LOCATION_OPTIONS: Option[] = [
  { value: "Uptown", label: "Uptown" },
  { value: "Classroom", label: "Classroom" },
  { value: "Downtown", label: "Downtown" },
  { value: "Best Man", label: "Best Man" },
  { value: "Coleng Gazebo", label: "Coleng Gazebo" },
  { value: "Colnas Gazebo", label: "Colnas Gazebo" },
  { value: "Colmans Gazebo", label: "Colmans Gazebo" },
  { value: "Football field/Pavilion", label: "Football field/Pavilion" },
  { value: "Ekorupa & Sons", label: "Ekorupa & Sons" },
  { value: "Exceeding Grace Cafeteria", label: "Exceeding Grace Cafeteria" },
  { value: "Library", label: "Library" },
  { value: "Marque", label: "Marque" },
];

const CATEGORY_OPTIONS: Option[] = CATEGORIES.filter((c) => c.value !== "All").map((c) => ({
  value: c.value,
  label: `${c.emoji} ${c.label}`,
}));

const STATUS_OPTIONS = ["Lost", "Found"] as const;

interface FormState {
  title: string;
  description: string;
  location: string;
  category: string;
  date_reported: string;
  phone_number: string;
  status: string;
  newImage: File | null;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const EditReportModal: React.FC<EditReportModalProps> = ({ report, onClose, onSaved }) => {
  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    location: "",
    category: "",
    date_reported: "",
    phone_number: "",
    status: "",
    newImage: null,
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Populate form when report changes
  useEffect(() => {
    if (!report) return;
    setForm({
      title: report.title,
      description: report.description,
      location: report.location,
      category: report.category ?? "",
      date_reported: report.date_reported,
      phone_number: report.phone_number,
      status: report.status,
      newImage: null,
    });
    setImagePreview(report.image);
    setErrors({});
    setSaveError(null);
  }, [report]);

  // Lock body scroll while open
  useEffect(() => {
    if (report) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, [report]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!report) return null;

  const handleText = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handlePhone = (e: ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setForm((prev) => ({ ...prev, phone_number: digits }));
    setErrors((prev) => ({ ...prev, phone_number: undefined }));
  };

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, newImage: "Image must be under 5 MB" }));
      return;
    }
    setForm((prev) => ({ ...prev, newImage: file }));
    setErrors((prev) => ({ ...prev, newImage: undefined }));
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.description.trim()) errs.description = "Description is required";
    if (!form.location) errs.location = "Location is required";
    if (!form.date_reported) errs.date_reported = "Date is required";
    if (!form.phone_number) errs.phone_number = "Phone number is required";
    else if (form.phone_number.length !== 10) errs.phone_number = "Must be exactly 10 digits";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    setSaveError(null);

    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (!CSRF_TOKEN || !accessToken) {
      setSaveError("Authentication error. Please log in again.");
      setSaving(false);
      return;
    }

    const fd = new FormData();
    fd.append("title", form.title.trim());
    fd.append("description", form.description.trim());
    fd.append("location", form.location);
    fd.append("date_reported", form.date_reported);
    fd.append("phone_number", form.phone_number);
    if (form.category) fd.append("category", form.category);
    if (form.status) fd.append("status", form.status);
    if (form.newImage) fd.append("image", form.newImage);

    try {
      const { data } = await axios.patch<ReportProps>(`${BASE_URL}/reports/${report.id}`, fd, {
        headers: {
          accept: "application/json",
          "Content-Type": "multipart/form-data",
          "X-CSRFTOKEN": CSRF_TOKEN,
          Authorization: `Bearer ${accessToken}`,
        },
      });
      onSaved({ ...report, ...data });
      onClose();
    } catch (err) {
      setSaveError(
        axios.isAxiosError(err)
          ? err.response?.data?.detail || err.response?.data?.message || "Failed to save. Please try again."
          : "An unexpected error occurred."
      );
    } finally {
      setSaving(false);
    }
  };

  const selectStyles = {
    control: (base: object) => ({
      ...base,
      borderColor: "#e5e7eb",
      borderRadius: "0.75rem",
      padding: "2px 4px",
      boxShadow: "none",
      "&:hover": { borderColor: "#60a5fa" },
    }),
    option: (base: object, state: { isSelected: boolean; isFocused: boolean }) => ({
      ...base,
      borderRadius: "6px",
      backgroundColor: state.isSelected ? "#2563eb" : state.isFocused ? "#eff6ff" : "transparent",
      color: state.isSelected ? "white" : "#374151",
    }),
    menuList: (base: object) => ({ ...base, padding: "4px" }),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal panel */}
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Edit Report</h2>
            <p className="text-xs text-gray-400 mt-0.5">ID #{report.id} — all fields are editable</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          {/* ── Image upload ── */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Item Photo
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative group cursor-pointer rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 hover:border-blue-400 transition-colors"
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white font-semibold text-sm bg-black/50 px-4 py-2 rounded-xl flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 512 512" fill="currentColor">
                        <path d="M149.1 64.8L138.7 96 64 96C28.7 96 0 124.7 0 160L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64l-74.7 0L362.9 64.8C356.4 45.2 338.1 32 317.4 32L194.6 32c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"/>
                      </svg>
                      Change Photo
                    </span>
                  </div>
                </>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center gap-2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 640 512" fill="currentColor">
                    <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"/>
                  </svg>
                  <p className="text-sm">Click to upload a photo</p>
                  <p className="text-xs">Max 5 MB</p>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
            {errors.newImage && <p className="text-xs text-red-500 mt-1">{errors.newImage}</p>}
          </div>

          {/* ── Title ── */}
          <Field label="Title" required error={errors.title}>
            <input
              name="title"
              type="text"
              value={form.title}
              onChange={handleText}
              placeholder="e.g. Blue backpack"
              className={inputCls(!!errors.title)}
            />
          </Field>

          {/* ── Description ── */}
          <Field label="Description" required error={errors.description}>
            <textarea
              name="description"
              value={form.description}
              onChange={handleText}
              rows={3}
              placeholder="Describe the item in detail…"
              className={`${inputCls(!!errors.description)} resize-none`}
            />
          </Field>

          {/* ── Two-col: Category + Status ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Category">
              <Select
                options={CATEGORY_OPTIONS}
                value={CATEGORY_OPTIONS.find((o) => o.value === form.category) ?? null}
                onChange={(opt: SingleValue<Option>) =>
                  setForm((prev) => ({ ...prev, category: opt?.value ?? "" }))
                }
                placeholder="Select category…"
                isClearable
                styles={selectStyles as never}
              />
            </Field>

            <Field label="Status">
              <div className="flex gap-2 pt-1">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, status: s }))}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                      form.status === s
                        ? s === "Found"
                          ? "bg-emerald-500 text-white border-emerald-500"
                          : "bg-red-500 text-white border-red-500"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {s === "Found" ? "✅ Found" : "❌ Lost"}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          {/* ── Location ── */}
          <Field label="Location" required error={errors.location}>
            <Select
              options={LOCATION_OPTIONS}
              value={LOCATION_OPTIONS.find((o) => o.value === form.location) ?? null}
              onChange={(opt: SingleValue<Option>) => {
                setForm((prev) => ({ ...prev, location: opt?.value ?? "" }));
                setErrors((prev) => ({ ...prev, location: undefined }));
              }}
              placeholder="Select campus location…"
              styles={selectStyles as never}
            />
          </Field>

          {/* ── Two-col: Date + Phone ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Date Reported" required error={errors.date_reported}>
              <input
                name="date_reported"
                type="date"
                value={form.date_reported}
                onChange={handleText}
                className={inputCls(!!errors.date_reported)}
              />
            </Field>

            <Field label="Phone Number" required error={errors.phone_number}>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center border-r border-gray-200 pr-3">
                  <span className="text-sm text-gray-500 font-medium">+234</span>
                </div>
                <input
                  name="phone_number"
                  type="tel"
                  value={form.phone_number}
                  onChange={handlePhone}
                  placeholder="0000000000"
                  maxLength={10}
                  className={`${inputCls(!!errors.phone_number)} pl-16`}
                />
              </div>
            </Field>
          </div>

          {/* Save error */}
          {saveError && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 512 512" fill="currentColor" className="mt-0.5 flex-shrink-0">
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24l0 112c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-112c0-13.3 10.7-24 24-24zm-24 224a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"/>
              </svg>
              {saveError}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 512 512" fill="currentColor">
                  <path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.8zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"/>
                </svg>
                Saving…
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 448 512" fill="currentColor">
                  <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
                </svg>
                Save Changes
              </>
            )}
          </button>
          <button
            onClick={onClose}
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Small helpers ── */
const inputCls = (hasError: boolean) =>
  `w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-colors ${
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
      : "border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
  }`;

const Field: React.FC<{
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}> = ({ label, required, error, children }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

export default EditReportModal;
