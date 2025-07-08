#!/bin/bash

echo "Testing Excel Data Analyzer Frontend"
echo "======================================"

# Test if the dev server is running
echo "1. Testing main page..."
status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/)
if [ "$status" = "200" ]; then
    echo "✅ Main page (/) - OK"
else
    echo "❌ Main page (/) - FAILED (HTTP $status)"
fi

# Test other routes
echo "2. Testing other routes..."
routes=("/login" "/signup" "/dashboard" "/charts" "/data-analysis" "/profile")
for route in "${routes[@]}"; do
    status=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:5173$route")
    if [ "$status" = "200" ]; then
        echo "✅ $route - OK"
    else
        echo "❌ $route - FAILED (HTTP $status)"
    fi
done

# Test if build works
echo "3. Testing build..."
cd /Users/kartikey0104/Desktop/excel/excel-data-analyzer/frontend
if npm run build > /dev/null 2>&1; then
    echo "✅ Build - OK"
else
    echo "❌ Build - FAILED"
fi

echo "======================================"
echo "Test completed!"
