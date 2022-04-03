/**
 * External dependencies
 */
import { map } from 'lodash';

/**
 * WordPress dependencies
 */
import { withSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { SelectControl } from '@wordpress/components';

function AuthorOptions( { authorList, selectedAuthor, onChange } ) {
	if ( ! authorList ) {
  	return null;
  }

	const authors = authorList.map( ( { name, id } ) => ( {
		label: name,
		value: id
	} ) );

	const authorOptions = prepend( { label: 'All', value: 0 }, authors );

	function prepend(value, array) {
	  var newArray = array.slice();
	  newArray.unshift(value);
	  return newArray;
	}

	return (
		<SelectControl
			label={ __( 'Author' ) }
      value={ selectedAuthor }
			options={ authorOptions }
      onChange={ onChange }
		/>
	);
}

export default withSelect( ( select ) => {
	return {
		authorList: select('core').getUsers( { who: 'authors' } )
	};
} )( AuthorOptions );
