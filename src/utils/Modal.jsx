import { useIsMobile } from "./use-mobile";

export default function Modal({
  child,
  width = "35",
  max = "55",
  height = "fit-content",
}) {
  const isMobile = useIsMobile();
  return (
    <main className="fixed top-0 px-4 md:px-0 left-0 h-full w-full bg-[#00000033] backdrop-blur-[3px] flex items-center  justify-center z-[99999]">
      <main
        className="max-h-[95vh] min-h-[70vh] overflow-y-scroll snap w-fit h-fit z-50"
        style={{
          minWidth: isMobile ? "100%" : `${width}%`,
          maxWidth: isMobile ? "100%" : `${max}%`,
          height: `${height}`,
        }}
      >
        <div className="w-full h-full min-h-[70vh] grow bg-white z-50 flex flex-col rounded-[20px]">
          {child}
        </div>
      </main>
    </main>
  );
}
