<?php
/**
 * Template Name: Login/Register Page
 *
 * @package Themee
 */

get_header(); ?>

<main class="login-page-container">
    <div class="login-form-container">
        <!-- Logo -->
        <div class="text-center mb-5">
            <?php if (has_custom_logo()): ?>
                <?php the_custom_logo(); ?>
            <?php else: ?>
                <img class="login-logo" src="<?php echo get_template_directory_uri(); ?>/assets/image/logo.png" alt="<?php bloginfo('name'); ?>">
            <?php endif; ?>
        </div>
        
        <!-- Title -->
        <div class="login-title">
            ورود | ثبت نام
        </div>
        
        <!-- Description -->
        <div class="login-description">
            لطفا شماره موبایل خود را وارد کنید
        </div>
        
        <!-- Login Form -->
        <form id="loginForm" class="flex flex-col gap-y-1">
            <input type="tel" 
                   id="phoneNumber" 
                   name="phone_number" 
                   placeholder="شماره تلفن" 
                   class="login-input"
                   required>
            
            <button type="submit" 
                    id="loginBtn"
                    class="login-button">
                ورود
            </button>
        </form>
        
        <!-- Verification Form (Hidden Initially) -->
        <form id="verificationForm" class="verification-form hidden">
            <div class="verification-info">
                <div class="verification-info-text">
                    کد تایید به شماره <span id="phoneDisplay" class="verification-phone"></span> ارسال شد
                </div>
            </div>
            
            <input type="text" 
                   id="verificationCode" 
                   name="verification_code" 
                   placeholder="کد تایید" 
                   maxlength="6"
                   class="login-input verification-code-input"
                   required>
            
            <div class="verification-buttons">
                <button type="button" 
                        id="resendBtn"
                        class="verification-button secondary">
                    ارسال مجدد
                </button>
                <button type="submit" 
                        id="verifyBtn"
                        class="verification-button primary">
                    تایید
                </button>
            </div>
            
            <button type="button" 
                    id="backBtn"
                    class="back-button">
                بازگشت
            </button>
        </form>
        
        <!-- Terms -->
        <div class="login-terms">
            ورود شما به معنای پذیرش 
            <a href="<?php echo get_privacy_policy_url(); ?>">
                قوانین و مقررات
            </a> 
            <?php bloginfo('name'); ?> میباشد.
        </div>
        
        <!-- Development Link (Remove in production) -->
        <?php if (defined('WP_DEBUG') && WP_DEBUG): ?>
        <div class="text-center mt-4">
            <a href="<?php echo home_url('/verification-codes'); ?>" class="text-xs text-gray-400 hover:text-gray-600">
                نمایش کدهای تایید (توسعه)
            </a>
        </div>
        <?php endif; ?>
        
        <!-- Loading Overlay -->
        <div id="loadingOverlay" class="loading-overlay hidden">
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <p class="loading-text">در حال پردازش...</p>
            </div>
        </div>
        
        <!-- Success/Error Messages -->
        <div id="messageContainer" class="message-container hidden">
            <div id="messageContent" class="message-content"></div>
        </div>
    </div>
</main>

<?php get_footer(); ?>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const verificationForm = document.getElementById('verificationForm');
    const phoneNumberInput = document.getElementById('phoneNumber');
    const verificationCodeInput = document.getElementById('verificationCode');
    const loginBtn = document.getElementById('loginBtn');
    const verifyBtn = document.getElementById('verifyBtn');
    const resendBtn = document.getElementById('resendBtn');
    const backBtn = document.getElementById('backBtn');
    const phoneDisplay = document.getElementById('phoneDisplay');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const messageContainer = document.getElementById('messageContainer');
    const messageContent = document.getElementById('messageContent');
    
    let currentPhoneNumber = '';
    let resendTimer = null;
    let resendCountdown = 60;
    
    // Format phone number input
    phoneNumberInput.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');
        if (value.length > 11) {
            value = value.substring(0, 11);
        }
        this.value = value;
    });
    
    // Format verification code input
    verificationCodeInput.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');
        if (value.length > 6) {
            value = value.substring(0, 6);
        }
        this.value = value;
    });
    
    // Login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const phoneNumber = phoneNumberInput.value.trim();
        
        if (!phoneNumber) {
            showMessage('لطفا شماره موبایل خود را وارد کنید', 'error');
            return;
        }
        
        if (phoneNumber.length !== 11) {
            showMessage('شماره موبایل باید 11 رقم باشد', 'error');
            return;
        }
        
        if (!phoneNumber.startsWith('09')) {
            showMessage('شماره موبایل باید با 09 شروع شود', 'error');
            return;
        }
        
        // Show loading
        showLoading(true);
        
        // Send verification code
        sendVerificationCode(phoneNumber);
    });
    
    // Verification form submission
    verificationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const verificationCode = verificationCodeInput.value.trim();
        
        if (!verificationCode) {
            showMessage('لطفا کد تایید را وارد کنید', 'error');
            return;
        }
        
        if (verificationCode.length !== 6) {
            showMessage('کد تایید باید 6 رقم باشد', 'error');
            return;
        }
        
        verifyCode(currentPhoneNumber, verificationCode);
    });
    
    // Resend code
    resendBtn.addEventListener('click', function() {
        if (resendCountdown > 0) return;
        
        showLoading(true);
        sendVerificationCode(currentPhoneNumber);
    });
    
    // Back button
    backBtn.addEventListener('click', function() {
        showLoginForm();
    });
    
    // Send verification code
    function sendVerificationCode(phoneNumber) {
        const formData = new FormData();
        formData.append('action', 'send_verification_code');
        formData.append('phone_number', phoneNumber);
        formData.append('nonce', '<?php echo wp_create_nonce('verification_nonce'); ?>');
        
        fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            showLoading(false);
            
            if (data.success) {
                currentPhoneNumber = phoneNumber;
                phoneDisplay.textContent = phoneNumber;
                showVerificationForm();
                startResendTimer();
                showMessage('کد تایید ارسال شد', 'success');
            } else {
                showMessage(data.data || 'خطا در ارسال کد تایید', 'error');
            }
        })
        .catch(error => {
            showLoading(false);
            console.error('Error:', error);
            showMessage('خطا در ارتباط با سرور', 'error');
        });
    }
    
    // Verify code
    function verifyCode(phoneNumber, code) {
        showLoading(true);
        
        const formData = new FormData();
        formData.append('action', 'verify_code');
        formData.append('phone_number', phoneNumber);
        formData.append('verification_code', code);
        formData.append('nonce', '<?php echo wp_create_nonce('verification_nonce'); ?>');
        
        fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            showLoading(false);
            
            if (data.success) {
                showMessage('ورود موفقیت‌آمیز! در حال انتقال...', 'success');
                
                // Redirect after 2 seconds
                setTimeout(() => {
                    if (data.data && data.data.redirect_url) {
                        window.location.href = data.data.redirect_url;
                    } else {
                        window.location.href = '<?php echo home_url(); ?>';
                    }
                }, 2000);
            } else {
                showMessage(data.data || 'کد تایید اشتباه است', 'error');
            }
        })
        .catch(error => {
            showLoading(false);
            console.error('Error:', error);
            showMessage('خطا در ارتباط با سرور', 'error');
        });
    }
    
    // Show login form
    function showLoginForm() {
        loginForm.classList.remove('hidden');
        verificationForm.classList.add('hidden');
        phoneNumberInput.value = '';
        verificationCodeInput.value = '';
        currentPhoneNumber = '';
        clearResendTimer();
    }
    
    // Show verification form
    function showVerificationForm() {
        loginForm.classList.add('hidden');
        verificationForm.classList.remove('hidden');
        verificationCodeInput.focus();
    }
    
    // Show loading
    function showLoading(show) {
        if (show) {
            loadingOverlay.classList.remove('hidden');
        } else {
            loadingOverlay.classList.add('hidden');
        }
    }
    
    // Show message
    function showMessage(message, type) {
        messageContent.textContent = message;
        messageContainer.classList.remove('hidden');
        
        if (type === 'success') {
            messageContent.className = 'message-content message-success';
        } else {
            messageContent.className = 'message-content message-error';
        }
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            messageContainer.classList.add('hidden');
        }, 5000);
    }
    
    // Start resend timer
    function startResendTimer() {
        resendCountdown = 60;
        resendBtn.textContent = `ارسال مجدد (${resendCountdown})`;
        resendBtn.disabled = true;
        
        resendTimer = setInterval(() => {
            resendCountdown--;
            resendBtn.textContent = `ارسال مجدد (${resendCountdown})`;
            
            if (resendCountdown <= 0) {
                clearResendTimer();
                resendBtn.textContent = 'ارسال مجدد';
                resendBtn.disabled = false;
            }
        }, 1000);
    }
    
    // Clear resend timer
    function clearResendTimer() {
        if (resendTimer) {
            clearInterval(resendTimer);
            resendTimer = null;
        }
        resendCountdown = 0;
        resendBtn.textContent = 'ارسال مجدد';
        resendBtn.disabled = false;
    }
});
</script>
