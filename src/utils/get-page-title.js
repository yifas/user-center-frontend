import defaultSettings from '@/settings'

const title = defaultSettings.title || 'User Center '

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
