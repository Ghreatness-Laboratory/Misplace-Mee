import React, { useState } from "react";
import ReportForm from "../components/make-a-report/reportForm";
import ReportPreview from "../components/make-a-report/reportPreview";
import { FormData } from "../types/reportForm.types";

const MakeAReport: React.FC = () => {
  const [displayReportPreview, setDisplayReportPreview] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);

  const resetForm = () => {
    setDisplayReportPreview(false);
    setFormData(null);
  };

  const handleReportSubmit = () => {
    if (formData) resetForm();
  };

  return (
    <div data-testid="make-a-report-page">
      {/* Admin page header */}
      <div className="bg-blue-600 text-white px-4 sm:px-8 lg:px-10 py-6">
        <div className="max-w-[1300px] mx-auto">
          <h1 className="text-2xl font-bold">Add New Lost Item</h1>
          <p className="text-blue-200 text-sm mt-0.5">
            Fill in the details below to post a new listing on the board
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <ReportForm
            displayReportPreview={displayReportPreview}
            setDisplayReportPreview={setDisplayReportPreview}
            setFormData={setFormData}
          />
        </div>
      </div>

      {formData && (
        <ReportPreview
          isOpen={displayReportPreview}
          title={formData.title}
          image={formData.image}
          description={formData.description}
          date_reported={formData.date_reported}
          location={formData.location}
          phone_number={formData.phone_number}
          category={formData.category}
          onReportSubmit={handleReportSubmit}
          onCancel={resetForm}
        />
      )}
    </div>
  );
};

export default MakeAReport;
