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

	const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10;

    // Add this function to handle pagination
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = foundPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(foundPosts.length / postsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const findPosts = async () => {
		try {
			let posts;
			if (searchById) {
				// Fetch single post by ID
				posts = await apiFetch({
					path: `/wp/v2/posts/${searchById}`,
				});
				// Convert single post to array for consistency
				posts = [posts];
			} else {
				// Regular search
				let queryParams = '?per_page=-1&orderby=date&order=desc';
				if (searchByTitle) {
					queryParams += `&search=${searchByTitle}`;
				}
				posts = await apiFetch({
					path: `/wp/v2/posts${queryParams}`,
				});
			}
			setFoundPosts(posts);
		} catch (error) {
			console.error('Error fetching posts:', error);
			setFoundPosts([]);
		}
    };

    const selectThisAsLink = (e, post) => {
        e.preventDefault();
        console.log("post = ");
        console.log(post);
        console.log(JSON.stringify(post));
        setPostTitle(`Read More: ${post.title.rendered}`);
        setPostLink(post.link);

		// Save the selected post ID to block attributes
		setAttributes({ savedReadPostId: post.id });
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

                    <div style={{ border: '1px solid red' }}>
                        <ul>
                            {currentPosts.map((post) => (
                                <li key={post.id}>
                                    <a href={post.link} onClick={(e) => selectThisAsLink(e, post)}>
                                        {post.title.rendered}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        {foundPosts.length > postsPerPage && (
                            <div className="pagination" style={{ border: '1px solid green' }}>
                                <Button
                                    size={'small'}
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    {__('Previous', 'dmgposts')}
                                </Button>
                                
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <Button
                                        key={i + 1}
                                        size={'small'}
                                        variant={currentPage === i + 1 ? 'primary' : 'secondary'}
                                        onClick={() => paginate(i + 1)}
                                    >
                                        {i + 1}
                                    </Button>
                                ))}
                                
                                <Button
                                    size={'small'}
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    {__('Next', 'dmgposts')}
                                </Button>
                            </div>
                        )}
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
