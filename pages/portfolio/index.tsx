import { NextPage } from 'next'
import { Text, Flex, Box } from '../../components/primitives'
import Layout from 'components/Layout'
import { useMediaQuery } from 'react-responsive'
import { useState } from 'react'
import { useAccount } from 'wagmi'
import { TabsList, TabsTrigger, TabsContent } from 'components/primitives/Tab'
import * as Tabs from '@radix-ui/react-tabs'
import { useUserCollections } from '@nftearth/reservoir-kit-ui'
import { useMounted } from '../../hooks'
import { TokenTable } from 'components/portfolio/TokenTable'
import { ConnectWalletButton } from 'components/ConnectWalletButton'
import { MobileTokenFilters } from 'components/common/MobileTokenFilters'
import { TokenFilters } from 'components/common/TokenFilters'
import { FilterButton } from 'components/common/FilterButton'
import { ListingsTable } from 'components/portfolio/ListingsTable'
import { OffersTable } from 'components/portfolio/OffersTable'
import { CollectionsTable } from 'components/portfolio/CollectionsTable'
import { faWallet } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {ActivityFilters} from "../../components/common/ActivityFilters";
import {MobileActivityFilters} from "../../components/common/MobileActivityFilters";
import {UserActivityTable} from "../../components/profile/UserActivityTable";
import {ActivityTypes} from "../../types/reservoir";

const PortfolioPage: NextPage = () => {
  const { address, isConnected } = useAccount()
  const [tokenFiltersOpen, setTokenFiltersOpen] = useState(false)
  const [activityFiltersOpen, setActivityFiltersOpen] = useState(true)
  const [activityTypes, setActivityTypes] = useState<ActivityTypes>(['sale'])
  const [filterCollection, setFilterCollection] = useState<string | undefined>(
    undefined
  )
  const isSmallDevice = useMediaQuery({ maxWidth: 905 })
  const isMounted = useMounted()

  let collectionQuery: Parameters<typeof useUserCollections>['1'] = {
    limit: 100,
    collection: filterCollection,
  }

  const { data: collections } = useUserCollections(
    address as string,
    collectionQuery
  )

  if (!isMounted) {
    return null
  }

  return (
    <Layout>
      <Flex
        direction="column"
        css={{
          px: '$space$4',
          py: '$space$5',
          '@sm': {
            px: '$space$5',
          },
        }}
      >
        {isConnected ? (
          <>
            <Text style="h4" css={{}}>
              Portfolio
            </Text>
            <Tabs.Root defaultValue="items">
              <Flex css={{ overflowX: 'scroll', '@sm': { overflowX: 'auto' } }}>
                <TabsList
                  style={{
                    whiteSpace: 'nowrap',
                    width: '100%',
                  }}
                >
                  <TabsTrigger value="items">Items</TabsTrigger>
                  <TabsTrigger value="collections">Collections</TabsTrigger>
                  <TabsTrigger value="listings">Listings</TabsTrigger>
                  <TabsTrigger value="offers">Offers Made</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>
              </Flex>

              <TabsContent value="items">
                <Flex
                  css={{
                    gap: tokenFiltersOpen ? '$5' : '0',
                    position: 'relative',
                  }}
                >
                  {isSmallDevice ? (
                    <MobileTokenFilters
                      collections={collections}
                      filterCollection={filterCollection}
                      setFilterCollection={setFilterCollection}
                    />
                  ) : (
                    <TokenFilters
                      open={tokenFiltersOpen}
                      setOpen={setTokenFiltersOpen}
                      collections={collections}
                      filterCollection={filterCollection}
                      setFilterCollection={setFilterCollection}
                    />
                  )}
                  <Box
                    css={{
                      flex: 1,
                      maxWidth: '100%',
                    }}
                  >
                    <Flex justify="between" css={{ marginBottom: '$4' }}>
                      {collections &&
                        collections.length > 0 &&
                        !isSmallDevice && (
                          <FilterButton
                            open={tokenFiltersOpen}
                            setOpen={setTokenFiltersOpen}
                          />
                        )}
                    </Flex>
                    <TokenTable
                      address={address}
                      filterCollection={filterCollection}
                    />
                  </Box>
                </Flex>
              </TabsContent>
              <TabsContent value="collections">
                <CollectionsTable address={address} />
              </TabsContent>
              <TabsContent value="listings">
                <ListingsTable address={address} />
              </TabsContent>
              <TabsContent value="offers">
                <OffersTable address={address} />
              </TabsContent>
              <TabsContent value="activity">
                <Flex
                  css={{
                    gap: activityFiltersOpen ? '$5' : '',
                    position: 'relative',
                  }}
                >
                  {!isSmallDevice && (
                    <ActivityFilters
                      open={activityFiltersOpen}
                      setOpen={setActivityFiltersOpen}
                      activityTypes={activityTypes}
                      setActivityTypes={setActivityTypes}
                    />
                  )}
                  <Box
                    css={{
                      flex: 1,
                      gap: '$4',
                      pb: '$5',
                    }}
                  >
                    {isSmallDevice ? (
                      <MobileActivityFilters
                        activityTypes={activityTypes}
                        setActivityTypes={setActivityTypes}
                      />
                    ) : (
                      <FilterButton
                        open={activityFiltersOpen}
                        setOpen={setActivityFiltersOpen}
                      />
                    )}
                    <UserActivityTable
                      user={address}
                      activityTypes={activityTypes}
                    />
                  </Box>
                </Flex>
              </TabsContent>
            </Tabs.Root>
          </>
        ) : (
          <Flex
            direction="column"
            align="center"
            css={{ mx: 'auto', py: '120px', maxWidth: '350px', gap: '$4' }}
          >
            <Text style="h4" css={{ mb: '$3' }}>
              Sell your NFT instantly
            </Text>
            <Text css={{ color: '$gray11' }}>
              <FontAwesomeIcon icon={faWallet} size="2xl" />
            </Text>
            <Text
              style="body1"
              css={{ color: '$gray11', textAlign: 'center', mb: '$4' }}
            >
              Connect wallet to instant sell your token across all major
              marketplaces.
            </Text>
            <ConnectWalletButton />
          </Flex>
        )}
      </Flex>
    </Layout>
  )
}

export default PortfolioPage
