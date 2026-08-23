#!/bin/bash
export TEST_PORT=5919
export PORT=5919

# Start the server and redirect output to a temporary file
node index.js > /tmp/argendar-test-server.log 2>&1 &
SERVER_PID=$!

echo "Test server started on port 5001 with PID $SERVER_PID"
echo "Waiting for server to initialize..."
sleep 3

# Run our integration tests
node scratch/test_endpoints.js
TEST_EXIT_CODE=$?

# Stop the server
echo "Stopping test server..."
kill $SERVER_PID

# Show logs if the tests failed
if [ $TEST_EXIT_CODE -ne 0 ]; then
  echo "Tests failed. Output logs from the test server:"
  cat /tmp/argendar-test-server.log
fi

exit $TEST_EXIT_CODE
