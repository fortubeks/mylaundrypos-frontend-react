export default function SideModal({ child }) {
  return (
    <main className="fixed top-0 left-0 h-full w-full bg-[#11182733] backdrop-blur-[3px] flex justify-end z-[9999]">
      <main className="overflow-y-scroll snap w-1/3 h-full z-50 ">
        <div className="w-full h-full bg-white z-50 flex flex-col items-center">
          {child}
        </div>
      </main>
    </main>
  );
}
