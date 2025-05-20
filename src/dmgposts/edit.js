/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import { Button } from '@wordpress/components';
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

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
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const { searchById, searchByTitle } = attributes;
	const [foundPosts, setFoundPosts] = useState([]);	

	const [postTitle, setPostTitle] = useState("post title to be!");

	const [postLink, setPostLink] = useState("a link be herey");


	//const [] = useState([]);

	const findPosts = async () => {
		let queryParams = '?';
		if (searchById) {
			queryParams += `id=${searchById}`;
		}
		if (searchByTitle) {
			queryParams += `${searchById ? '&' : ''}search=${searchByTitle}`;
		}

		try {
			const posts = await apiFetch({
				path: `/wp/v2/posts${queryParams}`,
			});
			setFoundPosts(posts);
		} catch (error) {
			console.error('Error fetching posts:', error);
		}
	};

	const selectThisAsLink = (e, post) => {
		e.preventDefault();
		console.log("post = ");
		console.log(post);
		console.log(JSON.stringify(post));
		setPostTitle(`Read More: ${post.title.rendered}`);
		setPostLink(post.link);
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Insert Post Link', 'dmgposts')}>
					<TextControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={__(
							'search by the id',
							'dmgposts'
						)}
						value={searchById || ''}
						onChange={(value) =>
							setAttributes({ searchById: value })
						}
					/>
					<TextControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={__(
							'search by the post title',
							'dmgposts'
						)}
						value={searchByTitle || ''}
						onChange={(value) =>
							setAttributes({ searchByTitle: value })
						}
					/>
					<Button
						variant="primary"
						onClick={findPosts}
						className="components-button"
					>
						{__('Find posts', 'dmgposts')}
					</Button>

					<div>
						{
							<ul>
								{foundPosts.map((post) => (
									<li key={post.id}>
										<a href={post.link} onClick={(e) => selectThisAsLink(e, post)}>{post.title.rendered}</a>
									</li>
								))}
							</ul>

						}
					</div>
				</PanelBody>
			</InspectorControls>

			<div {...useBlockProps()}>

				<p class="dmg-read-more">
						<a href={postLink}>{postTitle}</a>
				</p>

			</div>
		</>
	);
}
