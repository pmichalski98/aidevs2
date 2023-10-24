import { expect, test } from "@playwright/test";
import { getAuthToken, getTask, sendAnswer } from "../index";

test("Lesson 1, helloapi", async ({}) => {
  const authToken = await getAuthToken("helloapi");
  const cookie = await getTask(authToken);
  const res = await sendAnswer(cookie, authToken);
  console.log({ authToken });
  expect(authToken).toBeDefined();
  console.log({ cookie });
  expect(cookie).toBeDefined();
  console.log({ res });
  expect(res).toBe("CORRECT");
});
