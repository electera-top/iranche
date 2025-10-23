<?php
/*
Plugin Name: درگاه پرداخت بیت پی افزونه ووکامرس
Version: 4.2.0
Description: پرداخت وجه محصولات ووکامرس به وسیله درگاه پرداخت بیت پی
Plugin URI: https://bitpay.ir
Author: bdt
Author URI: https://bitpay.ir
*/
if(!defined('ABSPATH')) exit;

define('WOO_GPPDIR2', plugin_dir_path( __FILE__ ));
define('WOO_GPPDU2', plugin_dir_url( __FILE__ ));

function load_bitpayir2_woo_gateway(){

	/* Add Bitpayir Gateway Method */
	add_filter('woocommerce_payment_gateways', 'Woocommerce_Add_bitpayir2_Gateway');
	function Woocommerce_Add_bitpayir2_Gateway($methods){
		$methods[] = 'WC_bitpayir2';
		return $methods;
	}
	require_once( WOO_GPPDIR2 . 'class-wc-gateway-bitpayir2.php' );
	//require_once( WOO_GPPDIR . 'block-support.php' );
}
add_action('plugins_loaded', 'load_bitpayir2_woo_gateway', 0);


/**
 * Custom function to declare compatibility with cart_checkout_blocks feature 
*/
function declare_bitpayir2_cart_checkout_blocks_compatibility() {
    // Check if the required class exists
    if (class_exists('\Automattic\WooCommerce\Utilities\FeaturesUtil')) {
        // Declare compatibility for 'cart_checkout_blocks'
        \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility('cart_checkout_blocks', __FILE__, true);
    }
}
// Hook the custom function to the 'before_woocommerce_init' action
add_action('before_woocommerce_init', 'declare_bitpayir2_cart_checkout_blocks_compatibility');


// Hook the custom function to the 'woocommerce_blocks_loaded' action
add_action( 'woocommerce_blocks_loaded', 'bitpayir2_register_order_approval_payment_method_type' );

/**
 * Custom function to register a payment method type

 */
function bitpayir2_register_order_approval_payment_method_type() {
    // Check if the required class exists
    if ( ! class_exists( 'Automattic\WooCommerce\Blocks\Payments\Integrations\AbstractPaymentMethodType' ) ) {
        return;
    }

    // Include the custom Blocks Checkout class
    require_once plugin_dir_path(__FILE__) . 'class-block.php';

    // Hook the registration function to the 'woocommerce_blocks_payment_method_type_registration' action
    add_action(
        'woocommerce_blocks_payment_method_type_registration',
        function( Automattic\WooCommerce\Blocks\Payments\PaymentMethodRegistry $payment_method_registry ) {
            $payment_method_registry->register( new Bitpayir2_Gateway_Blocks );
        }
    );
}