import React, { memo, Suspense, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { classNames } from '@/shared/lib/classNames/classNames';
import { getUserInited, initAuthData } from '@/entities/User';
import { AppRouter } from './providers/router';
import { Navbar } from '@/widgets/Navbar';
import { Sidebar } from '@/widgets/Sidebar';
import { useTheme } from '@/shared/lib/hooks/useTheme/useTheme';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { ToggleFeatures } from '@/shared/lib/features';
import { MainLayout } from '@/shared/layouts/MainLayout';
import { AppLoaderLayout } from '@/shared/layouts/AppLoaderLayout';
import { PageLoader } from '@/widgets/PageLoader';
import { useAppToolbar } from './lib/useAppToolbar';
import { withTheme } from './providers/ThemeProvider/ui/withTheme';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('');
const App = memo(() => {
    const { theme } = useTheme();
    const dispatch = useAppDispatch();
    const inited = useSelector(getUserInited);
    const toolbar = useAppToolbar();

    useEffect(() => {
        if (!inited) {
            dispatch(initAuthData());
        }
    }, [dispatch, inited]);

    if (!inited) {
        return (
            <div
                                    id="app"
                                    className={classNames('app_redesigned', {}, [theme])}
                                >
                <Elements stripe={stripePromise}>

                <AppLoaderLayout />{' '}
                </Elements>
                                </div>
        );
    }

    return (
        <div
                            id="app"
                            className={classNames('app_redesigned', {}, [theme])}
                        >
            <Elements stripe={stripePromise}>
                            <Suspense fallback="">
                                <MainLayout
                                    header={<Navbar />}
                                    content={<AppRouter />}
                                    sidebar={<Sidebar />}
                                    toolbar={toolbar}
                                />
                            </Suspense>
            </Elements>

        </div>
    );
});

export default withTheme(App);
