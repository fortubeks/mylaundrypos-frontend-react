import arrow from "../assets/icons/arrow-circle.svg";
export default function Navigator({
  currentPage,
  setCurrentPage,
  array,
  perPage = 10,
  setPerPage,
}) {
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(array?.length / perPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 items-center py-2 mt-auto">
      <button onClick={handlePreviousPage} className="flex items-center gap-2">
        <img src={arrow} alt="" className="object-contain rotate-180" />
        Prev
      </button>
      <nav className="flex gap-2 items-center">
        <span className="bg-[#F3F3FA]">
          {Array.from(Array(Math.ceil(array?.length / perPage)).keys()).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                className={`h-6 w-6 rounded-md ${
                  currentPage === pageNumber + 1 ? "bg-[#F3F3FA]" : ""
                }`}
                onClick={() => handlePageChange(pageNumber + 1)}
              >
                {pageNumber + 1}
              </button>
            )
          )}
        </span>
        of {Math.ceil(array?.length / perPage)}
      </nav>
      <button onClick={handleNextPage} className="flex items-center gap-2">
        Next
        <img src={arrow} alt="" className="object-contain" />
      </button>
      <select
        name="per page"
        id=""
        className="bg-inherit"
        onChange={(e) => {
          setPerPage(parseInt(e.target.value));
          setCurrentPage(1);
        }}
      >
        <option value={10} selected>
          10 per page
        </option>
        <option value={20}>20 per page</option>
        <option value={30}>30 per page</option>
        <option value={40}>40 per page</option>
        <option value={50}>50 per page</option>
      </select>
    </div>
  );
}
