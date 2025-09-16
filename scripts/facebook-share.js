const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const fbUser = process.env.FB_USER;
  const fbPass = process.env.FB_PASS;
  const friendPage = "https://www.facebook.com/Engagehubtique";

  try {
    console.log("Logging in...");
    await page.goto("https://www.facebook.com/login", { waitUntil: "networkidle" });
    await page.fill("#email", fbUser);
    await page.fill("#pass", fbPass);
    await page.click('button[name="login"]');
    await page.waitForTimeout(5000);

    console.log("Go to friend's page...");
    await page.goto(friendPage, { waitUntil: "networkidle" });

    const postLinks = await page.$$eval("a[href*='/posts/']", links =>
      [...new Set(links.map(l => l.href))].slice(0, 2)
    );

    console.log("Found posts:", postLinks);

    for (const postUrl of postLinks) {
      console.log("Opening post:", postUrl);
      await page.goto(postUrl, { waitUntil: "networkidle" });

      // DEBUG: log all buttons on the page
      const buttons = await page.$$eval("div[role='button']", els =>
        els.map(e => e.textContent.trim()).filter(Boolean)
      );
      console.log("Buttons detected:", buttons);

      const shareSelectors = [
        'div[aria-label="Send this to friends or post it on your profile."]',
        'div[aria-label="Share"]',
        'div[role="button"]:has-text("Share")',
        'span:has-text("Share")',
        'svg[aria-label="Share"]'
      ];

      let clicked = false;
      for (const selector of shareSelectors) {
        try {
          await page.waitForSelector(selector, { timeout: 5000 });
          await page.click(selector);
          console.log("Clicked Share using selector:", selector);
          clicked = true;
          break;
        } catch (e) {
          console.log("Share button not found with:", selector);
        }
      }

      // Fallback: check ⋯ menu
      if (!clicked) {
        try {
          console.log("Trying 3-dot menu...");
          await page.click('div[aria-label="Actions for this post"]'); // the ⋯ menu
          await page.waitForTimeout(1000);
          await page.click('span:has-text("Share")', { timeout: 5000 });
          console.log("Clicked Share via 3-dot menu");
          clicked = true;
        } catch (e) {
          console.error("Still could not find Share on:", postUrl);
          continue;
        }
      }

      await page.waitForTimeout(2000);

      // Share to group
      try {
        await page.click('span:has-text("Share to a group")', { timeout: 8000 });
        console.log("Opened 'Share to a group' dialog");
      } catch (e) {
        console.error("Could not open 'Share to a group' for:", postUrl);
        continue;
      }

      await page.waitForTimeout(3000);

      const groups = await page.$$eval("div[role='option']", els =>
        els.map(e => e.textContent).filter(Boolean)
      );

      console.log("Groups found:", groups);

      for (const group of groups.slice(0, 2)) {
        console.log("Sharing to:", group);
        await page.click(`div[role='option']:has-text("${group}")`);
        await page.waitForTimeout(1000);
        await page.click('div[aria-label="Post"]');
        console.log("Posted to:", group);
        await page.waitForTimeout(4000);
      }
    }

    console.log("Done!");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await browser.close();
  }
})();
