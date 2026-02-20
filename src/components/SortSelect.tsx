import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

export type SortOption = "title" | "author" | "date";

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const SortSelect = ({ value, onChange }: SortSelectProps) => {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as SortOption)}>
      <SelectTrigger className="w-[150px]">
        <ArrowUpDown className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="title">Title</SelectItem>
        <SelectItem value="author">Author</SelectItem>
        <SelectItem value="date">Date Added</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default SortSelect;
