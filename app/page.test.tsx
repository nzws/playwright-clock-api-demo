import { test, expect } from "@playwright/test";

test("カウント開始を押下して10秒後にカウントが10になる", async ({ page }) => {
  await page.clock.install({ time: new Date("2024-02-02T10:00:00") });
  await page.goto("/");

  const counter = page.getByTestId("count");
  await expect(counter).toHaveText("0");

  await page.clock.pauseAt(new Date("2024-02-02T10:00:10"));

  await page.getByRole("button", { name: "カウント開始" }).click();
  await page.clock.runFor("00:10");

  await expect(counter).toHaveText("10");
});

test.describe("日時", () => {
  test("時刻が表示される (pauseAt)", async ({ page }) => {
    await page.clock.install({ time: new Date("2024-02-02T09:00:00") });
    await page.goto("/");

    await page.clock.pauseAt(new Date("2024-02-02T10:00:00"));

    const currentDateTime = page.getByTestId("currentDateTime");
    await expect(currentDateTime).toHaveText("2024/2/2 10:00:00");

    // for testing
    await page.waitForTimeout(1000);
    await expect(currentDateTime).toHaveText("2024/2/2 10:00:00");
  });

  test("時刻が表示される (setFixedTime)", async ({ page }) => {
    await page.clock.setFixedTime(new Date("2024-02-02T10:00:00"));
    await page.goto("/");

    const currentDateTime = page.getByTestId("currentDateTime");
    await expect(currentDateTime).toHaveText("2024/2/2 10:00:00");

    // for testing
    await page.waitForTimeout(1000);
    await expect(currentDateTime).toHaveText("2024/2/2 10:00:00");
  });

  test("日時が1秒ごとに更新される", async ({ page }) => {
    await page.clock.install({ time: new Date("2024-02-02T10:00:00") });
    await page.goto("/");

    const currentDateTime = page.getByTestId("currentDateTime");
    await expect(currentDateTime).toHaveText("2024/2/2 10:00:00");

    await page.clock.fastForward("00:01");

    await expect(currentDateTime).toHaveText("2024/2/2 10:00:01");
  });

  test("1分後も更新される (fastForward)", async ({ page }) => {
    await page.clock.install({ time: new Date("2024-02-02T10:00:00") });
    await page.goto("/");

    const currentDateTime = page.getByTestId("currentDateTime");
    await expect(currentDateTime).toHaveText("2024/2/2 10:00:00");

    const start = Date.now();
    await page.clock.fastForward("01:00");
    const end = Date.now();
    console.log("fastForward", `${end - start}ms`);

    await expect(currentDateTime).toHaveText("2024/2/2 10:01:00");
  });

  test("1分後も更新される (runFor)", async ({ page }) => {
    await page.clock.install({ time: new Date("2024-02-02T10:00:00") });
    await page.goto("/");

    const currentDateTime = page.getByTestId("currentDateTime");
    await expect(currentDateTime).toHaveText("2024/2/2 10:00:00");

    const start = Date.now();
    await page.clock.runFor("01:00");
    const end = Date.now();
    console.log("runFor", `${end - start}ms`);

    await expect(currentDateTime).toHaveText("2024/2/2 10:01:00");
  });
});

test.describe("ログアウト", () => {
  test("1時間後にログアウトする", async ({ page }) => {
    await page.clock.install({ time: new Date("2024-02-02T10:00:00") });
    await page.goto("/");

    const loggedOut = page.getByText(
      "1時間経過したため、ログアウトしました！！"
    );
    await expect(loggedOut).toBeHidden();

    await page.clock.fastForward("01:00:00");

    await expect(loggedOut).toBeVisible();
  });
});
