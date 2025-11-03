<?php
/**
 * Plugin Name: ایرانچه - مدیریت فروشگاه
 * Plugin URI: https://iranche.com
 * Description: نمایش اطلاعات پلن فروشگاه، حجم مصرفی، زمان باقیمانده و تعداد محصولات
 * Version: 1.0.0
 * Author: ایرانچه
 * Author URI: https://iranche.com
 * Text Domain: iranche-shop-manager
 * Domain Path: /languages
 * Requires at least: 5.0
 * Requires PHP: 7.4
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('IRANCHE_SM_VERSION', '1.0.0');
define('IRANCHE_SM_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('IRANCHE_SM_PLUGIN_URL', plugin_dir_url(__FILE__));

/**
 * Main plugin class
 */
class Iranche_Shop_Manager {
    
    private static $instance = null;
    private $main_db_connection = null;
    
    /**
     * Singleton instance
     */
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    /**
     * Constructor
     */
    private function __construct() {
        $this->init_hooks();
    }
    
    /**
     * Initialize hooks
     */
    private function init_hooks() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));
        
        // Check tenant status and restrict access if suspended/expired
        add_action('admin_init', array($this, 'check_tenant_status'));
        add_action('template_redirect', array($this, 'check_tenant_status_frontend'));
        
        // Add AJAX handlers for payment
        add_action('wp_ajax_iranche_renew_plan', array($this, 'handle_renew_plan'));
        add_action('wp_ajax_iranche_process_payment', array($this, 'handle_process_payment'));
    }
    
    /**
     * Get subdomain from current site URL
     */
    private function get_subdomain() {
        $site_url = get_site_url();
        
        // Extract subdomain from URL (e.g., http://testshop.localhost -> testshop)
        $parsed_url = parse_url($site_url);
        $host = isset($parsed_url['host']) ? $parsed_url['host'] : '';
        
        // Remove port if exists
        $host = preg_replace('/:\d+$/', '', $host);
        
        // Extract subdomain
        $parts = explode('.', $host);
        
        // If localhost, take first part as subdomain
        if (count($parts) >= 2 && (end($parts) === 'localhost' || end($parts) === 'local')) {
            return $parts[0];
        }
        
        // For other domains, try to get subdomain
        if (count($parts) > 2) {
            return $parts[0];
        }
        
        // Fallback: try to get from WP_HOME or database option
        $home_url = defined('WP_HOME') ? WP_HOME : get_option('home');
        $parsed = parse_url($home_url);
        if (isset($parsed['host'])) {
            $host_parts = explode('.', $parsed['host']);
            if (count($host_parts) >= 2) {
                return $host_parts[0];
            }
        }
        
        return '';
    }
    
    /**
     * Get connection to main database (shop_management)
     */
    private function get_main_db_connection() {
        if ($this->main_db_connection !== null) {
            return $this->main_db_connection;
        }
        
        // Database credentials for main database
        // These should match your docker-compose.yml or .env file
        $main_db_host = defined('IRANCHE_MAIN_DB_HOST') ? IRANCHE_MAIN_DB_HOST : 'main-db';
        $main_db_name = defined('IRANCHE_MAIN_DB_NAME') ? IRANCHE_MAIN_DB_NAME : 'shop_management';
        $main_db_user = defined('IRANCHE_MAIN_DB_USER') ? IRANCHE_MAIN_DB_USER : 'shop_user';
        $main_db_pass = defined('IRANCHE_MAIN_DB_PASSWORD') ? IRANCHE_MAIN_DB_PASSWORD : 'shop_password_123';
        
        // Create a new wpdb instance for main database
        require_once(ABSPATH . 'wp-includes/wp-db.php');
        $this->main_db_connection = new wpdb(
            $main_db_user,
            $main_db_pass,
            $main_db_name,
            $main_db_host
        );
        
        // Check if connection was successful
        if ($this->main_db_connection->last_error) {
            error_log('Iranche Shop Manager DB Error: ' . $this->main_db_connection->last_error);
            return null;
        }
        
        return $this->main_db_connection;
    }
    
    /**
     * Get tenant information from main database
     */
    private function get_tenant_info() {
        $subdomain = $this->get_subdomain();
        
        if (empty($subdomain)) {
            return null;
        }
        
        $db = $this->get_main_db_connection();
        
        if (!$db) {
            return null;
        }
        
        // Get tenant by subdomain
        $query = $db->prepare(
            "SELECT t.*, p.name as plan_name, p.type as plan_type_enum, p.duration, p.storage_gb as plan_storage_gb, 
                    p.price as plan_price, p.meters as plan_meters, p.max_users as plan_max_users,
                    p.description as plan_description, p.features as plan_features
             FROM tenants t 
             LEFT JOIN plans p ON t.plan_id = p.id 
             WHERE t.subdomain = %s",
            $subdomain
        );
        
        $tenant = $db->get_row($query, ARRAY_A);
        
        if (!$tenant) {
            return null;
        }
        
        // Parse JSON fields
        if (!empty($tenant['plan_features'])) {
            $tenant['plan_features'] = json_decode($tenant['plan_features'], true);
        } else {
            $tenant['plan_features'] = array();
        }
        
        return $tenant;
    }
    
    /**
     * Calculate remaining time based on created_at and plan duration
     */
    private function calculate_remaining_time($created_at, $duration, $expires_at = null) {
        // If expires_at is provided, use it
        if (!empty($expires_at) && $expires_at !== '0000-00-00 00:00:00') {
            $expires = strtotime($expires_at);
            $now = current_time('timestamp');
            $diff = $expires - $now;
            
            if ($diff <= 0) {
                return array(
                    'days' => 0,
                    'hours' => 0,
                    'minutes' => 0,
                    'formatted' => 'منقضی شده',
                    'is_expired' => true
                );
            }
            
            $days = floor($diff / (60 * 60 * 24));
            $hours = floor(($diff % (60 * 60 * 24)) / (60 * 60));
            
            $formatted = $days . ' روز';
            
            return array(
                'days' => $days,
                'hours' => $hours,
                'minutes' => 0,
                'formatted' => $formatted,
                'is_expired' => false
            );
        }
        
        // Calculate expires_at from created_at and duration
        if (empty($created_at) || empty($duration)) {
            return array(
                'days' => 0,
                'hours' => 0,
                'minutes' => 0,
                'formatted' => 'نامحدود',
                'is_expired' => false
            );
        }
        
        $created = strtotime($created_at);
        if (!$created) {
            return array(
                'days' => 0,
                'hours' => 0,
                'minutes' => 0,
                'formatted' => 'نامحدود',
                'is_expired' => false
            );
        }
        
        // Calculate expiration date based on duration
        $duration_months = array(
            'monthly' => 1,
            'quarterly' => 3,
            'semiannual' => 6,
            'yearly' => 12
        );
        
        $months = isset($duration_months[$duration]) ? $duration_months[$duration] : 1;
        
        // Add months to created_at
        $expires = strtotime('+' . $months . ' months', $created);
        
        $now = current_time('timestamp');
        $diff = $expires - $now;
        
        if ($diff <= 0) {
            return array(
                'days' => 0,
                'hours' => 0,
                'minutes' => 0,
                'formatted' => 'منقضی شده',
                'is_expired' => true
            );
        }
        
        $days = floor($diff / (60 * 60 * 24));
        $hours = floor(($diff % (60 * 60 * 24)) / (60 * 60));
        
        $formatted = $days . ' روز تا سررسید بعدی';
        
        return array(
            'days' => $days,
            'hours' => $hours,
            'minutes' => 0,
            'formatted' => $formatted,
            'is_expired' => false
        );
    }
    
    /**
     * Get storage usage in GB
     */
    private function get_storage_usage() {
        $tenant = $this->get_tenant_info();
        if (!$tenant) {
            return array('used' => 0, 'total' => 0, 'percentage' => 0);
        }
        
        $used_bytes = isset($tenant['storage_used']) ? intval($tenant['storage_used']) : 0;
        $limit_bytes = isset($tenant['storage_limit']) ? intval($tenant['storage_limit']) : 0;
        
        // If plan has storage_gb, use that instead
        if (!empty($tenant['plan_storage_gb'])) {
            $limit_bytes = floatval($tenant['plan_storage_gb']) * 1024 * 1024 * 1024;
        }
        
        $used_gb = $used_bytes / (1024 * 1024 * 1024);
        $total_gb = $limit_bytes / (1024 * 1024 * 1024);
        $percentage = $total_gb > 0 ? ($used_gb / $total_gb) * 100 : 0;
        
        return array(
            'used' => round($used_gb, 2),
            'total' => round($total_gb, 2),
            'percentage' => round($percentage, 2)
        );
    }
    
    /**
     * Get products count
     */
    private function get_products_count() {
        if (!class_exists('WooCommerce')) {
            return 0;
        }
        
        $args = array(
            'post_type' => 'product',
            'post_status' => 'publish',
            'posts_per_page' => -1,
            'fields' => 'ids'
        );
        
        $products = get_posts($args);
        return count($products);
    }
    
    /**
     * Calculate remaining products based on plan meters
     */
    private function calculate_remaining_products($plan_meters, $current_count) {
        // متراژ ضربدر 10 = تعداد محصول مجاز (بدون اعشار)
        $max_products = floor(floatval($plan_meters) * 10);
        $remaining = max(0, $max_products - $current_count);
        
        return array(
            'current' => $current_count,
            'max' => $max_products,
            'remaining' => $remaining,
            'percentage' => $max_products > 0 ? round(($current_count / $max_products) * 100, 2) : 0
        );
    }
    
    /**
     * Get current subscription status
     */
    private function get_subscription_status() {
        $tenant = $this->get_tenant_info();
        if (!$tenant) {
            return null;
        }
        
        $db = $this->get_main_db_connection();
        if (!$db) {
            return null;
        }
        
        // Get current subscription
        $subscription_id = isset($tenant['current_subscription_id']) ? intval($tenant['current_subscription_id']) : null;
        
        if (!$subscription_id) {
            // Try to get latest subscription
            $query = $db->prepare(
                "SELECT * FROM subscriptions WHERE tenant_id = %d ORDER BY id DESC LIMIT 1",
                $tenant['id']
            );
            $subscription = $db->get_row($query, ARRAY_A);
        } else {
            $query = $db->prepare(
                "SELECT * FROM subscriptions WHERE id = %d AND tenant_id = %d",
                $subscription_id,
                $tenant['id']
            );
            $subscription = $db->get_row($query, ARRAY_A);
        }
        
        if (!$subscription) {
            return null;
        }
        
        $now = current_time('timestamp');
        $end_date = strtotime($subscription['end_date']);
        $grace_period_end = !empty($subscription['grace_period_end']) ? strtotime($subscription['grace_period_end']) : null;
        
        // Check if subscription is expired
        $is_expired = $now > $end_date;
        $in_grace_period = $grace_period_end && $now <= $grace_period_end && $now > $end_date;
        $is_suspended = $grace_period_end && $now > $grace_period_end;
        
        return array(
            'subscription' => $subscription,
            'is_expired' => $is_expired,
            'in_grace_period' => $in_grace_period,
            'is_suspended' => $is_suspended,
            'days_remaining' => $is_expired ? 0 : max(0, floor(($end_date - $now) / (60 * 60 * 24))),
            'grace_days_remaining' => $in_grace_period ? max(0, floor(($grace_period_end - $now) / (60 * 60 * 24))) : 0
        );
    }
    
    /**
     * Check if current page is payment page (should be accessible even when suspended)
     */
    private function is_payment_page() {
        if (is_admin()) {
            $screen = get_current_screen();
            if ($screen && $screen->id === 'toplevel_page_iranche-shop-manager') {
                // Check if it's payment action
                return isset($_GET['action']) && $_GET['action'] === 'payment';
            }
        }
        
        // Check for AJAX payment actions
        if (defined('DOING_AJAX') && DOING_AJAX) {
            $action = isset($_POST['action']) ? $_POST['action'] : '';
            return in_array($action, array('iranche_renew_plan', 'iranche_process_payment'));
        }
        
        return false;
    }
    
    /**
     * Check tenant status and restrict access in admin
     */
    public function check_tenant_status() {
        // Allow access to payment page
        if ($this->is_payment_page()) {
            return;
        }
        
        $subscription_status = $this->get_subscription_status();
        
        if (!$subscription_status) {
            return; // No subscription, allow access (for setup)
        }
        
        // If suspended, redirect to payment page
        if ($subscription_status['is_suspended']) {
            wp_redirect(admin_url('admin.php?page=iranche-shop-manager&action=payment'));
            exit;
        }
        
        // If in grace period or expired, show warning but allow access
        // This will be handled in the admin page display
    }
    
    /**
     * Check tenant status and restrict access in frontend
     */
    public function check_tenant_status_frontend() {
        // Allow admin access
        if (is_admin()) {
            return;
        }
        
        $subscription_status = $this->get_subscription_status();
        
        if (!$subscription_status) {
            return; // No subscription, allow access
        }
        
        // If suspended, show maintenance message
        if ($subscription_status['is_suspended']) {
            $this->show_suspended_message();
            exit;
        }
    }
    
    /**
     * Show suspended message for frontend
     */
    private function show_suspended_message() {
        ?>
        <!DOCTYPE html>
        <html dir="rtl" lang="fa">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>فروشگاه غیرفعال</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    color: #333;
                }
                .container {
                    background: white;
                    border-radius: 20px;
                    padding: 60px 40px;
                    max-width: 600px;
                    text-align: center;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                }
                h1 {
                    color: #d63638;
                    margin-bottom: 20px;
                    font-size: 32px;
                }
                p {
                    color: #646970;
                    font-size: 18px;
                    line-height: 1.8;
                    margin-bottom: 30px;
                }
                .btn {
                    display: inline-block;
                    padding: 15px 40px;
                    background: #2271b1;
                    color: white;
                    text-decoration: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    transition: background 0.3s;
                }
                .btn:hover {
                    background: #135e96;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>فروشگاه موقتاً غیرفعال است</h1>
                <p>
                    دوره پلن فروشگاه شما به پایان رسیده است. لطفاً برای ادامه فعالیت، پلن خود را تمدید کنید.
                </p>
                <a href="<?php echo esc_url(admin_url('admin.php?page=iranche-shop-manager&action=payment')); ?>" class="btn">
                    تمدید پلن
                </a>
            </div>
        </body>
        </html>
        <?php
    }
    
    /**
     * Add admin menu
     */
    public function add_admin_menu() {
        add_menu_page(
            'مدیریت فروشگاه',
            'مدیریت فروشگاه',
            'manage_options',
            'iranche-shop-manager',
            array($this, 'render_admin_page'),
            'dashicons-store',
            30
        );
    }
    
    /**
     * Enqueue admin assets
     */
    public function enqueue_admin_assets($hook) {
        if ($hook !== 'toplevel_page_iranche-shop-manager') {
            return;
        }
        
        wp_enqueue_style(
            'iranche-sm-admin',
            IRANCHE_SM_PLUGIN_URL . 'assets/admin.css',
            array(),
            IRANCHE_SM_VERSION
        );
    }
    
    /**
     * Render admin page
     */
    public function render_admin_page() {
        // Check if payment page is requested
        if (isset($_GET['action']) && $_GET['action'] === 'payment') {
            $this->render_payment_page();
            return;
        }
        
        $tenant = $this->get_tenant_info();
        
        if (!$tenant) {
            ?>
            <div class="wrap">
                <h1>مدیریت فروشگاه</h1>
                <div class="notice notice-error">
                    <p>خطا: اطلاعات فروشگاه یافت نشد. لطفاً با پشتیبانی تماس بگیرید.</p>
                </div>
            </div>
            <?php
            return;
        }
        
        $subscription_status = $this->get_subscription_status();
        
        // Get plan info first
        $plan_name = !empty($tenant['plan_name']) ? $tenant['plan_name'] : 'بدون پلن';
        $plan_type = isset($tenant['plan_type_enum']) ? $tenant['plan_type_enum'] : $tenant['plan_type'];
        $plan_duration = isset($tenant['duration']) ? $tenant['duration'] : '';
        $plan_price = isset($tenant['plan_price']) ? intval($tenant['plan_price']) : 0;
        $plan_meters = isset($tenant['plan_meters']) ? floatval($tenant['plan_meters']) : 0;
        $plan_max_users = isset($tenant['plan_max_users']) ? intval($tenant['plan_max_users']) : 0;
        $plan_features = isset($tenant['plan_features']) ? $tenant['plan_features'] : array();
        
        // Calculate remaining time based on created_at and duration
        $remaining_time = $this->calculate_remaining_time(
            $tenant['created_at'], 
            $plan_duration, 
            isset($tenant['expires_at']) ? $tenant['expires_at'] : null
        );
        
        $storage = $this->get_storage_usage();
        $products_count = $this->get_products_count();
        $products_info = $this->calculate_remaining_products($plan_meters, $products_count);
        
        // Format duration
        $duration_labels = array(
            'monthly' => 'ماهانه',
            'quarterly' => 'سه‌ماهه',
            'semiannual' => 'شش‌ماهه',
            'yearly' => 'سالانه'
        );
        $plan_duration_label = isset($duration_labels[$plan_duration]) ? $duration_labels[$plan_duration] : $plan_duration;
        
        // Format price
        $formatted_price = number_format($plan_price, 0, '.', ',') . ' تومان';
        if ($plan_price == 0) {
            $formatted_price = 'رایگان';
        }
        
        ?>
        <div class="wrap iranche-sm-admin">
            <h1 class="wp-heading-inline">مدیریت فروشگاه</h1>
            <hr class="wp-header-end">
            
            <div class="iranche-sm-dashboard">
                <!-- Plan Info Card -->
                <div class="iranche-sm-card">
                    <div class="iranche-sm-card-header">
                        <h2>اطلاعات پلن فعلی</h2>
                    </div>
                    <div class="iranche-sm-card-body">
                        <div class="iranche-sm-info-grid">
                            <div class="iranche-sm-info-item">
                                <label>نام پلن:</label>
                                <span class="iranche-sm-value"><?php echo esc_html($plan_name); ?></span>
                            </div>
                            <div class="iranche-sm-info-item">
                                <label>نوع:</label>
                                <span class="iranche-sm-value">
                                    <?php 
                                    $type_label = ($plan_type === 'special') ? 'ویژه' : 'معمولی';
                                    echo esc_html($type_label);
                                    ?>
                                </span>
                            </div>
                            <div class="iranche-sm-info-item">
                                <label>مدت زمان:</label>
                                <span class="iranche-sm-value"><?php echo esc_html($plan_duration_label); ?></span>
                            </div>
                            <div class="iranche-sm-info-item">
                                <label>قیمت:</label>
                                <span class="iranche-sm-value"><?php echo esc_html($formatted_price); ?></span>
                            </div>
                            <?php if ($plan_meters > 0): ?>
                            <div class="iranche-sm-info-item">
                                <label>متراژ:</label>
                                <span class="iranche-sm-value"><?php echo esc_html(number_format($plan_meters, 2, '.', ',')); ?> متر مربع</span>
                            </div>
                            <?php endif; ?>
                            <?php if ($plan_max_users > 0): ?>
                            <div class="iranche-sm-info-item">
                                <label>حداکثر کاربران:</label>
                                <span class="iranche-sm-value"><?php echo esc_html($plan_max_users); ?></span>
                            </div>
                            <?php endif; ?>
                        </div>
                        
                        <?php if (!empty($plan_features)): ?>
                        <div class="iranche-sm-features">
                            <h3>ویژگی‌های پلن:</h3>
                            <ul>
                                <?php foreach ($plan_features as $key => $value): ?>
                                    <li>
                                        <strong><?php echo esc_html(ucfirst(str_replace('_', ' ', $key))); ?>:</strong>
                                        <?php echo esc_html(is_array($value) ? implode(', ', $value) : $value); ?>
                                    </li>
                                <?php endforeach; ?>
                            </ul>
                        </div>
                        <?php endif; ?>
                    </div>
                </div>
                
                <!-- Remaining Time Card -->
                <div class="iranche-sm-card">
                    <div class="iranche-sm-card-header">
                        <h2>زمان باقیمانده پلن</h2>
                    </div>
                    <div class="iranche-sm-card-body">
                        <div class="iranche-sm-time-display <?php echo $remaining_time['is_expired'] ? 'expired' : ''; ?>">
                            <div class="iranche-sm-time-value">
                                <?php echo esc_html($remaining_time['formatted']); ?>
                            </div>
                            <?php if (!$remaining_time['is_expired'] && $remaining_time['days'] > 0): ?>
                                <div class="iranche-sm-time-details">
                                    <span><?php echo esc_html($remaining_time['days']); ?> روز تا سررسید بعدی</span>
                                </div>
                            <?php endif; ?>
                            <div class="iranche-sm-time-info">
                                <span>تاریخ شروع: <?php echo esc_html(date_i18n('Y/m/d', strtotime($tenant['created_at']))); ?></span>
                                <?php if ($plan_duration_label): ?>
                                <span>• مدت پلن: <?php echo esc_html($plan_duration_label); ?></span>
                                <?php endif; ?>
                            </div>
                            <?php 
                            // Show payment button if expired or in grace period
                            $show_payment = false;
                            $payment_message = '';
                            
                            if ($subscription_status) {
                                if ($subscription_status['is_expired'] || $subscription_status['in_grace_period']) {
                                    $show_payment = true;
                                    if ($subscription_status['in_grace_period']) {
                                        $payment_message = sprintf('دوره مهلت شما %d روز باقی مانده است', $subscription_status['grace_days_remaining']);
                                    } else if ($subscription_status['is_expired']) {
                                        $payment_message = 'دوره پلن شما به پایان رسیده است';
                                    }
                                }
                            } else if ($remaining_time['is_expired']) {
                                $show_payment = true;
                                $payment_message = 'دوره پلن شما به پایان رسیده است';
                            }
                            
                            if ($show_payment): ?>
                                <div class="iranche-sm-payment-notice">
                                    <div class="notice notice-warning">
                                        <p><?php echo esc_html($payment_message); ?></p>
                                    </div>
                                    <a href="<?php echo esc_url(admin_url('admin.php?page=iranche-shop-manager&action=payment')); ?>" class="button button-primary button-large">
                                        تمدید پلن
                                    </a>
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
                
                <!-- Storage Usage Card -->
                <div class="iranche-sm-card">
                    <div class="iranche-sm-card-header">
                        <h2>استفاده از فضای ذخیره‌سازی</h2>
                    </div>
                    <div class="iranche-sm-card-body">
                        <div class="iranche-sm-storage-info">
                            <div class="iranche-sm-storage-display">
                                <span class="iranche-sm-storage-used"><?php echo esc_html(number_format($storage['used'], 2)); ?> GB</span>
                                <span class="iranche-sm-storage-separator">از</span>
                                <span class="iranche-sm-storage-total"><?php echo esc_html(number_format($storage['total'], 2)); ?> GB</span>
                            </div>
                            <div class="iranche-sm-progress-bar">
                                <div class="iranche-sm-progress-fill" style="width: <?php echo esc_attr($storage['percentage']); ?>%"></div>
                            </div>
                            <div class="iranche-sm-storage-percentage">
                                <?php echo esc_html($storage['percentage']); ?>% استفاده شده
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Products Count Card -->
                <div class="iranche-sm-card">
                    <div class="iranche-sm-card-header">
                        <h2>تعداد محصولات</h2>
                    </div>
                    <div class="iranche-sm-card-body">
                        <div class="iranche-sm-products-display">
                            <div class="iranche-sm-products-info">
                                <div class="iranche-sm-products-current">
                                    <span class="iranche-sm-products-count"><?php echo esc_html(number_format($products_info['current'])); ?></span>
                                    <span class="iranche-sm-products-label">محصول فعال</span>
                                </div>
                                <div class="iranche-sm-products-separator">از</div>
                                <div class="iranche-sm-products-max">
                                    <span class="iranche-sm-products-max-count"><?php echo esc_html(number_format($products_info['max'])); ?></span>
                                    <span class="iranche-sm-products-label">محصول مجاز</span>
                                </div>
                            </div>
                            <div class="iranche-sm-products-remaining">
                                <span class="iranche-sm-products-remaining-label">باقیمانده:</span>
                                <span class="iranche-sm-products-remaining-value"><?php echo esc_html(number_format($products_info['remaining'])); ?> محصول</span>
                            </div>
                            <div class="iranche-sm-progress-bar">
                                <div class="iranche-sm-progress-fill" style="width: <?php echo esc_attr($products_info['percentage']); ?>%"></div>
                            </div>
                            <div class="iranche-sm-products-percentage">
                                <?php echo esc_html($products_info['percentage']); ?>% استفاده شده
                            </div>
                        </div>
                        <div class="iranche-sm-products-actions">
                            <a href="<?php echo esc_url(admin_url('edit.php?post_type=product')); ?>" class="button button-primary">
                                مدیریت محصولات
                            </a>
                            <?php if ($products_info['remaining'] > 0): ?>
                            <a href="<?php echo esc_url(admin_url('post-new.php?post_type=product')); ?>" class="button">
                                افزودن محصول جدید
                            </a>
                            <?php else: ?>
                            <span class="button disabled">حد مجاز محصولات تکمیل شده</span>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
                
                <!-- Shop Info Card -->
                <div class="iranche-sm-card">
                    <div class="iranche-sm-card-header">
                        <h2>اطلاعات فروشگاه</h2>
                    </div>
                    <div class="iranche-sm-card-body">
                        <div class="iranche-sm-info-grid">
                            <div class="iranche-sm-info-item">
                                <label>نام فروشگاه:</label>
                                <span class="iranche-sm-value"><?php echo esc_html($tenant['shop_name']); ?></span>
                            </div>
                            <div class="iranche-sm-info-item">
                                <label>زیردامنه:</label>
                                <span class="iranche-sm-value"><?php echo esc_html($tenant['subdomain']); ?></span>
                            </div>
                            <div class="iranche-sm-info-item">
                                <label>وضعیت:</label>
                                <span class="iranche-sm-value">
                                    <?php
                                    $status_labels = array(
                                        'active' => 'فعال',
                                        'inactive' => 'غیرفعال',
                                        'suspended' => 'مسدود',
                                        'pending' => 'در انتظار'
                                    );
                                    $status = isset($status_labels[$tenant['status']]) ? $status_labels[$tenant['status']] : $tenant['status'];
                                    $status_class = $tenant['status'] === 'active' ? 'status-active' : 'status-inactive';
                                    echo '<span class="' . esc_attr($status_class) . '">' . esc_html($status) . '</span>';
                                    ?>
                                </span>
                            </div>
                            <div class="iranche-sm-info-item">
                                <label>تاریخ ایجاد:</label>
                                <span class="iranche-sm-value"><?php echo esc_html(date_i18n('Y/m/d H:i', strtotime($tenant['created_at']))); ?></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <?php
    }
    
    /**
     * Render payment page
     */
    private function render_payment_page() {
        $tenant = $this->get_tenant_info();
        if (!$tenant) {
            wp_die('خطا: اطلاعات فروشگاه یافت نشد.');
        }
        
        $subscription_status = $this->get_subscription_status();
        $current_plan_id = isset($tenant['plan_id']) ? intval($tenant['plan_id']) : null;
        
        $db = $this->get_main_db_connection();
        if (!$db) {
            wp_die('خطا: ارتباط با دیتابیس برقرار نشد.');
        }
        
        // Get available plans
        $plans_query = $db->prepare(
            "SELECT * FROM plans WHERE is_active = 1 ORDER BY sort_order ASC, price ASC"
        );
        $plans = $db->get_results($plans_query, ARRAY_A);
        
        // Format plans
        $duration_labels = array(
            'monthly' => 'ماهانه',
            'quarterly' => 'سه‌ماهه',
            'semiannual' => 'شش‌ماهه',
            'yearly' => 'سالانه'
        );
        
        wp_enqueue_script('jquery');
        ?>
        <div class="wrap iranche-sm-admin">
            <h1 class="wp-heading-inline">تمدید پلن</h1>
            <hr class="wp-header-end">
            
            <?php if ($subscription_status && $subscription_status['is_suspended']): ?>
                <div class="notice notice-error">
                    <p><strong>هشدار:</strong> فروشگاه شما به دلیل عدم تمدید پلن غیرفعال شده است. لطفاً برای فعال‌سازی مجدد، پلن خود را تمدید کنید.</p>
                </div>
            <?php elseif ($subscription_status && $subscription_status['in_grace_period']): ?>
                <div class="notice notice-warning">
                    <p><strong>هشدار:</strong> دوره مهلت شما <?php echo esc_html($subscription_status['grace_days_remaining']); ?> روز باقی مانده است. در صورت عدم پرداخت، فروشگاه غیرفعال خواهد شد.</p>
                </div>
            <?php endif; ?>
            
            <div class="iranche-sm-payment-page">
                <div class="iranche-sm-card">
                    <div class="iranche-sm-card-header">
                        <h2>انتخاب پلن</h2>
                    </div>
                    <div class="iranche-sm-card-body">
                        <?php if (empty($plans)): ?>
                            <p>هیچ پلن فعالی یافت نشد.</p>
                        <?php else: ?>
                            <div class="iranche-sm-plans-grid">
                                <?php foreach ($plans as $plan): ?>
                                    <?php
                                    $duration_label = isset($duration_labels[$plan['duration']]) ? $duration_labels[$plan['duration']] : $plan['duration'];
                                    $price = intval($plan['price']);
                                    $formatted_price = $price > 0 ? number_format($price, 0, '.', ',') . ' تومان' : 'رایگان';
                                    $is_current = $current_plan_id == $plan['id'];
                                    ?>
                                    <div class="iranche-sm-plan-card <?php echo $is_current ? 'current-plan' : ''; ?>">
                                        <div class="iranche-sm-plan-header">
                                            <h3><?php echo esc_html($plan['name']); ?></h3>
                                            <?php if ($is_current): ?>
                                                <span class="iranche-sm-plan-badge">پلن فعلی</span>
                                            <?php endif; ?>
                                        </div>
                                        <div class="iranche-sm-plan-price">
                                            <span class="iranche-sm-plan-amount"><?php echo esc_html($formatted_price); ?></span>
                                            <span class="iranche-sm-plan-duration">/ <?php echo esc_html($duration_label); ?></span>
                                        </div>
                                        <div class="iranche-sm-plan-features">
                                            <ul>
                                                <li>حجم ذخیره‌سازی: <?php echo esc_html($plan['storage_gb']); ?> GB</li>
                                                <li>متراژ: <?php echo esc_html($plan['meters']); ?> متر مربع</li>
                                                <li>حداکثر محصولات: <?php echo esc_html(floor($plan['meters'] * 10)); ?></li>
                                                <?php if ($plan['max_users'] > 0): ?>
                                                    <li>حداکثر کاربران: <?php echo esc_html($plan['max_users']); ?></li>
                                                <?php endif; ?>
                                            </ul>
                                        </div>
                                        <div class="iranche-sm-plan-action">
                                            <button class="button button-primary iranche-pay-button" 
                                                    data-plan-id="<?php echo esc_attr($plan['id']); ?>"
                                                    data-plan-price="<?php echo esc_attr($price); ?>"
                                                    data-plan-name="<?php echo esc_attr($plan['name']); ?>"
                                                    <?php echo $is_current && (!$subscription_status || (!$subscription_status['is_expired'] && !$subscription_status['in_grace_period'])) ? 'disabled' : ''; ?>>
                                                <?php echo $is_current && (!$subscription_status || (!$subscription_status['is_expired'] && !$subscription_status['in_grace_period'])) ? 'پلن فعلی' : 'انتخاب و پرداخت'; ?>
                                            </button>
                                        </div>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
                
                <div class="iranche-sm-card" id="iranche-payment-form" style="display: none;">
                    <div class="iranche-sm-card-header">
                        <h2>اطلاعات پرداخت</h2>
                    </div>
                    <div class="iranche-sm-card-body">
                        <form id="iranche-payment-form-content">
                            <input type="hidden" id="payment-plan-id" name="plan_id" value="">
                            
                            <div class="iranche-sm-payment-info">
                                <p><strong>پلن انتخابی:</strong> <span id="payment-plan-name"></span></p>
                                <p><strong>مبلغ قابل پرداخت:</strong> <span id="payment-plan-price"></span> تومان</p>
                            </div>
                            
                            <div class="iranche-sm-payment-methods">
                                <h3>روش پرداخت:</h3>
                                <label>
                                    <input type="radio" name="payment_method" value="manual" checked>
                                    پرداخت دستی (توسط ادمین)
                                </label>
                            </div>
                            
                            <div class="iranche-sm-payment-actions">
                                <button type="submit" class="button button-primary button-large">تایید پرداخت</button>
                                <button type="button" class="button iranche-cancel-payment">انصراف</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        
        <script>
        jQuery(document).ready(function($) {
            $('.iranche-pay-button').on('click', function() {
                var planId = $(this).data('plan-id');
                var planPrice = $(this).data('plan-price');
                var planName = $(this).data('plan-name');
                
                $('#payment-plan-id').val(planId);
                $('#payment-plan-name').text(planName);
                $('#payment-plan-price').text(planPrice.toLocaleString());
                $('#iranche-payment-form').slideDown();
                $('html, body').animate({
                    scrollTop: $('#iranche-payment-form').offset().top - 100
                }, 500);
            });
            
            $('.iranche-cancel-payment').on('click', function() {
                $('#iranche-payment-form').slideUp();
            });
            
            $('#iranche-payment-form-content').on('submit', function(e) {
                e.preventDefault();
                
                var planId = $('#payment-plan-id').val();
                var paymentMethod = $('input[name="payment_method"]:checked').val();
                
                if (!planId) {
                    alert('لطفاً یک پلن انتخاب کنید.');
                    return;
                }
                
                // Show loading
                var submitBtn = $(this).find('button[type="submit"]');
                var originalText = submitBtn.text();
                submitBtn.prop('disabled', true).text('در حال پردازش...');
                
                // Send AJAX request
                $.ajax({
                    url: ajaxurl,
                    type: 'POST',
                    data: {
                        action: 'iranche_process_payment',
                        plan_id: planId,
                        payment_method: paymentMethod,
                        nonce: '<?php echo wp_create_nonce('iranche_payment_nonce'); ?>'
                    },
                    success: function(response) {
                        if (response.success) {
                            alert('پرداخت با موفقیت ثبت شد. فروشگاه شما در حال فعال‌سازی است...');
                            window.location.reload();
                        } else {
                            alert('خطا: ' + (response.data && response.data.message ? response.data.message : 'خطا در پردازش پرداخت'));
                            submitBtn.prop('disabled', false).text(originalText);
                        }
                    },
                    error: function() {
                        alert('خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.');
                        submitBtn.prop('disabled', false).text(originalText);
                    }
                });
            });
        });
        </script>
        <?php
    }
    
    /**
     * Handle renew plan AJAX request
     */
    public function handle_renew_plan() {
        check_ajax_referer('iranche_payment_nonce', 'nonce');
        
        $plan_id = isset($_POST['plan_id']) ? intval($_POST['plan_id']) : 0;
        
        if (!$plan_id) {
            wp_send_json_error(array('message' => 'پلن انتخاب نشده است.'));
        }
        
        // This will be handled by process_payment
        $this->handle_process_payment();
    }
    
    /**
     * Handle process payment AJAX request
     */
    public function handle_process_payment() {
        check_ajax_referer('iranche_payment_nonce', 'nonce');
        
        $tenant = $this->get_tenant_info();
        if (!$tenant) {
            wp_send_json_error(array('message' => 'اطلاعات فروشگاه یافت نشد.'));
        }
        
        $plan_id = isset($_POST['plan_id']) ? intval($_POST['plan_id']) : 0;
        $payment_method = isset($_POST['payment_method']) ? sanitize_text_field($_POST['payment_method']) : 'manual';
        
        if (!$plan_id) {
            wp_send_json_error(array('message' => 'پلن انتخاب نشده است.'));
        }
        
        // Call tenant-manager API to process payment
        // Use main-db host or localhost for API access
        $api_host = defined('IRANCHE_MAIN_DB_HOST') && IRANCHE_MAIN_DB_HOST !== 'main-db' 
            ? 'http://' . IRANCHE_MAIN_DB_HOST . ':3000'
            : 'http://localhost:3000';
        $api_url = $api_host . '/api/subscriptions/renew';
        $api_data = array(
            'tenant_id' => $tenant['id'],
            'plan_id' => $plan_id,
            'payment_method' => $payment_method
        );
        
        $response = wp_remote_post($api_url, array(
            'body' => json_encode($api_data),
            'headers' => array(
                'Content-Type' => 'application/json'
            ),
            'timeout' => 30
        ));
        
        if (is_wp_error($response)) {
            wp_send_json_error(array('message' => 'خطا در ارتباط با سرور: ' . $response->get_error_message()));
        }
        
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        if ($data && isset($data['success']) && $data['success']) {
            wp_send_json_success(array('message' => 'پرداخت با موفقیت ثبت شد.'));
        } else {
            $error_message = isset($data['message']) ? $data['message'] : 'خطا در پردازش پرداخت';
            wp_send_json_error(array('message' => $error_message));
        }
    }
}

// Initialize plugin
function iranche_shop_manager_init() {
    return Iranche_Shop_Manager::get_instance();
}

// Hook into WordPress
add_action('plugins_loaded', 'iranche_shop_manager_init');

