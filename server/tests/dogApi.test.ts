import {
  describe,
  it,
  expect,
  vi,
  beforeAll,
  afterAll,
  beforeEach,
} from "vitest";
import request from "supertest";
import express from "express";
import dogRoutes from "../routes/dogRoutes";
import * as dogService from "../services/dogService";

// Mock the dogService
vi.mock("../services/dogService", () => ({
  getRandomDogImage: vi.fn(),
}));

describe("Dog API Integration Tests", () => {
  let app: express.Application;
  let server: any;

  beforeEach(() => {
    vi.resetAllMocks();
  });

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/api/dogs", dogRoutes);

    // Start server on a test port
    server = app.listen(0); // Use random available port
  });

  afterAll(() => {
    server.close();
  });

  it("GET /api/dogs/random should return a dog image", async () => {
    // Mock successful service response
    const mockServiceResponse = {
      imageUrl: "https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg",
      status: "success",
    };

    (dogService.getRandomDogImage as any).mockResolvedValue(
      mockServiceResponse,
    );

    const response = await request(app).get("/api/dogs/random").expect(200);

    expect(response.body).toHaveProperty("success");
    expect(response.body.success).toBe(true);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("imageUrl");
    expect(response.body.data.imageUrl).toBe(mockServiceResponse.imageUrl);
    expect(response.body.data).toHaveProperty("status");
    expect(response.body.data.status).toBe("success");

    // Verify service was called
    expect(dogService.getRandomDogImage).toHaveBeenCalledOnce();
  });

  it("should handle errors gracefully", async () => {
    // Mock service to throw error
    (dogService.getRandomDogImage as any).mockRejectedValue(
      new Error("API Error"),
    );

    const response = await request(app).get("/api/dogs/random").expect(500);

    expect(response.body).toHaveProperty("success");
    expect(response.body.success).toBe(false);
    expect(response.body).toHaveProperty("error");

    // Verify service was called
    expect(dogService.getRandomDogImage).toHaveBeenCalledOnce();
  });
});
