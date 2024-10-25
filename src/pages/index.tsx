import { Button, Link, Snippet } from '@nextui-org/react';

import { DiscordIcon, GithubIcon } from '@/components/icons';
import { subtitle, title } from '@/components/primitives';
import DefaultLayout from '@/layouts/default';

export default function IndexPage() {
    return (
        <DefaultLayout>
            <section className="flex h-full flex-col items-center justify-center gap-4 py-8 md:py-10">
                <div className="inline-block max-w-lg text-center justify-center">
                    <span className={title()}>Come&nbsp;</span>
                    <span className={title({ color: 'violet' })}>Brew&nbsp;</span>
                    <br />
                    <span className={title()}>
                        Build your second <span className={title({ color: 'violet' })}>brain</span>.
                    </span>
                    <div className={subtitle({ class: 'mt-4' })}>To reach beyond your limits</div>
                </div>

                <div className="flex gap-3">
                    <Link href="https://discord.gg/YGrbmbCVRF">
                        <Button color="primary" className="flex gap-2  items-center">
                            Document
                        </Button>
                    </Link>
                    <Link href="https://github.com/breeew/brew">
                        <Button color="primary" className="flex gap-2  items-center" variant="bordered">
                            <GithubIcon />
                            Github
                        </Button>
                    </Link>
                </div>

                <div className="mt-8">
                    <Snippet hideCopyButton hideSymbol variant="bordered">
                        <span className="flex items-center gap-2">
                            <div>Join us community </div>
                            <Button size="sm" color="primary" className="flex gap-2  items-center" radius="full" variant="ghost">
                                <DiscordIcon className=" float-start" />
                                Discord
                            </Button>
                        </span>
                    </Snippet>
                </div>
            </section>
        </DefaultLayout>
    );
}
