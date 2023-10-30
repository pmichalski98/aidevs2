import { expect, test } from "@playwright/test";
import { getAuthToken, getTask, sendAnswer, sendQuestionTask4 } from "../index";

test("liar, lesson5", async () => {
  const authToken = await getAuthToken("liar");
  const task = await getTask(authToken);
  const yesOrNo = await sendQuestionTask4(authToken);
  const res = await sendAnswer(yesOrNo, authToken);
  console.log(res);
  expect(res).toBe("CORRECT");
});
