#!/bin/bash

# اسکریپت تست Frontend Development Mode
echo "🧪 تست Frontend Development Mode..."

# بررسی وجود فایل‌های ضروری
echo "📁 بررسی فایل‌های ضروری..."
if [ ! -f "public-frontend/Dockerfile.dev" ]; then
    echo "❌ Dockerfile.dev یافت نشد!"
    exit 1
fi

if [ ! -f "public-frontend/package.json" ]; then
    echo "❌ package.json یافت نشد!"
    exit 1
fi

echo "✅ فایل‌های ضروری موجود هستند"

# تست Docker Compose configuration
echo "🔧 تست Docker Compose configuration..."
docker-compose config --services | grep frontend
if [ $? -eq 0 ]; then
    echo "✅ سرویس frontend در docker-compose.yml موجود است"
else
    echo "❌ سرویس frontend در docker-compose.yml یافت نشد!"
    exit 1
fi

# تست build
echo "🏗️ تست build..."
docker-compose build frontend
if [ $? -eq 0 ]; then
    echo "✅ Build موفق بود"
else
    echo "❌ Build ناموفق بود!"
    exit 1
fi

echo "🎉 تمام تست‌ها موفق بودند!"
echo ""
echo "🚀 برای اجرا:"
echo "   docker-compose up frontend -d"
echo ""
echo "📊 برای مشاهده logs:"
echo "   docker-compose logs frontend -f"
