import axios from "axios";
import {
  GetAuthTokenT,
  GetTaskResponseT,
  SendAnswerReponseT,
} from "./types/types";

const URL = process.env.AI_DEVS_API_BASE_URL;
const apiKey = process.env.AI_DEVS_API_KEY;
export async function getAuthToken(taskName: string) {
  const res = await axios.post<GetAuthTokenT>(`${URL}/token/${taskName}`, {
    apikey: apiKey,
  });
  if (!res.data.token) return "You didnt get auth token";
  return res.data.token;
}

export async function getTask(token: string) {
  const res = await axios.get<GetTaskResponseT>(`${URL}/task/${token}`);
  return res.data;
}

export async function sendAnswer(answer: string, token: string) {
  const res = await axios.post<SendAnswerReponseT>(`${URL}/answer/${token}`, {
    answer: answer,
  });
  return res.data.note;
}

export async function moderateText(input: string[]) {
  const res = await axios.post(
    "https://api.openai.com/v1/moderations",
    {
      input,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    }
  );
  const result = res.data.results.map((result, i) => {
    if (result.flagged) {
      return 1;
    } else if (!result.flagged) {
      return 0;
    }
  });

  return result;
  // return res.data;
}
