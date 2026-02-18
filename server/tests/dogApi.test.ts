import { describe, it, expect } from "vitest";
import request from "supertest";

const BASE_URL = "http://localhost:5000";

describe("API Tests - dogApi.test.ts", () => {
  // Test 1: Positive API test - GET /api/dogs/random
  it("Test 1: GET /api/dogs/random should return a random dog image", async () => {
    const response = await request(BASE_URL)
      .get("/api/dogs/random")
      .expect(200);

    // Expect that returned HTTP status is 200
    expect(response.status).toBe(200);

    // Expect that success is true
    expect(response.body).toHaveProperty("success");
    expect(response.body.success).toBe(true);

    // Expect that data is returned
    expect(response.body).toHaveProperty("data");

    // Expect that data contains imageUrl
    expect(response.body.data).toHaveProperty("imageUrl");

    // Expect that type of imageUrl is string
    expect(typeof response.body.data.imageUrl).toBe("string");
  });

  // Test 2: Invalid route - negative test
  it("Test 2: GET /api/dogs/invalid should return 404", async () => {
    const response = await request(BASE_URL)
      .get("/api/dogs/invalid")
      .expect(404);

    // Expect that returned HTTP status is 404
    expect(response.status).toBe(404);

    // Expect that returned response contains error message
    expect(response.body).toHaveProperty("error");

    // The error message could be different - let's check what it is
    console.log("Error message:", response.body.error);

    // Verify that error message exists and is a string
    expect(response.body.error).toBeDefined();
    expect(typeof response.body.error).toBe("string");
    expect(response.body.error.length).toBeGreaterThan(0);
  });
});
