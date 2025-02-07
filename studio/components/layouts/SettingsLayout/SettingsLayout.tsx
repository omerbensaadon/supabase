import { FC, ReactNode, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import { useFlag, useSelectedOrganization, useSelectedProject, useStore, withAuth } from 'hooks'
import { generateSettingsMenu } from './SettingsMenu.utils'

import ProjectLayout from '../'
import ProductMenu from 'components/ui/ProductMenu'

interface Props {
  title?: string
  children: ReactNode
}

const SettingsLayout: FC<Props> = ({ title, children }) => {
  const { ui, meta } = useStore()
  const project = useSelectedProject()
  const organization = useSelectedOrganization()
  const isOrgBilling = !!organization?.subscription_id

  const router = useRouter()
  // billing pages live under /billing/invoices and /billing/subscription, etc
  // so we need to pass the [5]th part of the url to the menu
  const page = router.pathname.includes('billing')
    ? router.pathname.split('/')[5]
    : router.pathname.split('/')[4]

  const isVaultEnabled = useFlag('vaultExtension')
  const menuRoutes = generateSettingsMenu(
    project?.ref as string,
    project,
    isVaultEnabled,
    isOrgBilling
  )

  useEffect(() => {
    if (project?.ref) {
      meta.extensions.load()
    }
  }, [project?.ref])

  return (
    <ProjectLayout
      title={title || 'Settings'}
      product="Settings"
      productMenu={<ProductMenu page={page} menu={menuRoutes} />}
    >
      <main style={{ maxHeight: '100vh' }} className="flex-1 overflow-y-auto">
        {children}
      </main>
    </ProjectLayout>
  )
}

export default withAuth(observer(SettingsLayout))
