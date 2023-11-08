import { GetTaskResponseT } from "../types/types";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, SystemMessage } from "langchain/schema";
import { getAuthToken, getTask, sendAnswer } from "../common";
import { Document, DocumentInput } from "langchain/document";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { appendFileSync, writeFileSync } from "fs";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { load } from "langchain/load";

interface WhoamIGetTaskResponseT extends GetTaskResponseT {
  hint: string;
}

export async function handleTask(task: WhoamIGetTaskResponseT) {
  const DOC_PATH = "./data/hints.txt";
  writeFileSync(DOC_PATH, "");
  let correctAnswer;
  let answer = false;
  const { hint } = task;
  const documents: DocumentInput<Record<string, any>>[] = [];
  documents.push(new Document({ pageContent: hint }));
  writeFileSync(DOC_PATH, JSON.stringify(documents));
  while (answer === false) {
    console.log({ documents });
    const loader = new TextLoader(DOC_PATH);
    const [doc] = await loader.load();
    // const vectorStore = await MemoryVectorStore.fromDocuments(
    //   documents,
    //   new OpenAIEmbeddings(),
    // );

    console.log({ doc });
    const chat = new ChatOpenAI({
      modelName: "gpt-4",
    });
    const prompt = new SystemMessage(`
  Based on given hints try to guess who am I talking about.
  If you dont know just return 0 and nothing else.
  Answer only when you are 100% sure. 
  Hints:###${doc.pageContent}###
  `);
    const { content } = await chat.call([prompt]);
    console.log(content, "here");
    if (content === "0") {
      const authToken = await getAuthToken("whoami");
      const task: WhoamIGetTaskResponseT = await getTask(authToken);
      const { hint: newHint } = task;
      console.log({ newHint });
      documents.push(new Document({ pageContent: newHint }));
      appendFileSync(DOC_PATH, JSON.stringify(documents));
    } else {
      correctAnswer = content;
      answer = true;
    }
  }
  return correctAnswer;
}
