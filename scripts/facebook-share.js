const { chromium } = require("playwright");

async function run() {
  const username = process.env.FB_USER;
  const password = process.env.FB_PASS;
  const pageUrl = "https://www.facebook.com/Engagehubtique";

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log("Logging in...");
    await page.goto("https://www.facebook.com/login", { waitUntil: "networkidle" });
    await page.fill("#email", username);
    await page.fill("#pass", password);
    await page.click('button[name="login"]');
    await page.waitForLoadState("networkidle");

    console.log("Go to friend's page...");
    await page.goto(pageUrl, { waitUntil: "networkidle" });
    await page.waitForTimeout(5000);

    // scroll to load posts
    await page.mouse.wheel(0, 2000);
    await page.waitForTimeout(3000);

    console.log("Extracting latest posts...");
    const postLinks = await page.$$eval('a[href*="pfbid"]', els =>
      els.map(e => e.href).filter((v, i, a) => a.indexOf(v) === i)
    );

    const latestPosts = postLinks.slice(0, 2);
    console.log("Found posts:", latestPosts);

    for (const post of latestPosts) {
      console.log("Opening post:", post);
      await page.goto(post, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(5000);

      try {
        console.log("Clicking Share...");
        await page.click('div[aria-label="Share"], span:has-text("Share")', { timeout: 10000 });
        await page.waitForTimeout(3000);

        console.log("Choosing Share to a group...");
        await page.click('span:has-text("Share to a group")', { timeout: 10000 });
        await page.waitForTimeout(5000);

        console.log("Selecting first group...");
        // 🔧 Adjust selector if you want to target a specific group by name
        const groups = await page.$$('div[role="option"]');
        if (groups.length > 0) {
          await groups[0].click();
        } else {
          console.log("No groups found in dropdown!");
          continue;
        }

        await page.waitForTimeout(3000);

        console.log("Clicking Post...");
        await page.click('div[aria-label="Post"], div[role="button"]:has-text("Post")', { timeout: 10000 });
        await page.waitForTimeout(5000);

        console.log("Shared successfully:", post);
      } catch (e) {
        console.error("Error sharing post:", post, e.message);
      }

      // Random delay between posts
      const delay = Math.floor(Math.random() * 5000) + 5000;
      console.log(`Waiting ${delay}ms before next post...`);
      await page.waitForTimeout(delay);
    }

  } catch (err) {
    console.error("Fatal error:", err.message);
  } finally {
    await browser.close();
  }
}

run();
