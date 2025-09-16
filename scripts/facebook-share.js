// facebook-share.js
// Run with: node /home/node/scripts/facebook-share.js
// Needs env vars: FB_USER, FB_PASS

const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const fbUser = process.env.FB_USER;
  const fbPass = process.env.FB_PASS;
  const friendPage = "https://www.facebook.com/Engagehubtique"; // <-- your friend’s page

  try {
    console.log("Logging in...");
    await page.goto("https://www.facebook.com/login", { waitUntil: "networkidle" });
    await page.fill("#email", fbUser);
    await page.fill("#pass", fbPass);
    await page.click('button[name="login"]');
    await page.waitForTimeout(5000);

    console.log("Go to friend's page...");
    await page.goto(friendPage, { waitUntil: "networkidle" });

    // grab latest 2 posts
    const postLinks = await page.$$eval("a[href*='/posts/']", links =>
      [...new Set(links.map(l => l.href))].slice(0, 2)
    );

    console.log("Found posts:", postLinks);

    for (const postUrl of postLinks) {
      console.log("Opening post:", postUrl);
      await page.goto(postUrl, { waitUntil: "networkidle" });

      // Click Share button
      console.log("Clicking Share...");
      await page.click('div[aria-label="Send this to friends or post it on your profile."]');
      await page.waitForTimeout(2000);

      // Select "Share to a group"
      console.log("Selecting 'Share to a group'...");
      await page.click('span:has-text("Share to a group")');
      await page.waitForTimeout(3000);

      // Extract group list
      const groups = await page.$$eval("div[role='option']", els =>
        els.map(e => e.textContent).filter(Boolean)
      );

      console.log("Groups found:", groups);

      for (const group of groups) {
        console.log("Sharing to:", group);

        // Click group name
        await page.click(`div[role='option']:has-text("${group}")`);
        await page.waitForTimeout(1000);

        // Click Post button
        await page.click('div[aria-label="Post"]');
        console.log("Posted to:", group);

        await page.waitForTimeout(4000);

        // Reopen share dialog for next group
        if (group !== groups[groups.length - 1]) {
          await page.click('div[aria-label="Send this to friends or post it on your profile."]');
          await page.click('span:has-text("Share to a group")');
        }
      }
    }

    console.log("Done!");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await browser.close();
  }
})();
