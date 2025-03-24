import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

// This is a placeholder for a real chart component
// In a real implementation, you'd use a library like Recharts
const SimpleChart: React.FC<{ data: { date: string; value: number }[] }> = ({
  data,
}) => {
  // Find the max value for scaling
  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <div className="w-full h-40 flex items-end space-x-1">
      {data.map((item, index) => {
        const height = `${(item.value / maxValue) * 100}%`;
        return (
          <div key={index} className="flex-1 flex flex-col items-center group">
            <div
              className="w-full bg-primary/80 rounded-t hover:bg-primary transition-colors"
              style={{ height }}
            >
              <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-background border rounded px-2 py-1 text-xs pointer-events-none">
                {item.date}: {item.value} messages
              </div>
            </div>
          </div>
        );
      })}
    </div>
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
        <SimpleChart data={filteredData} />
        <div className="mt-4 flex justify-between text-xs text-muted-foreground">
          <div>
            Total Messages:{" "}
            {filteredData.reduce((sum, item) => sum + item.value, 0)}
          </div>
          <div>
            Average:{" "}
            {Math.round(
              filteredData.reduce((sum, item) => sum + item.value, 0) /
                filteredData.length,
            )}{" "}
            per day
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
