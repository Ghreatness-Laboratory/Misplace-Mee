import React from "react";
import { ReportProps } from "../../types/report.types";
import { getCategoryColor, getCategoryEmoji } from "./filter";

interface ReportItemProps extends Partial<ReportProps> {
  style?: string;
  imageStyle?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

const ReportItem: React.FC<ReportItemProps> = ({
  title,
  date_reported,
  image,
  location,
  category,
  status,
  description,
  style,
  imageStyle,
  children,
  onClick,
}) => {
  const formattedDate = date_reported
    ? new Date(date_reported).toLocaleDateString("en-NG", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : date_reported;

  if (children) {
    return (
      <div data-testid="report-item" className="p-0 md:p-4 w-full rounded-lg">
        <div className={`${style}`}>
          <img
            src={image}
            alt={`Lost and Found Item at ${location}`}
            className={`object-cover w-full h-[180px] md:h-[200px] ${imageStyle}`}
          />
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      data-testid="report-item"
      onClick={onClick}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 hover:border-blue-200 transition-all duration-300 cursor-pointer"
    >
      {/* Image container */}
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={`Lost and Found: ${title}`}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Status badge */}
        {status && (
          <div className="absolute top-3 right-3">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow ${
                status.toLowerCase() === "found"
                  ? "bg-emerald-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {status}
            </span>
          </div>
        )}

        {/* Category badge */}
        {category && (
          <div className="absolute top-3 left-3">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border shadow-sm ${getCategoryColor(category)}`}
            >
              <span>{getCategoryEmoji(category)}</span>
              {category}
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-base line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        {description && (
          <p className="text-gray-500 text-sm line-clamp-2 mb-3">{description}</p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <div className="flex items-center gap-1 text-gray-500 text-xs min-w-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 384 512" fill="currentColor" className="flex-shrink-0 text-blue-400">
              <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/>
            </svg>
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-xs flex-shrink-0 ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 448 512" fill="currentColor" className="text-blue-400">
              <path d="M128 0c17.7 0 32 14.3 32 32l0 32 128 0 0-32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 32 48 0c26.5 0 48 21.5 48 48l0 48L0 160l0-48C0 85.5 21.5 64 48 64l48 0 0-32c0-17.7 14.3-32 32-32zM0 192l448 0 0 272c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 192zm64 80l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16z"/>
            </svg>
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* View details footer */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-blue-50 group-hover:bg-blue-600 transition-colors duration-300">
          <span className="text-blue-600 group-hover:text-white text-sm font-semibold transition-colors">
            View Details
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 group-hover:text-white transition-colors">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ReportItem;
