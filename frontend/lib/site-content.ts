export type SiteContent = {
  brandName: string;
  heroTitle: string;
  heroSubtitle: string;
  marketBriefing: string;
  investorScore: string;
  nifty50: string;
  sensex: string;
  niftyBank: string;
};

const STORAGE_KEY = 'investoriq_site_content';

export const defaultSiteContent: SiteContent = {
  brandName: 'InvestorIQ',
  heroTitle: 'Investor intelligence for the next move',
  heroSubtitle: 'Track markets, monitor risk, and surface the right opportunities before the crowd does.',
  marketBriefing: 'Markets are balancing global growth momentum with tighter risk monitoring and selective opportunities.',
  investorScore: '82',
  nifty50: '24,501',
  sensex: '80,640',
  niftyBank: '52,410',
};

export function getSiteContent(): SiteContent {
  if (typeof window === 'undefined') {
    return defaultSiteContent;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultSiteContent;
    }

    const parsed = JSON.parse(raw) as Partial<SiteContent>;
    return { ...defaultSiteContent, ...parsed };
  } catch {
    return defaultSiteContent;
  }
}

export function saveSiteContent(updates: Partial<SiteContent>): SiteContent {
  const next = { ...getSiteContent(), ...updates };

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  return next;
}

export function resetSiteContent(): SiteContent {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(STORAGE_KEY);
  }

  return defaultSiteContent;
}
