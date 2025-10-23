const bitpayir2_settings = window.wc.wcSettings.getSetting( 'bitpayir2_gateway_data', {} );
const bitpayir2_label = window.wp.htmlEntities.decodeEntities( bitpayir2_settings.title ) || window.wp.i18n.__( 'پرداخت از طریق تمامی کارت های بانکی (بیت پی)', 'woocommerce' );
const bitpayir2_Content = () => {
    return window.wp.htmlEntities.decodeEntities( bitpayir2_settings.description || '' );
};
const Bitpayir2_Block_Gateway = {
    name: 'WC_bitpayir2',
    label: bitpayir2_label,
    content: Object( window.wp.element.createElement )( bitpayir2_Content, null ),
    edit: Object( window.wp.element.createElement )( bitpayir2_Content, null ),
    canMakePayment: () => true,
    ariaLabel: bitpayir2_label,
    supports: {
        features: bitpayir2_settings.supports,
    },
};
window.wc.wcBlocksRegistry.registerPaymentMethod( Bitpayir2_Block_Gateway );