import { GetTaskResponseT } from "../types/types";
import { randomUUID } from "crypto";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { QdrantClient } from "@qdrant/js-client-rest";

interface SearchTaskResponseT extends GetTaskResponseT {
  question: string;
}

interface Data {
  title: string;
  url: string;
  info: string;
  date: string;
}

export async function handleTask(task: SearchTaskResponseT) {
  const { question } = task;

  const COLLECTION_NAME = "AIDEVS TASK";

  //fetch data to embed
  const url = "https://unknow.news/archiwum.json";
  const res = await fetch(url);

  const embeddings = new OpenAIEmbeddings({ maxConcurrency: 5 });
  const queryEmbedding = await embeddings.embedQuery(question);

  const qdrant = new QdrantClient({ url: process.env.QDRANT_URL });
  const result = await qdrant.getCollections();
  const collection = result.collections.find(
    (collection) => collection.name === COLLECTION_NAME,
  );

  // Create collection if doesnt exists
  if (!collection) {
    await qdrant.createCollection(COLLECTION_NAME, {
      vectors: { size: 1536, distance: "Cosine", on_disk: true },
    });
  }

  const collectionInfo = await qdrant.getCollection(COLLECTION_NAME);

  if (!collectionInfo.points_count) {
    const data: Data[] = await res.json();

    let documents = [];

    data.map((entry, index) => {
      if (index < 300) {
        documents.push({
          source: COLLECTION_NAME,
          url: entry.url,
          content: entry.info,
          uuid: randomUUID(),
        });
      }
    });

    //generate embeddings
    const points = [];
    for (const document of documents) {
      const [embedding] = await embeddings.embedDocuments([document.content]);
      points.push({
        id: document.uuid,
        payload: document,
        vector: embedding,
      });
    }

    //insert to database
    try {
      await qdrant.upsert(COLLECTION_NAME, {
        wait: true,
        batch: {
          ids: points.map((point) => point.id),
          vectors: points.map((point) => point.vector),
          payloads: points.map((point) => point.payload),
        },
      });
    } catch (e) {
      console.log(e);
    }
  }
  const search = await qdrant.search(COLLECTION_NAME, {
    vector: queryEmbedding,
    limit: 1,
    filter: {
      must: [
        {
          key: "source",
          match: {
            value: COLLECTION_NAME,
          },
        },
      ],
    },
  });

  if (search[0].payload) {
    return search[0].payload.url;
  }
}
