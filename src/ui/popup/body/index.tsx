import {m} from 'malevic';
import {getContext} from 'malevic/dom';
import {DONATE_URL} from '../../../utils/links';
import {getLocalMessage} from '../../../utils/locales';
import {Overlay} from '../../controls';
import AutomationPage from '../automation-page';
import MainPage from '../main-page';
import NewsSection from '../news-section';
import {Page, PageViewer} from '../page-viewer';
import SettingsPage from '../settings-page';
import SiteListPage from '../site-list-page';
import ThemePage from '../theme/page';
import type {ViewProps} from '../types';
import ManageSettingsPage from '../manage-settings-page';
import {isMobile} from '../../../utils/platform';

function Logo() {
    return (
        <a
            class="m-logo"
            href="https://darkreader.org/"
            target="_blank"
            rel="noopener noreferrer"
        >
            Dark Reader
        </a>
    );
}

type PageId = (
    'main'
    | 'theme'
    | 'settings'
    | 'site-list'
    | 'automation'
    | 'manage-settings'
);

let popstate: () => void = null;
isMobile && window.addEventListener('popstate', () => popstate && popstate());

function Pages(props: ViewProps) {
    const context = getContext();
    const store = context.store as {
        activePage: PageId;
    };
    if (store.activePage == null) {
        store.activePage = 'main';
    }

    function onThemeNavClick() {
        isMobile && history.pushState(undefined, undefined);
        store.activePage = 'theme';
        context.refresh();
    }

    function onSettingsNavClick() {
        isMobile && history.pushState(undefined, undefined);
        store.activePage = 'settings';
        context.refresh();
    }

    function onAutomationNavClick() {
        isMobile && history.pushState(undefined, undefined);
        store.activePage = 'automation';
        context.refresh();
    }

    function onManageSettingsClick() {
        isMobile && history.pushState(undefined, undefined);
        store.activePage = 'manage-settings';
        context.refresh();
    }

    function onSiteListNavClick() {
        isMobile && history.pushState(undefined, undefined);
        store.activePage = 'site-list';
        context.refresh();
    }

    function goBack() {
        const activePage = store.activePage;
        const settingsPageSubpages = ['automation', 'manage-settings', 'site-list'] as PageId[];
        if (settingsPageSubpages.includes(activePage)) {
            store.activePage = 'settings';
        } else {
            store.activePage = 'main';
        }
        context.refresh();
    }

    popstate = goBack;

    function onBackClick() {
        if (isMobile) {
            history.back();
        } else {
            goBack();
        }
    }

    return (
        <PageViewer
            activePage={store.activePage}
            onBackButtonClick={onBackClick}
        >
            <Page id="main">
                <MainPage
                    {...props}
                    onThemeNavClick={onThemeNavClick}
                    onSettingsNavClick={onSettingsNavClick}
                />
            </Page>
            <Page id="theme">
                <ThemePage {...props} />
            </Page>
            <Page id="settings">
                <SettingsPage
                    {...props}
                    onAutomationNavClick={onAutomationNavClick}
                    onManageSettingsClick={onManageSettingsClick}
                    onSiteListNavClick={onSiteListNavClick}
                />
            </Page>
            <Page id="site-list">
                <SiteListPage
                    {...props}
                />
            </Page>
            <Page id="automation">
                <AutomationPage {...props} />
            </Page>
            <Page id="manage-settings">
                <ManageSettingsPage {...props} />
            </Page>

        </PageViewer>
    );
}

function DonateGroup() {
    return (
        <div class="m-donate-group">
            <a class="m-donate-button" href={DONATE_URL} target="_blank" rel="noopener noreferrer">
                <span class="m-donate-button__icon"></span>
                <span class="m-donate-button__text">
                    {getLocalMessage('donate')}
                </span>
            </a>
            <label class="m-donate-description">
                This project is sponsored by you
            </label>
        </div>
    );
}

export default function Body(props: ViewProps) {
    const context = getContext();
    context.onCreate(() => {
        if (isMobile) {
            window.addEventListener('contextmenu', (e) => e.preventDefault());
        }
    });
    context.onRemove(() => {
        document.documentElement.classList.remove('preview');
    });

    return (
        <body>
            <section class="m-section">
                <Logo />
            </section>
            <section class="m-section pages-section">
                <Pages {...props} />
            </section>
            <section class="m-section">
                <DonateGroup />
            </section>
            <NewsSection {...props} />
            <Overlay />
        </body>
    );
}
