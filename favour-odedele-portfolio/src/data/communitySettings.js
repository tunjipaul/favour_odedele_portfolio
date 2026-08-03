export const DEFAULT_COMMUNITY_SETTINGS = {
  title: 'Join my community on Substack',
  description:
    'Join my community on Substack for essays, reflections, opportunities, book updates, and insights on education, leadership, entrepreneurship, and personal growth.',
  buttonText: 'Join my community on Substack',
  substackUrl: 'https://favourodedele.substack.com/subscribe',
  openInNewTab: true,
};

export const SUBSTACK_DASHBOARD_URL = 'https://favourodedele.substack.com';

export function normalizeCommunitySettings(data) {
  return {
    title: data?.title?.trim() || DEFAULT_COMMUNITY_SETTINGS.title,
    description: data?.description?.trim() || DEFAULT_COMMUNITY_SETTINGS.description,
    buttonText: data?.buttonText?.trim() || DEFAULT_COMMUNITY_SETTINGS.buttonText,
    substackUrl: data?.substackUrl?.trim() || DEFAULT_COMMUNITY_SETTINGS.substackUrl,
    openInNewTab: data?.openInNewTab !== false,
  };
}
