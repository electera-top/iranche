<?php
/**
 * Template Name: Verification Code Display
 * 
 * This page shows the last verification code for development purposes
 * Remove this in production!
 */

get_header(); ?>

<main class="min-h-screen bg-gray-100 flex justify-center items-center py-8">
    <div class="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 class="text-2xl font-bold text-center mb-6 text-gray-800">
            نمایش کد تایید (توسعه)
        </h1>
        
        <div class="space-y-4">
            <?php
            // Get all verification codes from options
            global $wpdb;
            $codes = $wpdb->get_results("SELECT option_name, option_value FROM {$wpdb->options} WHERE option_name LIKE 'last_verification_code_%' ORDER BY option_id DESC LIMIT 10");
            
            if ($codes): ?>
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 class="font-semibold text-blue-800 mb-2">آخرین کدهای تایید:</h3>
                    <div class="space-y-2">
                        <?php foreach ($codes as $code): 
                            $phone = str_replace('last_verification_code_', '', $code->option_name);
                        ?>
                            <div class="flex justify-between items-center bg-white p-2 rounded border">
                                <span class="text-sm text-gray-600"><?php echo esc_html($phone); ?></span>
                                <span class="font-mono text-lg font-bold text-blue-600"><?php echo esc_html($code->option_value); ?></span>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            <?php else: ?>
                <div class="text-center text-gray-500">
                    <p>هنوز کد تاییدی ارسال نشده است.</p>
                </div>
            <?php endif; ?>
            
            <div class="text-center">
                <a href="<?php echo home_url('/login'); ?>" class="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition">
                    بازگشت به صفحه ورود
                </a>
            </div>
            
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p class="text-sm text-yellow-800">
                    <strong>توجه:</strong> این صفحه فقط برای اهداف توسعه است و باید در محیط تولید حذف شود.
                </p>
            </div>
        </div>
    </div>
</main>

<?php get_footer(); ?>
