<?php
/*
Plugin Name: Iranche Upload Limits
Description: Enforce per-tenant upload quota
Author: System
Version: 1.0
*/
if (!defined('ABSPATH')) { exit; }

add_filter('upload_size_limit','iranche_limit_upload_size');
function iranche_limit_upload_size($size){ 
    return 512 * 1024 * 1024; 
}
