import React from "react";
import ReportList from "../components/common/reportList";

const Home: React.FC = () => {
  return (
    <div data-testid="home-page">
      <div className="bg-blue-600 text-white px-4 sm:px-8 lg:px-10 py-6">
        <div className="max-w-[1300px] mx-auto flex items-center justify-between">
          <div>
            <h1 role="heading" className="text-2xl font-bold">
              Admin Dashboard
            </h1>
            <p className="text-blue-200 text-sm mt-0.5">
              Manage lost &amp; found reports for Bells University campus
            </p>
          </div>
          <a
            href="/make-a-report"
            className="flex items-center gap-2 bg-white text-blue-600 font-semibold text-sm px-4 py-2.5 rounded-xl shadow hover:bg-blue-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Add New Item
          </a>
        </div>
      </div>
      <ReportList />
    </div>
  );
};

export default Home;
