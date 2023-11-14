import { expect, test } from "@playwright/test";
import { handleTask } from "../tasks/task14";
import { getAuthToken, getTask, sendAnswer } from "../common";

test("knowledge, lesson15", async () => {
  const authToken = await getAuthToken("knowledge");
  const task = await getTask(authToken);
  const answer = await handleTask(task);
  const res = await sendAnswer(answer, authToken);
  expect(res).toBe("CORRECT");
});
