#!/bin/bash

# Check if process is running on port 8545 and kill it
kill -9 $(lsof -ti tcp:8545) 2>/dev/null || echo "No process to kill"

# Create the logs directory if it doesn't exist
mkdir -p ./deployment/logs


# Start the hardhat node in the background, detached from the terminal
nohup npx hardhat node > "./deployment/logs/node_output.txt" 2>&1 &

# In a subshell, wait for 10 seconds, then run the TypeScript parser. This subshell is also sent to the background.
(
   sleep 10
   npx ts-node ./deployment/parse-output.ts
) &

echo "Hardhat node started and TypeScript parser scheduled."
