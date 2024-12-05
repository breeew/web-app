import ImageTool from '@editorjs/image';

import { DescribeImage } from '@/apis/tools';
import { notifyTaskProgress } from '@/stores/event';

const genenrating = new Map<string, bool>();

let count = 0;

function genId() {
    count = (count + 1) % Number.MAX_SAFE_INTEGER;

    return count.toString();
}

async function aiGenImageDescription(i18n: (string) => string, url: string): Promise<string | undefined> {
    const id = genId();

    if (genenrating.get(url)) {
        notifyTaskProgress({
            id: id,
            title: 'AI Task Notify',
            description: 'Please do not submit repeatedly',
            status: 'warning'
        });

        return undefined;
    }

    try {
        notifyTaskProgress({
            id: id,
            title: 'AI Task Notify',
            description: 'AI is processing the image, please wait a moment',
            status: 'processing'
        });
        genenrating.set(url, true);
        const result = await DescribeImage(url);

        genenrating.delete(url);

        notifyTaskProgress({
            id: id,
            title: 'AI Task Notify',
            description: 'Done',
            status: 'success'
        });

        return result;
    } catch (e: any) {
        console.error(e);
        notifyTaskProgress({
            id: id,
            title: 'AI Task Notify',
            description: 'Failed',
            status: 'failed'
        });

        return;
    }
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
                const result = await aiGenImageDescription(this.api.i18n.t, this._data.file.url);

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
