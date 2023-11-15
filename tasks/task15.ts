import { GetTaskResponseT } from "../types/types";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { BaseMessageChunk, HumanMessage } from "langchain/schema";

interface ToolsTask extends GetTaskResponseT {
  question: string;
}

const today = new Date();
export const intentSchema = {
  name: "describe_intention",
  description: `Describe user's intention, based on his latest message`,
  parameters: {
    type: "object",
    properties: {
      tool: {
        type: "string",
        description: `
                  Type has to be set to either:
                  'todo' — when user's message describes a task to be done.
                  'calendar' — when user's message contains date or describes some time horizont that a task should be done.
                  Example: I need to buy potatos in two days. 
                  `,
      },
      desc: {
        type: "string",
        description: `Rephrase users task to make it more consise.`,
      },
      date: {
        type: "string",
        description: `Return date in YYYY-MM-DD format if user specifiec some date.
        ###
        Example:
        User: I need to buy potatos in two days
        AI: 2023-11-17
        ###
        Answer: Return only date and nothing else in YYYY-MM-DD format.
        ###
        Context: Today is ${today}`,
      },
    },
    required: ["name"],
  },
};

export const parseFunctionCall = (
  result: BaseMessageChunk,
): { name: string; args: any } | null => {
  if (result?.additional_kwargs?.function_call === undefined) {
    return null;
  }
  return {
    name: result.additional_kwargs.function_call.name,
    args: JSON.parse(result.additional_kwargs.function_call.arguments),
  };
};
export async function handleTask(task: ToolsTask) {
  const { question: userPrompt } = task;
  const model = new ChatOpenAI({
    modelName: "gpt-4-0613",
  }).bind({ functions: [intentSchema] });

  const result = await model.invoke([new HumanMessage(userPrompt)]);
  const action = parseFunctionCall(result);
  if (action) {
    return action.args;
  }
}
