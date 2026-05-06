import React, { useState } from "react";
import useReports from "../../hooks/useReports";
import { ReportProps } from "../../types/report.types";
import Filter from "./filter";
import ItemModal from "./itemModal";
import Loader from "./loader";
import ReportItem from "./reportItem";

const ReportList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedItem, setSelectedItem] = useState<ReportProps | null>(null);
  const itemsPerPage = 6;

  const { data: items, loading, error } = useReports();

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description ?? "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation =
      selectedLocation === "All" || item.location === selectedLocation;
    const matchesCategory =
      selectedCategory === "All" ||
      (item.category ?? "Other") === selectedCategory;
    return matchesSearch && matchesLocation && matchesCategory;
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] my-10 max-w-[1280px] mx-4 sm:mx-8 xl:mx-auto px-4 sm:px-8 lg:px-10 bg-red-50/10 text-red-500 rounded-lg shadow-sm text-center">
        <h1 className="text-3xl font-bold">Oops!</h1>
        <p className="text-lg mt-2">Something went wrong while fetching the reports.</p>
        <p className="text-base mt-1">{error}</p>
        <button
          className="mt-4 py-2 px-6 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all"
          onClick={() => window.location.reload()}
        >
          Reload Page
        </button>
      </div>
    );
  }

  return (
    <>
      <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />

      <section id="browse" className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-8 lg:px-10">

          {/* Section header */}
          <div className="mb-8 md:mb-10 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Browse Lost Items
            </h2>
            <p className="text-gray-500 text-base">
              {items.length} item{items.length !== 1 ? "s" : ""} listed on campus — search, filter, and contact to claim yours
            </p>
          </div>

          {/* Search + Filter bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8 flex flex-col gap-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 50 45" fill="none">
                  <path d="M35.7347 28.3019H33.4763L32.6758 27.6072C35.5745 24.5817 37.1675 20.7188 37.1641 16.7238C37.1641 13.4162 36.0743 10.1828 34.0325 7.43258C31.9906 4.68236 29.0885 2.53882 25.6931 1.27303C22.2977 0.00724618 18.5614 -0.323942 14.9569 0.321351C11.3523 0.966645 8.04131 2.55944 5.44256 4.89831C2.84382 7.23718 1.07405 10.2171 0.357057 13.4612C-0.359935 16.7053 0.00805131 20.0679 1.41448 23.1238C2.82091 26.1797 5.20262 28.7916 8.25842 30.6292C11.3142 32.4669 14.9069 33.4477 18.5821 33.4477C23.1847 33.4477 27.4157 31.9297 30.6747 29.4082L31.4465 30.1286V32.1612L45.7404 45L50 41.1664L35.7347 28.3019ZM18.5821 28.3019C11.4637 28.3019 5.71756 23.1304 5.71756 16.7238C5.71756 10.3173 11.4637 5.1458 18.5821 5.1458C25.7004 5.1458 31.4465 10.3173 31.4465 16.7238C31.4465 23.1304 25.7004 28.3019 18.5821 28.3019Z" fill="#9CA3AF"/>
                </svg>
              </div>
              <input
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:bg-white transition-colors text-sm"
                name="search"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search by item name or description…"
                type="text"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(""); setCurrentPage(1); }}
                  className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18M6 6l12 12"/>
                  </svg>
                </button>
              )}
            </div>

            <Filter
              onFilterChange={handleLocationChange}
              onCategoryChange={handleCategoryChange}
              selectedCategory={selectedCategory}
            />
          </div>

          {/* Active filters */}
          {(selectedCategory !== "All" || selectedLocation !== "All" || searchQuery) && (
            <div className="flex items-center flex-wrap gap-2 mb-6 text-sm text-gray-600">
              <span className="text-gray-400">Showing results for:</span>
              {selectedCategory !== "All" && (
                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200 font-medium">
                  {selectedCategory}
                  <button onClick={() => handleCategoryChange("All")} className="ml-1 hover:text-blue-900">×</button>
                </span>
              )}
              {selectedLocation !== "All" && (
                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200 font-medium">
                  📍 {selectedLocation}
                  <button onClick={() => handleLocationChange("All")} className="ml-1 hover:text-blue-900">×</button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200 font-medium">
                  "{searchQuery}"
                  <button onClick={() => { setSearchQuery(""); setCurrentPage(1); }} className="ml-1 hover:text-blue-900">×</button>
                </span>
              )}
              <span className="text-gray-400 ml-auto">{filteredItems.length} result{filteredItems.length !== 1 ? "s" : ""}</span>
            </div>
          )}

          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh] py-16 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No items found</h3>
              <p className="text-gray-500 max-w-sm">
                We couldn't find anything matching your search or filters. Try adjusting them or check back later.
              </p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setSelectedLocation("All"); }}
                className="mt-6 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {paginatedItems.map((item) => (
                  <ReportItem
                    key={item.id}
                    title={item.title}
                    date_reported={item.date_reported}
                    image={item.image}
                    location={item.location}
                    category={item.category}
                    status={item.status}
                    description={item.description}
                    onClick={() => setSelectedItem(item)}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:border-blue-400 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    onClick={() => setCurrentPage((p) => p - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m15 18-6-6 6-6"/>
                    </svg>
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
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
                    aria-label="Next page"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default ReportList;
