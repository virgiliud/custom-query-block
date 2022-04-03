<?php
/**
 * Custom Routes.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Custom_Query_Routes extends WP_REST_Controller {

  /**
   * Register the routes for the objects of the controller.
   */
  public function register_routes() {
    $version = '1';
    $namespace = 'cq/v' . $version;

		// Post types
	  register_rest_route( $namespace, '/postTypeOptions', array(
	    'methods' => WP_REST_Server::READABLE,
	    'callback' => array( $this, 'cq_get_post_type_options' ),
			'permission_callback' => array( $this, 'get_items_permissions_check' )
	  ) );

		// Taxonomies
		register_rest_route( $namespace, '/taxonomyOptions', array(
	    'methods' => WP_REST_Server::READABLE,
	    'callback' => array( $this, 'cq_get_taxonomy_options' ),
			'permission_callback' => array( $this, 'get_items_permissions_check' )
	  ) );

		// Terms
		register_rest_route( $namespace, '/termOptions', array(
	    'methods' => WP_REST_Server::READABLE,
	    'callback' => array( $this, 'cq_get_term_options' ),
			'permission_callback' => array( $this, 'get_items_permissions_check' )
	  ) );
  }

	/**
   * Get post types
   *
   * @param WP_REST_Request $request Full data about the request.
   * @return WP_Error|WP_REST_Response
   */
	public function cq_get_post_type_options( $request ) {
		$args = array(
	     'public' => true,
			 'show_in_rest' => true,
	     '_builtin' => false
	  );

		$post_types = get_post_types( $args, 'object' );

		// Set default post type
		$post_types_array[] = [
			'label' => 'Post',
			'value' => 'post'
		];

		if ( $post_types ) {
			foreach ( $post_types as $post_type ) {
				$post_types_array[] = [
		      'label' => $post_type->label,
		      'value' => $post_type->name
		    ];
			}
		}

	  return new WP_REST_Response( $post_types_array, 200 );
	}

	/**
   * Get taxonomies
   *
   * @param WP_REST_Request $request Full data about the request.
   * @return WP_Error|WP_REST_Response
   */
	function cq_get_taxonomy_options( $request ) {
		$args = array(
		  'public' => true,
			'show_in_rest' => true
		);

		$taxonomies = get_taxonomies( $args, 'objects' );
		$taxonomies_array = [];

		if ( $taxonomies ) {
			foreach ( $taxonomies as $taxonomy ) {
				$taxonomies_array[] = [
		      'label' => $taxonomy->label,
		      'name' => $taxonomy->name,
					'object_type' => $taxonomy->object_type
		    ];
			}
		}

		if ( empty($taxonomies) ) {
    	return new WP_Error( 'empty_taxonomies', __( 'There are no taxonomies.', 'custom-query' ), array( 'status' => 404 ) );
    }

	  return new WP_REST_Response( $taxonomies_array, 200 );
	}

	/**
   * Get terms
   *
   * @param WP_REST_Request $request Full data about the request.
   * @return WP_Error|WP_REST_Response
   */
	function cq_get_term_options( $request ) {
		$args = array(
		  'public' => true,
			'show_in_rest' => true
		);

		$taxonomies = get_taxonomies( $args, 'objects' );
		$taxonomies_array = [];
		$terms_array = [];

		if ( $taxonomies ) {
			foreach ( $taxonomies as $taxonomy ) {
				$terms = get_terms( array(
			    'taxonomy' => $taxonomy->name,
			    'hide_empty' => false,
				) );

				if ( $terms ) {
					foreach ( $terms as $term ) {
						$terms_array[$taxonomy->name][] = [
							'label' => $term->name,
							'value' => $term->term_id,
							'taxonomy' => $taxonomy->name,
						];
					}

					$taxonomies_array[] = [
						'label' => $taxonomy->label,
						'object_type' => $taxonomy->object_type,
						'options' => $terms_array[$taxonomy->name]
					];
				}
			}
		}

		if ( empty($taxonomies) ) {
    	return new WP_Error( 'empty_terms', __( 'There are no terms.', 'custom-query' ), array( 'status' => 404 ) );
    }

	  return new WP_REST_Response( $taxonomies_array, 200 );
	}

  /**
   * Check if a given request has access to get items
   *
   * @param WP_REST_Request $request Full data about the request.
   * @return WP_Error|bool
   */
  public function get_items_permissions_check( $request ) {
    return true;
  }
}

add_action( 'rest_api_init', 'cq_register_routes' );

function cq_register_routes() {
  $cq_controller = new Custom_Query_Routes();
  $cq_controller->register_routes();
}
