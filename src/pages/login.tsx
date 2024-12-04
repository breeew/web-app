import { Icon } from '@iconify/react';
import { Button, Divider, Input, Link } from '@nextui-org/react';
import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSnapshot } from 'valtio';

import { LoginWithAccessToken } from '@/apis/user';
import { Logo } from '@/components/icons';
import SignUp from '@/pages/signup';
import { setCurrentSelectedSpace, setUserSpaces } from '@/stores/space';
import userStore, { setHost, setUserAccessToken, setUserInfo } from '@/stores/user';

export default function Component() {
    const { t } = useTranslation();
    const [mode, setMode] = useState('login');

    return (
        <div
            className="flex h-screen w-screen items-center justify-end overflow-hidden bg-content1 p-2 sm:p-4 lg:p-8"
            style={{
                backgroundImage: 'url(https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/black-background-texture.jpeg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            {/* Brand Logo */}
            <div className="absolute left-10 top-10">
                <div className="flex items-center">
                    <Link href="/">
                        <Logo className="text-white mr-2" size={18} />
                        <p className="font-medium text-white">Brew</p>
                    </Link>
                </div>
            </div>

            {/* Testimonial */}
            <div className="absolute bottom-10 left-10 hidden md:block">
                <p className="max-w-xl text-white/60">
                    <span className="font-medium">“</span>
                    {t('knowledgeCreateButtonTitle')}
                    <span className="font-medium">”</span>
                </p>
            </div>
            {mode === 'login' ? <LoginComponent changeMode={v => setMode(v)} /> : <SignUp changeMode={v => setMode(v)} />}
        </div>
    );
}

const LoginComponent = memo(function LoginComponent({ changeMode }: { changeMode: (v) => void }) {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);
    const [useTokenLogin, setUseTokenLogin] = useState(false);
    const [accessToken, setAccessToken] = useState('');
    const [accessTokenInvalid, setInvalidAccessToken] = useState<{ isInvalid: boolean; message: string }>({
        isInvalid: false,
        message: ''
    });

    const { host } = useSnapshot(userStore);

    const [hostURL, setHostURL] = useState(host);
    const [hostURLInvalid, setInvalidHostURL] = useState<{ isInvalid: boolean; message: string }>({
        isInvalid: false,
        message: ''
    });

    const [isLoading, setLoading] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const setAccessTokenFunc = useCallback(
        (at: string) => {
            if (accessTokenInvalid.isInvalid) {
                setInvalidAccessToken({
                    isInvalid: false,
                    message: ''
                });
            }

            setAccessToken(at);
        },
        [accessTokenInvalid]
    );

    const setHostURLFunc = useCallback(
        (at: string) => {
            if (hostURLInvalid.isInvalid) {
                setInvalidHostURL({
                    isInvalid: false,
                    message: ''
                });
            }

            setHostURL(at);
        },
        [hostURLInvalid]
    );

    const navigate = useNavigate();

    async function accessTokenLogin() {
        if (!accessToken) {
            setInvalidAccessToken({
                isInvalid: true,
                message: 'access token is required'
            });

            return;
        }
        setLoading(true);
        if (hostURL) {
            setHost(hostURL);
        } else {
            setHost(import.meta.env.VITE_BASE_URL);
        }

        try {
            const resp = await LoginWithAccessToken(accessToken);

            setCurrentSelectedSpace('');
            setUserSpaces([]);
            setUserAccessToken(accessToken);
            setUserInfo({
                userID: resp.user_id,
                // avatar: resp.avatar,
                avatar: 'https://avatar.vercel.sh/' + resp.user_id,
                userName: resp.user_name,
                email: resp.email
            });

            navigate('/dashboard');
        } catch (e: any) {
            console.error(e);
        }
        setLoading(false);
    }

    const [useSelfHost, setUseSelfHost] = useState(false);

    return (
        <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 p-6 shadow-small">
            <p className="pb-2 text-xl font-medium">{t('LogIn')}</p>
            {!useTokenLogin ? (
                <form className="flex flex-col gap-3" onSubmit={e => e.preventDefault()}>
                    <Input label={t('Email Address')} name="email" placeholder="Enter your email" type="email" variant="bordered" />
                    <Input
                        endContent={
                            <button type="button" onClick={toggleVisibility}>
                                {isVisible ? (
                                    <Icon className="pointer-events-none text-2xl text-default-400" icon="solar:eye-closed-linear" />
                                ) : (
                                    <Icon className="pointer-events-none text-2xl text-default-400" icon="solar:eye-bold" />
                                )}
                            </button>
                        }
                        label={t('Password')}
                        name="password"
                        placeholder="Enter your password"
                        type={isVisible ? 'text' : 'password'}
                        variant="bordered"
                    />
                    <div className="flex items-center justify-end px-1 py-2">
                        {/* <Checkbox name="remember" size="sm">
                                Remember me
                            </Checkbox> */}
                        <Link className="text-default-500" href="#" size="sm">
                            {t('Forgot Password')}?
                        </Link>
                    </div>
                    <Button color="primary" type="submit">
                        {t('LogIn')}
                    </Button>
                </form>
            ) : (
                <>
                    <Input
                        label="Access Token"
                        placeholder="Enter your access-token"
                        isInvalid={accessTokenInvalid.isInvalid}
                        errorMessage={accessTokenInvalid.message}
                        variant="bordered"
                        onValueChange={setAccessTokenFunc}
                    />
                    {useSelfHost ? (
                        <Input
                            isClearable
                            label="Host"
                            placeholder="Enter your service host"
                            isInvalid={hostURLInvalid.isInvalid}
                            errorMessage={hostURLInvalid.message}
                            variant="bordered"
                            defaultValue={host}
                            onValueChange={setHostURLFunc}
                        />
                    ) : (
                        <Button
                            variant="bordered"
                            size="lg"
                            onClick={() => {
                                setUseSelfHost(e => !e);
                            }}
                        >
                            Use Self-Host
                        </Button>
                    )}

                    <Button color="primary" isLoading={isLoading} onClick={accessTokenLogin}>
                        {t('LogIn')}
                    </Button>
                </>
            )}
            <div className="flex items-center gap-4 py-2">
                <Divider className="flex-1" />
                <p className="shrink-0 text-tiny text-default-500">OR</p>
                <Divider className="flex-1" />
            </div>
            <div className="flex flex-col gap-2">
                <Button startContent={<Icon icon="bitcoin-icons:relay-filled" width={24} />} variant="bordered" onClick={() => setUseTokenLogin(prev => !prev)}>
                    Continue with {useTokenLogin ? 'Email' : 'Brew-Token'}
                </Button>
                {/* <Button startContent={<Icon icon="flat-color-icons:google" width={24} />} variant="bordered">
                        Continue with Google
                    </Button>
                    <Button startContent={<Icon className="text-default-500" icon="fe:github" width={24} />} variant="bordered">
                        Continue with Github
                    </Button> */}
            </div>
            <p className="text-center text-small">
                {t('Need to create an account')}&nbsp;
                <span className="text-blue-500 cursor-pointer" onClick={() => changeMode('signup')} onKeyDown={() => changeMode('signup')}>
                    {t('SignUp')}
                </span>
            </p>
        </div>
    );
});
