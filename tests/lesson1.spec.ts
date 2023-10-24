import { expect, test } from "@playwright/test";
import {getAuthToken} from "../common";

test("Lesson 1, helloapi", async ({}) => {
 const res = await getAuthToken();
  expect(res).toBe(true);
});
