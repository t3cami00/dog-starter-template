import { describe, it, expect, vi, beforeEach } from "vitest";
import { getDogImage } from "../controllers/dogController";
import * as dogService from "../services/dogService";

// Mock the dogService
vi.mock("../services/dogService", () => ({
  getRandomDogImage: vi.fn(),
}));

describe("DogController Unit Tests", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  // Test 3: Positive test for dogController
  it("Test 3: should return success true and mocked JSON data", async () => {
    // Mock service response
    const mockServiceResponse = {
      imageUrl: "https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg",
      status: "success",
    };

    // Setup the mock to resolve with our test data
    (dogService.getRandomDogImage as any).mockResolvedValue(
      mockServiceResponse,
    );

    // Create mock request and response objects
    const req = {};
    const res = {
      json: vi.fn().mockReturnThis(),
      status: vi.fn().mockReturnThis(),
    };

    // Call the controller
    await getDogImage(req as any, res as any);

    // Assert that json was called with the expected data
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockServiceResponse,
    });

    // Verify the service was called
    expect(dogService.getRandomDogImage).toHaveBeenCalledOnce();
  });
});
