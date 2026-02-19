export async function fetchWeatherData(location) {
  // Mock API call to OpenWeatherMap or similar
  
  await new Promise(resolve => setTimeout(resolve, 300));

  // Determine if region is prone to drought or flood based on location string (simple heuristic)
  const isDroughtProne = location.toLowerCase().includes('rajasthan') || location.toLowerCase().includes('gujarat');
  const isFloodProne = location.toLowerCase().includes('bihar') || location.toLowerCase().includes('assam');

  let rainfallRisk = 0.2; // Low risk default
  if (isDroughtProne) rainfallRisk = 0.7;
  if (isFloodProne) rainfallRisk = 0.6;

  return {
    annualRainfall: 800 + Math.random() * 1200, // mm
    averageTemp: 24 + Math.random() * 10, // Celsius
    weatherRiskScore: Math.floor(rainfallRisk * 100), // 0-100, higher is worse weather risk
  };
}
