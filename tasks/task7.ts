import { OpenAIWhisperAudio } from "langchain/document_loaders/fs/openai_whisper_audio";

export async function handleTask() {
  const filePath = "./data/testaudio.mp3";

  const loader = new OpenAIWhisperAudio(filePath);

  const docs = await loader.load();

  return docs[0].pageContent;
}
