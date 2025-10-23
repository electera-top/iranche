<?php
/**
 * The template for displaying comments
 *
 * @package Themee
 */

if (post_password_required()) {
    return;
}
?>

<div id="comments" class="comments-area">
    <?php if (have_comments()) : ?>
        <h2 class="comments-title text-zinc-600 text-lg font-semibold mb-4">
            <?php
            $comments_number = get_comments_number();
            if ('1' === $comments_number) {
                printf(
                    esc_html__('یک دیدگاه برای %s', 'themee'),
                    '<span>' . get_the_title() . '</span>'
                );
            } else {
                printf(
                    esc_html(_nx(
                        '%1$s دیدگاه برای %2$s',
                        '%1$s دیدگاه برای %2$s',
                        $comments_number,
                        'comments title',
                        'themee'
                    )),
                    number_format_i18n($comments_number),
                    '<span>' . get_the_title() . '</span>'
                );
            }
            ?>
        </h2>

        <ol class="comment-list">
            <?php
            wp_list_comments(array(
                'style'      => 'ol',
                'short_ping' => true,
                'callback'   => 'themee_comment_callback',
            ));
            ?>
        </ol>

        <?php
        the_comments_navigation(array(
            'prev_text' => 'دیدگاه‌های قبلی',
            'next_text' => 'دیدگاه‌های بعدی',
        ));
        ?>
    <?php endif; ?>

    <?php if (!comments_open() && get_comments_number() && post_type_supports(get_post_type(), 'comments')) : ?>
        <p class="no-comments text-gray-500"><?php esc_html_e('دیدگاه‌ها بسته شده‌اند.', 'themee'); ?></p>
    <?php endif; ?>

    <?php
    comment_form(array(
        'title_reply'          => 'دیدگاه خود را بنویسید',
        'title_reply_to'       => 'پاسخ به %s',
        'cancel_reply_link'    => 'لغو پاسخ',
        'label_submit'         => 'ارسال نظر',
        'comment_field'        => '<div class="mb-4"><label for="comment" class="inline-block mb-2 ml-1 font-semibold text-xs text-slate-700">نظر شما:</label><textarea name="comment" id="comment" cols="30" rows="5" class="text-sm block w-full rounded-lg border border-gray-400 bg-white px-3 py-2 font-normal text-gray-700 outline-none focus:border-red-300" required></textarea></div>',
        'fields'               => array(
            'author' => '<div class="mb-4"><label for="author" class="inline-block mb-2 ml-1 font-semibold text-xs text-slate-700">نام شما:</label><input type="text" name="author" id="author" class="text-sm block w-full rounded-lg border border-gray-400 bg-white px-3 py-2 font-normal text-gray-700 outline-none focus:border-red-300" required /></div>',
            'email'  => '<div class="mb-4"><label for="email" class="inline-block mb-2 ml-1 font-semibold text-xs text-slate-700">ایمیل شما:</label><input type="email" name="email" id="email" class="text-sm block w-full rounded-lg border border-gray-400 bg-white px-3 py-2 font-normal text-gray-700 outline-none focus:border-red-300" required /></div>',
            'url'    => '<div class="mb-4"><label for="url" class="inline-block mb-2 ml-1 font-semibold text-xs text-slate-700">وب‌سایت:</label><input type="url" name="url" id="url" class="text-sm block w-full rounded-lg border border-gray-400 bg-white px-3 py-2 font-normal text-gray-700 outline-none focus:border-red-300" /></div>',
        ),
        'class_form'           => 'comment-form',
        'class_submit'         => 'inline-block px-8 py-2 ml-auto text-center text-white bg-blue-400 hover:bg-blue-500 transition rounded-lg shadow-md text-sm',
    ));
    ?>
</div>

<?php
function themee_comment_callback($comment, $args, $depth) {
    $GLOBALS['comment'] = $comment;
    ?>
    <li <?php comment_class(); ?> id="comment-<?php comment_ID(); ?>">
        <div class="border rounded-xl px-5 py-3 my-2">
            <div class="flex items-center gap-x-1">
                <svg class="fill-zinc-500" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z"></path></svg>
                <div class="text-xs opacity-60">
                    <?php comment_author(); ?> -
                    <?php comment_date('j F Y'); ?>
                </div>
            </div>
            <div class="opacity-60 text-sm py-3">
                <?php comment_text(); ?>
            </div>
            <div>
                <?php
                comment_reply_link(array_merge($args, array(
                    'depth'     => $depth,
                    'max_depth' => $args['max_depth'],
                    'reply_text' => 'پاسخ',
                    'class'     => 'mr-auto bg-blue-500 text-zinc-50 rounded-lg px-4 py-1 md:w-auto text-sm flex justify-center items-center'
                )));
                ?>
            </div>
        </div>
    <?php
}
?>