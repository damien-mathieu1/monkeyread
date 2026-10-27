"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BookOpenText, ExternalLink, Library, Trash2, Upload } from "lucide-react";
import { CenteredMessage, PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ACCEPTED_FILES, extractBook, extractErrorCode } from "@/lib/extract-text";
import { addBook, deleteBook, listBooks, type Book } from "@/lib/library";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";
import { useT } from "@/lib/i18n";

const FREE_SOURCES = [
  {
    id: "wikisource",
    name: "Wikisource",
    href: "https://fr.wikisource.org/wiki/Wikisource:Accueil",
  },
  {
    id: "ebooksgratuits",
    name: "Ebooks libres et gratuits",
    href: "https://www.ebooksgratuits.com",
  },
  {
    id: "bnr",
    name: "Bibliothèque numérique romande",
    href: "https://ebooks-bnr.com",
  },
  {
    id: "gutenberg",
    name: "Project Gutenberg",
    href: "https://www.gutenberg.org",
  },
  {
    id: "standardEbooks",
    name: "Standard Ebooks",
    href: "https://standardebooks.org",
  },
  {
    id: "gallica",
    name: "Gallica",
    href: "https://gallica.bnf.fr",
  },
] as const;

function BookRow({ book, onDelete }: { book: Book; onDelete: () => void }) {
  const t = useT();
  const progress = book.wordCount ? Math.min(book.position / book.wordCount, 1) : 0;

  return (
    <div className="grid items-center gap-4 rounded-lg bg-muted p-4 md:grid-cols-4">
      <div className="grid gap-1 md:col-span-2">
        <span className="truncate text-xl">{book.title}</span>
        <span className="truncate text-muted-foreground">
          {book.author || t.library.unknownAuthor}
        </span>
      </div>
      <div className="grid gap-2">
        <div className="h-1 overflow-hidden rounded-full bg-background">
          <div className="h-full bg-primary" style={{ width: `${progress * 100}%` }} />
        </div>
        <span className="text-xs text-muted-foreground">
          {Math.floor(progress * 100)}% · {t.library.words(formatNumber(book.wordCount))}
        </span>
      </div>
      <div className="flex justify-end gap-2">
        <Button asChild>
          <Link href={`/?book=${book.id}`}>
            <BookOpenText />
            {book.position > 0 ? t.library.resume : t.library.read}
          </Link>
        </Button>
        <Button size="icon" aria-label={t.common.delete} onClick={onDelete}>
          <Trash2 />
        </Button>
      </div>
    </div>
  );
}

export default function LibraryPage() {
  const t = useT();
  const [books, setBooks] = useState<Book[] | null>(null);
  const [status, setStatus] = useState({ msg: "", error: false });
  const [toDelete, setToDelete] = useState<Book | null>(null);
  const input = useRef<HTMLInputElement>(null);

  const refresh = () =>
    listBooks()
      .then(setBooks)
      .catch(() => setBooks([]));

  useEffect(() => {
    void refresh();
  }, []);

  const importFiles = async (files: File[]) => {
    for (const file of files) {
      setStatus({ msg: t.library.importing(file.name), error: false });
      try {
        await addBook(await extractBook(file));
        setStatus({ msg: t.library.added(file.name), error: false });
      } catch (e) {
        setStatus({
          msg: `${file.name} : ${t.library.errors[extractErrorCode(e)]}`,
          error: true,
        });
      }
    }
    await refresh();
  };

  return (
    <PageShell>
      <section className="grid gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <h2 className="flex flex-1 items-center gap-2 text-4xl text-muted-foreground">
            <Library className="size-8" />
            {t.library.title}
          </h2>
          <Button onClick={() => input.current?.click()}>
            <Upload />
            {t.library.import}
          </Button>
          <input
            ref={input}
            type="file"
            accept={ACCEPTED_FILES}
            multiple
            hidden
            onChange={(e) => {
              void importFiles([...(e.target.files ?? [])]);
              e.target.value = "";
            }}
          />
        </div>
        <p className="text-muted-foreground">{t.library.intro}</p>
        {status.msg && (
          <p className={cn("text-sm", status.error ? "text-destructive" : "text-muted-foreground")}>
            {status.msg}
          </p>
        )}
        {books === null ? (
          <CenteredMessage>{t.common.loading}</CenteredMessage>
        ) : books.length === 0 ? (
          <CenteredMessage>{t.library.empty}</CenteredMessage>
        ) : (
          <div className="grid gap-2">
            {books.map((book) => (
              <BookRow key={book.id} book={book} onDelete={() => setToDelete(book)} />
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-4">
        <h2 className="text-2xl text-muted-foreground">{t.library.freeTitle}</h2>
        <p>{t.library.freeIntro}</p>
        <div className="grid gap-2 md:grid-cols-2">
          {FREE_SOURCES.map((src) => (
            <a
              key={src.href}
              href={src.href}
              target="_blank"
              rel="noreferrer"
              className="grid gap-1 rounded-lg bg-muted p-4 transition-colors duration-125 hover:bg-accent"
            >
              <span className="flex items-center gap-2 text-primary">
                {src.name}
                <ExternalLink className="size-4" />
              </span>
              <span className="text-sm text-muted-foreground">{t.library.sources[src.id]}</span>
            </a>
          ))}
        </div>
      </section>

      <Dialog open={!!toDelete} onOpenChange={(open) => !open && setToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.library.deleteTitle}</DialogTitle>
          </DialogHeader>
          <p>{t.library.deleteBody(<span className="text-primary">{toDelete?.title}</span>)}</p>
          <Button
            variant="destructive"
            onClick={async () => {
              if (toDelete) await deleteBook(toDelete.id);
              setToDelete(null);
              await refresh();
            }}
          >
            {t.common.delete}
          </Button>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
