import axios from "axios";
import { type ModerationResults } from "../types/types";

export async function handleTask(input: string[]) {
  const moderationResult = await getModerationResult(input);

  return moderationResult.data.results.map((result) =>
    result.flagged ? 1 : 0
  );
}

async function getModerationResult(input: string[]) {
  return axios.post<ModerationResults>(
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
}
