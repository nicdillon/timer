'use client';

import dynamic from 'next/dynamic'

export default function SettingsPage() {
    const SettingsNoSSR = dynamic(() => import('./Settings'), {ssr: false})

    return (
        <SettingsNoSSR/>
    );
}