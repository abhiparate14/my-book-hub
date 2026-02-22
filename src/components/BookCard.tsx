import { Book, BookStatus, STATUS_COLORS, STATUS_LABELS } from "@/types/book";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface BookCardProps {
  book: Book;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

const BookCard = ({ book, onClick, onDelete }: BookCardProps) => {
  return (
    <Card
      className="group relative cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="aspect-[2/3] w-full overflow-hidden bg-muted">
        {book.thumbnailUrl
          ? (
            <img
              src={book.thumbnailUrl}
              alt={book.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          )
          : (
            <div className="flex h-full items-center justify-center p-4">
              <span className="font-display text-sm text-muted-foreground text-center">
                {book.title}
              </span>
            </div>
          )}
      </div>
      <div className="p-3">
        <h3 className="font-display text-sm font-semibold leading-tight line-clamp-2">
          {book.title}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
          {book.authors?.join(", ") || "Unknown Author"}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <Badge
            variant="secondary"
            className={`${
              STATUS_COLORS[book.status]
            } text-primary-foreground text-[10px] px-2 py-0.5`}
          >
            {STATUS_LABELS[book.status]}
          </Badge>
          {book.status === "lent" && book.lentTo && (
            <span className="text-[10px] text-muted-foreground">
              → {book.lentTo}
            </span>
          )}
        </div>
      </div>
      <Button
        variant="destructive"
        size="icon"
        className="absolute right-2 top-2 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={onDelete}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </Card>
  );
};

export default BookCard;
