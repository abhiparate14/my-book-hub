import { BookStatus, STATUS_LABELS } from "@/types/book";
import { cn } from "@/lib/utils";

const FILTERS: Array<{ value: BookStatus | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "want_to_read", label: "Want to Read" },
  { value: "bought", label: "Bought" },
  { value: "read", label: "Read" },
  { value: "lent", label: "Lent" },
];

interface StatusFilterProps {
  active: BookStatus | "all";
  onChange: (filter: BookStatus | "all") => void;
}

const StatusFilter = ({ active, onChange }: StatusFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
            active === f.value
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
};

export default StatusFilter;
