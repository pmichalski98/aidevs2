import { expect, test } from "@playwright/test";
import { getAuthToken, getTask, sendAnswer } from "../common";
import { handleTask } from "../tasks/task9";

test("rodo, lesson10", async () => {
  const authToken = await getAuthToken("rodo");
  const task = await getTask(authToken);
  console.log({ task });
  const answer = await handleTask();
  const res = await sendAnswer(answer, authToken);
  console.log(res);
  expect(res).toBe("CORRECT");
});
