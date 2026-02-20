import type { Book, BookStatus, GoogleBooksResponse } from "@/types/book";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";
const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const getAuthToken = () => authToken;

const isPreviewMode = () => !import.meta.env.VITE_BACKEND_URL;

const authHeaders = (): HeadersInit => ({
  "Content-Type": "application/json",
  ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
});

// --- In-memory mock store for preview mode ---
let mockBooks: Book[] = [];
let mockIdCounter = 1;

function getMockBooks(): Book[] {
  return [...mockBooks];
}

function addMockBook(book: Omit<Book, "id">): Book {
  const newBook: Book = { ...book, id: String(mockIdCounter++) };
  mockBooks.push(newBook);
  return newBook;
}

function updateMockBook(
  id: string,
  data: { status: BookStatus; lentTo?: string },
): Book {
  const idx = mockBooks.findIndex((b) => b.id === id);
  if (idx === -1) throw new Error("Book not found");
  mockBooks[idx] = { ...mockBooks[idx], ...data };
  return mockBooks[idx];
}

function deleteMockBook(id: string): void {
  mockBooks = mockBooks.filter((b) => b.id !== id);
}

// --- API functions ---

export async function fetchBooks(): Promise<Book[]> {
  if (isPreviewMode()) return getMockBooks();
  const res = await fetch(`${BACKEND_URL}/api/app-library/books`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch books");
  return res.json();
}

export async function saveBook(book: {
  googleBooksId: string;
  title: string;
  authors: string[];
  thumbnailUrl: string;
  status: BookStatus;
}): Promise<Book> {
  if (isPreviewMode()) return addMockBook(book);
  const res = await fetch(`${BACKEND_URL}/api/app-library/books`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error("Failed to save book");
  return res.json();
}

export async function updateBook(
  bookId: string,
  data: { status: BookStatus; lentTo?: string },
): Promise<Book> {
  if (isPreviewMode()) return updateMockBook(bookId, data);
  const res = await fetch(`${BACKEND_URL}/api/app-library/books/${bookId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update book");
  return res.json();
}

export async function deleteBook(bookId: string): Promise<void> {
  if (isPreviewMode()) return deleteMockBook(bookId);
  const res = await fetch(`${BACKEND_URL}/api/app-library/books/${bookId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete book");
}

export async function searchGoogleBooks(
  query: string,
): Promise<GoogleBooksResponse> {
  const res = await fetch(
    `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&maxResults=12`,
  );
  if (!res.ok) throw new Error("Failed to search books");
  return res.json();
}
