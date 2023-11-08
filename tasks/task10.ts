import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, SystemMessage } from "langchain/schema";

interface ITask {
  code: number;
  msg: string;
  input: string;
  question: string;
}
export async function handleTask(task: ITask) {
  const { question, input: url } = task;

  const res = await fetchData(url);
  if (res.status === 500) {
    await handleTask(task);
  }
  if (res.status === 200) {
    const data = await res.text();
    const { content } = await askGpt(data, question);
    return content;
  } else {
    setTimeout(async () => {
      await handleTask(task);
    }, 5000);
  }
}
async function fetchData(url: string) {
  return fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
    },
  });
}

async function askGpt(answerIsHere: string, question: string) {
  const chat = new ChatOpenAI({
    modelName: "gpt-4-1106-preview",
  });
  const prompt = new HumanMessage(`
  Answer for provided question, answer is in provided context.
  ###
  Question: ${question}
  `);
  const system = new SystemMessage(`
  Context: ${answerIsHere};
  `);
  return chat.call([prompt, system]);
}
