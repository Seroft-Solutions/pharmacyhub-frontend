@echo off
echo Moving request pages...

REM Create requests directories
mkdir src\features\licensing\ui\pages\requests\pharmacist
mkdir src\features\licensing\ui\pages\requests\pharmacy-manager
mkdir src\features\licensing\ui\pages\requests\proprietor
mkdir src\features\licensing\ui\pages\requests\salesman

REM Move pharmacist requests
echo import { SidebarLayout } from "@/shared/ui/sidebar/SideBarLayout";> src\features\licensing\ui\pages\requests\pharmacist\page.tsx
echo import { PharmacistRequests } from "@/features/licensing/ui/pharmacist/PharmacistRequests";>> src\features\licensing\ui\pages\requests\pharmacist\page.tsx
echo.>> src\features\licensing\ui\pages\requests\pharmacist\page.tsx
echo export default function PharmacistRequestsPage() {>> src\features\licensing\ui\pages\requests\pharmacist\page.tsx
echo   return (>> src\features\licensing\ui\pages\requests\pharmacist\page.tsx
echo     ^<^>^<h1^>Pharmacist Requests^</h1^>^<PharmacistRequests/^>^</^>>> src\features\licensing\ui\pages\requests\pharmacist\page.tsx
echo   );>> src\features\licensing\ui\pages\requests\pharmacist\page.tsx
echo }>> src\features\licensing\ui\pages\requests\pharmacist\page.tsx

REM Move pharmacy manager requests
echo import { SidebarLayout } from "@/shared/ui/sidebar/SideBarLayout";> src\features\licensing\ui\pages\requests\pharmacy-manager\page.tsx
echo import { PharmacyManagerRequests } from "@/features/licensing/ui/pharmacy-manager/PharmacyManagerRequests";>> src\features\licensing\ui\pages\requests\pharmacy-manager\page.tsx
echo.>> src\features\licensing\ui\pages\requests\pharmacy-manager\page.tsx
echo export default function PharmacyManagerRequestsPage() {>> src\features\licensing\ui\pages\requests\pharmacy-manager\page.tsx
echo   return (>> src\features\licensing\ui\pages\requests\pharmacy-manager\page.tsx
echo     ^<^>^<h1^>Pharmacy Manager Requests^</h1^>^<PharmacyManagerRequests/^>^</^>>> src\features\licensing\ui\pages\requests\pharmacy-manager\page.tsx
echo   );>> src\features\licensing\ui\pages\requests\pharmacy-manager\page.tsx
echo }>> src\features\licensing\ui\pages\requests\pharmacy-manager\page.tsx

REM Move proprietor requests
echo import { SidebarLayout } from "@/shared/ui/sidebar/SideBarLayout";> src\features\licensing\ui\pages\requests\proprietor\page.tsx
echo import { ProprietorRequests } from "@/features/licensing/ui/proprietor/ProprietorRequests";>> src\features\licensing\ui\pages\requests\proprietor\page.tsx
echo.>> src\features\licensing\ui\pages\requests\proprietor\page.tsx
echo export default function ProprietorRequestsPage() {>> src\features\licensing\ui\pages\requests\proprietor\page.tsx
echo   return (>> src\features\licensing\ui\pages\requests\proprietor\page.tsx
echo     ^<^>^<h1^>Proprietor Requests^</h1^>^<ProprietorRequests/^>^</^>>> src\features\licensing\ui\pages\requests\proprietor\page.tsx
echo   );>> src\features\licensing\ui\pages\requests\proprietor\page.tsx
echo }>> src\features\licensing\ui\pages\requests\proprietor\page.tsx

REM Move salesman requests
echo import { SidebarLayout } from "@/shared/ui/sidebar/SideBarLayout";> src\features\licensing\ui\pages\requests\salesman\page.tsx
echo import { SalesmanRequests } from "@/features/licensing/ui/salesman/SalesmanRequests";>> src\features\licensing\ui\pages\requests\salesman\page.tsx
echo.>> src\features\licensing\ui\pages\requests\salesman\page.tsx
echo export default function SalesmanRequestsPage() {>> src\features\licensing\ui\pages\requests\salesman\page.tsx
echo   return (>> src\features\licensing\ui\pages\requests\salesman\page.tsx
echo     ^<^>^<h1^>Salesman Requests^</h1^>^<SalesmanRequests/^>^</^>>> src\features\licensing\ui\pages\requests\salesman\page.tsx
echo   );>> src\features\licensing\ui\pages\requests\salesman\page.tsx
echo }>> src\features\licensing\ui\pages\requests\salesman\page.tsx

REM Create Next.js route structure for requests
mkdir src\app\(licensing)\requests
mkdir src\app\(licensing)\requests\pharmacist
mkdir src\app\(licensing)\requests\pharmacy-manager
mkdir src\app\(licensing)\requests\proprietor
mkdir src\app\(licensing)\requests\salesman

REM Create Next.js route files
echo import { PharmacistRequestsPage } from '@/features/licensing/ui/pages/requests/pharmacist/page';> src\app\(licensing)\requests\pharmacist\page.tsx
echo export default PharmacistRequestsPage;>> src\app\(licensing)\requests\pharmacist\page.tsx

echo import { PharmacyManagerRequestsPage } from '@/features/licensing/ui/pages/requests/pharmacy-manager/page';> src\app\(licensing)\requests\pharmacy-manager\page.tsx
echo export default PharmacyManagerRequestsPage;>> src\app\(licensing)\requests\pharmacy-manager\page.tsx

echo import { ProprietorRequestsPage } from '@/features/licensing/ui/pages/requests/proprietor/page';> src\app\(licensing)\requests\proprietor\page.tsx
echo export default ProprietorRequestsPage;>> src\app\(licensing)\requests\proprietor\page.tsx

echo import { SalesmanRequestsPage } from '@/features/licensing/ui/pages/requests/salesman/page';> src\app\(licensing)\requests\salesman\page.tsx
echo export default SalesmanRequestsPage;>> src\app\(licensing)\requests\salesman\page.tsx

REM Clean up old request pages
del src\app\(pages)\pharmacistsRequests\page.tsx
del src\app\(pages)\pharmacyManagerRequests\page.tsx
del src\app\(pages)\proprietorsRequests\page.tsx
del src\app\(pages)\salesmenRequests\page.tsx

REM Create index file for requests routes
echo export * from './pharmacist/route';> src\features\licensing\ui\pages\requests\routes.ts
echo export * from './pharmacy-manager/route';>> src\features\licensing\ui\pages\requests\routes.ts
echo export * from './proprietor/route';>> src\features\licensing\ui\pages\requests\routes.ts
echo export * from './salesman/route';>> src\features\licensing\ui\pages\requests\routes.ts

echo Request pages moved successfully.