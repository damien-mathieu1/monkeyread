import { tokenize } from "@/lib/rsvp";
import type { ExtractedBook } from "@/lib/extract-text";

export type Book = {
  id: string;
  title: string;
  author: string;
  wordCount: number;
  /** Index of the next word to read. */
  position: number;
  addedAt: number;
  lastReadAt: number | null;
};

// Texts live apart from metadata so saving the reading position never rewrites a whole book.
const DB_NAME = "monkeyread";
const BOOKS = "books";
const TEXTS = "texts";

let dbPromise: Promise<IDBDatabase> | undefined;

function db() {
  dbPromise ??= new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(BOOKS, { keyPath: "id" });
      req.result.createObjectStore(TEXTS);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

async function run<T>(
  stores: string[],
  mode: IDBTransactionMode,
  fn: (tx: IDBTransaction) => IDBRequest<T> | void,
): Promise<T> {
  const tx = (await db()).transaction(stores, mode);
  const req = fn(tx);
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve(req ? req.result : (undefined as T));
    tx.onerror = tx.onabort = () => reject(tx.error);
  });
}

export async function listBooks() {
  const books = await run<Book[]>([BOOKS], "readonly", (tx) => tx.objectStore(BOOKS).getAll());
  return books.sort((a, b) => (b.lastReadAt ?? b.addedAt) - (a.lastReadAt ?? a.addedAt));
}

export async function getBook(id: string) {
  const [book, text] = await Promise.all([
    run<Book | undefined>([BOOKS], "readonly", (tx) => tx.objectStore(BOOKS).get(id)),
    run<string | undefined>([TEXTS], "readonly", (tx) => tx.objectStore(TEXTS).get(id)),
  ]);
  return book && text !== undefined ? { book, text } : null;
}

export async function addBook({ title, author, text }: ExtractedBook) {
  const book: Book = {
    id: crypto.randomUUID(),
    title,
    author,
    wordCount: tokenize(text).length,
    position: 0,
    addedAt: Date.now(),
    lastReadAt: null,
  };
  await run([BOOKS, TEXTS], "readwrite", (tx) => {
    tx.objectStore(BOOKS).put(book);
    tx.objectStore(TEXTS).put(text, book.id);
  });
  return book;
}

export async function savePosition(id: string, position: number) {
  await run([BOOKS], "readwrite", (tx) => {
    const store = tx.objectStore(BOOKS);
    const req = store.get(id);
    req.onsuccess = () => {
      if (req.result) store.put({ ...req.result, position, lastReadAt: Date.now() });
    };
  });
}

export async function deleteBook(id: string) {
  await run([BOOKS, TEXTS], "readwrite", (tx) => {
    tx.objectStore(BOOKS).delete(id);
    tx.objectStore(TEXTS).delete(id);
  });
}
