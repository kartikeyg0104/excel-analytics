#!/bin/bash

# Excel Analytics - Start All Services Script

echo "🚀 Starting Excel Analytics Full Stack Application..."
echo ""
echo "📊 Starting services:"
echo "  - Backend API (Port 3000)"
echo "  - Frontend App (Port 5173)" 
echo "  - Admin Panel (Port 5174)"
echo ""

# Run all services concurrently
npm run dev

echo ""
echo "✅ All services started successfully!"
echo ""
echo "🌐 Access your applications:"
echo "  Frontend:    http://localhost:5173"
echo "  Admin Panel: http://localhost:5174" 
echo "  Backend API: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"
