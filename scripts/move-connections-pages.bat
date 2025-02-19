@echo off
echo Moving connection and request pages...

REM Create connections directories
mkdir src\features\licensing\ui\pages\connections\pharmacist
mkdir src\features\licensing\ui\pages\connections\pharmacy-manager
mkdir src\features\licensing\ui\pages\connections\proprietor
mkdir src\features\licensing\ui\pages\connections\salesman

REM Move pharmacist connections
echo import { SidebarLayout } from "@/shared/ui/sidebar/SideBarLayout";> src\features\licensing\ui\pages\connections\pharmacist\page.tsx
echo import { PharmacistConnections } from "@/features/licensing/ui/pharmacist/PharmacistConnections";>> src\features\licensing\ui\pages\connections\pharmacist\page.tsx
echo.>> src\features\licensing\ui\pages\connections\pharmacist\page.tsx
echo export default function PharmacistConnectionsPage() {>> src\features\licensing\ui\pages\connections\pharmacist\page.tsx
echo   return (>> src\features\licensing\ui\pages\connections\pharmacist\page.tsx
echo     ^<^>^<h1^>Pharmacist Connections^</h1^>^<PharmacistConnections/^>^</^>>> src\features\licensing\ui\pages\connections\pharmacist\page.tsx
echo   );>> src\features\licensing\ui\pages\connections\pharmacist\page.tsx
echo }>> src\features\licensing\ui\pages\connections\pharmacist\page.tsx

REM Move pharmacy manager connections
echo import { SidebarLayout } from "@/shared/ui/sidebar/SideBarLayout";> src\features\licensing\ui\pages\connections\pharmacy-manager\page.tsx
echo import { PharmacyManagerConnections } from "@/features/licensing/ui/pharmacy-manager/PharmacyManagerConnections";>> src\features\licensing\ui\pages\connections\pharmacy-manager\page.tsx
echo.>> src\features\licensing\ui\pages\connections\pharmacy-manager\page.tsx
echo export default function PharmacyManagerConnectionsPage() {>> src\features\licensing\ui\pages\connections\pharmacy-manager\page.tsx
echo   return (>> src\features\licensing\ui\pages\connections\pharmacy-manager\page.tsx
echo     ^<^>^<h1^>Pharmacy Manager Connections^</h1^>^<PharmacyManagerConnections/^>^</^>>> src\features\licensing\ui\pages\connections\pharmacy-manager\page.tsx
echo   );>> src\features\licensing\ui\pages\connections\pharmacy-manager\page.tsx
echo }>> src\features\licensing\ui\pages\connections\pharmacy-manager\page.tsx

REM Move proprietor connections
echo import { SidebarLayout } from "@/shared/ui/sidebar/SideBarLayout";> src\features\licensing\ui\pages\connections\proprietor\page.tsx
echo import { ProprietorConnections } from "@/features/licensing/ui/proprietor/ProprietorConnections";>> src\features\licensing\ui\pages\connections\proprietor\page.tsx
echo.>> src\features\licensing\ui\pages\connections\proprietor\page.tsx
echo export default function ProprietorConnectionsPage() {>> src\features\licensing\ui\pages\connections\proprietor\page.tsx
echo   return (>> src\features\licensing\ui\pages\connections\proprietor\page.tsx
echo     ^<^>^<h1^>Proprietor Connections^</h1^>^<ProprietorConnections/^>^</^>>> src\features\licensing\ui\pages\connections\proprietor\page.tsx
echo   );>> src\features\licensing\ui\pages\connections\proprietor\page.tsx
echo }>> src\features\licensing\ui\pages\connections\proprietor\page.tsx

REM Move salesman connections
echo import { SidebarLayout } from "@/shared/ui/sidebar/SideBarLayout";> src\features\licensing\ui\pages\connections\salesman\page.tsx
echo import { SalesmanConnections } from "@/features/licensing/ui/salesman/SalesmanConnections";>> src\features\licensing\ui\pages\connections\salesman\page.tsx
echo.>> src\features\licensing\ui\pages\connections\salesman\page.tsx
echo export default function SalesmanConnectionsPage() {>> src\features\licensing\ui\pages\connections\salesman\page.tsx
echo   return (>> src\features\licensing\ui\pages\connections\salesman\page.tsx
echo     ^<^>^<h1^>Salesman Connections^</h1^>^<SalesmanConnections/^>^</^>>> src\features\licensing\ui\pages\connections\salesman\page.tsx
echo   );>> src\features\licensing\ui\pages\connections\salesman\page.tsx
echo }>> src\features\licensing\ui\pages\connections\salesman\page.tsx

REM Create Next.js route structure for connections
mkdir src\app\(licensing)\connections
mkdir src\app\(licensing)\connections\pharmacist
mkdir src\app\(licensing)\connections\pharmacy-manager
mkdir src\app\(licensing)\connections\proprietor
mkdir src\app\(licensing)\connections\salesman

REM Create Next.js route files
echo import { PharmacistConnectionsPage } from '@/features/licensing/ui/pages/connections/pharmacist/page';> src\app\(licensing)\connections\pharmacist\page.tsx
echo export default PharmacistConnectionsPage;>> src\app\(licensing)\connections\pharmacist\page.tsx

echo import { PharmacyManagerConnectionsPage } from '@/features/licensing/ui/pages/connections/pharmacy-manager/page';> src\app\(licensing)\connections\pharmacy-manager\page.tsx
echo export default PharmacyManagerConnectionsPage;>> src\app\(licensing)\connections\pharmacy-manager\page.tsx

echo import { ProprietorConnectionsPage } from '@/features/licensing/ui/pages/connections/proprietor/page';> src\app\(licensing)\connections\proprietor\page.tsx
echo export default ProprietorConnectionsPage;>> src\app\(licensing)\connections\proprietor\page.tsx

echo import { SalesmanConnectionsPage } from '@/features/licensing/ui/pages/connections/salesman/page';> src\app\(licensing)\connections\salesman\page.tsx
echo export default SalesmanConnectionsPage;>> src\app\(licensing)\connections\salesman\page.tsx

REM Clean up old connection pages
del src\app\(pages)\pharmacistsConnections\page.tsx
del src\app\(pages)\pharmacyManagerConnections\page.tsx
del src\app\(pages)\proprietorConnections\page.tsx
del src\app\(pages)\salesmanConnections\page.tsx

echo Connection pages moved successfully.