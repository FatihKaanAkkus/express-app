#!/bin/sh

echo "Running migrations..."
npm run db:deploy

echo "Starting the Express server..."
exec node dist/server.js
