/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls, BlockControls } from '@wordpress/block-editor';
import { BaseControl, PanelBody, TextControl, SelectControl, RangeControl, ToggleControl, Disabled } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';

/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * Internal dependencies
 */
import PostTypeOptions from './components/post-type-options';
import ImageSizeControl from './components/image-size-control';
import HeadingLevelDropdown from './components/heading/heading-level-dropdown';
import LayoutToolbar from './components/layout-toolbar';
import AuthorOptions from './components/author-options';
import TermsAutocomplete from './components/terms-autocomplete';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
  const { headingLevel, selectedPostType, displayExcerpt, excerptLength, displayReadMoreLink, readMoreText, displayFeaturedImage, imageSizeSlug, displayAuthor, displayDate, orderSelect, orderBy, order, selectedAuthor, selectedTerms, taxQuery, postsToShow, displayLayout, columns } = attributes;

	return (
    <>
      <BlockControls>
        <LayoutToolbar
          displayLayout={ displayLayout }
          setDisplayLayout={ ( value ) => {
            setAttributes( { displayLayout: value } )
          } }
        />
      </BlockControls>

      <BlockControls group="block">
        <HeadingLevelDropdown
          selectedLevel={ headingLevel }
          onChange={ ( value ) =>
            setAttributes( { headingLevel: value } )
          }
        />
      </BlockControls>

      <InspectorControls>
        <PanelBody title={ __( 'Post settings' ) } initialOpen={ true }>
          <PostTypeOptions
            selectedPostType={ selectedPostType }
            onChange={ ( value ) => {
  						setAttributes( { selectedPostType: value, selectedTerms: null, taxQuery: '' } );
  					} }
          />

          <RangeControl
            label={ __( 'Number of posts' ) }
            value={ postsToShow }
            onChange={ ( value ) =>	setAttributes( { postsToShow: value } ) }
            min={ 1 }
            max={ 50 }
          />

          { ( displayLayout === 'grid' ) && (
            <RangeControl
              label={ __( 'Columns' ) }
              value={ columns }
              onChange={ ( value ) =>
                setAttributes( { columns: value } )
              }
              min={ 1 }
              max={ 6 }
            />
          ) }
        </PanelBody>

        <PanelBody title={ __( 'Order & filter settings' ) } initialOpen={ true }>
          <SelectControl
    				label={ __( 'Order by' ) }
    				value={ orderSelect }
    				options={ [
    					{
    						label: __( 'Newest to oldest' ),
    						value: 'date/desc',
    					},
    					{
    						label: __( 'Oldest to newest' ),
    						value: 'date/asc',
    					},
    					{
    						label: __( 'A - Z' ),
    						value: 'title/asc',
    					},
    					{
    						label: __( 'Z - A' ),
    						value: 'title/desc',
    					},
              {
    						label: __( 'Random' ),
    						value: 'rand/ ',
    					},
    				] }
            onChange={ ( value ) => {
    					const [ newOrderBy, newOrder ] = value.split( '/' );
              setAttributes( { orderSelect: value, orderBy: newOrderBy, order: newOrder.toUpperCase() } )
    				} }
    			/>

          <AuthorOptions
            selectedAuthor={ selectedAuthor }
            onChange={ ( value ) => {
  						setAttributes( { selectedAuthor: value } );
  					} }
          />

          <BaseControl className="query-block-control" label={ __( 'Terms' ) }>
            <TermsAutocomplete
              selectedPostType={ selectedPostType }
              selectedTerms={ selectedTerms }
              onChange={ ( value ) =>	{
                setAttributes( { selectedTerms: value } );

                const mapArray = value.reduce( (acc, {value, taxonomy} ) => {
          			  if (acc.has(taxonomy)) {
          			    acc.get(taxonomy).ids.push(value);
          			  } else {
          			    acc.set(taxonomy, {taxonomy: taxonomy, ids: [value]});
          			  }
          			  return acc;
          			}, new Map());

          			const queryArray = [...mapArray.values()];

                setAttributes( { taxQuery: queryArray } );
              } }
            />
          </BaseControl>
        </PanelBody>

        <PanelBody title={ __( 'Display settings' ) } initialOpen={ true }>
          <ToggleControl
            label={ __( 'Featured image' ) }
            checked={ displayFeaturedImage }
            onChange={ ( value ) =>	setAttributes( { displayFeaturedImage: value } ) }
          />

          { displayFeaturedImage && (
            <>
              <ImageSizeControl
                slug={ imageSizeSlug }
                onChange={ ( value ) => setAttributes( { imageSizeSlug: value } ) }
              />
            </>
          ) }

          <ToggleControl
            label={ __( 'Author' ) }
            checked={ displayAuthor }
            onChange={ ( value ) =>	setAttributes( { displayAuthor: value } ) }
          />

          <ToggleControl
            label={ __( 'Date' ) }
            checked={ displayDate }
            onChange={ ( value ) =>	setAttributes( { displayDate: value } ) }
          />

          <ToggleControl
            label={ __( 'Excerpt' ) }
            checked={ displayExcerpt }
            onChange={ ( value ) =>	setAttributes( { displayExcerpt: value } ) }
          />

          { displayExcerpt && (
            <RangeControl
							label={ __( 'Max number of words' ) }
							value={ excerptLength }
							onChange={ ( value ) =>
								setAttributes( { excerptLength: value } )
							}
							min={ 5 }
							max={ 100 }
						/>
          ) }

          <ToggleControl
            label={ __( 'Read more link' ) }
            checked={ displayReadMoreLink }
            onChange={ ( value ) =>	setAttributes( { displayReadMoreLink: value } ) }
          />

          { displayReadMoreLink && (
            <TextControl
              label={ __( 'Read more text' ) }
              value={ readMoreText }
              onChange={ ( value ) =>	setAttributes( { readMoreText: value } ) }
            />
          ) }
        </PanelBody>
      </InspectorControls>

      <div { ...useBlockProps() }>
        <Disabled>
          <ServerSideRender block="cq/custom-query" attributes={ attributes } />
        </Disabled>
      </div>

    </>
	);
}
