import { FlagProvider as UnleashFlagProvider } from '@unleash/proxy-client-react'
import { useFlag as useUnleashFlag } from '@unleash/proxy-client-react'
import type { PropsWithChildren } from 'react'
import { env } from './env'

const unleashConfig = {
    // How often (in seconds) the client should poll the proxy for updates
    refreshInterval: 60,
    // The name of your application. It's only used for identifying your application
    appName: 'coaching-sospeso',
    // Your front-end API URL or the Unleash proxy's URL (https://<proxy-url>/proxy)
    url: 'https://unleash.life-lifter.com/api/frontend/',
    // A client-side API token OR one of your proxy's designated client keys (previously known as proxy secrets)
    clientKey: env.UNLEASH_FRONTEND_TOKEN,
}

export function useFlag(key: string): boolean{
    return useUnleashFlag(key)
}

export function FlagProvider({ children }: PropsWithChildren) {
    return (
        <UnleashFlagProvider config= {unleashConfig} >
            {children}
        </UnleashFlagProvider>
  )
}