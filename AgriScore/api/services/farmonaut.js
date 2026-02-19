export async function fetchSatelliteData(location, farmSize) {
  // Mock API call to Farmonaut or similar satellite data provider
  // In a real app, this would use the location coordinates to fetch NDVI, soil moisture, etc.
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Generate mock data based on randomness but consistent for the session if needed
  // Here we just return random plausible values
  
  const vegetationIndex = 0.4 + Math.random() * 0.5; // 0.4 to 0.9 (Healthy)
  const soilMoisture = 0.3 + Math.random() * 0.4; // 30% to 70%
  
  // Crop suitability score (0-100)
  // This would be a complex calculation based on soil type, history, etc.
  const cropSuitability = Math.floor(60 + Math.random() * 35);

  return {
    vegetationIndex, // NDVI
    soilMoisture,
    cropSuitability,
    lastSatellitePass: new Date().toISOString(),
  };
}
