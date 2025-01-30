@echo off
echo Setting up HTML Email Sender Project...

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

REM Install dependencies
echo Installing project dependencies...
call npm install

REM Generate Prisma client
echo Generating Prisma client...
call npx prisma generate

REM Run database migrations
echo Running database migrations...
call npx prisma migrate dev

REM Start the Next.js development server
echo Starting the application...
start npm run dev

echo Application is running. Open http://localhost:3000 in your browser.
pause