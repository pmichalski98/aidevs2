import { expect, test } from "@playwright/test";
import { handleTask } from "../tasks/task15";
import { getAuthToken, getTask, sendAnswer } from "../common";

test("tools, lesson16", async () => {
  const authToken = await getAuthToken("tools");
  const task = await getTask(authToken);
  const answer = await handleTask(task);
  const res = await sendAnswer(answer, authToken);
  expect(res).toBe("CORRECT");
});
