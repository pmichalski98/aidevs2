import { GetTaskResponseT } from "../types/types";
import OpenAI from "openai";
import { HumanMessage, SystemMessage } from "langchain/schema";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { readFileSync } from "fs";

interface OptimalDbTask extends GetTaskResponseT {
  database: string;
}
export async function handleTask(task: OptimalDbTask) {
  const data = readFileSync("./data/optimizedData.txt", "utf-8");
  if (!data) {
    const response = await fetch(task.database);
    let data;
    if (response.ok) {
      data = await response.text();
    }
    const translatePrompt = new SystemMessage(
      "Optimize provided data. " +
        "Try to make it as concise as possible. " +
        "Return only optimized data, nothing else" +
        "If possible try to shorten the meaning to 2-3 words, but thats not necessary in every case. It is more important to keep sense of the data rather than shorten it." +
        "Example: " +
        "User: One of Peters favourite movies is Matrix, he watches it at least 2 times a year" +
        "AI: Fav movie Matrix",
    );
    const user = new HumanMessage(`Data to optimize: ${data}`);
    const openai = new ChatOpenAI({ modelName: "gpt-4-1106-preview" });
    const { content } = await openai.call([translatePrompt, user]);
    console.log(content);
    return content;
  }
  return data;
}
