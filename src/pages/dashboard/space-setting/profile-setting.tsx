import { Button, cn, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Popover, PopoverContent, PopoverTrigger, Skeleton, Spacer, Textarea } from '@heroui/react';
import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { DeleteUserSpace, UpdateUserSpace, type UserSpace } from '@/apis/space';
import { loadUserSpaces } from '@/stores/space';

interface ProfileSettingCardProps {
    className?: string;
    space: UserSpace;
    className?: string;
    label: string;
    variant?: string;
    radius?: string;
    onClose: () => void;
}

const ProfileSetting = React.forwardRef<HTMLDivElement, ProfileSettingCardProps>(({ className, space, onClose, ...props }, ref) => {
    const { t } = useTranslation();

    const [desc, setDesc] = useState(space.description);
    const [title, setTitle] = useState(space.title);
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    const navigate = useNavigate();

    const deleteSpace = useCallback(
        async function () {
            setDeleteLoading(true);
            setIsDisabled(true);
            try {
                await DeleteUserSpace(space.space_id);
                await loadUserSpaces();

                navigate('/dashboard');
                onClose();
            } catch (e: any) {
                console.error(e);
            }
            setDeleteLoading(false);
            setIsDisabled(false);
        },
        [space]
    );

    const updateSpace = useCallback(
        async function () {
            setLoading(true);
            setIsDisabled(true);
            try {
                await UpdateUserSpace(space.space_id, title, desc);
                await loadUserSpaces();
            } catch (e: any) {
                console.error(e);
            }
            setLoading(false);
            setIsDisabled(false);
        },
        [space, title, desc]
    );

    return (
        <div ref={ref} className={cn('p-2', className)} {...props}>
            {/* Profile */}
            <div>
                <p className="text-lg font-medium text-default-700">{t('SpaceProfile')}</p>
                <p className="mt-1 text-sm font-normal text-default-400">This displays your space profile on the site.</p>
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
                <div className="flex flex-col gap-4">
                    <Input label={t('createSpaceNameLabel')} defaultValue={title} size="lg" labelPlacement="outside" placeholder="Named your space" variant="bordered" onValueChange={setTitle} />
                    <Textarea
                        size="lg"
                        label={t('createSpaceDescriptionLabel')}
                        variant="bordered"
                        labelPlacement="outside"
                        placeholder="Your space description"
                        className="w-full"
                        defaultValue={desc}
                        onValueChange={setDesc}
                    />
                    <Spacer y={2} />
                    <div className="flex justify-end gap-4">
                        <Popover placement="top">
                            <PopoverTrigger>
                                <Button className="shadow-lg" color="danger" isDisabled={isDisabled} size="lg" onPress={deleteSpace}>
                                    {t('Delete')}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[240px]">
                                {titleProps => (
                                    <div className="px-1 py-2 w-full">
                                        <p className="text-small font-bold text-foreground" {...titleProps}>
                                            {t('DeleteSpaceWarning')}
                                        </p>
                                        <div className="mt-2 flex flex-col gap-2 w-full">
                                            <Button color="danger" isDisabled={isDisabled} size="lg" variant="ghost" isLoading={deleteLoading} onPress={deleteSpace}>
                                                {t('Delete Enter')}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </PopoverContent>
                        </Popover>

                        <Button className="bg-gradient-to-tr from-red-500 to-blue-500 text-white shadow-lg" isDisabled={isDisabled} size="lg" isLoading={loading} onPress={updateSpace}>
                            {t('Update')}
                        </Button>
                    </div>
                </div>
            </Skeleton>
        </div>
    );
});

ProfileSetting.displayName = 'ProfileSetting';

export default ProfileSetting;
