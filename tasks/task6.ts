import { OpenAIEmbeddings } from "langchain/embeddings/openai";

export async function handleTask() {
  const phraseToEmbedd = "Hawaiian pizza";
  const embedding = new OpenAIEmbeddings({
    modelName: "text-embedding-ada-002",
  });
  return embedding.embedQuery(phraseToEmbedd);
}
