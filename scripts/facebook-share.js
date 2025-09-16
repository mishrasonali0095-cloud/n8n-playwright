// facebook-share.js
const { chromium } = require('playwright');

(async () => {
  const fbUser = process.env.FB_USER;
  const fbPass = process.env.FB_PASS;
  const groups = ["Group One", "Group Two"]; // put your group names here

  const browser = await chromium.launch({
    headless: true, // set false if you want to debug
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("Logging in...");
  await page.goto("https://www.facebook.com/login");
  await page.fill('input[name="email"]', fbUser);
  await page.fill('input[name="pass"]', fbPass);
  await page.click('button[name="login"]');
  await page.waitForTimeout(5000);

  console.log("Go to friend’s page...");
  await page.goto("https://www.facebook.com/YourFriendsPage"); // <-- put page URL
  await page.waitForSelector('div[role="article"]');

  // Select latest 2 posts
  const posts = await page.$$('div[role="article"]');
  const latestPosts = posts.slice(0, 2);

  for (let post of latestPosts) {
    console.log("Clicking Share...");
    const shareBtn = await post.$('div[aria-label="Share"]');
    if (!shareBtn) continue;
    await shareBtn.click();
    await page.waitForTimeout(2000);

    for (let group of groups) {
      console.log(`Sharing to: ${group}`);
      await page.click('span:has-text("Share to a group")');
      await page.waitForSelector('input[aria-label="Search for a group"]');
      await page.fill('input[aria-label="Search for a group"]', group);
      await page.waitForTimeout(2000);
      await page.keyboard.press("Enter");
      await page.waitForTimeout(2000);
      await page.click('div[aria-label="Post"]');
      await page.waitForTimeout(5000);
    }
  }

  console.log("Done!");
  await browser.close();
})();
