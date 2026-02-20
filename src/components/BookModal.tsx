import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Book, BookStatus, STATUS_LABELS } from "@/types/book";
import { deleteBook, updateBook } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface BookModalProps {
  book: Book | null;
  open: boolean;
  onClose: () => void;
}

const BookModal = ({ book, open, onClose }: BookModalProps) => {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<BookStatus>(
    book?.status || "want_to_read",
  );
  const [lentTo, setLentTo] = useState(book?.lentTo || "");

  const updateMutation = useMutation({
    mutationFn: () =>
      updateBook(book!.id, {
        status,
        lentTo: status === "lent" ? lentTo : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast({ title: "Book updated!" });
      onClose();
    },
    onError: () => toast({ title: "Failed to update", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteBook(book!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast({ title: "Book removed" });
      onClose();
    },
    onError: () => toast({ title: "Failed to delete", variant: "destructive" }),
  });

  // Sync state when book changes or modal opens
  useEffect(() => {
    if (book && open) {
      setStatus(book.status);
      setLentTo(book.lentTo || "");
    }
  }, [book, open]);

  if (!book) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">{book.title}</DialogTitle>
          <DialogDescription>
            {book.authors?.join(", ") || "Unknown Author"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4">
          {book.thumbnailUrl && (
            <img
              src={book.thumbnailUrl}
              alt={book.title}
              className="h-32 w-auto rounded-md object-cover shadow"
            />
          )}
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as BookStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  side="bottom"
                  sideOffset={4}
                >
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {status === "lent" && (
              <div className="space-y-2">
                <Label>Lent to</Label>
                <Input
                  placeholder="Borrower's name"
                  value={lentTo}
                  onChange={(e) => setLentTo(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="destructive"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
          >
            Delete
          </Button>
          <Button
            onClick={() => updateMutation.mutate()}
            disabled={updateMutation.isPending}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookModal;
