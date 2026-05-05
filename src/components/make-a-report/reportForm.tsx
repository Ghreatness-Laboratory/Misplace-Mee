import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import Select, { SingleValue } from "react-select";
import { CATEGORIES } from "../common/filter";
import { FormData } from "../../types/reportForm.types";

interface FormProps {
  displayReportPreview: boolean;
  setDisplayReportPreview: React.Dispatch<React.SetStateAction<boolean>>;
  setFormData: React.Dispatch<React.SetStateAction<FormData | null>>;
}

type FormError = Partial<Omit<FormData, "image">> & { image?: string };

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

const selectStyles = {
  control: (base: object) => ({
    ...base,
    borderColor: "#d1d5db",
    borderRadius: "0.5rem",
    padding: "2px 4px",
    boxShadow: "none",
    "&:hover": { borderColor: "#93c5fd" },
  }),
  option: (base: object, state: { isSelected: boolean; isFocused: boolean }) => ({
    ...base,
    borderRadius: "6px",
    backgroundColor: state.isSelected ? "#2563eb" : state.isFocused ? "#eff6ff" : "transparent",
    color: state.isSelected ? "white" : "#374151",
  }),
  menuList: (base: object) => ({ ...base, padding: "4px" }),
};

const ReportForm: React.FC<FormProps> = ({
  displayReportPreview,
  setDisplayReportPreview,
  setFormData,
}) => {
  const [formState, setFormState] = useState<FormData>({
    title: "",
    description: "",
    image: null,
    location: "",
    status: "Lost",
    date_reported: "",
    phone_number: "",
    email: "",
    category: "",
  });
  const [selectedLocation, setSelectedLocation] = useState<Option | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Option | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormError>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.style.overflow = displayReportPreview ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [displayReportPreview]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormState((prev) => ({ ...prev, phone_number: digits }));
    setErrors((prev) => ({ ...prev, phone_number: undefined }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "File size must be under 5 MB" }));
      return;
    }
    setFormState((prev) => ({ ...prev, image: file }));
    setErrors((prev) => ({ ...prev, image: undefined }));
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const validateForm = (): boolean => {
    const newErrors: FormError = {};
    if (!formState.title.trim()) newErrors.title = "Title is required";
    if (!formState.description.trim()) newErrors.description = "Description is required";
    if (!formState.image) newErrors.image = "Image is required";
    if (!formState.location) newErrors.location = "Location is required";
    if (!formState.phone_number) newErrors.phone_number = "Phone number is required";
    else if (formState.phone_number.length !== 10) newErrors.phone_number = "Must be exactly 10 digits";
    if (!formState.date_reported) newErrors.date_reported = "Date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setFormData({ ...formState });
      setDisplayReportPreview(true);
    }
  };

  const fieldCls = (hasError: boolean) =>
    `w-full py-3 px-4 text-sm outline-none border rounded-lg transition-colors ${
      hasError
        ? "border-red-300 focus:border-red-400"
        : "border-gray-300 focus:border-blue-400"
    }`;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      {/* ── Image upload ── */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">
          Photo of Item <span className="text-red-500">*</span>
        </p>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative group cursor-pointer rounded-xl overflow-hidden border-2 border-dashed border-gray-200 hover:border-blue-400 transition-colors"
        >
          {imagePreview ? (
            <>
              <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-semibold bg-black/50 px-4 py-2 rounded-xl">
                  Change Photo
                </span>
              </div>
            </>
          ) : (
            <div className="h-44 flex flex-col items-center justify-center gap-2 text-gray-400">
              <svg viewBox="0 0 640 512" className="h-10 fill-current mb-1">
                <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"/>
              </svg>
              <p className="text-sm font-medium">Click to upload a photo</p>
              <p className="text-xs">JPG, PNG or WebP — max 5 MB</p>
            </div>
          )}
        </div>
        <input ref={fileInputRef} id="file" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        {errors.image && <p className="text-xs text-red-500 mt-1">{errors.image}</p>}
      </div>

      {/* ── Title ── */}
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
          Report Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formState.title}
          placeholder="e.g. Blue Samsung Galaxy phone"
          onChange={handleChange}
          autoComplete="off"
          className={fieldCls(!!errors.title)}
        />
        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
      </div>

      {/* ── Description ── */}
      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={formState.description}
          placeholder="Describe the item — colour, size, distinguishing features…"
          onChange={handleChange}
          className={`${fieldCls(!!errors.description)} resize-none`}
        />
        {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
      </div>

      {/* ── Category + Status row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
          <Select
            options={CATEGORY_OPTIONS}
            value={selectedCategory}
            onChange={(opt: SingleValue<Option>) => {
              setSelectedCategory(opt);
              setFormState((prev) => ({ ...prev, category: opt?.value ?? "" }));
            }}
            placeholder="Select category…"
            isClearable
            styles={selectStyles as never}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
          <div className="flex gap-2">
            {(["Lost", "Found"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFormState((prev) => ({ ...prev, status: s }))}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-all ${
                  formState.status === s
                    ? s === "Found"
                      ? "bg-emerald-500 text-white border-emerald-500"
                      : "bg-red-500 text-white border-red-500"
                    : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                }`}
              >
                {s === "Found" ? "✅ Found" : "❌ Lost"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Location ── */}
      <div>
        <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
          Location <span className="text-red-500">*</span>
        </label>
        <Select
          inputId="location"
          options={LOCATION_OPTIONS}
          value={selectedLocation}
          onChange={(opt: SingleValue<Option>) => {
            setSelectedLocation(opt);
            setFormState((prev) => ({ ...prev, location: opt?.value ?? "" }));
            setErrors((prev) => ({ ...prev, location: undefined }));
          }}
          placeholder="Select campus location…"
          styles={selectStyles as never}
        />
        {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
      </div>

      {/* ── Date + Phone row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="date_reported" className="block text-sm font-semibold text-gray-700 mb-2">
            Date Reported <span className="text-red-500">*</span>
          </label>
          <input
            id="date_reported"
            name="date_reported"
            type="date"
            value={formState.date_reported}
            onChange={handleChange}
            className={fieldCls(!!errors.date_reported)}
          />
          {errors.date_reported && <p className="text-xs text-red-500 mt-1">{errors.date_reported}</p>}
        </div>

        <div>
          <label htmlFor="phone_number" className="block text-sm font-semibold text-gray-700 mb-2">
            Contact Phone <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center border-r border-gray-200 pr-3">
              <span className="text-sm text-gray-500 font-medium">+234</span>
            </div>
            <input
              id="phone_number"
              name="phone_number"
              type="tel"
              maxLength={10}
              value={formState.phone_number}
              onChange={handlePhoneChange}
              placeholder="0000000000"
              className={`${fieldCls(!!errors.phone_number)} pl-16`}
            />
          </div>
          {errors.phone_number && <p className="text-xs text-red-500 mt-1">{errors.phone_number}</p>}
        </div>
      </div>

      {/* ── Email (optional) ── */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
          Email <span className="text-gray-400 font-normal text-xs">(optional)</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formState.email}
          onChange={handleChange}
          autoComplete="email"
          placeholder="you@example.com"
          className={fieldCls(!!errors.email)}
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors shadow-sm mt-2"
      >
        Preview Report
      </button>
    </form>
  );
};

export default ReportForm;
