// facebook-share.js
// Automates logging into Facebook, going to a friend's page, grabbing recent posts,
// and sharing them to groups using Playwright.

const { chromium } = require("playwright");

(async () => {
  const FB_USER = process.env.FB_USER;
  const FB_PASS = process.env.FB_PASS;
  const FRIEND_PAGE = "https://www.facebook.com/Engagehubtique"; // change if needed

  if (!FB_USER || !FB_PASS) {
    console.error("❌ FB_USER and FB_PASS must be set as environment variables.");
    process.exit(1);
  }

  const browser = await chromium.launch({
    headless: true, // set false if debugging
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log("🔑 Logging in...");
    await page.goto("https://www.facebook.com/login", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    await page.fill('input[name="email"]', FB_USER);
    await page.fill('input[name="pass"]', FB_PASS);
    await page.click('button[name="login"]');

    // Wait until feed/homepage loads
    await page.waitForSelector('[role="feed"], [aria-label="Create a post"]', {
      timeout: 60000,
    });

    console.log("➡️ Navigating to friend's page...");
    await page.goto(FRIEND_PAGE, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.waitForSelector('div[role="main"]', { timeout: 60000 });

    // Grab latest posts
    console.log("🔎 Collecting posts...");
    const posts = await page.$$eval("a", (links) =>
      links
        .map((a) => a.href)
        .filter((href) => href.includes("/posts/"))
        .slice(0, 2)
    );

    if (!posts.length) {
      console.error("❌ No posts found.");
      await browser.close();
      process.exit(1);
    }

    console.log("✅ Found posts:", posts);

    for (const postUrl of posts) {
      console.log(`➡️ Opening post: ${postUrl}`);
      await page.goto(postUrl, { waitUntil: "domcontentloaded", timeout: 60000 });

      // Wait for share button (different selectors possible)
      const shareButton =
        (await page.$('div[aria-label="Share"]')) ||
        (await page.$('span:has-text("Share")'));

      if (!shareButton) {
        console.warn(`⚠️ Share button not found on ${postUrl}`);
        continue;
      }

      console.log("📌 Clicking Share...");
      await shareButton.click();
      await page.waitForTimeout(3000);

      // Click "Share to a group"
      const groupOption = await page.$('span:has-text("Share to a group")');
      if (!groupOption) {
        console.warn("⚠️ 'Share to a group' option not found.");
        continue;
      }
      await groupOption.click();
      await page.waitForTimeout(3000);

      // Choose first group from list
      const firstGroup = await page.$('div[role="option"]');
      if (!firstGroup) {
        console.warn("⚠️ No group option found.");
        continue;
      }
      await firstGroup.click();

      // Click Post
      const postButton = await page.$('div[aria-label="Post"], div[role="button"]:has-text("Post")');
      if (postButton) {
        await postButton.click();
        console.log(`✅ Shared ${postUrl} to group.`);
      } else {
        console.warn("⚠️ Post button not found.");
      }

      await page.waitForTimeout(5000);
    }

    console.log("🎉 Done!");
    await browser.close();
  } catch (err) {
    console.error("❌ Error:", err);
    await browser.close();
    process.exit(1);
  }
})();
