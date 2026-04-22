import type { ItemCardProps } from "../../types";

/**
 * Formats a date string into a relative time label.
 */
const timeAgo = (dateStr: string): string => {
  const seconds = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 1000
  );
  const intervals: [number, string][] = [
    [31536000, "year"],
    [2592000, "month"],
    [604800, "week"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
  ];
  for (const [secs, label] of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count} ${label}${count > 1 ? "s" : ""} ago`;
  }
  return "Just now";
};

const ItemCard = ({ item, onDetailsClick }: ItemCardProps) => {
  const isLost = item.status === "lost";
  const badgeClasses = isLost
    ? "bg-error-container text-on-error-container"
    : "bg-primary-container text-on-primary-container";

  return (
    <div className="bg-white rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group">
      {/* ── Image ── */}
      <div className="relative h-48 w-full overflow-hidden bg-surface-container-high">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant opacity-40">
              {isLost ? "search" : "inventory_2"}
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span
            className={`${badgeClasses} text-label-sm font-label-sm px-3 py-1 rounded-full uppercase tracking-wider`}
          >
            {item.status}
          </span>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="p-md">
        <h3 className="font-h3 text-h3 text-on-surface mb-xs truncate">
          {item.title}
        </h3>
        <div className="flex items-center gap-1 text-on-surface-variant mb-md">
          <span className="material-symbols-outlined text-[18px]">
            location_on
          </span>
          <span className="text-body-sm font-body-sm">{item.location}</span>
        </div>
        <div className="flex justify-between items-center pt-md border-t border-surface-container">
          <span className="text-label-sm text-on-surface-variant">
            {timeAgo(item.created_at)}
          </span>
          <button
            onClick={() => onDetailsClick?.(item.id)}
            className="text-primary font-label-md hover:underline cursor-pointer"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
