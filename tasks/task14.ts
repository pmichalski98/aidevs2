import { GetTaskResponseT } from "../types/types";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  BaseMessageChunk,
  HumanMessage,
  SystemMessage,
} from "langchain/schema";

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
  [key: string]: (curr: string) => Promise<string | undefined>;
}

const tools: ITools = {
  currency: async (curr: string) => {
    const chat = new ChatOpenAI({ modelName: "gpt-4-0613" });
    const { content: currISO } = await chat.call([
      new SystemMessage(
        `For provided currency return 3 letter currency code with ISO 4217 standard.Return only ISO code, nothing else. Currency: ${curr}`,
      ),
    ]);
    try {
      const res = await fetch(
        `http://api.nbp.pl/api/exchangerates/rates/a/${currISO}`,
      );
      const data = await res.json();
      return data.rates[0].mid as string;
    } catch (e) {
      console.log(e);
    }
  },
  currentPopulation: async (country: string) => {
    const chat = new ChatOpenAI({ modelName: "gpt-4-0613" });
    const { content: translated } = await chat.call([
      new SystemMessage(
        `Translate to english. Return only translated value, nothing else. 
        Text to translate: ${country}`,
      ),
    ]);
    try {
      const res = await fetch(
        `https://restcountries.com/v3.1/name/${translated.toLowerCase()}`,
      );
      const data = await res.json();
      return data[0].population as string;
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
  const result = await model.invoke([new HumanMessage(question)]);
  const action = parseFunctionCall(result);
  if (action && tools[action.name]) {
    const answer = await tools[action.name](action.args.arg);
    return answer;
  } else {
    const { content: answer } = await chat.call([
      new HumanMessage(`Answer for users question based on your knowledge. Keep answers concise.
    Users question:${question}`),
    ]);
    return answer;
  }
}
