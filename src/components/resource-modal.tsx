import { Button, ButtonGroup, Input, Kbd, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea, useDisclosure } from '@nextui-org/react';
import { forwardRef, memo, useCallback, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSnapshot } from 'valtio';

import ResourceDeletePopover from './resource-delete-popover';

import { CreateResource, type Resource, UpdateResource } from '@/apis/resource';
import { useMedia } from '@/hooks/use-media';
import { useToast } from '@/hooks/use-toast';
import spaceStore from '@/stores/space';

interface ResourceManageProps {
    onModify: () => void;
}

const ResourceManage = memo(
    forwardRef((props: ResourceManageProps, ref: any) => {
        const { t } = useTranslation();
        const { currentSelectedSpace } = useSnapshot(spaceStore);
        const { isOpen, onOpen, onClose } = useDisclosure();
        const [id, setID] = useState('');
        const [title, setTitle] = useState('');
        const [cycle, setCycle] = useState<number | null>();
        const [description, setDescription] = useState('');
        const [resource, setResource] = useState<Resource | null>({
            title: '',
            description: '',
            id: ''
        });
        const [isCreate, setIsCreate] = useState(false);
        const [isLoading, setIsLoading] = useState(false);
        const { toast } = useToast();

        const { isMobile } = useMedia();
        const { onModify } = props;

        function show(resource: Resource | string | undefined) {
            if (!resource) {
                setIsCreate(true);
            } else if (typeof resource === 'string') {
                // TODO load resource
            } else {
                setResource(resource);
                setID(resource.id);
                setTitle(resource.title);
                setCycle(resource.cycle);
                setDescription(resource.description);
            }
            onOpen();
        }

        const create = useCallback(async () => {
            if (!id) {
                return;
            }
            setIsLoading(true);
            try {
                await CreateResource(currentSelectedSpace, id, title, cycle, description);
                onModify && onModify();
                onClose();
                toast({
                    title: t('Success')
                });
            } catch (e: any) {
                console.error(e);
            }
            setIsLoading(false);
        }, [currentSelectedSpace, id, title, cycle, description]);

        const update = useCallback(async () => {
            if (!id) {
                return;
            }
            setIsLoading(true);
            try {
                await UpdateResource(currentSelectedSpace, id, title, cycle, description);
                onModify && onModify();
                onClose();
                toast({
                    title: t('Success')
                });
            } catch (e: any) {
                console.error(e);
            }
            setIsLoading(false);
        }, [currentSelectedSpace, id, title, cycle, description]);

        const onDelete = useCallback(async () => {
            onModify && onModify();
            onClose();
            toast({
                title: t('Success')
            });
        }, [currentSelectedSpace, id, title, cycle, description]);

        useImperativeHandle(ref, () => {
            return {
                show
            };
        });

        return (
            <Modal backdrop="blur" placement="auto" scrollBehavior="inside" size={isMobile ? 'full' : 'lg'} isOpen={isOpen} isKeyboardDismissDisabled={false} onClose={onClose}>
                <ModalContent>
                    {onClose => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 dark:text-gray-100 text-gray-800">
                                {/* <Breadcrumbs>
                                    <BreadcrumbItem>Home</BreadcrumbItem>
                                    <BreadcrumbItem onClick={onClose}>{spaceTitle === 'Main' ? t('MainSpace') : spaceTitle}</BreadcrumbItem>
                                    <BreadcrumbItem>{t('CreateResource')}</BreadcrumbItem>
                                </Breadcrumbs> */}
                            </ModalHeader>
                            <ModalBody className="w-full overflow-hidden flex flex-col items-center">
                                <div className="w-full h-full md:max-w-[650px]">
                                    <div className="flex flex-wrap gap-1">
                                        <Input
                                            isRequired
                                            isDisabled={!isCreate}
                                            label={t('ID')}
                                            variant="bordered"
                                            placeholder="Resource key"
                                            className="text-xl text-gray-800 dark:text-gray-100"
                                            labelPlacement="outside"
                                            defaultValue={resource?.id}
                                            description="only allow type a-z,A-Z"
                                            onValueChange={setID}
                                        />
                                    </div>
                                    <div className="w-full my-5 dark:text-gray-100 text-gray-800 text-lg overflow-hidden">
                                        <Input
                                            label={t('Title')}
                                            variant="bordered"
                                            placeholder="Resource title"
                                            className="text-xl text-gray-800 dark:text-gray-100"
                                            labelPlacement="outside"
                                            defaultValue={resource?.title}
                                            onValueChange={setTitle}
                                        />
                                    </div>

                                    <div className="flex flex-wrap gap-1 mb-5">
                                        <Input
                                            label={t('ClearCycle') + '(' + t('Day') + ')' + ' empty or 0 means unlimit'}
                                            variant="bordered"
                                            placeholder="Resource life cycle (day)"
                                            className="text-xl text-gray-800 dark:text-gray-100"
                                            labelPlacement="outside"
                                            type="number"
                                            defaultValue={resource?.cycle}
                                            description="allow number"
                                            onValueChange={setCycle}
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-1 mb-5">
                                        <Textarea
                                            label={t('Description')}
                                            variant="bordered"
                                            labelPlacement="outside"
                                            placeholder="Your resource description"
                                            className="w-full"
                                            defaultValue={resource?.description}
                                            onValueChange={setDescription}
                                        />
                                    </div>
                                    <div className="flex gap-4 justify-end">
                                        <Button
                                            className="mt-6 float-right w-32 text-white bg-gradient-to-br from-pink-300 to-indigo-300 dark:from-indigo-500 dark:to-pink-500"
                                            isLoading={isLoading}
                                            onClick={isCreate ? create : update}
                                        >
                                            {isCreate ? t('Submit') : t('Update')}
                                        </Button>
                                    </div>
                                    <div className="pb-10" />
                                </div>
                            </ModalBody>
                            {isCreate || (
                                <ModalFooter className="flex justify-center">
                                    <ButtonGroup variant="flat" size={isMobile ? 'sm' : 'lg'}>
                                        <ResourceDeletePopover resource={resource} onDelete={onDelete}>
                                            <Button color="danger">{t('Delete')}</Button>
                                        </ResourceDeletePopover>

                                        <Button onPress={onClose}>{t('Close')}</Button>
                                    </ButtonGroup>
                                </ModalFooter>
                            )}
                        </>
                    )}
                </ModalContent>
            </Modal>
        );
    })
);

export default ResourceManage;
