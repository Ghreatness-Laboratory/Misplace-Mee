import React, { useEffect, useRef, useState } from "react";
import Select, { components, OptionProps, SingleValue } from "react-select";

interface FilterProps {
  onFilterChange: (selectedLocation: string) => void;
  onCategoryChange?: (category: string) => void;
  selectedCategory?: string;
}

type Option = {
  value: string;
  label: string;
};

const locationOptions: Option[] = [
  { value: "All", label: "All Locations" },
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

export const CATEGORIES = [
  { value: "All", label: "All Items", emoji: "🔍" },
  { value: "Cash", label: "Cash", emoji: "💵" },
  { value: "Books", label: "Books", emoji: "📚" },
  { value: "Stationery", label: "Stationery", emoji: "✏️" },
  { value: "Electronics", label: "Electronics", emoji: "📱" },
  { value: "Clothing", label: "Clothing", emoji: "👕" },
  { value: "Accessories", label: "Accessories", emoji: "👜" },
  { value: "ID/Cards", label: "ID & Cards", emoji: "🪪" },
  { value: "Keys", label: "Keys", emoji: "🔑" },
  { value: "Jewelry", label: "Jewelry", emoji: "💍" },
  { value: "Other", label: "Other", emoji: "📦" },
];

export const getCategoryColor = (category?: string): string => {
  const colors: Record<string, string> = {
    Cash: "bg-green-100 text-green-700 border-green-200",
    Books: "bg-blue-100 text-blue-700 border-blue-200",
    Stationery: "bg-purple-100 text-purple-700 border-purple-200",
    Electronics: "bg-orange-100 text-orange-700 border-orange-200",
    Clothing: "bg-pink-100 text-pink-700 border-pink-200",
    Accessories: "bg-teal-100 text-teal-700 border-teal-200",
    "ID/Cards": "bg-red-100 text-red-700 border-red-200",
    Keys: "bg-amber-100 text-amber-700 border-amber-200",
    Jewelry: "bg-rose-100 text-rose-700 border-rose-200",
    Other: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return colors[category ?? ""] ?? "bg-slate-100 text-slate-600 border-slate-200";
};

export const getCategoryEmoji = (category?: string): string => {
  const found = CATEGORIES.find((c) => c.value === category);
  return found?.emoji ?? "📦";
};

const CustomOption = (props: OptionProps<Option>) => {
  const { data, label } = props;
  return (
    <components.Option {...props}>
      <label
        className="flex items-center"
        data-testid={`location-option-${data.value
          .replace(/\s+/g, "-")
          .toLowerCase()}`}
      >
        {label}
      </label>
    </components.Option>
  );
};

const Filter: React.FC<FilterProps> = ({
  onFilterChange,
  onCategoryChange,
  selectedCategory = "All",
}) => {
  const [selectedOption, setSelectedOption] =
    useState<SingleValue<Option>>(null);
  const [showSelect, setShowSelect] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelectChange = (selected: SingleValue<Option>) => {
    if (selected && selected.value !== "All") {
      setSelectedOption(selected);
      onFilterChange(selected.value);
    } else {
      setSelectedOption(null);
      onFilterChange("All");
    }
    setShowSelect(false);
  };

  const toggleSelect = () => {
    setShowSelect((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowSelect(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="relative flex flex-col items-end gap-2 w-full"
      data-testid="filter-dropdown-container"
    >
      {/* Category pills — scrollable row */}
      <div className="flex items-center gap-2 w-full overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => onCategoryChange?.(cat.value)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600"
              }`}
            >
              <span>{cat.emoji}</span>
              <span className="whitespace-nowrap">{cat.label}</span>
            </button>
          );
        })}

        {/* Location filter button */}
        <div className="relative flex-shrink-0 ml-auto" ref={dropdownRef}>
          <button
            title="Filter by Location"
            aria-label="Open Location Filter"
            data-testid="filter-button"
            onClick={toggleSelect}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
              selectedOption
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600"
            }`}
          >
            <svg viewBox="0 0 384 512" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
              <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
            </svg>
            <span className="whitespace-nowrap">
              {selectedOption ? selectedOption.label : "Location"}
            </span>
            {selectedOption && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedOption(null);
                  onFilterChange("All");
                }}
                className="ml-1 hover:text-white/70"
              >
                ×
              </span>
            )}
          </button>

          {showSelect && (
            <div
              className="absolute top-10 right-0 w-[260px] bg-white shadow-xl border border-gray-100 rounded-xl z-20 overflow-hidden"
              data-testid="location-dropdown"
            >
              <Select
                inputId="location-select"
                data-testid="location-select"
                options={locationOptions}
                components={{ Option: CustomOption }}
                value={selectedOption}
                onChange={handleSelectChange}
                placeholder="Filter by location..."
                className="text-gray-800"
                isMulti={false}
                aria-label="Select Location"
                autoFocus
                menuIsOpen
                controlShouldRenderValue={false}
                styles={{
                  control: (base) => ({ ...base, display: "none" }),
                  menu: (base) => ({ ...base, position: "static", boxShadow: "none", margin: 0, borderRadius: 0 }),
                  menuList: (base) => ({ ...base, padding: "4px" }),
                  option: (base, state) => ({
                    ...base,
                    borderRadius: "6px",
                    backgroundColor: state.isSelected ? "#2563eb" : state.isFocused ? "#eff6ff" : "transparent",
                    color: state.isSelected ? "white" : "#374151",
                  }),
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filter;
