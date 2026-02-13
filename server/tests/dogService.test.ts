import { describe, it, expect, vi, beforeEach } from "vitest";
import { getRandomDogImage } from "../services/dogService";

// Mock global fetch
global.fetch = vi.fn();

describe("DogService Unit Tests", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  // Test 1: Positive test for dogService
  it("Test 1: should successfully fetch a random dog image", async () => {
    // Mock successful API response
    const mockApiResponse = {
      message: "https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg",
      status: "success",
    };

    // Mock the fetch implementation
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    });

    // Call the service
    const result = await getRandomDogImage();

    // Assertions
    expect(result.imageUrl).toBe(mockApiResponse.message);
    expect(result.status).toBe("success");
    expect(global.fetch).toHaveBeenCalledOnce();
    expect(global.fetch).toHaveBeenCalledWith(
      "https://dog.ceo/api/breeds/image/random",
    );
  });

  // Test 2: Negative test for dogService
  it("Test 2: should throw error when API returns error status", async () => {
    // Mock error API response
    const mockErrorResponse = {
      status: "error",
      message: "Breed not found",
    };

    // Mock the fetch implementation with error status
    (global.fetch as any).mockResolvedValue({
      ok: true, // The HTTP response is OK, but the API returned an error status
      json: async () => mockErrorResponse,
    });

    // Assert that the service throws the expected error
    await expect(getRandomDogImage()).rejects.toThrow(
      "Failed to fetch dog image from API",
    );

    // Verify fetch was called
    expect(global.fetch).toHaveBeenCalledOnce();
  });

  // Additional negative test for network failure
  it("should throw error when fetch fails (network error)", async () => {
    // Mock fetch to reject with network error
    (global.fetch as any).mockRejectedValue(new Error("Network error"));

    // Assert that the service throws the expected error
    await expect(getRandomDogImage()).rejects.toThrow(
      "Failed to fetch dog image: Network error",
    );

    // Verify fetch was called
    expect(global.fetch).toHaveBeenCalledOnce();
  });
});
