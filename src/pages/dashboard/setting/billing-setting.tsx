import { Icon } from '@iconify/react';
import { Button, Input, RadioGroup, Select, SelectItem, Spacer } from '@nextui-org/react';
import { cn } from '@nextui-org/react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { PlanCustomRadio } from './plan-custom-radio';

interface BillingSettingCardProps {
    className?: string;
}

const BillingSetting = React.forwardRef<HTMLDivElement, BillingSettingCardProps>(({ className, ...props }, ref) => {
    const { t } = useTranslation();

    return (
        <div ref={ref} className={cn('p-2', className)} {...props}>
            {/* Payment Method */}
            <div>
                <div className="rounded-large bg-default-100">
                    <div className="flex items-center justify-between gap-2 px-4 py-3">
                        <div className="flex items-center gap-3">
                            <Icon className="h-6 w-6 text-default-500" icon="solar:card-outline" />
                            <div>
                                <p className="text-sm font-medium text-default-600">Payment method</p>
                                <p className="text-xs text-default-400">MasterCard credit card ending in ***3456</p>
                            </div>
                        </div>
                        <Button className="bg-default-foreground text-background" radius="md" size="sm" variant="shadow">
                            Update
                        </Button>
                    </div>
                </div>
            </div>
            <Spacer y={4} />
            {/* Current Plan */}
            <div>
                <p className="text-base font-medium text-default-700">{t('Current Plan')}</p>
                <p className="mt-1 text-sm font-normal text-default-400">
                    {t('Your membership plan will expire on')} <span className="text-default-500">2024/12/31</span>
                </p>
                {/* Plan radio group */}
                <RadioGroup
                    className="mt-4"
                    classNames={{
                        wrapper: 'gap-4 flex-row flex-wrap'
                    }}
                    defaultValue="pro-monthly"
                    orientation="horizontal"
                >
                    <PlanCustomRadio
                        classNames={{
                            label: 'text-default-500 font-medium'
                        }}
                        description={t('Trial Plan')}
                        value="trial-monthly"
                    >
                        <div className="mt-2">
                            <p className="pt-2">
                                <span className="text-[30px] font-semibold leading-7 text-default-foreground">$2</span>
                                &nbsp;<span className="text-xs font-medium text-default-400">/{t('per month')}</span>
                            </p>
                            <ul className="list-inside mt-3 list-disc text-xs font-normal text-default-500">
                                <li>{t('All features')}</li>
                                <li>{t('Limited use, updated every days', { day: 7 })}</li>
                                <li>{t('object storage space', { size: '1GB' })}</li>
                            </ul>
                        </div>
                    </PlanCustomRadio>
                    <PlanCustomRadio
                        classNames={{
                            label: 'text-default-500 font-medium'
                        }}
                        description={t('Pro Monthly')}
                        value="pro-monthly"
                    >
                        <div className="mt-2">
                            <p className="pt-2">
                                <span className="text-[30px] font-semibold leading-7 text-default-foreground">$12</span>
                                &nbsp;<span className="text-xs font-medium text-default-400">/{t('per month')}</span>
                            </p>
                            <ul className="list-inside mt-3 list-disc text-xs font-normal text-default-500">
                                <li>{t('All features')}</li>
                                <li>{t('Meets most use cases, with only limited access for abnormal usage')}</li>
                                <li>{t('object storage space', { size: '50GB' })}</li>
                            </ul>
                        </div>
                    </PlanCustomRadio>
                    <PlanCustomRadio
                        classNames={{
                            label: 'text-default-500 font-medium'
                        }}
                        description={t('Pro Yearly')}
                        value="pro-yearly"
                    >
                        <div className="mt-2">
                            <p className="pt-2">
                                <span className="text-[30px] font-semibold leading-7 text-default-foreground">$120</span>
                                &nbsp;<span className="text-xs font-medium text-default-400">/{t('per year')}</span>
                            </p>
                            <ul className="list-inside mt-3 list-disc text-xs font-normal text-default-500">
                                <li>{t('All features')}</li>
                                <li>{t('Meets most use cases, with only limited access for abnormal usage')}</li>
                                <li>{t('object storage space', { size: '70GB' })}</li>
                            </ul>
                        </div>
                    </PlanCustomRadio>
                </RadioGroup>
            </div>
            <Spacer y={4} />
            {/* Billing Address */}
            <div>
                {/*  Title */}
                <div>
                    <p className="text-base font-medium text-default-700">Share</p>
                    <p className="mt-1 text-sm font-normal text-default-400">Your personal referral code.</p>
                </div>
            </div>
            <div className="mt-2 space-y-2">
                <Input placeholder="Address Line 1" />
            </div>
            <Button className="mt-5 bg-default-foreground text-background">{t('Update')}</Button>
        </div>
    );
});

BillingSetting.displayName = 'BillingSetting';

export default BillingSetting;
