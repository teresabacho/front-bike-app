import { memo, useMemo, useState } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import { ThemeSwitcher } from '@/features/ThemeSwitcher';
import { LangSwitcher } from '@/features/LangSwitcher';
import {HStack, VStack} from '@/shared/ui/redesigned/Stack';
import cls from './Sidebar.module.scss';
import { SidebarItem } from '../SidebarItem/SidebarItem';
import { useSidebarItems } from '../../model/selectors/getSidebarItems';
import { Icon } from '@/shared/ui/redesigned/Icon';
import ArrowIcon from '@/shared/assets/icons/arrow-bottom.svg';
import {Text} from "@/shared/ui/redesigned/Text";

interface SidebarProps {
    className?: string;
}

export const Sidebar = memo(({ className }: SidebarProps) => {
    const [collapsed, setCollapsed] = useState(false);
    const sidebarItemsList = useSidebarItems();

    const onToggle = () => {
        setCollapsed((prev) => !prev);
    };

    const itemsList = useMemo(
        () =>
            sidebarItemsList.map((item) => (
                <SidebarItem
                    item={item}
                    collapsed={collapsed}
                    key={item.path}
                />
            )),
        [collapsed, sidebarItemsList],
    );

    return (
        <aside
                            data-testid="sidebar"
                            className={classNames(
                                cls.SidebarRedesigned,
                                { [cls.collapsedRedesigned]: collapsed },
                                [className],
                            )}
                        >

                            <VStack role="navigation" gap="8" className={cls.items}>
                                {itemsList}
                            </VStack>
                            <Icon
                                data-testid="sidebar-toggle"
                                onClick={onToggle}
                                className={cls.collapseBtn}
                                Svg={ArrowIcon}
                                clickable
                            />
                            <div className={cls.switchers}>
                                <HStack gap={'4'} max justify={'center'} align={'center'}>
                                    <ThemeSwitcher />
                                    <Text className={'aaa'} text={'Тема'} />
                                </HStack>
                                <LangSwitcher short={collapsed} className={cls.lang} />
                            </div>
                        </aside>
    );
});
