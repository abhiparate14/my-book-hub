import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { searchGoogleBooks, saveBook } from "@/lib/api";
import { GoogleBooksVolume, BookStatus } from "@/types/book";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Plus, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SearchPanelProps {
  open: boolean;
  onClose: () => void;
}

const SearchPanel = ({ open, onClose }: SearchPanelProps) => {
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["googleBooks", searchTerm],
    queryFn: () => searchGoogleBooks(searchTerm),
    enabled: searchTerm.length > 2,
  });

  const addMutation = useMutation({
    mutationFn: (volume: GoogleBooksVolume) =>
      saveBook({
        googleBooksId: volume.id,
        title: volume.volumeInfo.title,
        authors: volume.volumeInfo.authors || [],
        thumbnailUrl: volume.volumeInfo.imageLinks?.thumbnail || "",
        status: "want_to_read" as BookStatus,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast({ title: "Book added to library!" });
    },
    onError: () => toast({ title: "Failed to add book", variant: "destructive" }),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(query);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">Search Books</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSearch} className="mb-8 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title, author, or ISBN..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>
          <Button type="submit" disabled={query.length < 3}>
            Search
          </Button>
        </form>

        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        )}

        <div className="space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-2">
          {data?.items?.map((volume) => (
            <Card key={volume.id} className="flex gap-4 p-4">
              <div className="h-20 w-14 flex-shrink-0 overflow-hidden rounded bg-muted">
                {volume.volumeInfo.imageLinks?.thumbnail ? (
                  <img
                    src={volume.volumeInfo.imageLinks.thumbnail}
                    alt={volume.volumeInfo.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground p-1 text-center">
                    No cover
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-sm font-semibold leading-tight line-clamp-1">
                  {volume.volumeInfo.title}
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                  {volume.volumeInfo.authors?.join(", ") || "Unknown Author"}
                </p>
                {volume.volumeInfo.publishedDate && (
                  <p className="text-[10px] text-muted-foreground">
                    {volume.volumeInfo.publishedDate}
                  </p>
                )}
              </div>
              <Button
                size="sm"
                onClick={() => addMutation.mutate(volume)}
                disabled={addMutation.isPending}
                className="flex-shrink-0"
              >
                <Plus className="mr-1 h-3.5 w-3.5" />
                Add
              </Button>
            </Card>
          ))}

          {data && !data.items?.length && searchTerm && (
            <div className="py-12 text-center text-muted-foreground">
              No books found for "{searchTerm}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPanel;
