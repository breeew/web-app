import { Button, Input, Skeleton, Spacer } from '@nextui-org/react';
import { cn } from '@nextui-org/react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useSnapshot } from 'valtio';
import { subscribeKey } from 'valtio/utils';

import { UpdateUserProfile } from '@/apis/user';
import { useToast } from '@/hooks/use-toast';
import userStore, { setUserInfo } from '@/stores/user';

interface ProfileSettingCardProps {
    className?: string;
}

const ProfileSetting = React.forwardRef<HTMLDivElement, ProfileSettingCardProps>(({ className, ...props }, ref) => {
    const { t } = useTranslation();

    const { userInfo } = useSnapshot(userStore);
    const [loading, setLoading] = React.useState(true);
    const { toast } = useToast();

    const [userName, setUserName] = React.useState('');
    const [errorUserName, setErrorUserName] = React.useState({
        invalid: false,
        errorMessage: ''
    });
    const [email, setEmail] = React.useState('');
    const [errorEmail, setErrorEmail] = React.useState({
        invalid: false,
        errorMessage: ''
    });

    React.useEffect(() => {
        if (!userInfo) {
            subscribeKey(userStore, 'userInfo', userInfo => {
                if (!userInfo) {
                    return;
                }

                setEmail(userInfo.email);
                setUserName(userInfo.userName);
            });

            return;
        }

        setEmail(userInfo.email);
        setUserName(userInfo.userName);

        setLoading(false);
    }, [userInfo]);

    const disabled = React.useMemo(() => {
        return userInfo.email === email && userInfo.userName === userName;
    }, [email, userName, userInfo]);

    function initInvalidMessage() {
        setErrorUserName({
            invalid: false,
            errorMessage: ''
        });
        setErrorEmail({
            invalid: false,
            errorMessage: ''
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    async function updateUserProfile() {
        initInvalidMessage();
        if (userName.length > 32) {
            setErrorUserName({
                invalid: true,
                errorMessage: 'too long, must < 32'
            });

            return;
        }

        if (!emailRegex.test(email)) {
            setErrorEmail({
                invalid: true,
                errorMessage: 'email address is wrong'
            });

            return;
        }

        setLoading(true);
        try {
            await UpdateUserProfile(userName, email);
            setUserInfo({
                userID: userInfo.userID,
                email: email,
                avatar: 'https://avatar.vercel.sh/' + userInfo.user_id,
                userName: userName
            });
            toast({
                title: t('Success')
            });
        } catch (e: any) {
            console.error(e);
        }
        setLoading(false);
    }

    return (
        <div ref={ref} className={cn('p-2', className)} {...props}>
            {/* Profile */}
            <div>
                <p className="text-base font-medium text-default-700">{t('Profile')}</p>
                <p className="mt-1 text-sm font-normal text-default-400">This displays your public profile on the site.</p>
                {/* <Card className="mt-4 bg-default-100" shadow="none">
                    <CardBody>
                        <div className="flex items-center gap-4">
                            <Badge
                                disableOutline
                                classNames={{ badge: 'w-5 h-5' }}
                                content={
                                    <Button isIconOnly className="h-5 w-5 min-w-5 bg-background p-0 text-default-500" radius="full" size="sm" variant="bordered">
                                        <Icon className="h-[9px] w-[9px]" icon="solar:pen-linear" />
                                    </Button>
                                }
                                placement="bottom-right"
                                shape="circle"
                            >
                                <Avatar className="h-16 w-16" src="https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/avatars/e1b8ec120710c09589a12c0004f85825.jpg" />
                            </Badge>
                            <div>
                                <p className="text-sm font-medium text-default-600">Kate Moore</p>
                                <p className="text-xs text-default-400">Customer Support</p>
                                <p className="mt-1 text-xs text-default-400">kate.moore@acme.com</p>
                            </div>
                        </div>
                    </CardBody>
                </Card> */}
            </div>
            <Spacer y={4} />
            <Skeleton isLoaded={!loading}>
                {/* Username */}
                <div>
                    <p className="text-base font-medium text-default-700">{t('Nickname')}</p>
                    <p className="mt-1 text-sm font-normal text-default-400">Nickname or first name.</p>
                    {userName && (
                        <Input
                            className="mt-2"
                            placeholder="Type your nickname"
                            isInvalid={errorUserName.invalid}
                            errorMessage={errorUserName.errorMessage}
                            defaultValue={userInfo.userName}
                            onValueChange={setUserName}
                        />
                    )}
                </div>
                <Spacer y={2} />
                {/* Email Address */}
                <div>
                    <p className="text-base font-medium text-default-700">{t('Email Address')}</p>
                    <p className="mt-1 text-sm font-normal text-default-400">The email address associated with your account.</p>
                    {email && (
                        <Input
                            className="mt-2"
                            placeholder="Type your email"
                            type="email"
                            isInvalid={errorEmail.invalid}
                            errorMessage={errorEmail.errorMessage}
                            defaultValue={email}
                            onValueChange={setEmail}
                        />
                    )}
                </div>
                <Spacer y={2} />
                <Button isDisabled={disabled} className="mt-4 bg-default-foreground text-background" isLoading={loading} onClick={updateUserProfile}>
                    {t('Update')}
                </Button>
            </Skeleton>
        </div>
    );
});

ProfileSetting.displayName = 'ProfileSetting';

export default ProfileSetting;
