"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BookOpenText, ExternalLink, Library, Trash2, Upload } from "lucide-react";
import { CenteredMessage, PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ACCEPTED_FILES, extractBook } from "@/lib/extract-text";
import { addBook, deleteBook, listBooks, type Book } from "@/lib/library";
import { cn } from "@/lib/utils";

const FREE_SOURCES = [
  {
    name: "Wikisource",
    href: "https://fr.wikisource.org/wiki/Wikisource:Accueil",
    description: "Des milliers d'œuvres françaises relues, téléchargeables en EPUB.",
  },
  {
    name: "Ebooks libres et gratuits",
    href: "https://www.ebooksgratuits.com",
    description: "Classiques français du domaine public, mis en page avec soin.",
  },
  {
    name: "Bibliothèque numérique romande",
    href: "https://ebooks-bnr.com",
    description: "Littérature francophone du domaine public, en EPUB et PDF.",
  },
  {
    name: "Project Gutenberg",
    href: "https://www.gutenberg.org",
    description: "Plus de 75 000 livres du domaine public, surtout en anglais.",
  },
  {
    name: "Standard Ebooks",
    href: "https://standardebooks.org",
    description: "Classiques anglais du domaine public, soigneusement corrigés.",
  },
  {
    name: "Gallica",
    href: "https://gallica.bnf.fr",
    description: "Les collections de la BnF. Beaucoup de PDF sont des scans sans texte.",
  },
];

function BookRow({ book, onDelete }: { book: Book; onDelete: () => void }) {
  const progress = book.wordCount ? Math.min(book.position / book.wordCount, 1) : 0;

  return (
    <div className="grid items-center gap-4 rounded-lg bg-muted p-4 md:grid-cols-4">
      <div className="grid gap-1 md:col-span-2">
        <span className="truncate text-xl">{book.title}</span>
        <span className="truncate text-muted-foreground">{book.author || "auteur inconnu"}</span>
      </div>
      <div className="grid gap-2">
        <div className="h-1 overflow-hidden rounded-full bg-background">
          <div className="h-full bg-primary" style={{ width: `${progress * 100}%` }} />
        </div>
        <span className="text-xs text-muted-foreground">
          {Math.floor(progress * 100)}% · {book.wordCount.toLocaleString("fr")} mots
        </span>
      </div>
      <div className="flex justify-end gap-2">
        <Button asChild>
          <Link href={`/?book=${book.id}`}>
            <BookOpenText />
            {book.position > 0 ? "reprendre" : "lire"}
          </Link>
        </Button>
        <Button size="icon" aria-label="supprimer" onClick={onDelete}>
          <Trash2 />
        </Button>
      </div>
    </div>
  );
}

export default function LibraryPage() {
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
      setStatus({ msg: `import de ${file.name}...`, error: false });
      try {
        await addBook(await extractBook(file));
        setStatus({ msg: `${file.name} ajouté`, error: false });
      } catch (e) {
        setStatus({ msg: `${file.name} : ${(e as Error).message}`, error: true });
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
            bibliothèque
          </h2>
          <Button onClick={() => input.current?.click()}>
            <Upload />
            importer un livre
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
        <p className="text-muted-foreground">
          PDF, EPUB ou TXT. Les livres restent dans ton navigateur : rien n&apos;est envoyé sur un
          serveur, et ta position de lecture est gardée pour reprendre là où tu t&apos;es arrêté.
        </p>
        {status.msg && (
          <p className={cn("text-sm", status.error ? "text-destructive" : "text-muted-foreground")}>
            {status.msg}
          </p>
        )}
        {books === null ? (
          <CenteredMessage>chargement...</CenteredMessage>
        ) : books.length === 0 ? (
          <CenteredMessage>aucun livre pour l&apos;instant</CenteredMessage>
        ) : (
          <div className="grid gap-2">
            {books.map((book) => (
              <BookRow key={book.id} book={book} onDelete={() => setToDelete(book)} />
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-4">
        <h2 className="text-2xl text-muted-foreground">livres gratuits</h2>
        <p>
          Des sites où trouver des livres du domaine public, légalement et gratuitement. Préfère
          l&apos;EPUB quand il existe : le texte en sort plus propre qu&apos;un PDF.
        </p>
        <div className="grid gap-2 md:grid-cols-2">
          {FREE_SOURCES.map((s) => (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="grid gap-1 rounded-lg bg-muted p-4 transition-colors duration-125 hover:bg-accent"
            >
              <span className="flex items-center gap-2 text-primary">
                {s.name}
                <ExternalLink className="size-4" />
              </span>
              <span className="text-sm text-muted-foreground">{s.description}</span>
            </a>
          ))}
        </div>
      </section>

      <Dialog open={!!toDelete} onOpenChange={(open) => !open && setToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>supprimer le livre</DialogTitle>
          </DialogHeader>
          <p>
            Retirer <span className="text-primary">{toDelete?.title}</span> de ta bibliothèque ? Ta
            position de lecture sera perdue.
          </p>
          <Button
            variant="destructive"
            onClick={async () => {
              if (toDelete) await deleteBook(toDelete.id);
              setToDelete(null);
              await refresh();
            }}
          >
            supprimer
          </Button>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
