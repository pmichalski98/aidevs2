import { expect, test } from "@playwright/test";
import { getAuthToken, getTask, moderateText, sendAnswer } from "../index";
import { ModerationTaskResponse } from "../types/types";

test("moderation, lesson2 ", async () => {
  const authToken = await getAuthToken("moderation");
  const { input }: ModerationTaskResponse = await getTask(authToken);
  const moderationResult = await moderateText(input);
  const result = await sendAnswer(moderationResult, authToken);
  expect(result).toBe("CORRECT");
});
