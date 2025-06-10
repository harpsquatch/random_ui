#!/usr/bin/env python3
"""
Test Runner for Login UI Selenium Tests
Installs dependencies and runs all tests with HTML reporting
"""

import subprocess
import sys
import os

def install_dependencies():
    """Install required packages"""
    print("📦 Installing dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Dependencies installed successfully!\n")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False

def run_selenium_tests():
    """Run the Selenium test suite"""
    print("🚀 Starting Selenium tests...")
    print("=" * 60)
    
    try:
        # Run pytest with detailed output
        result = subprocess.run([
            sys.executable, "-m", "pytest", 
            "test_login_ui.py", 
            "--html=test_report.html", 
            "--self-contained-html",
            "-v",
            "--tb=short"
        ], text=True)
        
        if result.returncode == 0:
            print("\n" + "=" * 60)
            print("🎉 ALL TESTS PASSED!")
            print("📄 Detailed report saved to: test_report.html")
            print("🌐 Open test_report.html in your browser to view results")
        else:
            print("\n" + "=" * 60)
            print("❌ SOME TESTS FAILED")
            print("📄 Check test_report.html for detailed failure information")
        
        return result.returncode == 0
        
    except FileNotFoundError:
        print("❌ pytest not found. Make sure dependencies are installed.")
        return False

def check_html_files():
    """Check if HTML files exist"""
    required_files = ["index.html", "demo.html"]
    missing_files = []
    
    for file in required_files:
        if not os.path.exists(file):
            missing_files.append(file)
    
    if missing_files:
        print(f"❌ Missing required files: {', '.join(missing_files)}")
        print("   Make sure you're running this from the correct directory.")
        return False
    
    print("✅ All required HTML files found")
    return True

def main():
    """Main test runner"""
    print("🧪 Login UI - Selenium Test Runner")
    print("=" * 60)
    
    # Check if we're in the right directory
    if not check_html_files():
        return False
    
    # Install dependencies
    if not install_dependencies():
        return False
    
    # Run tests
    success = run_selenium_tests()
    
    print("\n" + "=" * 60)
    if success:
        print("✅ Test run completed successfully!")
    else:
        print("⚠️  Test run completed with failures - check report for details")
    
    return success

if __name__ == "__main__":
    try:
        success = main()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\n⏹️  Tests interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n💥 Unexpected error: {e}")
        sys.exit(1) 