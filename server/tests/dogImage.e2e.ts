import { test, expect } from "@playwright/test";

test.describe("E2E Tests - Dog Image App", () => {
  // Test 3: Positive E2E test - Page load
  test("Test 3: should load dog image when page loads", async ({ page }) => {
    // Wait for API response
    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("/api/dogs/random") &&
        response.status() === 200,
    );

    // Navigate to page
    await page.goto("http://localhost:5174");

    // Wait for API call to complete
    await responsePromise;

    // Find the image element
    const image = page.locator('img[alt*="dog" i], img[src*="images.dog.ceo"]');

    // Check that image exists
    await expect(image).toBeVisible();

    // Get image source and verify it's a valid URL
    const imageSrc = await image.getAttribute("src");
    expect(imageSrc).toBeTruthy();
    expect(imageSrc).toMatch(/^https?:\/\//);
  });

  // Test 4: Positive E2E test - Button click
  test("Test 4: should load new dog image when button is clicked", async ({
    page,
  }) => {
    // Navigate to page first
    await page.goto("http://localhost:5174");

    // Wait for initial image to load
    await page.waitForResponse(
      (response) =>
        response.url().includes("/api/dogs/random") &&
        response.status() === 200,
    );

    // Find the button (looking for "GET ANOTHER DOG" button)
    const button = page.getByRole("button", {
      name: /get another|another|new|random/i,
    });
    await expect(button).toBeVisible();

    // Wait for new API response after click
    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("/api/dogs/random") &&
        response.status() === 200,
    );

    // Click button
    await button.click();

    // Wait for API call to complete
    await responsePromise;

    // Find image and verify it has source
    const image = page.locator('img[alt*="dog" i], img[src*="images.dog.ceo"]');
    const imageSrc = await image.getAttribute("src");

    expect(imageSrc).toBeTruthy();
    expect(imageSrc).toMatch(/^https?:\/\//);
  });

  // Test 5: Negative E2E test - API call fails
  test("Test 5: should show error message when API call fails", async ({
    page,
  }) => {
    // Intercept and abort API calls
    await page.route("**/api/dogs/random", (route) => route.abort());

    // Navigate to page
    await page.goto("http://localhost:5174");

    // Wait a bit for error to appear
    await page.waitForTimeout(1000);

    // Check for element containing "error" text (using regex for case insensitive)
    const errorElement = page.locator("text=/error/i");
    await expect(errorElement).toBeVisible();
  });
});
