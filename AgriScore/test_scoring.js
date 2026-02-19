import { calculateCreditScore } from './api/services/scoring.js';

async function test() {
  console.log('--- Testing Credit Scoring Engine ---');

  // Test Case 1: Small Farm, No History (Base Case)
  const farmer1 = {
    id: 'f1',
    name: 'Ramesh',
    location: 'Sikar, Rajasthan', // Drought prone
    farmSize: 2.5, // Small
    region: 'North'
  };
  
  console.log(`\nTesting Farmer 1: ${farmer1.name} (${farmer1.location}, ${farmer1.farmSize} acres)`);
  const score1 = await calculateCreditScore(farmer1);
  console.log('Score:', score1.score);
  console.log('Details:', score1.details);


  // Test Case 2: Large Farm, Good Location, Good Revenue
  const farmer2 = {
    id: 'f2',
    name: 'Suresh',
    location: 'Patna, Bihar', // Flood prone but fertile
    farmSize: 15, // Large
    region: 'East'
  };

  const revenue2 = [
    { year: 2023, amount: 800000, season: 'Kharif', crop: 'Rice' }, // ~53k/acre
    { year: 2024, amount: 750000, season: 'Rabi', crop: 'Wheat' }
  ];

  console.log(`\nTesting Farmer 2: ${farmer2.name} (${farmer2.location}, ${farmer2.farmSize} acres)`);
  const score2 = await calculateCreditScore(farmer2, revenue2);
  console.log('Score:', score2.score);
  console.log('Details:', score2.details);

  if (score2.score > score1.score) {
    console.log('\n[PASS] Logic Check: Large/Prosperous farmer has higher score.');
  } else {
    console.log('\n[FAIL] Logic Check: Scores do not reflect expected disparity.');
  }
}

test();
