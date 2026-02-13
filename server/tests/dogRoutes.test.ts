import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import dogRoutes from "../routes/dogRoutes";

// Mock the controller
vi.mock("../controllers/dogController", () => ({
  getDogImage: vi.fn(),
}));

// Import the mocked controller
import { getDogImage } from "../controllers/dogController";

describe("DogRoutes Unit Tests", () => {
  let app: express.Application;

  beforeEach(() => {
    vi.resetAllMocks();

    // Setup express app with routes
    app = express();
    app.use(express.json());
    app.use("/api/dogs", dogRoutes);
  });

  // Test 4: Positive test for dogRoutes
  it("Test 4: GET /api/dogs/random should return 200 and image data", async () => {
    // Mock image URL for testing
    const mockImageUrl =
      "https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg";

    // Mock controller implementation
    (getDogImage as any).mockImplementation((req, res) => {
      res.json({
        success: true,
        data: {
          imageUrl: mockImageUrl,
          status: "success",
        },
      });
    });

    // Make request to the endpoint
    const response = await request(app).get("/api/dogs/random").expect(200);

    // Assert response structure
    expect(response.body.success).toBe(true);
    expect(response.body.data.imageUrl).toBe(mockImageUrl);
    expect(response.body.data.status).toBe("success");

    // Verify controller was called
    expect(getDogImage).toHaveBeenCalledOnce();
  });

  // Test 5: Negative test for dogRoutes (500 Internal Server Error)
  it("Test 5: GET /api/dogs/random should return 500 when server error occurs", async () => {
    // Mock controller to return 500 error
    (getDogImage as any).mockImplementation((req, res) => {
      res.status(500).json({
        error: "Internal server error",
        message: "Failed to fetch dog image",
      });
    });

    // Make request and expect 500 status
    const response = await request(app).get("/api/dogs/random").expect(500);

    // Assert error response
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Internal server error");

    // Verify controller was called
    expect(getDogImage).toHaveBeenCalledOnce();
  });
});
