const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 2000 });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Login
  await page.goto('https://www.facebook.com/login');
  await page.fill('#email', process.env.FB_USER);
  await page.fill('#pass', process.env.FB_PASS);
  await page.click('button[name="login"]');
  await page.waitForTimeout(7000);

  // Go to friend's page (replace with their profile/page URL)
  const friendPage = 'https://www.facebook.com/FRIEND_PAGE_URL';
  await page.goto(friendPage);
  await page.waitForTimeout(5000);

  // Collect the first 2 post URLs
  const posts = await page.$$eval('a[href*="/posts/"]', els =>
    els.map(e => e.href).slice(0, 2)
  );

  for (const postUrl of posts) {
    console.log(`Processing post: ${postUrl}`);
    await page.goto(postUrl);
    await page.waitForTimeout(5000 + Math.random() * 3000);

    // Click Share
    await page.click('div[aria-label="Share"]');
    await page.waitForTimeout(3000);

    // Click "Share to a group"
    await page.click('span:has-text("Share to a group")');
    await page.waitForTimeout(4000);

    // Collect groups
    const groups = await page.$$eval('div[role="listitem"] span', els =>
      els.map(e => e.innerText)
    );

    // Loop through groups
    for (const groupName of groups) {
      console.log(`Sharing to: ${groupName}`);
      await page.fill('input[aria-label="Search for groups"]', groupName);
      await page.waitForTimeout(2000);
      await page.keyboard.press('Enter');
      await page.click('div[aria-label="Post"]');
      await page.waitForTimeout(6000 + Math.random() * 4000);

      // Re-open share menu for next group
      await page.click('div[aria-label="Share"]');
      await page.waitForTimeout(2000);
      await page.click('span:has-text("Share to a group")');
      await page.waitForTimeout(3000);
    }
  }

  await browser.close();
})();
