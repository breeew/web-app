import { Button, cn, Image, Link, Snippet } from '@nextui-org/react';

import { DiscordIcon, GithubIcon } from '@/components/icons';
import { Name } from '@/components/logo';
import MorphingText from '@/components/morphing-text';
import NeonGradientCard from '@/components/neon-gradient-card';
import Particles from '@/components/particles';
import { subtitle, title } from '@/components/primitives';
import SafariBox from '@/components/safari-box';
import ShineBorder from '@/components/shine-border';
import ShinyText from '@/components/shiny-text';
import DefaultLayout from '@/layouts/default';

export default function IndexPage() {
    return (
        <DefaultLayout>
            <section className="flex h-full flex-col items-center gap-4 py-8 md:py-10">
                <div className="z-10 mb-4 flex items-center justify-center">
                    <div
                        className={cn(
                            'group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800'
                        )}
                    >
                        <ShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                            <span>✨ Quick start your cyber memory</span>
                        </ShinyText>
                    </div>
                </div>

                <div className="inline-block max-w-xl text-center justify-center">
                    <span className={title()}>Come&nbsp;</span>
                    <span className={title({ color: 'violet' })}>{Name}&nbsp;</span>
                    <br />
                    <span className={title()}>
                        Build your second <span className={title({ color: 'violet' })}>brain</span>.
                    </span>
                    {/* <div className={subtitle({ class: 'mt-4' })}>To reach beyond your limits</div> */}
                </div>

                <div className="flex gap-3 mt-10 mb-24">
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

                <MorphingText className="mb-20" texts={['Oblivion Your Memory', 'To', 'Reach beyond your limits']} />
                {/* <div className="mt-8">
                    <Snippet hideCopyButton hideSymbol variant="bordered">
                        <span className="flex items-center gap-2">
                            <div>Join us community </div>
                            <Button size="sm" color="primary" className="flex gap-2  items-center" radius="full" variant="ghost">
                                <DiscordIcon className=" float-start" />
                                Discord
                            </Button>
                        </span>
                    </Snippet>
                </div> */}

                <NeonGradientCard className=" justify-center text-center w-full max-w-[1200px]">
                    <Image src="https://brew-img.holdno.com/website/demo/obliv-demo.png" className="w-full" />
                </NeonGradientCard>
            </section>
            <Particles className="absolute inset-0 z-0" quantity={200} ease={10} refresh />
        </DefaultLayout>
    );
}
