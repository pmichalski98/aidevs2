import { expect, test } from "@playwright/test";
import { getAuthToken, getTask, sendAnswer } from "../common";
import { handleTask } from "../tasks/task8";

test("functions, lesson9", async () => {
  const authToken = await getAuthToken("functions");
  await getTask(authToken);
  const answer = await handleTask();
  const res = await sendAnswer(answer, authToken);
  expect(res).toBe("CORRECT");
});
