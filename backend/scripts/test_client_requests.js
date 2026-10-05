import JobRequestsService from '../src/services/JobRequestsService.js';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  const userId = 'b058ab2d-29ef-4dca-b1f3-712f02680afe'; // Client ID from previous test
  console.log(`Fetching requests for client: ${userId}`);
  
  try {
    const requests = await JobRequestsService.getClientRequests(userId);
    console.log(JSON.stringify(requests, null, 2));
  } catch (error) {
    console.error("Error fetching requests:", error);
  }
}

test();
