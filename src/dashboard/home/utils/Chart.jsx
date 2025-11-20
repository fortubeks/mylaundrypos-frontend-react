import { useEffect, useRef, useState } from "react";
// import { transformChartData } from "./functions";
import { useSelector } from "react-redux";

// set all values to 0
const loadingData = [
  { month: "Jan", value: 0 },
  { month: "Feb", value: 0 },
  { month: "Mar", value: 0 },
  { month: "Apr", value: 0 },
  { month: "May", value: 0 },
  { month: "Jun", value: 0 },
  { month: "Jul", value: 0 },
  { month: "Aug", value: 0 },
  { month: "Sep", value: 0 },
  { month: "Oct", value: 0 },
  { month: "Nov", value: 0 },
  { month: "Dec", value: 0 },
];
export default function WarehouseStockChart() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const sidebar = useSelector((state) => state.general.sidebar);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const chartRef = useRef(null);
  const heightRef = useRef(null);

  // const data = loading ? loadingData : transformChartData(chartData);
  const data = loadingData;

  const currentMonth = new Date().toLocaleString("en-US", { month: "short" });
  const currentValue =
    data.find((item) => item.month === currentMonth)?.value || 0;
  const previousValue =
    data.find(
      (item) =>
        item.month ===
        new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleString(
          "en-US",
          { month: "short" }
        )
    )?.value || 0;
  const increase = currentValue - previousValue;

  useEffect(() => {
    if (chartRef.current) {
      setWidth(chartRef.current.offsetWidth);
    }
    if (heightRef.current) {
      setHeight(heightRef.current.offsetHeight);
    }
  }, [chartRef, heightRef, sidebar]);

  const chartWidth = width - 32;
  const chartHeight = height - 40;
  // const barWidth = chartWidth / (data.length + 12);
  // const barSpacing = (chartWidth - data.length * barWidth) / (data.length - 1);
  const barWidth = Math.max(8, (chartWidth - 16) / (data.length * 2 - 1));

  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const valueRange = maxValue - minValue;

  const getBarHeight = (value) => {
    if (valueRange === 0) return chartHeight / 8;
    const normalizedValue = (value - minValue) / valueRange;
    return Math.max(normalizedValue * (chartHeight - 40) + 20, 20);
  };

  // const getBarX = (index) => {
  //   return barSpacing + index * (barWidth + barSpacing);
  // };
  // const getBarX = (index) => {
  //   return index * (barWidth + barSpacing);
  // };
  const getBarX = (index) => {
    return index * (barWidth * 2);
  };

  return (
    <div
      className="rounded-[20px] border border-[#EFEFEF] w-full max-w-full h-[340px] flex flex-col p-4"
      ref={chartRef}
    >
      <div className="flex justify-between items-center gap-10">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-medium text-[#212121]">
            Current Warehouse Stock
          </h2>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-black">
              {currentValue.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-[#878788]">
            Increase {Math.abs(increase / 1000)}K this month
          </p>
        </div>
      </div>

      <div className="h-full flex grow relative" ref={heightRef}>
        <svg width={"100%"} className="grow">
          {data.map((item, index) => {
            const barHeight = getBarHeight(item.value);
            const barX = getBarX(index);
            const isCurrentMonth = item.month === currentMonth;
            const isHovered = hoveredIndex === index;

            return (
              <g key={item.month}>
                <rect
                  x={barX}
                  y={chartHeight - barHeight + 20}
                  width={barWidth}
                  height={barHeight}
                  rx={12}
                  ry={12}
                  fill={isCurrentMonth ? "#000000" : "#D1D5DB"}
                  className="cursor-pointer transition-opacity duration-200"
                  style={{ opacity: isHovered && !isCurrentMonth ? 0.8 : 1 }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />

                {/* Month label */}
                <text
                  x={barX + barWidth / 2}
                  y={chartHeight + 35}
                  textAnchor="middle"
                  className="text-xs fill-gray-500"
                >
                  {item.month}
                </text>
              </g>
            );
          })}
        </svg>

        <div
          className="absolute"
          style={{
            left:
              getBarX(data.findIndex((item) => item.month === currentMonth)) +
              barWidth / 2,
            top: chartHeight - getBarHeight(currentValue) + 20 - 45,
            transform: "translateX(-50%)",
          }}
        >
          <div className="bg-black text-white px-3 py-1 rounded text-sm font-medium">
            {currentValue.toLocaleString()}
          </div>
          <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black mx-auto"></div>
        </div>

        {hoveredIndex !== null && data[hoveredIndex].month !== currentMonth && (
          <div
            className="absolute"
            style={{
              left: getBarX(hoveredIndex) + barWidth / 2,
              top:
                chartHeight - getBarHeight(data[hoveredIndex].value) + 20 - 45,
              transform: "translateX(-50%)",
            }}
          >
            <div className="bg-gray-800 text-white px-3 py-1 rounded text-sm font-medium">
              {data[hoveredIndex].value.toLocaleString()}
            </div>
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800 mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
}
