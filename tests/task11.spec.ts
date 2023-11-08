import { expect, test } from "@playwright/test";
import { getAuthToken, getTask, sendAnswer } from "../common";
import { handleTask } from "../tasks/task11";

test("whoami, lesson12", async () => {
  const authToken = await getAuthToken("whoami");
  const task = await getTask(authToken);
  const answer = await handleTask(task);
  if (answer) {
    const res = await sendAnswer(answer, authToken);
    console.log(res);
    expect(res).toBe("CORRECT");
  }
});
