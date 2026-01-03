#!/bin/bash

echo "🚀 DayFlow HRMS - Quick Start Script"
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm -v)"
echo ""

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

echo "✅ Dependencies installed"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    echo "VITE_API_BASE_URL=http://localhost:3000" > .env
    echo "✅ .env file created"
    echo ""
fi

echo "🎉 Setup complete!"
echo ""
echo "📋 Available commands:"
echo "  npm run dev      - Start development server"
echo "  npm run build    - Build for production"
echo "  npm run preview  - Preview production build"
echo ""
echo "🌐 Pages available:"
echo "  Sign In:  http://localhost:5173/"
echo "  Sign Up:  http://localhost:5173/sign-up"
echo ""
echo "▶️  Starting development server..."
echo ""

npm run dev