import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveUrlLoader } from "@langchain/community/document_loaders/web/recursive_url";
import * as cheerio from "cheerio";

export async function loadDocs(pdfPath, websiteUrl) {
  let docs = [];

  // Load PDF
  if (pdfPath) {
    const pdfLoader = new PDFLoader(pdfPath);
    const pdfDocs = await pdfLoader.load();
    docs = docs.concat(
      pdfDocs.map(d => ({
        pageContent: d.pageContent.trim(),
        metadata: {
          source: pdfPath,
          snippet: d.pageContent.slice(0, 150) + "..."
        }
      }))
    );
  }

  // Load Website
  if (websiteUrl) {
    const webLoader = new RecursiveUrlLoader(websiteUrl, {
      extractor: (html) => {
        const $ = cheerio.load(html);
        return $("p, h1, h2, h3")
          .map((_, el) => $(el).text())
          .get()
          .join("\n\n");
      },
      maxDepth: 4,       // keep crawl limited
      maxConcurrency: 5,
      timeout: 10000
    });

    const webDocs = await webLoader.load();

    docs = docs.concat(
      webDocs.map(d => ({
        pageContent: d.pageContent.trim(),
        metadata: {
          source: d.metadata.source ?? websiteUrl,
          snippet: d.pageContent.slice(0, 150) + "..."
        }
      }))
    );
  }

  return docs;
}
