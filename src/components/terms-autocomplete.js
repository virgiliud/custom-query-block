/**
 * WordPress dependencies
 */
import { Spinner } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

/**
 * External dependencies
 */
import Select from 'react-select';
import reactSelectStyles from 'gutenberg-react-select-styles';

/**
 * Term Options
 */
export default function TermOptions( { selectedPostType, selectedTerms, onChange } ) {
	const [ error, setError ] = useState( null );
	const [ termOptions, setTermOptions ] = useState( null );

	useEffect( () => {
		apiFetch( { path: '/cq/v1/termOptions' } ).then(
			( result ) => {
				const resultFiltered = result.filter( ( { object_type } ) => object_type.includes(selectedPostType) )
				.map( ( { label, options } ) => ( {
					label: label,
					options: options
				} ) );

				setTermOptions( resultFiltered );
			},
			( error ) => {
				setError( error );
			}
		);
	}, [ selectedPostType ] );

	if ( error ) {
		return <div className="components-notice is-error query-block__notice">Error: { error.message }</div>;
	}
	else if ( termOptions ) {
		const handleChange = ( selectedOption ) => {
	  	onChange( selectedOption );
	  }

		return (
			<Select
				key={`key-${selectedPostType}`} // using key to re-render Select when the post type is updated
        classNamePrefix="query-block"
        styles={ reactSelectStyles }
				defaultValue={ selectedTerms }
				options={ termOptions }
				onChange={ handleChange }
				isMulti={ true }
				isClearable={ false }
			/>
		)
	}

	return <div><Spinner /></div>
}
