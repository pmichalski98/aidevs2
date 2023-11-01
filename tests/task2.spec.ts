import { expect, test } from "@playwright/test";
import { getAuthToken, getTask, sendAnswer } from "../common";
import { ModerationTaskResponse } from "../types/types";
import { handleTask } from "../tasks/task2";

test("moderation, lesson2 ", async () => {
  const authToken = await getAuthToken("moderation");
  const { input }: ModerationTaskResponse = await getTask(authToken);
  const answer = await handleTask(input);
  const result = await sendAnswer(answer, authToken);
  expect(result).toBe("CORRECT");
});
