import type { Book, BookStatus, GoogleBooksResponse } from "@/types/book";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const getAuthToken = () => authToken;

const authHeaders = (): HeadersInit => ({
  "Content-Type": "application/json",
  ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
});

export async function checkSession(): Promise<{ token: string } | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/check-session`, {
      credentials: "include",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch {
    return null;
  }
}

export function getLoginUrl(): string {
  return `${BACKEND_URL}/login`;
}

export async function fetchBooks(): Promise<Book[]> {
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
  data: { status: BookStatus; lentTo?: string }
): Promise<Book> {
  const res = await fetch(`${BACKEND_URL}/api/app-library/books/${bookId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update book");
  return res.json();
}

export async function deleteBook(bookId: string): Promise<void> {
  const res = await fetch(`${BACKEND_URL}/api/app-library/books/${bookId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete book");
}

export async function searchGoogleBooks(query: string): Promise<GoogleBooksResponse> {
  const res = await fetch(
    `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&maxResults=12`
  );
  if (!res.ok) throw new Error("Failed to search books");
  return res.json();
}
