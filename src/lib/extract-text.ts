export type ExtractedBook = { title: string; author: string; text: string };

export const ACCEPTED_FILES = ".pdf,.epub,.txt,application/pdf,application/epub+zip,text/plain";

function baseName(file: File) {
  return file.name.replace(/\.[^.]+$/, "");
}

// Joins hyphenated line breaks ("lec-\nture" → "lecture") and collapses whitespace.
export function cleanText(text: string) {
  return text
    .replace(/(\p{L})-\n(\p{Ll})/gu, "$1$2")
    .replace(/\s+/g, " ")
    .trim();
}

async function extractPdf(file: File): Promise<ExtractedBook> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();

  const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  const pages: string[][] = [];
  for (let n = 1; n <= pdf.numPages; n++) {
    const page = await pdf.getPage(n);
    const content = await page.getTextContent();
    let line = "";
    const lines: string[] = [];
    for (const item of content.items) {
      if (!("str" in item)) continue;
      line += item.str;
      if (item.hasEOL) {
        lines.push(line.trim());
        line = "";
      }
    }
    lines.push(line.trim());
    pages.push(lines.filter(Boolean));
    page.cleanup();
  }

  // Running headers and footers: the first or last 2 lines of a page, repeating on many pages
  // (digits ignored, so "Chapitre 3 — 12" matches "Chapitre 3 — 13"). Page numbers are bare digits.
  const key = (l: string) => l.replace(/\d+/g, "#").toLowerCase();
  const edge = (lines: string[], i: number) => i < 2 || i >= lines.length - 2;
  const seen = new Map<string, number>();
  for (const lines of pages) {
    const keys = new Set(lines.filter((_, i) => edge(lines, i)).map(key));
    for (const k of keys) seen.set(k, (seen.get(k) ?? 0) + 1);
  }
  const isNoise = (lines: string[], l: string, i: number) =>
    /^\d+$/.test(l) ||
    (edge(lines, i) && pages.length >= 5 && (seen.get(key(l)) ?? 0) >= pages.length * 0.3);
  const body = pages
    .map((lines) => lines.filter((l, i) => !isNoise(lines, l, i)).join("\n"))
    .join("\n");

  const { info } = (await pdf.getMetadata().catch(() => ({ info: {} }))) as {
    info: { Title?: string; Author?: string };
  };
  await pdf.loadingTask.destroy();
  return {
    title: info.Title?.trim() || baseName(file),
    author: info.Author?.trim() ?? "",
    text: cleanText(body),
  };
}

const BLOCKS = "p,div,h1,h2,h3,h4,h5,h6,li,blockquote,tr,br,section";

function parseXml(source: string, type: DOMParserSupportedType) {
  const doc = new DOMParser().parseFromString(source, type);
  return doc.querySelector("parsererror") ? null : doc;
}

async function extractEpub(file: File): Promise<ExtractedBook> {
  const { default: JSZip } = await import("jszip");
  const zip = await JSZip.loadAsync(file);
  const read = (path: string) => zip.file(decodeURIComponent(path))?.async("string");

  const container = parseXml((await read("META-INF/container.xml")) ?? "", "application/xml");
  const opfPath = container?.querySelector("rootfile")?.getAttribute("full-path");
  const opf = opfPath && parseXml((await read(opfPath)) ?? "", "application/xml");
  if (!opfPath || !opf) throw new Error("epub invalide");

  const dir = opfPath.includes("/") ? opfPath.slice(0, opfPath.lastIndexOf("/") + 1) : "";
  const hrefs = new Map(
    [...opf.querySelectorAll("manifest > item")].map((i) => [
      i.getAttribute("id"),
      i.getAttribute("href"),
    ]),
  );

  const parts: string[] = [];
  for (const ref of opf.querySelectorAll("spine > itemref")) {
    const href = hrefs.get(ref.getAttribute("idref"));
    const source = href && (await read(dir + href.split("#")[0]));
    if (!source) continue;
    const doc =
      parseXml(source, "application/xhtml+xml") ??
      new DOMParser().parseFromString(source, "text/html");
    const body = doc.querySelector("body");
    if (!body) continue;
    body.querySelectorAll("script,style").forEach((el) => el.remove());
    body.querySelectorAll(BLOCKS).forEach((el) => el.append(" "));
    parts.push(body.textContent ?? "");
  }

  const meta = (tag: string) =>
    opf.getElementsByTagNameNS("http://purl.org/dc/elements/1.1/", tag)[0]?.textContent?.trim();
  return {
    title: meta("title") || baseName(file),
    author: meta("creator") ?? "",
    text: cleanText(parts.join(" ")),
  };
}

export async function extractBook(file: File): Promise<ExtractedBook> {
  const name = file.name.toLowerCase();
  const book = name.endsWith(".pdf")
    ? await extractPdf(file)
    : name.endsWith(".epub")
      ? await extractEpub(file)
      : { title: baseName(file), author: "", text: cleanText(await file.text()) };
  if (!book.text) {
    throw new Error("aucun texte trouvé (un PDF scanné ne contient que des images)");
  }
  return book;
}
