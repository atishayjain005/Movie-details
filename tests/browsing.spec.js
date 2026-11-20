const { test, expect } = require('@playwright/test');
const endpoint = '**/api/movieList';
// Synthetic fixtures only; never displayed by production code.
const record = {title:'Test movie with a deliberately long title',director:['First director','Second director'],stars:['Test actor'],runTime:120,releasedDate:1656633600,genre:'Drama',language:'Kannada',pageViews:10,totalVoted:3};
for (const width of [320,768,1280]) {
  test(`cards and disclosure fit ${width}px`, async ({page}) => {
    await page.setViewportSize({width,height:850});
    await page.route(endpoint, route => route.fulfill({json:{result:[record,{}]}}));
    await page.goto('/');
    await expect(page.getByRole('heading',{name:record.title})).toBeVisible();
    await expect(page.getByText(/120 mins/)).toBeVisible();
    await expect(page.getByText(/Jul 01, 2022/)).toBeVisible();
    await page.getByRole('button',{name:'Company Info'}).click();
    await expect(page.locator('#company-details')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.keyboard.press('Escape');
    await expect(page.locator('#company-details')).toBeHidden();
    if(width===320) await page.screenshot({path:'test-results/mobile.png',fullPage:true});
  });
}
test('failure retries to empty state',async ({page}) => {
  let attempts=0;
  await page.route(endpoint,route => route.fulfill(++attempts===1 ? {status:503} : {json:{result:[]}}));
  await page.goto('/');
  await expect(page.getByRole('alert')).toBeVisible();
  await page.getByRole('button',{name:'Try again'}).click();
  await expect(page.getByRole('status')).toHaveText(/No movies/);
});
test('keyboard skip link reaches main and brand preserves storage',async ({page}) => {
  await page.route(endpoint,route=>route.fulfill({json:{result:[]}}));
  await page.goto('/');
  await page.evaluate(()=>localStorage.setItem('unrelated','keep'));
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link',{name:'Skip to content'})).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  await page.getByRole('link',{name:'GeekSynergy'}).click();
  expect(await page.evaluate(()=>localStorage.getItem('unrelated'))).toBe('keep');
});
