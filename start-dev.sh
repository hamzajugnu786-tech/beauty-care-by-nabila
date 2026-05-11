#!/bin/bash
# Persistent dev server startup script
cd /home/z/my-project

# Kill any existing server
pkill -f "next dev" 2>/dev/null || true
sleep 2

# Start the server detached from this shell
nohup npx next dev -p 3000 >> /home/z/my-project/dev.log 2>&1 &
SERVER_PID=$!
echo $SERVER_PID > /home/z/my-project/.dev-pid

# Wait for ready
for i in $(seq 1 30); do
  if curl -s --connect-timeout 2 --max-time 5 http://localhost:3000/ -o /dev/null 2>/dev/null; then
    echo "Server ready on port 3000, PID: $SERVER_PID"
    exit 0
  fi
  sleep 1
done

echo "Server failed to start within 30s"
exit 1
