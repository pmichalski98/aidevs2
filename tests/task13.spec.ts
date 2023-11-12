import { expect, test } from "@playwright/test";
import { handleTask } from "../tasks/task13";
import { getAuthToken, getTask, sendAnswer } from "../common";

test("people, lesson14", async () => {
  const authToken = await getAuthToken("people");
  const task = await getTask(authToken);
  const answer = await handleTask(task);
  const res = await sendAnswer(answer, authToken);
  expect(res).toBe("CORRECT");
});
