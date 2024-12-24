import "@interchain-ui/react/styles"
import React from 'react';
import {Container} from '@mui/material';
import { styled } from '@mui/system';
import ValidatorCampaignPage from "./pages/ValidatorCampaignPage";
import FAQComponent from "./components/FAQComponent";
import SocialLinks from "./components/SocialLinks";
import { ChainProvider } from '@cosmos-kit/react';
import {wallets, SignerOptions} from 'cosmos-kit';
import { chains, assets } from 'chain-registry';
import { GasPrice } from '@cosmjs/stargate';

const AppWrapper = styled('div')({
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(135deg, #13001E 0%, #1E0034 50%, #2D0050 100%)',
    backgroundAttachment: 'fixed',
    color: '#fff',
    position: 'relative',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 50% 0%, rgba(255, 64, 129, 0.15) 0%, rgba(0, 0, 0, 0) 50%)',
        pointerEvents: 'none'
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("/noise.png")',
        opacity: 0.03,
        pointerEvents: 'none',
        animation: 'grain 8s steps(10) infinite'
    }
});

const MainContent = styled(Container)({
    flex: 1,
    padding: '2rem 1rem',
    position: 'relative',
    zIndex: 1,
    '@media (min-width: 600px)': {
        padding: '3rem 2rem',
    },
    '@media (min-width: 960px)': {
        padding: '4rem 2rem',
    }
});

const App: React.FC = () => {
    const signerOptions: SignerOptions = {
        preferredSignType: () => 'direct',
        signingStargate: (_chain) => {
            let gasPrice;
            try {
                const chain = typeof _chain === 'string'
                    ? chains.find(({ chain_name }) => chain_name === _chain)!
                    : _chain;
                const feeToken = chain.fees?.fee_tokens[0];
                const fee = `${feeToken?.average_gas_price || 0.025}${feeToken?.denom}`;
                gasPrice = GasPrice.fromString(fee);
            } catch (error) {
                gasPrice = GasPrice.fromString('0.025uatom');
            }
            return { gasPrice };
        },
    };

    return (
        <ChainProvider
            chains={chains}
            assetLists={assets}
            wallets={wallets}
            endpointOptions={{
                isLazy: true,
                endpoints: {
                    cosmoshub: {
                        rpc: ['https://cosmoshub.tendermintrpc.lava.build/'],
                        rest: ['https://cosmoshub.api.kjnodes.com/'],
                    },
                }
            }}
            walletConnectOptions={{
                signClient: {
                    projectId: 'a8510432ebb71e6948cfd6cde54b70f7',
                    relayUrl: 'wss://relay.walletconnect.org',
                    metadata: {
                        name: 'Cosmos Kit dApp',
                        description: 'Cosmos Kit dApp built by Create Cosmos App',
                        url: 'https://docs.cosmology.zone/cosmos-kit/',
                        icons: [],
                    },
                },
            }}
            signerOptions={signerOptions}
        >
            <AppWrapper>
                <SocialLinks />
                <MainContent maxWidth="lg">
                    <ValidatorCampaignPage />
                    <FAQComponent />
                </MainContent>
            </AppWrapper>
        </ChainProvider>
    );
};

export default App;