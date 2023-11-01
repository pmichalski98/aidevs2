import { expect, test } from "@playwright/test";
import { getAuthToken, getTask, sendAnswer } from "../common";
import { CookieTaskResponse } from "../types/types";

test("Lesson 1, helloapi", async () => {
  const authToken = await getAuthToken("helloapi");
  const { cookie }: CookieTaskResponse = await getTask(authToken);
  const result = await sendAnswer(cookie, authToken);
  expect(result).toBe("CORRECT");
});
