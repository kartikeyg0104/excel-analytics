#!/bin/bash

echo "🧪 Testing Excel Analytics Backend API..."
echo ""

# Test 1: Backend Health Check
echo "1. Testing Backend Health..."
curl -s -o /dev/null -w "Status: %{http_code}" http://localhost:3000/
echo ""
echo ""

# Test 2: User Registration
echo "2. Testing User Registration..."
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User", 
    "email": "test@example.com",
    "password": "testpassword123"
  }' \
  -w "\nStatus: %{http_code}\n"

echo ""
echo "✅ API Test Complete!"
