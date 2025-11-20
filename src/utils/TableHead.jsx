import Checkmark from "./Checkmark";
export default function TableHead({
  names,
  px = "px-2",
  text = "text-sm",
  bg = "bg-[#F9F9F9]",
  checkbox = false,
  checked = false,
  setChecked = () => {},
}) {
  return (
    <thead className={`w-full sticky top-0 rounded-xl ${text}`}>
      <tr>
        {checkbox && (
          <th
            scope="col"
            className={`text-[#878788] font-normal text-center ${bg} ${
              checkbox ? "rounded-l-xl pl-2" : ""
            } `}
          >
            <Checkmark checked={checked} setChecked={setChecked} />
          </th>
        )}
        {names.map((name, i) => {
          const isFirst = i === 0 && !checkbox;
          const isLast = i === names.length - 1;

          const roundedClass = `${isFirst ? "rounded-l-xl border-l" : ""} ${
            isLast ? "rounded-r-xl border-r" : ""
          } `;
          const rounded = `${isFirst ? "rounded-l-xl" : ""} ${
            isLast ? "rounded-r-xl" : ""
          }`;

          return (
            <th
              scope="col"
              className={`text-[#878788] font-normal ${bg} ${rounded}`}
              key={i}
            >
              <div
                className={`${px} ${roundedClass} py-3 w-full h-full border-y border-[#EFEFEF] text-start whitespace-nowrap`}
              >
                {name}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}

// export default function TableHead({
//   names,
//   px = "px-2",
//   text = "text-sm",
//   bg = "bg-[#F9F9F9]",
//   checkbox = false,
// }) {
//   return (
//     <thead className="bg-transparent">
//       <tr>
//         <th colSpan={names.length} className="p-0">
//           <div
//             className={`${bg} rounded-xl border border-[#EFEFEF] overflow-hidden ${text}`}
//           >
//             <table className="w-full text-sm">
//               <thead>
//                 <tr>
//                   {checkbox && (
//                     <th
//                       scope="col"
//                       className={`pl-2 text-[#878788] py-3 font-normal text-center`}
//                     >
//                       <label className="inline-flex items-center cursor-pointer">
//                         <input type="checkbox" className="sr-only peer" />
//                         <div className="w-5 h-5 border border-gray-300 rounded-md bg-white peer-checked:bg-secondary peer-checked:border-secondary flex items-center justify-center relative transition-colors duration-200">
//                           <FaCheck className="text-white text-xs" />
//                         </div>
//                       </label>
//                     </th>
//                   )}
//                   {names.map((name, i) => (
//                     <th
//                       scope="col"
//                       className={`${px} py-3 text-start text-[#878788]`}
//                       key={i}
//                     >
//                       {name}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//             </table>
//           </div>
//         </th>
//       </tr>
//     </thead>
//   );
// }
