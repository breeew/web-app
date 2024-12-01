import ImageTool from '@editorjs/image';

import { DescribeImage } from '@/apis/tools';

const genenrating = new Map<string, bool>();

async function aiGenImageDescription(url: string): Promise<string | undefined> {
    if (genenrating.get(url)) {
        return undefined;
    }
    genenrating.set(url, true);
    const result = await DescribeImage(url);

    genenrating.delete(url);

    return result;
}

export default class CustomImage extends ImageTool {
    /**
     * Callback fired when Block Tune is activated
     * @param tuneName - tune that has been clicked
     */
    private async tuneToggled(tuneName: keyof ImageToolData): void {
        console.log(this);
        switch (tuneName) {
            case 'aiGenImageDescript':
                this._data[tuneName] = true;
                const result = await aiGenImageDescription(this._data.file.url);

                if (result) {
                    this._data.caption = result;
                    this.ui.fillCaption(this._data.caption);
                }

                return;
            default:
        }

        // inverse tune state
        this.setTune(tuneName, !(this._data[tuneName] as boolean));

        // reset caption on toggle
        if (tuneName === 'caption' && !this._data[tuneName]) {
            this._data.caption = '';
            this.ui.fillCaption('');
        }
    }

    /**
     * Set one tune
     * @param tuneName - {@link Tunes.tunes}
     * @param value - tune state
     */
    private setTune(tuneName: keyof ImageToolData, value: boolean): void {
        (this._data[tuneName] as boolean) = value;
        this.ui.applyTune(tuneName, value);
        if (tuneName === 'stretched') {
            /**
             * Wait until the API is ready
             */
            Promise.resolve()
                .then(() => {
                    this.block.stretched = value;
                })
                .catch(err => {
                    console.error(err);
                });
        }
    }
}
