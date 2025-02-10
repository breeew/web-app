import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea, useDisclosure } from '@heroui/react';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { CreateUserSpace } from '@/apis/space';
import { loadUserSpaces } from '@/stores/space';

const CreateSpaceComponent = forwardRef((_, ref) => {
    const { t } = useTranslation();
    const { isOpen, onOpenChange, onClose } = useDisclosure();

    function trigger() {
        onOpenChange();
    }

    useImperativeHandle(ref, () => ({
        trigger
    }));

    const [desc, setDesc] = useState('');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);

    async function createSpace() {
        setLoading(true);
        try {
            await CreateUserSpace(title, desc);

            await loadUserSpaces();
            onClose();
            toast.success(t('Success'));
        } catch (e: any) {
            console.error(e);
        }
        setLoading(false);
    }

    return (
        <>
            <Modal backdrop="blur" className="z-[1000000]" isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{t('Create new space')}</ModalHeader>
                            <ModalBody>
                                <Input label={t('createSpaceNameLabel')} size="lg" labelPlacement="outside" placeholder="Named your space" variant="bordered" onValueChange={setTitle} />
                                <Textarea
                                    size="lg"
                                    label={t('createSpaceDescriptionLabel')}
                                    variant="bordered"
                                    labelPlacement="outside"
                                    placeholder="Your space description"
                                    className="w-full"
                                    onValueChange={setDesc}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button className="bg-gradient-to-tr from-red-500 to-blue-500 text-white shadow-lg" isLoading={loading} onPress={createSpace}>
                                    {t('Create')}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
});

CreateSpaceComponent.displayName = 'CreateSpace';

export default CreateSpaceComponent;
