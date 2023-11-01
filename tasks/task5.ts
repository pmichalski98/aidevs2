import { HumanMessage } from "langchain/schema";
import { InpromptTaskResponse } from "../types/types";
import { ChatOpenAI } from "langchain/chat_models/openai";

export async function handleTask(task: InpromptTaskResponse) {
  const personName = await filterPersonName(task);

  const foundPersonInfo = task.input.filter((row) => row.includes(personName));

  const chat = new ChatOpenAI();
  const prompt = `Answer for proviced question using information that u have in context. If u dont know the answer say that you dont know.
  ###
  Question: ${task.question}
  ###
  Answer: Translate to polish language.
  ###
  Context:
  ${JSON.stringify(foundPersonInfo)}
  `;
  const { content: answer } = await chat.call([prompt]);
  return answer;
}

async function filterPersonName(task: InpromptTaskResponse) {
  const chat = new ChatOpenAI();
  console.log({ name: task.question });
  const prompt = new HumanMessage(`In given text find human name and return it.
  ###
  Answer: Return only name,nothing else. If u dont find any return 0.
    ###
    Text to find in : ${task.question}
    `);
  const { content } = await chat.call([prompt]);
  if (content === "0") throw new Error("Failed to find person name");

  console.log(content);

  return content;
}
