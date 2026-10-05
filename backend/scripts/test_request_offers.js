import JobRequestsService from '../src/services/JobRequestsService.js';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  const clientId = 'b058ab2d-29ef-4dca-b1f3-712f02680afe'; // Client ID
  const requestId = '23c367ff-c5ae-4bc4-b057-bd6e343f975d'; // Request ID with a pending offer

  console.log(`Fetching offers for request: ${requestId} by client: ${clientId}`);
  
  try {
    const offers = await JobRequestsService.getRequestOffers(clientId, requestId);
    console.log(JSON.stringify(offers, null, 2));
  } catch (error) {
    console.error("Error fetching offers:", error);
  }
}

test();
