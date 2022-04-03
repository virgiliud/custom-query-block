/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { SelectControl, Spinner } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { select } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * Post type options
 */
export default function PostTypeOptions( { selectedPostType, onChange } ) {
	const [ error, setError ] = useState( null );
	const [ postOptions, setPostOptions ] = useState( null );

	useEffect( () => {
		apiFetch( { path: '/cq/v1/postTypeOptions' } ).then(
			( result ) => {
				setPostOptions( result );
			},
			( error ) => {
				setError( error );
			}
		);
	}, [ selectedPostType, onChange ] );

	if ( error ) {
		return <div className="components-notice is-error query-block__notice">Error: { error.message }</div>;
	}

	if ( postOptions ) {
		return (
			<SelectControl
				label={ __( 'Post Type' ) }
				value={ selectedPostType }
				options={ postOptions }
				onChange={ onChange }
			/>
		)
	}

	return <div><Spinner /></div>
}
