import { fetchSatelliteData } from './farmonaut.js';
import { fetchWeatherData } from './weather.js';

export async function calculateCreditScore(farmer, revenueHistory = []) {
  /**
   * Credit Scoring Weights:
   * - Land Size: 20% (Medium Impact)
   * - Loan History (Mocked): 20% (Medium Impact)
   * - Crop Yield Potential (Satellite/Weather): 30% (High Impact due to focus on future repayment)
   * - Revenue History: 30% (Direct ability to pay)
   * 
   * Base Score: 300
   * Max Score: 900
   */

  const { location, farmSize, region, id } = farmer;

  // 1. Fetch External Data (Parallel)
  const [satelliteData, weatherData] = await Promise.all([
    fetchSatelliteData(location, farmSize),
    fetchWeatherData(location, region)
  ]);

  // 2. Calculate Component Scores (0-100 scale for each component)

  // --- Land Size Score ---
  // More land generally implies higher production capacity, but diminishes after a point (scalability issues)
  // Threshold: 20 acres maxes out this score.
  const landScore = Math.min((farmSize / 20) * 100, 100);

  // --- Loan History Score ---
  // In a real system, we'd query a credit bureau or our own loan repayment table.
  // For now, we'll derive a proxy score based on 'documentsVerified' as a trust indicator.
  // Or simply mock it. Let's use a deterministic hash of the ID for consistency in demo.
  const loanHistoryScore = (id.charCodeAt(0) + id.charCodeAt(id.length - 1)) % 100; 

  // --- Yield Potential Score ---
  // Composite of Vegetation Index (NDVI), Soil Moisture, and Weather Risk
  // Good NDVI (>0.6) is great. High weather risk is bad.
  const viScore = satelliteData.vegetationIndex * 100; // 0.4 -> 40, 0.8 -> 80
  const moistureScore = (satelliteData.soilMoisture > 0.3 && satelliteData.soilMoisture < 0.8) ? 90 : 50; // Optimal range
  
  // Weather risk reduces the score
  const weatherFactor = 100 - weatherData.weatherRiskScore; 

  const yieldPotentialScore = (viScore * 0.4) + (moistureScore * 0.3) + (weatherFactor * 0.3);

  // --- Revenue History Score ---
  // Calculate average annual revenue stability
  let revenueScore = 50; // Default for new farmers without history
  if (revenueHistory.length > 0) {
    const totalRev = revenueHistory.reduce((acc, curr) => acc + curr.amount, 0);
    const avgRev = totalRev / revenueHistory.length;
    // Normalize: Assume 50,000 INR/acre is decent benchmark
    const revenuePerAcre = farmSize > 0 ? avgRev / farmSize : 0;
    revenueScore = Math.min((revenuePerAcre / 50000) * 80, 100); 
  }

  // 3. Final Weighted Calculation
  // Weights: Land(0.2), Loan(0.2), Yield(0.3), Revenue(0.3)
  const weightedScore = 
    (landScore * 0.2) +
    (loanHistoryScore * 0.2) +
    (yieldPotentialScore * 0.3) +
    (revenueScore * 0.3);

  // Map 0-100 to 300-900 range
  const finalScore = Math.round(300 + (weightedScore * 6));

  return {
    score: finalScore,
    details: {
      landScore: Math.round(landScore),
      loanHistoryScore: Math.round(loanHistoryScore),
      yieldPotentialScore: Math.round(yieldPotentialScore),
      revenueScore: Math.round(revenueScore),
      satelliteData,
      weatherData
    }
  };
}
