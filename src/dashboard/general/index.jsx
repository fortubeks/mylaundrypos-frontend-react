export function PopOut({ child, onClick }) {
  return (
    <main
      className="fixed top-0 px-4 md:px-0 left-0 h-full w-full flex pt-[6%] justify-center z-[99999] bg-[#00000080]"
      onClick={onClick} // Fires only if outside is clicked
    >
      <div
        className="h-[60vh] overflow-y-scroll snap w-1/2 z-50 shadow-[4px_4px_20px_6px_#0000000D] rounded-[10px]"
        onClick={(e) => e.stopPropagation()} // Stops inner clicks
      >
        <div className="w-full h-full grow bg-white z-50 flex flex-col rounded-[10px]">
          {child}
        </div>
      </div>
    </main>
  );
}
