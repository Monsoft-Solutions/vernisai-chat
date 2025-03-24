import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { BadgeCheck, TrendingUp, TrendingDown } from "lucide-react";

// Enhanced chart component with better visual elements
const EnhancedChart: React.FC<{ data: { date: string; value: number }[] }> = ({
  data,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Check if data is empty and provide fallbacks
  if (!data.length) {
    return (
      <div className="w-full h-40 flex items-center justify-center text-text-tertiary">
        No usage data available for the selected period.
      </div>
    );
  }

  // Find the max value for scaling
  const maxValue = Math.max(...data.map((item) => item.value)) || 1; // Fallback to 1 if all values are 0

  // Calculate trend (comparing first and last data points)
  const trend =
    data.length > 1 ? data[data.length - 1].value > data[0].value : false;

  // Find the current day's usage percentage compared to the max
  const currentPercentage =
    maxValue > 0
      ? Math.round((data[data.length - 1].value / maxValue) * 100)
      : 0;

  // Calculate day-to-day percentage change with proper error handling
  const percentageChange =
    data.length > 1 && data[data.length - 2].value !== 0
      ? Math.round(
          ((data[data.length - 1].value - data[data.length - 2].value) /
            Math.max(data[data.length - 2].value, 1)) *
            100,
        )
      : 0;

  return (
    <>
      <div className="w-full mb-4 bg-background-secondary p-3 rounded-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <div className="text-sm text-text-tertiary mb-1">Current Usage</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold">
                {data[data.length - 1].value}
              </div>
              <div
                className={`text-xs px-2 py-1 rounded-full flex items-center ${percentageChange >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
              >
                {percentageChange >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {percentageChange >= 0 ? "+" : ""}
                {percentageChange}%
              </div>
            </div>
          </div>
          <div className="flex items-center mt-2 sm:mt-0">
            <BadgeCheck
              className={`h-5 w-5 mr-2 ${currentPercentage > 80 ? "text-amber-500" : "text-green-500"}`}
            />
            <span className="text-sm">{currentPercentage}% of limit used</span>
          </div>
        </div>
      </div>

      <div className="w-full h-40 flex items-end space-x-0.5 relative">
        {data.map((item, index) => {
          const height =
            maxValue > 0 ? `${(item.value / maxValue) * 100}%` : "0%";
          const isActive = hoveredIndex === index;
          const formattedDate = new Date(item.date).toLocaleDateString(
            "en-US",
            {
              month: "short",
              day: "numeric",
            },
          );

          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center group"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className={`w-full rounded-t transition-all ${
                  isActive
                    ? "bg-primary"
                    : trend
                      ? "bg-primary/60"
                      : "bg-primary/40"
                }`}
                style={{ height }}
              ></div>
              {/* Only show date labels on every 3rd bar or when hovered for cleaner UI */}
              {(index % 3 === 0 || isActive) && (
                <div
                  className={`text-[8px] sm:text-[10px] mt-1 text-text-tertiary whitespace-nowrap transform rotate-45 origin-left sm:transform-none ${isActive ? "font-medium text-text-primary" : ""}`}
                >
                  {formattedDate}
                </div>
              )}

              {/* Tooltip */}
              {isActive && (
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-background-primary shadow-lg border rounded px-3 py-2 text-xs z-10 pointer-events-none">
                  <div className="font-medium">{formattedDate}</div>
                  <div className="flex justify-between gap-4 items-center">
                    <span>Messages:</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                  {index > 0 && data[index - 1].value > 0 && (
                    <div className="flex justify-between gap-4 items-center mt-1 text-[10px]">
                      <span>vs previous:</span>
                      <span
                        className={`${item.value > data[index - 1].value ? "text-green-600" : "text-red-600"}`}
                      >
                        {item.value > data[index - 1].value ? "↑" : "↓"}
                        {Math.abs(item.value - data[index - 1].value)}(
                        {Math.round(
                          ((item.value - data[index - 1].value) /
                            Math.max(data[index - 1].value, 1)) *
                            100,
                        )}
                        %)
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

type UsageChartProps = {
  data: {
    date: string;
    value: number;
  }[];
  title: string;
};

export const UsageChart: React.FC<UsageChartProps> = ({ data, title }) => {
  const [timeRange, setTimeRange] = useState<"week" | "month">("week");

  // Filter data based on the selected time range
  const filteredData =
    timeRange === "week"
      ? data.slice(-7) // Last 7 days
      : data; // Full month

  // Calculate total and average metrics with proper empty data handling
  const totalMessages =
    filteredData.length > 0
      ? filteredData.reduce((sum, item) => sum + item.value, 0)
      : 0;
  const averagePerDay =
    filteredData.length > 0
      ? Math.round(totalMessages / filteredData.length)
      : 0;
  const maxDay =
    filteredData.length > 0
      ? filteredData.reduce(
          (max, item) => (item.value > max.value ? item : max),
          filteredData[0],
        )
      : { date: new Date().toISOString().split("T")[0], value: 0 };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between px-6">
        <CardTitle>{title}</CardTitle>
        <div className="flex space-x-1">
          <Button
            variant={timeRange === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("week")}
          >
            Week
          </Button>
          <Button
            variant={timeRange === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("month")}
          >
            Month
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-6 pt-0 pb-6 flex-grow">
        <EnhancedChart data={filteredData} />

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div className="bg-background-secondary p-3 rounded-lg">
            <div className="text-text-tertiary mb-1">Total Messages</div>
            <div className="text-lg font-medium">{totalMessages}</div>
          </div>
          <div className="bg-background-secondary p-3 rounded-lg">
            <div className="text-text-tertiary mb-1">Daily Average</div>
            <div className="text-lg font-medium">{averagePerDay}</div>
          </div>
          <div className="bg-background-secondary p-3 rounded-lg">
            <div className="text-text-tertiary mb-1">Peak Day</div>
            <div className="text-lg font-medium">{maxDay.value}</div>
            <div className="text-[10px] text-text-tertiary">
              {new Date(maxDay.date).toLocaleDateString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
