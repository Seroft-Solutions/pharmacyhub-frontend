@echo off
echo Moving and updating remaining pages...

REM Update and move pharmacy-manager page
echo import { SidebarLayout } from "@/shared/ui/sidebar/SideBarLayout";> src\features\licensing\ui\pages\pharmacy-manager\page.tsx
echo import { PharmacyManagerList } from "@/features/licensing/ui/pharmacy-manager/PharmacyManagerList";>> src\features\licensing\ui\pages\pharmacy-manager\page.tsx
echo.>> src\features\licensing\ui\pages\pharmacy-manager\page.tsx
echo export default function PharmacyManager() {>> src\features\licensing\ui\pages\pharmacy-manager\page.tsx
echo   return (>> src\features\licensing\ui\pages\pharmacy-manager\page.tsx
echo     ^<^>^<h1^>Pharmacy Managers Page^</h1^>^<PharmacyManagerList/^>^</^>>> src\features\licensing\ui\pages\pharmacy-manager\page.tsx
echo   );>> src\features\licensing\ui\pages\pharmacy-manager\page.tsx
echo }>> src\features\licensing\ui\pages\pharmacy-manager\page.tsx

REM Update and move proprietor page
echo import { SidebarLayout } from "@/shared/ui/sidebar/SideBarLayout";> src\features\licensing\ui\pages\proprietor\page.tsx
echo import { ProprietorList } from "@/features/licensing/ui/proprietor/ProprietorList";>> src\features\licensing\ui\pages\proprietor\page.tsx
echo.>> src\features\licensing\ui\pages\proprietor\page.tsx
echo export default function Proprietor() {>> src\features\licensing\ui\pages\proprietor\page.tsx
echo   return (>> src\features\licensing\ui\pages\proprietor\page.tsx
echo     ^<^>^<h1^>Proprietors Page^</h1^>^<ProprietorList/^>^</^>>> src\features\licensing\ui\pages\proprietor\page.tsx
echo   );>> src\features\licensing\ui\pages\proprietor\page.tsx
echo }>> src\features\licensing\ui\pages\proprietor\page.tsx

REM Update and move salesman page
echo import { SidebarLayout } from "@/shared/ui/sidebar/SideBarLayout";> src\features\licensing\ui\pages\salesman\page.tsx
echo import { SalesmanList } from "@/features/licensing/ui/salesman/SalesmanList";>> src\features\licensing\ui\pages\salesman\page.tsx
echo.>> src\features\licensing\ui\pages\salesman\page.tsx
echo export default function Salesman() {>> src\features\licensing\ui\pages\salesman\page.tsx
echo   return (>> src\features\licensing\ui\pages\salesman\page.tsx
echo     ^<^>^<h1^>Salesmen Page^</h1^>^<SalesmanList/^>^</^>>> src\features\licensing\ui\pages\salesman\page.tsx
echo   );>> src\features\licensing\ui\pages\salesman\page.tsx
echo }>> src\features\licensing\ui\pages\salesman\page.tsx

REM Create route configurations for each
echo Creating route configurations...

echo export const pharmacyManagerRoutes = {> src\features\licensing\ui\pages\pharmacy-manager\route.ts
echo   base: '/pharmacy-manager',>> src\features\licensing\ui\pages\pharmacy-manager\route.ts
echo   list: '/pharmacy-manager/list',>> src\features\licensing\ui\pages\pharmacy-manager\route.ts
echo   connections: '/pharmacy-manager/connections',>> src\features\licensing\ui\pages\pharmacy-manager\route.ts
echo   requests: '/pharmacy-manager/requests'>> src\features\licensing\ui\pages\pharmacy-manager\route.ts
echo };>> src\features\licensing\ui\pages\pharmacy-manager\route.ts

echo export const proprietorRoutes = {> src\features\licensing\ui\pages\proprietor\route.ts
echo   base: '/proprietor',>> src\features\licensing\ui\pages\proprietor\route.ts
echo   list: '/proprietor/list',>> src\features\licensing\ui\pages\proprietor\route.ts
echo   connections: '/proprietor/connections',>> src\features\licensing\ui\pages\proprietor\route.ts
echo   requests: '/proprietor/requests'>> src\features\licensing\ui\pages\proprietor\route.ts
echo };>> src\features\licensing\ui\pages\proprietor\route.ts

echo export const salesmanRoutes = {> src\features\licensing\ui\pages\salesman\route.ts
echo   base: '/salesman',>> src\features\licensing\ui\pages\salesman\route.ts
echo   list: '/salesman/list',>> src\features\licensing\ui\pages\salesman\route.ts
echo   connections: '/salesman/connections',>> src\features\licensing\ui\pages\salesman\route.ts
echo   requests: '/salesman/requests'>> src\features\licensing\ui\pages\salesman\route.ts
echo };>> src\features\licensing\ui\pages\salesman\route.ts

REM Update Next.js route files
mkdir src\app\(licensing)\pharmacy-manager
mkdir src\app\(licensing)\proprietor
mkdir src\app\(licensing)\salesman

echo import { PharmacyManager } from '@/features/licensing/ui/pages/pharmacy-manager/page';> src\app\(licensing)\pharmacy-manager\page.tsx
echo export default PharmacyManager;>> src\app\(licensing)\pharmacy-manager\page.tsx

echo import { Proprietor } from '@/features/licensing/ui/pages/proprietor/page';> src\app\(licensing)\proprietor\page.tsx
echo export default Proprietor;>> src\app\(licensing)\proprietor\page.tsx

echo import { Salesman } from '@/features/licensing/ui/pages/salesman/page';> src\app\(licensing)\salesman\page.tsx
echo export default Salesman;>> src\app\(licensing)\salesman\page.tsx

REM Clean up old files
del src\app\(pages)\pharmacy-manager\page.tsx
del src\app\(pages)\proprietor\page.tsx
del src\app\(pages)\salesman\page.tsx

REM Create index file for all routes
echo export * from './pharmacist/route';> src\features\licensing\ui\pages\routes.ts
echo export * from './pharmacy-manager/route';>> src\features\licensing\ui\pages\routes.ts
echo export * from './proprietor/route';>> src\features\licensing\ui\pages\routes.ts
echo export * from './salesman/route';>> src\features\licensing\ui\pages\routes.ts

echo Remaining pages moved and updated successfully.