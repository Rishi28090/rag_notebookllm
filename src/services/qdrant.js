import { QdrantClient } from "@qdrant/js-client-rest";
import { embedText } from "./embeddings.js";



const client = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
});

try {
    const result = await client.getCollections();
    console.log('List of collections:', result.collections);
} catch (err) {
    console.error('Could not get collections:', err);
}
const COLLECTION = "rag_docs";

export async function initQdrant() {
  try {
    await client.getCollection(COLLECTION);
    console.log(`✅ Collection "${COLLECTION}" already exists`);
  } catch (err) {
    console.log(`⚠️ Collection "${COLLECTION}" not found. Creating...`);
    await client.createCollection(COLLECTION, {
      vectors: {
        size: 768,   // depends on your embedding model dimension
        distance: "Cosine"
      }
    });
    console.log(`✅ Collection "${COLLECTION}" created`);
  }
}

export async function saveDocsToQdrant(docs) {
    await initQdrant()
;  await client.upsert(COLLECTION, {
    points: await Promise.all(
      docs.map(async (doc, i) => ({
        id: Date.now() + i,
        vector: await embedText(doc.pageContent),
        payload: {
          text: doc.pageContent,
          source: doc.metadata?.source || "pdf",
          snippet: doc.metadata?.snippet || doc.pageContent.slice(0, 100)
        },
      }))
    ),
  });
}

export async function queryQdrant(query) {
  const vector = await embedText(query);
  const results = await client.search(COLLECTION, { vector, limit: 3 });

  return results.map(r => ({
    text: r.payload.text,
    source: r.payload.source,
    snippet: r.payload.snippet
  }));
}
