const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log("🔐 Logging in...");
    await page.goto("https://www.facebook.com/login", { waitUntil: "domcontentloaded" });

    await page.fill("#email", process.env.FB_USER);
    await page.fill("#pass", process.env.FB_PASS);
    await page.click('button[name="login"]');

    // Wait for login success
    await page.waitForSelector('input[aria-label="Search Facebook"]', { timeout: 60000 });
    console.log("✅ Logged in");

    console.log("➡️ Go to friend's page...");
    await page.goto("https://www.facebook.com/Engagehubtique", { waitUntil: "domcontentloaded" });

    // Wait for posts feed
    await page.waitForSelector('[role="feed"]', { timeout: 60000 });
    console.log("✅ Page loaded");

    // Find posts (simplified)
    const posts = await page.$$eval('a[href*="/posts/"]', els =>
      [...new Set(els.map(el => el.href))].slice(0, 2)
    );

    console.log("📝 Found posts:", posts);

    const groups = ["Russia Friends", "मराठी मैत्री ग्रुप"];

    for (const postUrl of posts) {
      console.log(`➡️ Opening post: ${postUrl}`);
      await page.goto(postUrl, { waitUntil: "domcontentloaded" });

      // Open Share menu
      const shareBtn =
        (await page.$('div[aria-label="Share"]')) ||
        (await page.$('span:has-text("Share")'));

      if (!shareBtn) {
        console.warn(`⚠️ Share button not found on ${postUrl}`);
        continue;
      }
      await shareBtn.click();
      await page.waitForTimeout(2000);

      // Click "Share to a group"
      const groupOption = await page.$('span:has-text("Share to a group")');
      if (!groupOption) {
        console.warn("⚠️ 'Share to a group' option missing");
        continue;
      }
      await groupOption.click();
      await page.waitForTimeout(2000);

      // Loop through group names
      for (const groupName of groups) {
        console.log(`📌 Sharing to: ${groupName}`);

        const searchBox = await page.$('input[aria-label="Search for groups"]');
        if (!searchBox) {
          console.warn("⚠️ No group search box.");
          continue;
        }

        await searchBox.fill("");
        await searchBox.type(groupName, { delay: 100 });
        await page.waitForTimeout(3000);

        // Pick first result
        const firstResult = await page.$('div[role="option"]');
        if (!firstResult) {
          console.warn(`⚠️ Group not found: ${groupName}`);
          continue;
        }
        await firstResult.click();

        // Click Post
        const postBtn =
          (await page.$('div[aria-label="Post"]')) ||
          (await page.$('div[role="button"]:has-text("Post")'));
        if (postBtn) {
          await postBtn.click();
          console.log(`✅ Shared ${postUrl} to ${groupName}`);
        } else {
          console.warn("⚠️ Post button not found.");
        }

        await page.waitForTimeout(4000);
      }
    }

    console.log("🎉 Done!");
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await browser.close();
  }
})();
