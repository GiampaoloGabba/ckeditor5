/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module image/imageresize/resizeimagecommand
 */

import { Command } from 'ckeditor5/src/core';

import type ImageUtils from '../imageutils';
import {Element, ViewElement} from "@ckeditor/ckeditor5-engine";

/**
 * The resize image command. Currently, it only supports the width attribute.
 */
export default class ResizeImageCommand extends Command {
	/**
	 * Desired image width and height.
	 */
	declare public value: null | {
		width: string | null;
		height: string | null;
	};

	/**
	 * @inheritDoc
	 */
	public override refresh(): void {
		const editor = this.editor;
		const imageUtils: ImageUtils = editor.plugins.get( 'ImageUtils' );
		const element = imageUtils.getClosestSelectedImageElement( editor.model.document.selection );

		this.isEnabled = !!element;

		if ( !element || !element.hasAttribute( 'resizedWidth' ) ) {
			this.value = null;
		} else {
			this.value = {
				width: element.getAttribute( 'resizedWidth' ) as string,
				height: element.getAttribute( 'resizedHeight' ) as string
			};
		}

		if ( !element || !element.hasAttribute( 'resizedHeight' ) ) {
			this.value = null;
		} else {
			this.value = {
				width: element.getAttribute( 'resizedWidth' ) as string,
				height: element.getAttribute( 'resizedHeight' ) as string
			};
		}
	}

	/**
	 * Executes the command.
	 *
	 * ```ts
	 * // Sets the width to 50%:
	 * editor.execute( 'resizeImage', { width: '50%' } );
	 *
	 * // Removes the width attribute:
	 * editor.execute( 'resizeImage', { width: null } );
	 * ```
	 *
	 * @param options
	 * @param options.width The new width of the image.
	 * @fires execute
	 */
	public override execute( options: { width: string | null } ): void {
		const editor = this.editor;
		const model = editor.model;
		const imageUtils: ImageUtils = editor.plugins.get( 'ImageUtils' );
		const imageElement = imageUtils.getClosestSelectedImageElement( model.document.selection );

		this.value = {
			width: options.width,
			height: 'auto'
		};

		if ( imageElement ) {
			/* MODIFICA GG: Recupero altezza*/
			const domConverter = editor.editing.view.domConverter;
			const mapper = editor.editing.mapper;
			const domView = domConverter.mapViewToDom( mapper.toViewElement( imageElement as Element )! ) as HTMLElement;

			model.change( writer => {
				writer.setAttribute( 'resizedWidth', options.width, imageElement );
				writer.setAttribute( 'resizedHeight', domView.clientHeight, imageElement );

				writer.setAttribute( 'width', options.width?.replace( 'px', '' ), imageElement );
				writer.setAttribute( 'height', domView.clientHeight, imageElement );
			} );
		}
	}
}
