const { chromium } = require("playwright");

(async () => {
  const FB_USER = process.env.FB_USER;
  const FB_PASS = process.env.FB_PASS;
  const pageUrl = process.argv[2]; // post URL passed from n8n

  if (!FB_USER || !FB_PASS) {
    console.error("FB_USER and FB_PASS env variables are required");
    process.exit(1);
  }

  console.log("Launching browser...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("Logging in...");
  await page.goto("https://www.facebook.com/login", { waitUntil: "networkidle" });
  await page.fill('input[name="email"]', FB_USER);
  await page.fill('input[name="pass"]', FB_PASS);
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle" }),
    page.click('button[name="login"]'),
  ]);

  console.log("Opening post:", pageUrl);
  await page.goto(pageUrl, { waitUntil: "networkidle" });
  await page.waitForTimeout(4000);

  // Scroll to reveal footer
  await page.evaluate(() => window.scrollBy(0, window.innerHeight));
  await page.waitForTimeout(2000);

  console.log("Clicking Share...");
  const shareBtn = page.locator('div[aria-label="Share"]');
  await shareBtn.first().click();

  console.log("Waiting for Share options...");
  await page.waitForSelector('span:text("Share to a group")', { timeout: 10000 });
  await page.locator('span:text("Share to a group")').click();

  console.log("Selecting group...");
  await page.waitForSelector('input[aria-label="Search for a group"]', { timeout: 10000 });
  // Type your group name (or leave blank if default works)
  await page.keyboard.type("My Group Name");
  await page.keyboard.press("Enter");

  console.log("Posting...");
  await page.waitForSelector('div[aria-label="Post"]', { timeout: 10000 });
  await page.locator('div[aria-label="Post"]').click();

  console.log("✅ Successfully shared!");
  await browser.close();
})();
