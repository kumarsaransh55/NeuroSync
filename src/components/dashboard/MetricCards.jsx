import React from "react";
import { TrendingUp, ArrowUpRight } from "lucide-react";

const metrics = [
  {
    title: "Total Projects",
    value: "24",
    trend: "Increased from last month",
    trendIcon: TrendingUp,
    primary: true,
  },
  {
    title: "Ended Projects",
    value: "10",
    trend: "Increased from last month",
    trendIcon: TrendingUp,
    primary: false,
  },
  {
    title: "Running Projects",
    value: "12",
    trend: "Increased from last month",
    trendIcon: TrendingUp,
    primary: false,
  },
  {
    title: "Pending Project",
    value: "2",
    trend: "On Discuss",
    trendIcon: TrendingUp, // or different icon if spec had it, using same for now
    primary: false,
  },
];

export default function MetricCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className={`relative p-6 rounded-[var(--radius-card)] flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] ${
            metric.primary
              ? "bg-gradient-to-br from-[var(--color-brand-start)] via-[var(--color-brand-mid)] to-[var(--color-brand-end)] text-white shadow-[var(--shadow-card)]"
              : "bg-[var(--color-card-bg)] text-[var(--color-text-primary)] border border-[var(--color-border-color)] shadow-sm"
          }`}
        >
          {/* Top Row: Title + Arrow */}
          <div className="flex justify-between items-start mb-4">
            <h3
              className={`text-[16px] font-semibold ${metric.primary ? "text-white" : "text-[var(--color-text-secondary)]"}`}
            >
              {metric.title}
            </h3>
            <button
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                metric.primary
                  ? "border-white/30 text-white hover:bg-white/10"
                  : "border-[var(--color-border-color)] text-[var(--color-text-primary)] hover:border-[var(--color-text-primary)]"
              }`}
            >
              <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="mb-6">
            <span
              className={`text-[32px] font-bold tracking-tight ${metric.primary ? "text-white" : "text-[var(--color-text-primary)]"}`}
            >
              {metric.value}
            </span>
          </div>

          {/* Bottom Trend */}
          <div className="flex items-center gap-2">
            <span
              className={`flex justify-center items-center w-5 h-5 rounded-md ${
                metric.primary ? "bg-white/20" : "bg-[var(--color-success-bg)]"
              }`}
            >
              <TrendingUp
                size={12}
                className={
                  metric.primary
                    ? "text-white"
                    : "text-[var(--color-brand-start)]"
                }
              />
            </span>
            <span
              className={`text-[12px] font-medium ${metric.primary ? "text-[var(--color-success-bg)]" : "text-[var(--color-text-secondary)]"}`}
            >
              {metric.trend}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
