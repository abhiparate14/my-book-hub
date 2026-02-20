export type BookStatus = "want_to_read" | "bought" | "read" | "lent";

export interface Book {
  id: string;
  googleBooksId: string;
  title: string;
  authors: string[];
  thumbnailUrl: string;
  status: BookStatus;
  lentTo?: string;
}

export interface GoogleBooksVolume {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    description?: string;
    publishedDate?: string;
  };
}

export interface GoogleBooksResponse {
  totalItems: number;
  items?: GoogleBooksVolume[];
}

export const STATUS_LABELS: Record<BookStatus, string> = {
  want_to_read: "Want to Read",
  bought: "Bought",
  read: "Read",
  lent: "Lent",
};

export const STATUS_COLORS: Record<BookStatus, string> = {
  want_to_read: "bg-status-want",
  bought: "bg-status-bought",
  read: "bg-status-read",
  lent: "bg-status-lent",
};
