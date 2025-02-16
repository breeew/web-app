import {
    Button,
    getKeyValue,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Skeleton,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    useDisclosure
} from '@heroui/react';
import { cn } from '@heroui/react';
import { Icon } from '@iconify/react';
import { fromAbsolute, getLocalTimeZone } from '@internationalized/date';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useSnapshot } from 'valtio';

import { PlanCustomRadio } from './plan-custom-radio';

import { GetPlanList, type Plan, RedeemGiftCode, RedeemGiftCodeResponse } from '@/apis/plan';
import { AccessToken, CreateUserAccessToken, GetUserPlanDescription, ListUserAccessTokens } from '@/apis/user';
import { useMedia } from '@/hooks/use-media';
import { usePlan } from '@/hooks/use-plan';
import userStore, { setUserInfo } from '@/stores/user';

interface SecretSettingCardProps {
    className?: string;
}

const SecretSetting = React.forwardRef<HTMLDivElement, BillingSettingCardProps>(({ className, ...props }, ref) => {
    const { t } = useTranslation();

    const [tokenList, setTokenList] = React.useState<AccessToken[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    async function loadUserAccessTokens() {
        setIsLoading(true);
        try {
            const resp = await ListUserAccessTokens(1, 20);
            setTokenList(resp);
        } catch (e: any) {
            console.error(e);
        }
        setIsLoading(false);
    }

    React.useEffect(() => {
        loadUserAccessTokens();
    }, []);

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [createLoading, setCreateLoading] = React.useState(false);
    const [tokenDesc, setTokenDesc] = React.useState('');
    const [tmpToken, setTmpToken] = React.useState('');
    const createAccessToken = React.useCallback(async () => {
        setCreateLoading(true);
        try {
            const res = await CreateUserAccessToken(tokenDesc);
            await loadUserAccessTokens();
            setTmpToken(res);
        } catch (e: any) {
            console.error(e);
        }
        setCreateLoading(false);
    }, [tokenDesc]);

    const { isMobile } = useMedia();

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-center">
                    <div>
                        <span className="text-default-400 text-sm font-semibold">{t('TotalTokens', { total: tokenList.length })}</span>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="ghost" size={isMobile ? 'lg' : 'base'} onPress={onOpen}>
                            {t('Create')}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }, [tokenList]);

    const copyTokenInput = React.useRef();
    const copyToken = React.useCallback(() => {
        if (copyTokenInput.current) {
            copyTokenInput.current.select();
            document.execCommand('copy');

            toast.success(t('Copied'));
        }
    }, [copyTokenInput, tmpToken]);

    function onOpenChanged() {
        onOpenChange();
        setTmpToken('');
    }
    return (
        <div ref={ref} className={cn('p-2', className)} {...props}>
            <Table aria-label="access token table" topContent={topContent} topContentPlacement="outside">
                <TableHeader>
                    <TableColumn key="info">{t('Title')}</TableColumn>
                    <TableColumn key="token">{t('Token')}</TableColumn>
                    <TableColumn key="created_at">{t('CreatedTime')}</TableColumn>
                </TableHeader>
                <TableBody emptyContent={t('Empty')} items={tokenList} isLoading={isLoading} loadingContent={<Spinner />}>
                    {item => (
                        <TableRow key={item.name}>
                            {columnKey => <TableCell>{columnKey === 'created_at' ? new Date(getKeyValue(item, columnKey) * 1000).toLocaleString() : getKeyValue(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <Modal isOpen={isOpen} backdrop="blur" onOpenChange={onOpenChanged}>
                <ModalContent>
                    {onClose => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{t('NewTokenTitle')}</ModalHeader>
                            <ModalBody>
                                {tmpToken ? (
                                    <Input
                                        ref={copyTokenInput}
                                        label={t('Success')}
                                        size="lg"
                                        disabled
                                        value={tmpToken}
                                        endContent={
                                            <button onClick={copyToken}>
                                                <Icon icon="tabler:copy" />
                                            </button>
                                        }
                                        labelPlacement="outside"
                                        placeholder="Type your token description"
                                        variant="bordered"
                                        onValueChange={setTokenDesc}
                                    />
                                ) : (
                                    <Input label={t('TokenDescription')} size="lg" labelPlacement="outside" placeholder="Type your token description" variant="bordered" onValueChange={setTokenDesc} />
                                )}
                            </ModalBody>
                            <ModalFooter>
                                {tmpToken ? (
                                    <Button color="primary" onPress={onOpenChanged}>
                                        {t('Close')}
                                    </Button>
                                ) : (
                                    <Button color="primary" onPress={createAccessToken}>
                                        {t('Submit')}
                                    </Button>
                                )}
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
});

SecretSetting.displayName = 'SecretSetting';

export default SecretSetting;
