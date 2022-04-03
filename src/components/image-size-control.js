/**
 * External dependencies
 */
import { isEmpty, has } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { SelectControl } from '@wordpress/components';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { select, useSelect } from '@wordpress/data';

export default function ImageSizeControl( { slug, onChange } ) {

	const { imageSizeOptions } = useSelect((select) => {
		// Get image sizes
		const { getSettings } = select( blockEditorStore );
		const { imageSizes } = getSettings();

		// Note: 'image_size_names_choose' filter must be used to make custom image sizes available from selection in the WordPress admin.
		return {
			imageSizeOptions: imageSizes
				.map( ( { name, slug } ) => ( {
					value: slug,
					label: name,
				} ) ),
			}
		}, [ slug ]
	);

	return (
		<>
			{ ! isEmpty( imageSizeOptions ) && (
				<SelectControl
					label={ __( 'Image size' ) }
					value={ slug }
					options={ imageSizeOptions }
					onChange={ onChange }
				/>
			) }
		</>
	);
}
