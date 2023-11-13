import { GetTaskResponseT } from "../types/types";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { BaseMessageChunk, HumanMessage } from "langchain/schema";

interface KnowledgeTask extends GetTaskResponseT {
  question: string;
}

const currentPopulationSchema = {
  name: "currentPopulation",
  description: "check current population for provided country",
  type: "object",
  parameters: {
    type: "object",
    properties: {
      arg: {
        type: "string",
        description: "country",
      },
    },
  },
};
const currencySchema = {
  name: "currency",
  description: "check current exchange rate for provided currency",
  type: "object",
  parameters: {
    type: "object",
    properties: {
      arg: {
        type: "string",
        description: "currency",
      },
    },
  },
};

interface ITools {
  [key: string]: (curr: string) => string;
}

const tools: ITools = {
  currency: async (curr: string) => {
    console.log(curr, "curr");
    try {
      console.log("try");
      const res = await fetch(
        `http://api.nbp.pl/api/exchangerates/rates/a/${curr}`,
      );
      console.log(res);
      // console.log(await res.json());
    } catch (e) {
      console.log(e);
    }
  },
  currentPopulation: async (country: string) => {
    console.log("country", country);
    try {
      const res = await fetch(
        `https://restcountries.com/v3.1/name/${country.toLowerCase()}`,
      );
      const data = await res.json();
      return data.population as string;
    } catch (e) {
      console.log(e);
    }
  },
};

function parseFunctionCall(result: BaseMessageChunk) {
  if (result.additional_kwargs.function_call === undefined) {
    return null;
  }
  return {
    name: result.additional_kwargs.function_call.name,
    args: JSON.parse(result.additional_kwargs.function_call.arguments),
  };
}

export async function handleTask(task: KnowledgeTask) {
  const chat = new ChatOpenAI({ modelName: "gpt-4-0613" });
  const model = new ChatOpenAI({
    modelName: "gpt-4-0613",
  }).bind({
    functions: [currencySchema, currentPopulationSchema],
  });
  const { question } = task;
  console.log(question);
  const result = await model.invoke([new HumanMessage(question)]);
  const action = parseFunctionCall(result);
  console.log(action);
  if (action && tools[action.name]) {
    console.log("halo");
    const res = await tools[action.name](action.args.arg);
    console.log(res, "lololol");
  } else {
    const { content } = await chat.call([
      new HumanMessage(`Answer for users question based on your knowledge. Keep answers concise.
    Users question:${question}`),
    ]);
    return content;
  }
}
