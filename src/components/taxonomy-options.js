/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { SelectControl, Spinner } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

/**
 * Taxonomy options
 */
export default function TaxonomyOptions( { selectedTaxonomy, onChange } ) {
	const [ error, setError ] = useState( null );
	const [ taxonomyOptions, setTaxonomyOptions ] = useState( null );

	useEffect( () => {
		apiFetch( { path: '/cq/v1/taxonomyOptions' } ).then(
			( result ) => {
				setTaxonomyOptions( result );
			},
			( error ) => {
				setError( error );
			}
		);
	}, [ selectedTaxonomy, onChange ] );

	if ( error ) {
		return <div className="components-notice is-error query-block__notice">Error: { error.message }</div>;
	}

	if ( taxonomyOptions ) {
		const taxOptions = prepend({label: '- Select -', value: ''}, taxonomyOptions);

		return (
			<SelectControl
				label={ __( 'Taxonomy' ) }
				value={ selectedTaxonomy }
				options={ taxOptions }
				onChange={ onChange }
			/>
		)
	}

	return <div><Spinner /></div>
}
