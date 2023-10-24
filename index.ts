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
  return res.data.cookie;
}

export async function sendAnswer(answer: string, token: string) {
  const res = await axios.post<SendAnswerReponseT>(`${URL}/answer/${token}`, {
    answer,
  });
  return res.data.note;
}
