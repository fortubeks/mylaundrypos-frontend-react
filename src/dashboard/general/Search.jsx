import { useMemo, useState } from "react";
import sch from "../../assets/icons/search.svg";
import { useDispatch } from "react-redux";
import { setShowSearch } from "../../store/slices/generalSlice";
import { appRoutes } from "./searchRoutes";
import { useNavigate } from "react-router-dom";
import Fuse from "fuse.js";

export default function Search() {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const fuse = useMemo(() => {
    return new Fuse(appRoutes, {
      includeScore: true,
      includeMatches: true,
      threshold: 0.4,
      ignoreLocation: true,
    });
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return fuse.search(query);
  }, [query, fuse]);

  const handleNavigate = (path) => {
    navigate(path);
    setQuery(""); // Clear after navigation
    dispatch(setShowSearch(false));
  };

  const filteredRoutes = query.trim()
    ? results
    : appRoutes.map((r) => ({ item: r }));

  return (
    <div className="w-full h-full grow relative text-sm flex flex-col">
      <div className="flex items-center w-full px-4 py-1 border-b border-[#EFEFEF]">
        <img src={sch} alt="Search" className="object-contain" />
        <input
          type="text"
          className="h-10 w-full bg-inherit px-3"
          placeholder="Search for something"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={() => dispatch(setShowSearch(false))}
          className={`flex items-center justify-center px-3 h-10 border border-[#EFEFEF] rounded-md text-[#959595] text-sm`}
        >
          esc
        </button>
      </div>
      <div className="w-full h-full grow flex">
        {query && (
          <ul className="w-full  z-50 shadow-lg h-full overflow-y-auto">
            {filteredRoutes.length === 0 ? (
              <li className="px-4 py-2 text-sm text-gray-400">
                No matching routes
              </li>
            ) : (
              filteredRoutes.map((result, i) => {
                const route = result.item;
                const indices = result.matches?.[0]?.indices || [];
                return (
                  <li
                    key={i}
                    className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleNavigate(route)}
                    dangerouslySetInnerHTML={{
                      __html: highlightMatch(route, indices),
                    }}
                  />
                );
              })
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
function highlightMatch(text, indices) {
  if (!indices || indices.length === 0) return escapeHTML(text);

  let result = "";
  let lastIndex = 0;

  indices.forEach(([start, end]) => {
    result += escapeHTML(text.slice(lastIndex, start));
    result += `<span class="font-semibold">${escapeHTML(
      text.slice(start, end + 1)
    )}</span>`;
    lastIndex = end + 1;
  });

  result += escapeHTML(text.slice(lastIndex));
  return result;
}

// Escape HTML to prevent XSS
function escapeHTML(str) {
  return str.replace(/[&<>"']/g, function (m) {
    return (
      {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      }[m] || m
    );
  });
}
