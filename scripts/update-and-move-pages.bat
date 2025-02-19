@echo off
echo Updating and moving pages according to FSD...

REM Create necessary directories
mkdir src\features\licensing\ui\pages\pharmacist
mkdir src\features\licensing\ui\pages\pharmacy-manager
mkdir src\features\licensing\ui\pages\proprietor
mkdir src\features\licensing\ui\pages\salesman
mkdir src\features\dashboard\ui\pages

REM Update and move pharmacist page
echo import { SidebarLayout } from "@/shared/ui/sidebar/SideBarLayout";> src\features\licensing\ui\pages\pharmacist\page.tsx
echo import { PharmacistList } from "@/features/licensing/ui/pharmacist/PharmacistList";>> src\features\licensing\ui\pages\pharmacist\page.tsx
echo.>> src\features\licensing\ui\pages\pharmacist\page.tsx
echo export default function Pharmacist() {>> src\features\licensing\ui\pages\pharmacist\page.tsx
echo   return (>> src\features\licensing\ui\pages\pharmacist\page.tsx
echo     ^<^>^<h1^>Pharmacists Page^</h1^>^<PharmacistList/^>^</^>>> src\features\licensing\ui\pages\pharmacist\page.tsx
echo   );>> src\features\licensing\ui\pages\pharmacist\page.tsx
echo }>> src\features\licensing\ui\pages\pharmacist\page.tsx

REM Create route.ts files for pages
echo Creating route configuration...

echo // Route configuration for pharmacist pages> src\features\licensing\ui\pages\pharmacist\route.ts
echo export const pharmacistRoutes = {>> src\features\licensing\ui\pages\pharmacist\route.ts
echo   base: '/pharmacist',>> src\features\licensing\ui\pages\pharmacist\route.ts
echo   list: '/pharmacist/list',>> src\features\licensing\ui\pages\pharmacist\route.ts
echo   connections: '/pharmacist/connections',>> src\features\licensing\ui\pages\pharmacist\route.ts
echo   requests: '/pharmacist/requests'>> src\features\licensing\ui\pages\pharmacist\route.ts
echo };>> src\features\licensing\ui\pages\pharmacist\route.ts

REM Update app router structure
mkdir src\app\(licensing)
mkdir src\app\(licensing)\pharmacist

REM Create Next.js route file that imports from feature
echo import { Pharmacist } from '@/features/licensing/ui/pages/pharmacist/page';> src\app\(licensing)\pharmacist\page.tsx
echo.>> src\app\(licensing)\pharmacist\page.tsx
echo export default Pharmacist;>> src\app\(licensing)\pharmacist\page.tsx

REM Move layout file
mkdir src\shared\ui\layouts
echo import { SidebarLayout } from "@/shared/ui/sidebar/SideBarLayout";> src\shared\ui\layouts\LicensingLayout.tsx
echo.>> src\shared\ui\layouts\LicensingLayout.tsx
echo export default function LicensingLayout({ children }: { children: React.ReactNode }) {>> src\shared\ui\layouts\LicensingLayout.tsx
echo   return ^<SidebarLayout^>{children}^</SidebarLayout^>;>> src\shared\ui\layouts\LicensingLayout.tsx
echo }>> src\shared\ui\layouts\LicensingLayout.tsx

echo import { LicensingLayout } from "@/shared/ui/layouts/LicensingLayout";> src\app\(licensing)\layout.tsx
echo export default LicensingLayout;>> src\app\(licensing)\layout.tsx

REM Clean up old files
del src\app\(pages)\pharmacist\page.tsx

echo Page updates and moves completed.