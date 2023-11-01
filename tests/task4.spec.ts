import { expect, test } from "@playwright/test";
import { getAuthToken, getTask, sendAnswer } from "../common";
import { handleTask } from "../tasks/task4";

test("liar, lesson5", async () => {
  const authToken = await getAuthToken("liar");
  await getTask(authToken);
  const answer = await handleTask(authToken);
  const res = await sendAnswer(answer, authToken);
  expect(res).toBe("CORRECT");
});
