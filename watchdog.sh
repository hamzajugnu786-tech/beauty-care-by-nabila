#!/bin/bash
cd /home/z/my-project
while true; do
  if ! pgrep -f "next-server" > /dev/null; then
    echo "$(date): Server died, restarting..." >> watchdog.log
    pkill -f "next" 2>/dev/null
    sleep 2
    setsid node node_modules/.bin/next start -p 3000 >> dev.log 2>&1 &
    echo $! > .dev-pid
  fi
  sleep 10
done
