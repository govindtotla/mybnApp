#!/bin/bash

# Script to get SHA-1 fingerprint for Android OAuth setup
# This is needed when configuring Google OAuth for Android in Google Cloud Console

echo "🔍 Getting SHA-1 fingerprint for Android OAuth setup..."
echo ""

# Check if running on macOS or Linux
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "📱 macOS detected"
    KEYSTORE_PATH="$HOME/.android/debug.keystore"
else
    echo "🐧 Linux detected"
    KEYSTORE_PATH="$HOME/.android/debug.keystore"
fi

# Check if debug keystore exists
if [ ! -f "$KEYSTORE_PATH" ]; then
    echo "❌ Debug keystore not found at: $KEYSTORE_PATH"
    echo ""
    echo "Creating debug keystore..."
    keytool -genkey -v -keystore "$KEYSTORE_PATH" -alias androiddebugkey -storepass android -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"
    echo ""
fi

echo "🔑 Getting SHA-1 from debug keystore..."
echo ""

# Get SHA-1
SHA1=$(keytool -list -v -keystore "$KEYSTORE_PATH" -alias androiddebugkey -storepass android -keypass android 2>/dev/null | grep -A 1 "SHA1:" | grep -o "[0-9A-F:]\{47\}")

if [ -z "$SHA1" ]; then
    echo "❌ Could not extract SHA-1. Trying alternative method..."
    keytool -list -v -keystore "$KEYSTORE_PATH" -alias androiddebugkey -storepass android -keypass android
else
    echo "✅ SHA-1 Fingerprint:"
    echo "$SHA1"
    echo ""
    echo "📋 Copy this SHA-1 and paste it in Google Cloud Console:"
    echo "   APIs & Services → Credentials → Create OAuth Client ID → Android"
    echo ""
fi

# Also check for release keystore if using EAS
echo ""
echo "💡 For EAS Build (production), get SHA-1 from:"
echo "   eas credentials"
echo "   → Select Android"
echo "   → View credentials"
echo "   → Copy SHA-1"
