@echo off
echo Reorganizing pages according to FSD...

REM Create feature-specific page directories
mkdir src\features\licensing\ui\pages
mkdir src\features\licensing\ui\pages\pharmacist
mkdir src\features\licensing\ui\pages\pharmacy-manager
mkdir src\features\licensing\ui\pages\proprietor
mkdir src\features\licensing\ui\pages\salesman
mkdir src\features\licensing\ui\pages\connections

REM Create dashboard feature directory
mkdir src\features\dashboard
mkdir src\features\dashboard\ui
mkdir src\features\dashboard\ui\pages

REM Move dashboard page
xcopy /Y src\app\(pages)\dashboard\* src\features\dashboard\ui\pages\
rmdir /S /Q src\app\(pages)\dashboard

REM Move licensing-related pages
xcopy /Y src\app\(pages)\pharmacist\* src\features\licensing\ui\pages\pharmacist\
xcopy /Y src\app\(pages)\pharmacistsConnections\* src\features\licensing\ui\pages\connections\pharmacist\
xcopy /Y src\app\(pages)\pharmacistsRequests\* src\features\licensing\ui\pages\connections\pharmacist-requests\

xcopy /Y src\app\(pages)\pharmacy-manager\* src\features\licensing\ui\pages\pharmacy-manager\
xcopy /Y src\app\(pages)\pharmacyManagerConnections\* src\features\licensing\ui\pages\connections\pharmacy-manager\
xcopy /Y src\app\(pages)\pharmacyManagerRequests\* src\features\licensing\ui\pages\connections\pharmacy-manager-requests\

xcopy /Y src\app\(pages)\proprietor\* src\features\licensing\ui\pages\proprietor\
xcopy /Y src\app\(pages)\proprietorConnections\* src\features\licensing\ui\pages\connections\proprietor\
xcopy /Y src\app\(pages)\proprietorsRequests\* src\features\licensing\ui\pages\connections\proprietor-requests\

xcopy /Y src\app\(pages)\salesman\* src\features\licensing\ui\pages\salesman\
xcopy /Y src\app\(pages)\salesmanConnections\* src\features\licensing\ui\pages\connections\salesman\
xcopy /Y src\app\(pages)\salesmenRequests\* src\features\licensing\ui\pages\connections\salesman-requests\

REM Copy layout to shared components
xcopy /Y src\app\(pages)\layout.tsx src\shared\ui\layouts\
del src\app\(pages)\layout.tsx

REM Update app router structure
mkdir src\app\(dashboard)
mkdir src\app\(licensing)

REM Create route files that import from features
echo import { DashboardPage } from '@/features/dashboard/ui/pages';> src\app\(dashboard)\page.tsx
echo export default DashboardPage;>> src\app\(dashboard)\page.tsx

REM Create licensing route files
echo import { PharmacistPage } from '@/features/licensing/ui/pages/pharmacist';> src\app\(licensing)\pharmacist\page.tsx
echo export default PharmacistPage;>> src\app\(licensing)\pharmacist\page.tsx

echo import { PharmacyManagerPage } from '@/features/licensing/ui/pages/pharmacy-manager';> src\app\(licensing)\pharmacy-manager\page.tsx
echo export default PharmacyManagerPage;>> src\app\(licensing)\pharmacy-manager\page.tsx

echo import { ProprietorPage } from '@/features/licensing/ui/pages/proprietor';> src\app\(licensing)\proprietor\page.tsx
echo export default ProprietorPage;>> src\app\(licensing)\proprietor\page.tsx

echo import { SalesmanPage } from '@/features/licensing/ui/pages/salesman';> src\app\(licensing)\salesman\page.tsx
echo export default SalesmanPage;>> src\app\(licensing)\salesman\page.tsx

echo import { PageLayout } from '@/shared/ui/layouts';> src\app\(licensing)\layout.tsx
echo export default PageLayout;>> src\app\(licensing)\layout.tsx

REM Clean up old pages directory
rmdir /S /Q src\app\(pages)

echo Pages reorganization complete.