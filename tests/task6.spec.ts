import { expect, test } from "@playwright/test";
import { getAuthToken, getTask, sendAnswer } from "../common";
import { handleTask } from "../tasks/task6";

test("embedding, lesson7", async () => {
  const authToken = await getAuthToken("embedding");
  await getTask(authToken);
  const answer = await handleTask();
  const res = await sendAnswer(answer, authToken);
  expect(res).toBe("CORRECT");
});
