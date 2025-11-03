<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * Localized language
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'themes_demo' );

/** Database username */
define( 'DB_USER', 'shop_user' );

/** Database password */
define( 'DB_PASSWORD', 'shop_password_123' );

/** Database hostname */
define( 'DB_HOST', 'main-db' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',          'a%,wJQ&V2SGaYFtz9iy+>!4 K7?*K9l{i3htMU6-wRWHsWoRyrIL.D%ZO=RARuGg' );
define( 'SECURE_AUTH_KEY',   'OMY:+k/$#*k[0<d b%Y@W[@f7%?vEMPD(9oz+FEjMFsL$5e`l-N4yJ,n7yAFvYG%' );
define( 'LOGGED_IN_KEY',     'vDi3ghIFWa+QD(dA$6M}pl (Z_8p0<2p_pgAV@#9b!)ybtl|G9jqPQNKki]g:aY;' );
define( 'NONCE_KEY',         'pZ7~r6wF&+o/2ie2>C}wVbN<T_?b1ND/5M%(KG*^Ftv7xH!o4ST4cpuI|^zUg%Q4' );
define( 'AUTH_SALT',         '>XcBNzT?X^Vft!EV%DzQk:!=KV-RD*`8=@M~CG.A$B-vRK+3I!%nrWAc#%Y ii a' );
define( 'SECURE_AUTH_SALT',  'fQX|Fe^gYhQnpkpW[gj$}#pWg0JC|k-jW=AP%7%r9vl*86/>xO3p7*%pOcRuS H/' );
define( 'LOGGED_IN_SALT',    'TI+b| -Xg})KG@wRV3ugu!QwPQuzo3%M&2b0.~l5Yb*xD-%e`Pn#J^>tG<T8]W a' );
define( 'NONCE_SALT',        'q%{a*h2A{7&dVKeIaGI:nRTPzF,XU9D~M<ReCU^6e0ZH:myi;FoquTui3TpCTyI9' );
define( 'WP_CACHE_KEY_SALT', 'YCh,#>=P9(mD3jAcv]^.N5tQMmP}0Z%>Zi/qx)=<F!:5#chP3fJH;X+f4;71Wg6_' );


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';


/* Add any custom values between this line and the "stop editing" line. */



/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', false );
}

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
