@echo off
echo Verifying final FSD structure...

REM Clean up any remaining old directories
rmdir /S /Q src\app\(pages) 2>nul
rmdir /S /Q src\components 2>nul
rmdir /S /Q src\api 2>nul
rmdir /S /Q src\types 2>nul
rmdir /S /Q src\utils 2>nul
rmdir /S /Q src\src 2>nul

REM Create feature-specific models and types
echo Creating models and types...

REM Licensing feature models
echo export interface PharmacistModel {> src\features\licensing\model\pharmacist.ts
echo   id: string;>> src\features\licensing\model\pharmacist.ts
echo   name: string;>> src\features\licensing\model\pharmacist.ts
echo   license: string;>> src\features\licensing\model\pharmacist.ts
echo }>> src\features\licensing\model\pharmacist.ts

echo export interface ConnectionModel {> src\features\licensing\model\connection.ts
echo   id: string;>> src\features\licensing\model\connection.ts
echo   type: string;>> src\features\licensing\model\connection.ts
echo   status: string;>> src\features\licensing\model\connection.ts
echo }>> src\features\licensing\model\connection.ts

REM Create barrel exports
echo export * from './pharmacist';> src\features\licensing\model\index.ts
echo export * from './connection';>> src\features\licensing\model\index.ts

REM Create feature-specific constants
echo export const LICENSE_TYPES = {> src\features\licensing\lib\constants.ts
echo   PHARMACIST: 'pharmacist',>> src\features\licensing\lib\constants.ts
echo   PHARMACY_MANAGER: 'pharmacy-manager',>> src\features\licensing\lib\constants.ts
echo   PROPRIETOR: 'proprietor',>> src\features\licensing\lib\constants.ts
echo   SALESMAN: 'salesman'>> src\features\licensing\lib\constants.ts
echo };>> src\features\licensing\lib\constants.ts

REM Create feature root index
echo export * from './model';> src\features\licensing\index.ts
echo export * from './ui';>> src\features\licensing\index.ts
echo export * from './api';>> src\features\licensing\index.ts
echo export * from './lib';>> src\features\licensing\index.ts

REM Create UI index
echo export * from './pages';> src\features\licensing\ui\index.ts
echo export * from './pharmacist';>> src\features\licensing\ui\index.ts
echo export * from './pharmacy-manager';>> src\features\licensing\ui\index.ts
echo export * from './proprietor';>> src\features\licensing\ui\index.ts
echo export * from './salesman';>> src\features\licensing\ui\index.ts

REM Create shared layer exports
echo export * from './ui';> src\shared\index.ts
echo export * from './api';>> src\shared\index.ts
echo export * from './config';>> src\shared\index.ts
echo export * from './lib';>> src\shared\index.ts
echo export * from './types';>> src\shared\index.ts

REM Verify directory structure
echo.
echo Verifying directories...
dir src\features
dir src\entities
dir src\shared
dir src\app

echo Structure verification complete.