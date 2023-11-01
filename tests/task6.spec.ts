import { expect, test } from "@playwright/test";
import { embeddingTask, getAuthToken, getTask, sendAnswer } from "../index";

test("embedding, lesson7", async () => {
  const authToken = await getAuthToken("embedding");
  await getTask(authToken);
  const answer = await embeddingTask();
  const res = await sendAnswer(answer, authToken);
  expect(res).toBe("CORRECT");
});
