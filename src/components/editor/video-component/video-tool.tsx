// Video Block Tool, based on Image Tool
import ImageTool from '@editorjs/image';
import { createRoot } from 'react-dom/client';

import Videojs from './videojs';

const IconVideo =
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 489.2 489.2"><path d="M439.6,0h-390C22.2,0,0,22.2,0,49.6v390c0,27.4,22.2,49.6,49.6,49.6h390c27.4,0,49.6-22.2,49.6-49.6V49.7 C489.3,22.3,467,0,439.6,0z M300.6,47.8h42.5v42.5h-42.5V47.8z M223.4,47.8h42.5v42.5h-42.5V47.8L223.4,47.8z M146.1,47.8h42.5 v42.5h-42.5V47.8z M111.3,441.6H68.8v-42.5h42.5V441.6z M111.3,90.3H68.8V47.8h42.5V90.3z M188.6,441.6h-42.5v-42.5h42.5V441.6z M265.8,441.6h-42.5v-42.5h42.5V441.6z M343.1,441.6h-42.5v-42.5h42.5V441.6z M352.5,256.7l-163.1,94.2c-9.2,5.3-20.8-1.3-20.8-12 V150.5c0-10.7,11.6-17.3,20.8-12l163.1,94.2C361.8,238,361.8,251.4,352.5,256.7z M420.4,441.6h-42.5v-42.5h42.5V441.6z M420.4,90.3 h-42.5V47.8h42.5V90.3z"/></svg>';

export default class Video extends ImageTool {
    static get toolbox() {
        return { title: 'Video', icon: IconVideo };
    }

    /**
     * @param {object} tool - tool properties got from editor.js
     * @param {ImageToolData} tool.data - previously saved data
     * @param {ImageConfig} tool.config - user config for Tool
     * @param {object} tool.api - Editor.js API
     * @param {boolean} tool.readOnly - read-only mode flag
     * @param {BlockAPI|{}} tool.block - current Block API
     */
    constructor({ data, config, api, onSelectFile, readOnly, block }) {
        config.buttonContent = config.buttonContent || `${IconVideo} ${api.i18n.t('Select a Video')}`;
        config.types = config.types || 'video/*';
        super({ data, config, api, onSelectFile, readOnly, block });
    }

    // original render() method from image tool is used
    // render() {
    // }

    /**
     * Set new video file (override default method)
     *
     * @private
     *
     * @param {object} file - uploaded file data
     */
    set image(file) {
        this._data.file = file || {};

        if (file && file.url) {
            // this.ui.fillImage(file.url);
            this.fillVideo(file.url);
        }
    }

    /**
     * Shows a video
     *
     * @param {string} url - video source
     * @returns {void}
     */
    fillVideo(url) {
        const root = createRoot(this.ui.nodes.imageContainer);

        root.render(
            <Videojs
                src={url}
                className={this.ui.CSS.imageEl}
                onLoadedData={() => {
                    this.ui.toggleStatus('filled');
                    if (this.ui.nodes.imagePreloader) {
                        this.ui.nodes.imagePreloader.style.backgroundImage = '';
                    }
                }}
            />
        );
    }

    static get pasteConfig() {
        return {
            tags: [
                {
                    videojs: { src: true },
                    video: { src: true }
                }
            ],
            patterns: {
                video: /https?:\/\/\S+\.(mov|ogv|webm|mp4|m4v|m3u8)(\?[a-z0-9=]*)?$/i
            },
            files: {
                mimeTypes: ['video/*']
            }
        };
    }

    async onPaste(event) {
        switch (event.type) {
            case 'tag': {
                const video = event.detail.data;
                // need getAttribute for custom HTML element videojs
                this.uploadUrl(video.getAttribute('src'));
                break;
            }
            case 'pattern': {
                const url = event.detail.data;
                this.uploadUrl(url);
                break;
            }
            case 'file': {
                const file = event.detail.file;
                this.uploadFile(file);
                break;
            }
        }
    }

    destroy() {
        const root = createRoot(this.ui.nodes.imageContainer);

        root.render(null);
    }
}
