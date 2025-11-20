import arrow from "../assets/icons/arrow-circle.svg";

export default function NavigatorPager({
  currentPage,
  setCurrentPage,
  perPage = 10,
  setPerPage,
  pagination
}) {

  return (
    <div className="flex flex-wrap gap-2 items-center py-2 mt-auto">
      <button
        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-2"
      >
        <img src={arrow} alt="" className="object-contain rotate-180" />
        Prev
      </button>
      <nav className="flex gap-2 items-center">
        <span className="bg-[#F3F3FA] p-1">
          {Array.from({ length: pagination?.last_page }, (_, i) => (
            <button
              key={i}
              className={`h-6 w-6 rounded-md ${
                currentPage === i + 1 ? "bg-[#E8E8E8]" : ""
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </span>
        of {pagination?.last_page}
      </nav>
      <button
        onClick={() =>
          currentPage < pagination?.last_page && setCurrentPage(currentPage + 1)
        }
        disabled={currentPage === pagination?.last_page}
        className="flex items-center gap-2"
      >
        Next
        <img src={arrow} alt="" className="object-contain" />
      </button>
      <select
        name="per page"
        value={perPage}
        className="bg-inherit"
        onChange={(e) => {
          setPerPage(parseInt(e.target.value));
          setCurrentPage(1);
        }}
      >
        {[10, 20, 30, 40, 50].map((num) => (
          <option key={num} value={num}>
            {num} per page
          </option>
        ))}
      </select>
    </div>
  );
}
