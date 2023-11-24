import { expect, test } from "@playwright/test";
import { handleTask } from "../tasks/task21";
import { getAuthToken, getTask, sendAnswer } from "../common";

test("google, lesson22", async () => {
  const authToken = await getAuthToken("google");
  const task = await getTask(authToken);
  console.log(task);
  const answer = await handleTask();
  const res = await sendAnswer(answer, authToken);
  console.log(res);
  if (res !== "CORRECT") {
    console.log(res.response.data.history);
    console.log(res.response.data.answer);
  }
  expect(res).toBe("CORRECT");
});
