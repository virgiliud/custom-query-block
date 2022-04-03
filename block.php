<?php
/**
 * Registers the block using the metadata loaded from the `block.json` file.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function create_custom_query_block_init() {
	register_block_type(
		__DIR__ . '/build',
		array(
			'render_callback' => 'render_custom_query_block',
		)
	);
}
add_action( 'init', 'create_custom_query_block_init' );

/**
 * Renders the cq/custom-query block on the server.
 *
 * @param array $attributes The block attributes.
 *
 * @return string Returns the HTML content.
 */
function render_custom_query_block( $attributes ) {

	$html = '';

	$class = 'custom-query-block';
	$class .= ( $attributes['displayLayout'] == 'grid' ) ? ' cq-is-grid' : ' cq-is-list';
	$class .= ( $attributes['displayLayout'] == 'grid' ) ? ' cq-columns-' . $attributes['columns'] : '';
	$class .= ' cq-type-' . $attributes['selectedPostType'];

	$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => $class ) );

	if ( !post_type_exists($attributes['selectedPostType']) ) {
		return sprintf(
			'<div %1$s><p>Post type not found.</p></div>',
			$wrapper_attributes
		);
	}

	$args = array(
		'post_type' => $attributes['selectedPostType'],
		'order' => $attributes['order'],
		'orderby' => $attributes['orderBy'],
		'post_status' => 'publish',
		'posts_per_page' => $attributes['postsToShow']
	);

	if ( isset( $attributes['taxQuery'] ) && !empty( $attributes['taxQuery'] ) ) {

		$tax_query = array('relation' => 'OR');

		foreach ( $attributes['taxQuery'] as $tax ) {
			$tax_query[] = array(
				'taxonomy' => $tax['taxonomy'],
				'field' => 'term_id',
				'terms' => $tax['ids']
			);
		}

		$args['tax_query'] = $tax_query;
	}

	if ( isset($attributes['selectedAuthor']) && ($attributes['selectedAuthor'] > 0 )) {
		$args['author'] = $attributes['selectedAuthor'];
	}

	$the_query = new WP_Query( $args );

	if ( $the_query->have_posts() ) {
	  while ( $the_query->have_posts() ) {
	    $the_query->the_post();

			$postID = get_the_ID();
			$post_link = esc_url( get_permalink( $postID ) );
			$has_image = ( $attributes['displayFeaturedImage'] && has_post_thumbnail( $postID ) );
			$taxonomies = get_object_taxonomies( $attributes['selectedPostType'], 'names' );

			$post_classes = 'custom-query-block__item';
			$post_classes .= $has_image ? ' cq-has-image' : '';

			foreach ( $taxonomies as $taxonomy_slug ) {
        // Get the terms related to the post
        $terms = get_the_terms( $postID, $taxonomy_slug );

        if ( ! empty( $terms ) ) {
          foreach ( $terms as $term ) {
          	$post_classes .= ' cq-' . $taxonomy_slug . '-' . $term->slug;
          }
        }
	    }

			$html .= '<div class="' . $post_classes . '">';

			// Featured Image
			if ( $has_image ) {

				$image_classes = 'custom-query-block__image';

				$featured_image = sprintf(
					'<a href="%1$s">%2$s</a>',
					$post_link,
					get_the_post_thumbnail( $postID, $attributes['imageSizeSlug'] )
				);

				$html .= sprintf(
					'<figure class="%1$s">%2$s</figure>',
					$image_classes,
					$featured_image
				);
			}

			$html .= '<div class="custom-query-block__content">';

			// Post Title
			$title = get_the_title( $postID );

			if ( ! $title ) {
				$title = __( '(no title)' );
			}

			$level = 'h' . $attributes['headingLevel'];

			$html .= sprintf(
				'<' . $level . ' class="custom-query-block__title"><a href="%1$s">%2$s</a></' . $level . '>',
				$post_link,
				$title
			);

			$author = '';

			// Author
			if ( isset( $attributes['displayAuthor'] ) && $attributes['displayAuthor'] ) {
				$author_display_name = get_the_author_meta( 'display_name' );

				$byline = sprintf( __( 'By %s' ), $author_display_name );

				if ( ! empty( $author_display_name ) ) {
					$author .= sprintf(
						'<div class="custom-query-block__author">%1$s</div>',
						esc_html( $byline )
					);
				}
			}

			$date = '';

			// Date
			if ( isset( $attributes['displayDate'] ) && $attributes['displayDate'] ) {
				$date .= sprintf(
					'<time datetime="%1$s" class="custom-query-block__date">%2$s</time>',
					esc_attr( get_the_date( 'c', $postID ) ),
					esc_html( get_the_date( '', $postID ) )
				);
			}

			// Display author and/or date
			if ( (isset( $attributes['displayAuthor'] ) && $attributes['displayAuthor']) || (isset( $attributes['displayDate'] ) && $attributes['displayDate']) ) {
				$separate = ( $author && $date ) ? '<div class="custom-query-block__separate"></div>' : '';
				$html .= sprintf(
					'<div class="custom-query-block__meta">%1$s %2$s %3$s</div>',
					$author,
					$separate,
					$date
				);
			}

			// Excerpt
			if ( isset( $attributes['displayExcerpt'] ) && $attributes['displayExcerpt'] ) {
				$excerpt = get_the_excerpt();
				$trimmed_excerpt = wp_trim_words( $excerpt, $attributes['excerptLength'], ' [&hellip;]' );

				if ( post_password_required() ) {
					$trimmed_excerpt = __( 'This content is password protected.' );
				}

				$html .= sprintf(
					'<p class="custom-query-block__excerpt">%1$s</p>',
					$trimmed_excerpt
				);
			}

			// Read more
			if ( isset( $attributes['displayReadMoreLink'] ) && $attributes['displayReadMoreLink'] ) {
				$html .= sprintf(
					'<a class="custom-query-block__read-more" href="%1$s">%2$s</a>',
					$post_link,
					$attributes['readMoreText']
				);
			}

			$html .= '</div>';

			$html .= '</div>';
	  }

		// Restore original post data
		wp_reset_postdata();

	} else {
		$html .= '<p class="custom-query-block__no-posts">No posts found.</p>';
	}

	return sprintf(
		'<div %1$s>%2$s</div>',
		$wrapper_attributes,
		$html
	);
}
