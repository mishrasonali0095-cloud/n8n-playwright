const { chromium } = require('playwright');

// Helper: wait random time between min/max (ms)
const waitRandom = async (page, min, max) => {
  const time = Math.floor(Math.random() * (max - min + 1)) + min;
  console.log(`⏳ Waiting ${time} ms`);
  await page.waitForTimeout(time);
};

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 1500 });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 🔑 Login
    console.log("🔑 Logging into Facebook...");
    await page.goto('https://www.facebook.com/login');
    await page.fill('#email', process.env.FB_USER);
    await page.fill('#pass', process.env.FB_PASS);
    await page.click('button[name="login"]');
    await waitRandom(page, 5000, 8000);

    // 🧑 Friend's page
    const friendPage = 'https://www.facebook.com/Engagehubtique';
    console.log(`📄 Opening page: ${friendPage}`);
    await page.goto(friendPage);
    await waitRandom(page, 5000, 8000);

    // 📌 Get last 2 post URLs
    const posts = await page.$$eval('a[href*="/posts/"]', els =>
      els.map(e => e.href).slice(0, 2)
    );
    console.log(`📝 Found ${posts.length} posts:`, posts);

    for (const postUrl of posts) {
      try {
        console.log(`➡️ Processing post: ${postUrl}`);
        await page.goto(postUrl);
        await waitRandom(page, 4000, 7000);

        // Share → Share to a group
        await page.click('div[aria-label="Share"]');
        await waitRandom(page, 2000, 4000);

        await page.click('span:has-text("Share to a group")');
        await waitRandom(page, 3000, 5000);

        // Collect groups
        const groups = await page.$$eval('div[role="listitem"] span', els =>
          els.map(e => e.innerText)
        );
        console.log(`👥 Found ${groups.length} groups`);

        // ⚠️ For testing: only first 2 groups
        for (const groupName of groups.slice(0, 2)) {
          try {
            console.log(`📤 Sharing to: ${groupName}`);
            await page.fill('input[aria-label="Search for groups"]', groupName);
            await waitRandom(page, 2000, 3000);
            await page.keyboard.press('Enter');

            await page.click('div[aria-label="Post"]');
            await waitRandom(page, 5000, 9000);

            // Re-open for next group
            await page.click('div[aria-label="Share"]');
            await waitRandom(page, 2000, 4000);
            await page.click('span:has-text("Share to a group")');
            await waitRandom(page, 3000, 5000);
          } catch (err) {
            console.error(`⚠️ Failed to share in group ${groupName}:`, err.message);
            continue;
          }
        }
      } catch (err) {
        console.error(`⚠️ Error while processing post ${postUrl}:`, err.message);
        continue;
      }
    }
  } catch (err) {
    console.error("🚨 Fatal error:", err.message);
  } finally {
    console.log("✅ Closing browser");
    await browser.close();
  }
})();
