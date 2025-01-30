#!/bin/bash

echo "Setting up HTML Email Sender Project..."

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "Node.js is not installed. Please install Node.js from https://nodejs.org"
    exit 1
fi

# Install dependencies
echo "Installing project dependencies..."
npm install

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "Running database migrations..."
npx prisma migrate dev

# Start the Next.js development server
echo "Starting the application..."
npm run dev