import { test, expect } from "@playwright/test";

const HOST = "http://localhost:4321";

test("존재하지 않는 소스페소 링크로 가려 하면 404페이지가 나온다", async ({
  page,
}) => {
  await page.goto(HOST + "/sospeso/3123131");

  await expect(
    page.getByRole("heading", { name: "404 찾을 수 없는 페이지" }),
  ).toBeVisible();

  await page.getByRole("link", { name: "홈으로 돌아가기" }).click();

  await expect(page).toHaveURL(HOST + "/");
});
