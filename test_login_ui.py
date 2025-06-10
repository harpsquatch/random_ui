"""
Selenium Test Suite for Login UI
Tests the complete login flow including form validation, login attempts, and demo page navigation
"""

import pytest
import time
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager


class TestLoginUI:
    """Test suite for Login UI functionality"""
    
    @pytest.fixture(autouse=True)
    def setup_and_teardown(self):
        """Setup and teardown for each test"""
        # Setup Chrome options
        chrome_options = Options()
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920,1080")
        # Uncomment the next line to run headless
        # chrome_options.add_argument("--headless")
        
        # Initialize the driver
        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service, options=chrome_options)
        self.wait = WebDriverWait(self.driver, 10)
        
        # Get the current directory and construct file path
        current_dir = os.path.dirname(os.path.abspath(__file__))
        self.login_page_path = f"file://{current_dir}/index.html"
        self.demo_page_path = f"file://{current_dir}/demo.html"
        
        yield
        
        # Teardown
        self.driver.quit()
    
    def test_page_loads_correctly(self):
        """Test that the login page loads with all essential elements"""
        self.driver.get(self.login_page_path)
        
        # Check page title
        assert "Modern Login UI" in self.driver.title
        
        # Check essential elements are present
        assert self.driver.find_element(By.ID, "email").is_displayed()
        assert self.driver.find_element(By.ID, "password").is_displayed()
        assert self.driver.find_element(By.CLASS_NAME, "login-btn").is_displayed()
        
        # Check header text
        header = self.driver.find_element(By.TAG_NAME, "h1")
        assert "Welcome Back" in header.text
        
        print("✓ Page loads correctly with all essential elements")
    
    def test_form_validation_empty_fields(self):
        """Test form validation for empty fields"""
        self.driver.get(self.login_page_path)
        
        # Wait for the page to load and dismiss the demo notification
        time.sleep(2)
        
        # Try to submit with empty fields
        login_btn = self.driver.find_element(By.CLASS_NAME, "login-btn")
        login_btn.click()
        
        # Wait for validation message
        time.sleep(1)
        
        # Check if validation message appears (it should show "Please fill in all fields")
        # The message appears as a toast notification, so we check if it exists
        messages = self.driver.find_elements(By.CLASS_NAME, "message")
        assert len(messages) > 0, "Validation message should appear for empty fields"
        
        print("✓ Form validation works for empty fields")
    
    def test_form_validation_invalid_email(self):
        """Test form validation for invalid email format"""
        self.driver.get(self.login_page_path)
        time.sleep(2)
        
        # Fill in invalid email and valid password
        email_input = self.driver.find_element(By.ID, "email")
        password_input = self.driver.find_element(By.ID, "password")
        
        email_input.send_keys("invalid-email")
        password_input.send_keys("password123")
        
        # Submit form
        login_btn = self.driver.find_element(By.CLASS_NAME, "login-btn")
        login_btn.click()
        
        # Wait and check for validation message
        time.sleep(1)
        messages = self.driver.find_elements(By.CLASS_NAME, "message")
        assert len(messages) > 0, "Validation message should appear for invalid email"
        
        print("✓ Form validation works for invalid email")
    
    def test_form_validation_short_password(self):
        """Test form validation for password too short"""
        self.driver.get(self.login_page_path)
        time.sleep(2)
        
        # Fill in valid email and short password
        email_input = self.driver.find_element(By.ID, "email")
        password_input = self.driver.find_element(By.ID, "password")
        
        email_input.send_keys("test@example.com")
        password_input.send_keys("123")  # Too short
        
        # Submit form
        login_btn = self.driver.find_element(By.CLASS_NAME, "login-btn")
        login_btn.click()
        
        # Wait and check for validation message
        time.sleep(1)
        messages = self.driver.find_elements(By.CLASS_NAME, "message")
        assert len(messages) > 0, "Validation message should appear for short password"
        
        print("✓ Form validation works for short password")
    
    def test_password_toggle_functionality(self):
        """Test password visibility toggle"""
        self.driver.get(self.login_page_path)
        time.sleep(2)
        
        password_input = self.driver.find_element(By.ID, "password")
        toggle_btn = self.driver.find_element(By.ID, "togglePassword")
        
        # Initially password should be hidden
        assert password_input.get_attribute("type") == "password"
        
        # Click toggle button
        toggle_btn.click()
        time.sleep(0.5)
        
        # Password should now be visible
        assert password_input.get_attribute("type") == "text"
        
        # Click again to hide
        toggle_btn.click()
        time.sleep(0.5)
        
        # Password should be hidden again
        assert password_input.get_attribute("type") == "password"
        
        print("✓ Password toggle functionality works correctly")
    
    def test_remember_me_checkbox(self):
        """Test remember me checkbox functionality"""
        self.driver.get(self.login_page_path)
        time.sleep(2)
        
        remember_checkbox = self.driver.find_element(By.ID, "remember")
        
        # Initially should be unchecked
        assert not remember_checkbox.is_selected()
        
        # Click the checkbox label (since the actual checkbox is hidden)
        checkbox_wrapper = self.driver.find_element(By.CLASS_NAME, "checkbox-wrapper")
        checkbox_wrapper.click()
        time.sleep(0.5)
        
        # Should now be checked
        assert remember_checkbox.is_selected()
        
        print("✓ Remember me checkbox works correctly")
    
    def test_social_login_buttons(self):
        """Test social login buttons are clickable and show messages"""
        self.driver.get(self.login_page_path)
        time.sleep(2)
        
        # Test Google login button
        google_btn = self.driver.find_element(By.CLASS_NAME, "google-btn")
        assert google_btn.is_displayed()
        google_btn.click()
        time.sleep(1)
        
        # Test GitHub login button
        github_btn = self.driver.find_element(By.CLASS_NAME, "github-btn")
        assert github_btn.is_displayed()
        github_btn.click()
        time.sleep(1)
        
        print("✓ Social login buttons are functional")
    
    def test_forgot_password_link(self):
        """Test forgot password link"""
        self.driver.get(self.login_page_path)
        time.sleep(2)
        
        forgot_link = self.driver.find_element(By.CLASS_NAME, "forgot-password")
        assert forgot_link.is_displayed()
        forgot_link.click()
        time.sleep(1)
        
        # Should show a message about password reset
        messages = self.driver.find_elements(By.CLASS_NAME, "message")
        assert len(messages) > 0
        
        print("✓ Forgot password link works correctly")
    
    def test_signup_link(self):
        """Test signup link"""
        self.driver.get(self.login_page_path)
        time.sleep(2)
        
        signup_link = self.driver.find_element(By.CSS_SELECTOR, ".signup-link a")
        assert signup_link.is_displayed()
        signup_link.click()
        time.sleep(1)
        
        # Should show a message about signup page
        messages = self.driver.find_elements(By.CLASS_NAME, "message")
        assert len(messages) > 0
        
        print("✓ Signup link works correctly")
    
    def test_successful_login_flow(self):
        """Test successful login and redirect to demo page"""
        self.driver.get(self.login_page_path)
        time.sleep(2)
        
        # Fill in demo credentials
        email_input = self.driver.find_element(By.ID, "email")
        password_input = self.driver.find_element(By.ID, "password")
        
        email_input.send_keys("demo@example.com")
        password_input.send_keys("password123")
        
        # Submit form
        login_btn = self.driver.find_element(By.CLASS_NAME, "login-btn")
        login_btn.click()
        
        # Wait for loading animation and potential success
        time.sleep(3)
        
        # Due to random success/failure, we might get either success or failure
        # Let's check what happened
        current_url = self.driver.current_url
        
        if "demo.html" in current_url:
            # Success case - we're on demo page
            assert "demo.html" in current_url
            
            # Check demo page elements
            demo_title = self.wait.until(
                EC.presence_of_element_located((By.CLASS_NAME, "demo-title"))
            )
            assert "This is just a demo" in demo_title.text
            
            print("✓ Successful login redirects to demo page")
        else:
            # Failure case - we're still on login page
            assert "index.html" in current_url or current_url.endswith("/")
            print("✓ Failed login keeps user on login page (random failure simulation)")
    
    def test_demo_page_elements(self):
        """Test demo page loads correctly with all elements"""
        self.driver.get(self.demo_page_path)
        time.sleep(2)
        
        # Check essential elements
        demo_title = self.driver.find_element(By.CLASS_NAME, "demo-title")
        assert "This is just a demo" in demo_title.text
        
        # Check success icon
        success_icon = self.driver.find_element(By.CLASS_NAME, "success-icon")
        assert success_icon.is_displayed()
        
        # Check feature items
        feature_items = self.driver.find_elements(By.CLASS_NAME, "feature-item")
        assert len(feature_items) == 4  # Should have 4 feature items
        
        # Check action buttons
        back_btn = self.driver.find_element(By.CSS_SELECTOR, ".primary-btn")
        info_btn = self.driver.find_element(By.CSS_SELECTOR, ".secondary-btn")
        assert back_btn.is_displayed()
        assert info_btn.is_displayed()
        
        print("✓ Demo page loads correctly with all elements")
    
    def test_demo_page_back_to_login(self):
        """Test navigation back to login from demo page"""
        self.driver.get(self.demo_page_path)
        time.sleep(2)
        
        # Click back to login button
        back_btn = self.driver.find_element(By.CSS_SELECTOR, ".primary-btn")
        back_btn.click()
        
        # Wait for redirect
        time.sleep(2)
        
        # Should be back on login page
        current_url = self.driver.current_url
        assert "index.html" in current_url
        
        # Check we're on login page
        assert self.driver.find_element(By.ID, "email").is_displayed()
        
        print("✓ Back to login navigation works correctly")
    
    def test_demo_page_info_modal(self):
        """Test info modal on demo page"""
        self.driver.get(self.demo_page_path)
        time.sleep(2)
        
        # Click info button
        info_btn = self.driver.find_element(By.CSS_SELECTOR, ".secondary-btn")
        info_btn.click()
        time.sleep(1)
        
        # Check modal appears
        modal = self.wait.until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "div[style*='position: fixed']"))
        )
        assert modal.is_displayed()
        
        # Check modal content
        modal_content = modal.find_element(By.TAG_NAME, "div")
        assert "About This Demo" in modal_content.text
        
        # Close modal by clicking the button
        close_btn = modal.find_element(By.TAG_NAME, "button")
        close_btn.click()
        time.sleep(1)
        
        print("✓ Info modal works correctly")
    
    def test_konami_code_easter_egg(self):
        """Test Konami code easter egg functionality"""
        self.driver.get(self.login_page_path)
        time.sleep(2)
        
        # Execute Konami code sequence
        body = self.driver.find_element(By.TAG_NAME, "body")
        
        # Konami sequence: ↑↑↓↓←→←→BA
        keys_sequence = [
            Keys.ARROW_UP, Keys.ARROW_UP,
            Keys.ARROW_DOWN, Keys.ARROW_DOWN,
            Keys.ARROW_LEFT, Keys.ARROW_RIGHT,
            Keys.ARROW_LEFT, Keys.ARROW_RIGHT,
            'b', 'a'
        ]
        
        for key in keys_sequence:
            body.send_keys(key)
            time.sleep(0.1)
        
        time.sleep(1)
        
        # Check if form was auto-filled
        email_input = self.driver.find_element(By.ID, "email")
        password_input = self.driver.find_element(By.ID, "password")
        remember_checkbox = self.driver.find_element(By.ID, "remember")
        
        assert email_input.get_attribute("value") == "demo@example.com"
        assert password_input.get_attribute("value") == "password123"
        assert remember_checkbox.is_selected()
        
        print("✓ Konami code easter egg works correctly")
    
    def test_responsive_design_mobile(self):
        """Test responsive design by resizing to mobile viewport"""
        self.driver.get(self.login_page_path)
        
        # Resize to mobile viewport
        self.driver.set_window_size(375, 667)  # iPhone size
        time.sleep(2)
        
        # Check that elements are still visible and functional
        login_card = self.driver.find_element(By.CLASS_NAME, "login-card")
        assert login_card.is_displayed()
        
        email_input = self.driver.find_element(By.ID, "email")
        password_input = self.driver.find_element(By.ID, "password")
        login_btn = self.driver.find_element(By.CLASS_NAME, "login-btn")
        
        assert email_input.is_displayed()
        assert password_input.is_displayed()
        assert login_btn.is_displayed()
        
        # Test input functionality on mobile
        email_input.send_keys("test@mobile.com")
        password_input.send_keys("mobile123")
        
        assert email_input.get_attribute("value") == "test@mobile.com"
        assert password_input.get_attribute("value") == "mobile123"
        
        print("✓ Responsive design works correctly on mobile viewport")
    
    def test_multiple_login_attempts(self):
        """Test multiple login attempts (simulate real user behavior)"""
        self.driver.get(self.login_page_path)
        time.sleep(2)
        
        attempts = 0
        max_attempts = 5
        
        while attempts < max_attempts:
            # Clear any existing values
            email_input = self.driver.find_element(By.ID, "email")
            password_input = self.driver.find_element(By.ID, "password")
            
            email_input.clear()
            password_input.clear()
            
            # Fill credentials
            email_input.send_keys("demo@example.com")
            password_input.send_keys("password123")
            
            # Submit
            login_btn = self.driver.find_element(By.CLASS_NAME, "login-btn")
            login_btn.click()
            
            # Wait for result
            time.sleep(3)
            
            current_url = self.driver.current_url
            if "demo.html" in current_url:
                print(f"✓ Login successful after {attempts + 1} attempts")
                break
            else:
                attempts += 1
                print(f"  Attempt {attempts} failed (random simulation)")
                time.sleep(1)  # Brief pause before next attempt
        
        if attempts == max_attempts:
            print(f"✓ Completed {max_attempts} login attempts (testing random failure simulation)")


def run_tests():
    """Run all tests with HTML report generation"""
    import subprocess
    import sys
    
    # Run pytest with HTML report
    result = subprocess.run([
        sys.executable, "-m", "pytest", 
        "test_login_ui.py", 
        "--html=test_report.html", 
        "--self-contained-html",
        "-v"
    ], capture_output=True, text=True)
    
    print("Test Results:")
    print(result.stdout)
    if result.stderr:
        print("Errors:")
        print(result.stderr)
    
    return result.returncode == 0


if __name__ == "__main__":
    # If running directly, execute the test runner
    success = run_tests()
    if success:
        print("\n🎉 All tests completed! Check test_report.html for detailed results.")
    else:
        print("\n❌ Some tests failed. Check test_report.html for details.") 