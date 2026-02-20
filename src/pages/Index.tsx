import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBooks, deleteBook } from "@/lib/api";
import { Book, BookStatus } from "@/types/book";
import BookCard from "@/components/BookCard";
import BookModal from "@/components/BookModal";
import StatusFilter from "@/components/StatusFilter";
import SearchPanel from "@/components/SearchPanel";
import { Button } from "@/components/ui/button";
import { Search, BookOpen } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [filter, setFilter] = useState<BookStatus | "all">("all");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: books = [], isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: fetchBooks,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast({ title: "Book removed" });
    },
    onError: () => toast({ title: "Failed to delete", variant: "destructive" }),
  });

  const filteredBooks =
    filter === "all" ? books : books.filter((b) => b.status === filter);

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setModalOpen(true);
  };

  const handleDelete = (e: React.MouseEvent, bookId: string) => {
    e.stopPropagation();
    deleteMutation.mutate(bookId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="font-display text-xl font-bold tracking-tight">
              My Library
            </h1>
          </div>
          <Button onClick={() => setSearchOpen(true)} className="gap-2">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search Books</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <StatusFilter active={filter} onChange={setFilter} />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <BookOpen className="mb-4 h-16 w-16 text-muted-foreground/40" />
            <h2 className="font-display text-xl font-semibold text-muted-foreground">
              {filter === "all" ? "Your library is empty" : "No books with this status"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {filter === "all"
                ? "Search and add books to start building your collection"
                : "Change the filter or add more books"}
            </p>
            {filter === "all" && (
              <Button onClick={() => setSearchOpen(true)} className="mt-4 gap-2">
                <Search className="h-4 w-4" />
                Search Books
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onClick={() => handleBookClick(book)}
                onDelete={(e) => handleDelete(e, book.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Search Panel */}
      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Book Modal */}
      <BookModal
        book={selectedBook}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedBook(null);
        }}
      />
    </div>
  );
};

export default Index;
