import { Icon } from '@iconify/react';
import { Button, Input, Tooltip } from '@nextui-org/react';
import { AnimatePresence, domAnimation, LazyMotion, m } from 'framer-motion';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { SendVerifyEmail, Signup } from '@/apis/user';
import { useToast } from '@/hooks/use-toast';

export default function Component({ changeMode }: { changeMode: (v: string) => void }) {
    const { t } = useTranslation();
    const { toast } = useToast();

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [verifyCode, setVerifyCode] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [[page, direction], setPage] = useState([0, 0]);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isUserNameValid, setIsUserNameValid] = useState(true);
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);
    const [isVerifyCodeValid, setIsVerifyCodeValid] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);
    const toggleConfirmPasswordVisibility = () => setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

    const Title = useCallback(
        (props: React.PropsWithChildren<{}>) => (
            <m.h1 animate={{ opacity: 1, x: 0 }} className="text-xl font-medium" exit={{ opacity: 0, x: -10 }} initial={{ opacity: 0, x: -10 }}>
                {props.children}
            </m.h1>
        ),
        [page]
    );

    const titleContent = useMemo(() => {
        return page === 0 ? t('SignUp') : page === 1 ? t('Enter Password') : t('Verify Code');
    }, [page]);

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 50 : -50,
            opacity: 0
        })
    };

    const paginate = (newDirection: number) => {
        setPage([page + newDirection, newDirection]);
    };

    const handleEmailSubmit = () => {
        if (!email.length) {
            setIsEmailValid(false);

            return;
        }
        setIsEmailValid(true);

        if (!userName.length) {
            setIsUserNameValid(false);

            return;
        }
        setIsUserNameValid(true);

        paginate(1);
    };

    const [isSendVerifyEmail, setIsSendVerifyEmail] = useState();
    const handlePasswordSubmit = async () => {
        if (!password.length) {
            setIsPasswordValid(false);

            return;
        }

        if (!confirmPassword.length || confirmPassword !== password) {
            setIsConfirmPasswordValid(false);

            return;
        }
        setIsConfirmPasswordValid(true);
        setIsPasswordValid(true);

        // Submit logic or API call here
        if (isSendVerifyEmail) {
            paginate(1);

            return;
        }
        try {
            setIsLoading(true);
            await SendVerifyEmail(email);
            paginate(1);
            setIsSendVerifyEmail(true);
            setTimeout(() => {
                setIsSendVerifyEmail(false);
            }, 1000 * 60);
        } catch (e: any) {
            console.error(e);
        }
        setIsLoading(false);
    };

    const handleSignUpSubmit = async () => {
        setIsLoading(true);
        try {
            await Signup(email, userName, password, verifyCode);
            toast({
                title: t('Notify'),
                description: t('Welcome to signup')
            });
            changeMode('login');
        } catch (e: any) {
            console.error(e);
        }
        setIsLoading(false);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        switch (page) {
            case 0:
                handleEmailSubmit();
                break;
            case 1:
                handlePasswordSubmit();
                break;
            case 2:
                handleSignUpSubmit();
                break;
            default:
                break;
        }
    };

    return (
        <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 p-6 shadow-small">
            <LazyMotion features={domAnimation}>
                <m.div className="flex min-h-[40px] items-center gap-2 pb-2">
                    <AnimatePresence initial={false} mode="popLayout">
                        {page >= 1 && (
                            <m.div animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} initial={{ opacity: 0, x: -10 }}>
                                <Tooltip content="Go back" delay={3000}>
                                    <Button isIconOnly size="sm" variant="flat" onPress={() => paginate(-1)}>
                                        <Icon className="text-default-500" icon="solar:alt-arrow-left-linear" width={16} />
                                    </Button>
                                </Tooltip>
                            </m.div>
                        )}
                    </AnimatePresence>
                    <AnimatePresence custom={direction} initial={false} mode="wait">
                        <Title>{titleContent}</Title>
                    </AnimatePresence>
                </m.div>
                <AnimatePresence custom={direction} initial={false} mode="wait">
                    <m.form
                        key={page}
                        animate="center"
                        className="flex flex-col gap-3"
                        custom={direction}
                        exit="exit"
                        initial="enter"
                        transition={{ duration: 0.2 }}
                        variants={variants}
                        onSubmit={handleSubmit}
                    >
                        {page === 0 && (
                            <>
                                <Input
                                    autoFocus
                                    isRequired
                                    label={t('Email Address')}
                                    name="email"
                                    placeholder="Enter your email"
                                    type="email"
                                    variant="bordered"
                                    validationState={isEmailValid ? 'valid' : 'invalid'}
                                    value={email}
                                    onValueChange={value => {
                                        setIsEmailValid(true);
                                        setEmail(value);
                                    }}
                                />

                                <Input
                                    isRequired
                                    label={t('UserName')}
                                    name="username"
                                    placeholder="Enter your user name"
                                    type="text"
                                    variant="bordered"
                                    validationState={isUserNameValid ? 'valid' : 'invalid'}
                                    value={userName}
                                    onValueChange={value => {
                                        setIsUserNameValid(true);
                                        setUserName(value);
                                    }}
                                />
                            </>
                        )}
                        {page === 1 && (
                            <>
                                <Input
                                    autoFocus
                                    isRequired
                                    endContent={
                                        <button type="button" onClick={togglePasswordVisibility}>
                                            {isPasswordVisible ? (
                                                <Icon className="pointer-events-none text-2xl text-default-400" icon="solar:eye-closed-linear" />
                                            ) : (
                                                <Icon className="pointer-events-none text-2xl text-default-400" icon="solar:eye-bold" />
                                            )}
                                        </button>
                                    }
                                    label={t('Password')}
                                    name="password"
                                    variant="bordered"
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    validationState={isPasswordValid ? 'valid' : 'invalid'}
                                    value={password}
                                    onValueChange={value => {
                                        setIsPasswordValid(true);
                                        setPassword(value);
                                    }}
                                />

                                <Input
                                    isRequired
                                    endContent={
                                        <button type="button" onClick={toggleConfirmPasswordVisibility}>
                                            {isConfirmPasswordVisible ? (
                                                <Icon className="pointer-events-none text-2xl text-default-400" icon="solar:eye-closed-linear" />
                                            ) : (
                                                <Icon className="pointer-events-none text-2xl text-default-400" icon="solar:eye-bold" />
                                            )}
                                        </button>
                                    }
                                    errorMessage={!isConfirmPasswordValid ? t('Passwords do not match') : undefined}
                                    variant="bordered"
                                    label={t('Confirm Password')}
                                    name="confirmPassword"
                                    type={isConfirmPasswordVisible ? 'text' : 'password'}
                                    validationState={isConfirmPasswordValid ? 'valid' : 'invalid'}
                                    value={confirmPassword}
                                    onValueChange={value => {
                                        setIsConfirmPasswordValid(true);
                                        setConfirmPassword(value);
                                    }}
                                />
                            </>
                        )}
                        {page === 2 && (
                            <>
                                <Input
                                    autoFocus
                                    isRequired
                                    errorMessage={!isVerifyCodeValid ? 'Enter your email verify code' : undefined}
                                    label={t('Verify Code')}
                                    name="verifyCode"
                                    variant="bordered"
                                    type="text"
                                    validationState={isVerifyCodeValid ? 'valid' : 'invalid'}
                                    value={verifyCode}
                                    onValueChange={value => {
                                        setIsVerifyCodeValid(true);
                                        setVerifyCode(value);
                                    }}
                                />
                                <span className="text-sm dark:text-zinc-300 text-zinc-600">{t('Please check your email for the verification code')}</span>
                            </>
                        )}
                        <Button fullWidth color="primary" type="submit" className="mt-6" isLoading={isLoading}>
                            {page === 0 ? t('Continue') : page === 1 ? t('Enter Password') : t('SignUp')}
                        </Button>
                    </m.form>
                </AnimatePresence>
            </LazyMotion>
            <p className="text-center text-small">
                {t('Already have an account')}&nbsp;
                <span className="text-blue-500 cursor-pointer" onClick={() => changeMode('login')} onKeyDown={() => changeMode('login')}>
                    {t('LogIn')}
                </span>
            </p>
        </div>
    );
}
