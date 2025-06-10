document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    
    // Smart button finder - works with any button structure
    const loginBtn = document.querySelector('.new-submit-btn') || 
                     document.querySelector('#newLoginButton') || 
                     document.querySelector('.login-btn') || 
                     document.querySelector('.btn-primary') || 
                     document.querySelector('button[type="submit"]');
    
    const rememberCheckbox = document.getElementById('remember');
    
    // Password toggle functionality
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });
    
    // Enhanced input focus effects
    const inputs = document.querySelectorAll('input[type="email"], input[type="password"]');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
        
        // Add typing animation
        input.addEventListener('input', function() {
            if (this.value.length > 0) {
                this.style.fontWeight = '500';
            } else {
                this.style.fontWeight = '400';
            }
        });
    });
    
    // Form submission with loading animation
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        
        // Basic validation
        if (!email || !password) {
            showMessage('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showMessage('Please enter a valid email address', 'error');
            emailInput.focus();
            return;
        }
        
        if (password.length < 6) {
            showMessage('Password must be at least 6 characters long', 'error');
            passwordInput.focus();
            return;
        }
        
        // Simulate login process
        performLogin(email, password);
    });
    
    // Social login buttons
    const socialBtns = document.querySelectorAll('.social-btn');
    socialBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const provider = this.classList.contains('google-btn') ? 'Google' : 'GitHub';
            showMessage(`${provider} login would be implemented here`, 'info');
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // Remember me checkbox animation
    rememberCheckbox.addEventListener('change', function() {
        const checkmark = this.nextElementSibling;
        if (this.checked) {
            checkmark.style.transform = 'scale(1.1)';
            setTimeout(() => {
                checkmark.style.transform = 'scale(1)';
            }, 200);
        }
    });
    
    // Forgot password link
    const forgotPasswordLink = document.querySelector('.forgot-password');
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        showMessage('Password reset would be implemented here', 'info');
    });
    
    // Sign up link
    const signupLink = document.querySelector('.signup-link a');
    signupLink.addEventListener('click', function(e) {
        e.preventDefault();
        showMessage('Sign up page would be implemented here', 'info');
    });
    
    // Functions
    function performLogin(email, password) {
        // Add loading state
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Remove loading state
            loginBtn.classList.remove('loading');
            
            // Simulate random login success/failure for demo
            const isSuccess = Math.random() > 0.3; // 70% success rate
            
            if (isSuccess) {
                loginBtn.classList.add('success');
                showMessage('Login successful! Redirecting...', 'success');
                
                // Redirect to demo page after success animation
                setTimeout(() => {
                    window.location.href = 'demo.html';
                }, 1500);
            } else {
                loginBtn.disabled = false;
                showMessage('Invalid credentials. Please try again.', 'error');
                
                // Shake animation for error
                loginForm.style.animation = 'shake 0.5s ease-in-out';
                setTimeout(() => {
                    loginForm.style.animation = '';
                }, 500);
            }
        }, 2000); // 2 second loading simulation
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.textContent = message;
        
        // Add styles
        Object.assign(messageEl.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            fontSize: '14px',
            zIndex: '1000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });
        
        // Set background color based on type
        switch (type) {
            case 'success':
                messageEl.style.background = '#4caf50';
                break;
            case 'error':
                messageEl.style.background = '#f44336';
                break;
            case 'info':
                messageEl.style.background = '#2196f3';
                break;
            default:
                messageEl.style.background = '#666';
        }
        
        // Add to page
        document.body.appendChild(messageEl);
        
        // Animate in
        setTimeout(() => {
            messageEl.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 3 seconds (unless it's a success message with redirect)
        if (type !== 'success' || !message.includes('Redirecting')) {
            setTimeout(() => {
                messageEl.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (messageEl.parentNode) {
                        messageEl.remove();
                    }
                }, 300);
            }, 3000);
        }
    }
    
    // Add shake animation styles
    const shakeStyles = document.createElement('style');
    shakeStyles.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(shakeStyles);
    
    // Add some random demo credentials on page load
    setTimeout(() => {
        showMessage('Try demo@example.com / password123 for testing', 'info');
    }, 1000);
    
    // Easter egg: Konami code for auto-fill
    let konamiCode = [];
    const konamiSequence = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];
    
    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.code);
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            emailInput.value = 'demo@example.com';
            passwordInput.value = 'password123';
            rememberCheckbox.checked = true;
            showMessage('🎮 Konami code activated! Form auto-filled.', 'success');
            konamiCode = [];
        }
    });
    
    // Add floating particles effect
    createFloatingParticles();
    
    function createFloatingParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        
        // Create particles
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                animation: floatParticle ${5 + Math.random() * 10}s linear infinite;
                left: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 5}s;
            `;
            particlesContainer.appendChild(particle);
        }
        
        document.body.appendChild(particlesContainer);
        
        // Add particle animation
        const particleStyles = document.createElement('style');
        particleStyles.textContent = `
            @keyframes floatParticle {
                0% {
                    transform: translateY(100vh) scale(0);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100px) scale(1);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(particleStyles);
    }
}); 