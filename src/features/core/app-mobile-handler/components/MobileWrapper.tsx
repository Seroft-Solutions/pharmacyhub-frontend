import React from 'react';
import { useMobileStore, selectIsMobile, selectIsTablet, selectIsDesktop } from '../store/useMobileStore';

type RenderStrategy = 'show-mobile-only' | 'hide-mobile-only' | 'responsive';

interface MobileWrapperProps {
  children: React.ReactNode;
  mobileChildren?: React.ReactNode;
  tabletChildren?: React.ReactNode;
  desktopChildren?: React.ReactNode;
  strategy?: RenderStrategy;
  className?: string;
  mobileClassName?: string;
  tabletClassName?: string;
  desktopClassName?: string;
}

/**
 * MobileWrapper component that conditionally renders content based on viewport
 * 
 * @example
 * // Basic usage - renders different content for mobile vs desktop
 * <MobileWrapper
 *   mobileChildren={<SimplifiedView />}
 *   desktopChildren={<FullFeaturedView />}
 * >
 *   <FallbackView />
 * </MobileWrapper>
 * 
 * @example
 * // With responsive classes
 * <MobileWrapper
 *   mobileClassName="p-2 flex-col"
 *   desktopClassName="p-6 flex-row"
 *   className="flex w-full"
 * >
 *   <CommonContent />
 * </MobileWrapper>
 */
export const MobileWrapper: React.FC<MobileWrapperProps> = ({
  children,
  mobileChildren,
  tabletChildren,
  desktopChildren,
  strategy = 'responsive',
  className = '',
  mobileClassName = '',
  tabletClassName = '',
  desktopClassName = '',
}) => {
  // Use selectors to get only what we need from the store
  const isMobile = useMobileStore(selectIsMobile);
  const isTablet = useMobileStore(selectIsTablet);
  const isDesktop = useMobileStore(selectIsDesktop);
  
  // Handle show-mobile-only strategy
  if (strategy === 'show-mobile-only') {
    if (!isMobile) return null;
    return (
      <div className={`${className} ${mobileClassName}`.trim()}>
        {mobileChildren || children}
      </div>
    );
  }
  
  // Handle hide-mobile-only strategy
  if (strategy === 'hide-mobile-only') {
    if (isMobile) return null;
    return (
      <div className={`${className} ${isTablet ? tabletClassName : desktopClassName}`.trim()}>
        {isTablet && tabletChildren ? tabletChildren : 
         isDesktop && desktopChildren ? desktopChildren : children}
      </div>
    );
  }
  
  // Handle responsive strategy (default)
  return (
    <div className={`${className} ${
      isMobile ? mobileClassName : 
      isTablet ? tabletClassName : 
      desktopClassName
    }`.trim()}>
      {isMobile && mobileChildren ? mobileChildren : 
       isTablet && tabletChildren ? tabletChildren : 
       isDesktop && desktopChildren ? desktopChildren : 
       children}
    </div>
  );
};

/**
 * MobileOnly component that only renders on mobile devices
 * 
 * @example
 * <MobileOnly>
 *   <MobileNavigation />
 * </MobileOnly>
 */
export const MobileOnly: React.FC<Omit<MobileWrapperProps, 'strategy'>> = (props) => (
  <MobileWrapper {...props} strategy="show-mobile-only" />
);

/**
 * DesktopOnly component that only renders on non-mobile devices
 * 
 * @example
 * <DesktopOnly>
 *   <DesktopNavigation />
 * </DesktopOnly>
 */
export const DesktopOnly: React.FC<Omit<MobileWrapperProps, 'strategy'>> = (props) => (
  <MobileWrapper {...props} strategy="hide-mobile-only" />
);

/**
 * TabletAndDesktop component that only renders on tablet and desktop devices
 * 
 * @example
 * <TabletAndDesktop>
 *   <WiderLayoutNavigation />
 * </TabletAndDesktop>
 */
export const TabletAndDesktop: React.FC<Omit<MobileWrapperProps, 'strategy'>> = (props) => (
  <MobileWrapper {...props} strategy="hide-mobile-only" />
);

/**
 * ResponsiveContainer that applies different classes based on viewport
 * 
 * @example
 * <ResponsiveContainer
 *   mobileClassName="grid-cols-1"
 *   tabletClassName="grid-cols-2"
 *   desktopClassName="grid-cols-4"
 *   className="grid gap-4"
 * >
 *   {items.map(item => <ItemCard key={item.id} item={item} />)}
 * </ResponsiveContainer>
 */
export const ResponsiveContainer: React.FC<Omit<MobileWrapperProps, 'strategy'>> = (props) => (
  <MobileWrapper {...props} strategy="responsive" />
);
