@echo off
echo Starting frontend migration...

REM Create backup of current src directory
echo Creating backup...
xcopy /E /I src src_backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%

REM Clean up any existing duplicate directories
rmdir /S /Q src\src 2>nul
rmdir /S /Q src\features 2>nul
rmdir /S /Q src\entities 2>nul
rmdir /S /Q src\shared 2>nul

REM Create FSD structure
echo Creating FSD structure...
mkdir src\features
mkdir src\entities
mkdir src\shared

REM Create feature layers
mkdir src\features\licensing\ui
mkdir src\features\licensing\model
mkdir src\features\licensing\api
mkdir src\features\licensing\lib

mkdir src\features\exams\ui
mkdir src\features\exams\model
mkdir src\features\exams\api
mkdir src\features\exams\lib

REM Create shared layers
mkdir src\shared\ui
mkdir src\shared\api
mkdir src\shared\config
mkdir src\shared\lib
mkdir src\shared\types

REM Create entities
mkdir src\entities\user
mkdir src\entities\pharmacy
mkdir src\entities\license

REM Move files to new structure
echo Moving files to new structure...

REM Move UI components to shared
xcopy /E /I src\components\ui\* src\shared\ui\
rmdir /S /Q src\components\ui

REM Move navigation components
mkdir src\shared\ui\navigation
xcopy /E /I src\components\NavigationBar\* src\shared\ui\navigation\
rmdir /S /Q src\components\NavigationBar

REM Move sidebar components
mkdir src\shared\ui\sidebar
xcopy /E /I src\components\NavSideBar\* src\shared\ui\sidebar\
rmdir /S /Q src\components\NavSideBar

REM Move API and services
mkdir src\shared\api\services
xcopy /E /I src\api\* src\shared\api\
rmdir /S /Q src\api

REM Move config and utils
xcopy /E /I src\config\* src\shared\config\
rmdir /S /Q src\config
xcopy /E /I src\lib\* src\shared\lib\
rmdir /S /Q src\lib
xcopy /E /I src\types\* src\shared\types\
rmdir /S /Q src\types
xcopy /E /I src\utils\* src\shared\lib\utils\
rmdir /S /Q src\utils

REM Move feature-specific components
xcopy /E /I src\components\RegistrationForm\* src\features\licensing\ui\forms\
xcopy /E /I src\components\Pharmacist\* src\features\licensing\ui\pharmacist\
xcopy /E /I src\components\PharmacyManager\* src\features\licensing\ui\pharmacy-manager\
xcopy /E /I src\components\Proprietor\* src\features\licensing\ui\proprietor\
xcopy /E /I src\components\Salesman\* src\features\licensing\ui\salesman\
rmdir /S /Q src\components\RegistrationForm
rmdir /S /Q src\components\Pharmacist
rmdir /S /Q src\components\PharmacyManager
rmdir /S /Q src\components\Proprietor
rmdir /S /Q src\components\Salesman

REM Move hooks
mkdir src\shared\lib\hooks
move src\hooks\useApi.ts src\shared\api\hooks\useApi.ts
move src\hooks\useAuth.ts src\features\licensing\lib\hooks\useAuth.ts
move src\hooks\useDebounce.ts src\shared\lib\hooks\useDebounce.ts
move src\hooks\use-mobile.tsx src\shared\lib\hooks\use-mobile.tsx
rmdir /S /Q src\hooks

REM Create index files
echo Creating index files...
echo export * from './ui';> src\shared\index.ts
echo export * from './api';>> src\shared\index.ts
echo export * from './config';>> src\shared\index.ts
echo export * from './lib';>> src\shared\index.ts
echo export * from './types';>> src\shared\index.ts

echo export * from './model';> src\features\licensing\index.ts
echo export * from './ui';>> src\features\licensing\index.ts
echo export * from './api';>> src\features\licensing\index.ts
echo export * from './lib';>> src\features\licensing\index.ts

echo export * from './model';> src\features\exams\index.ts
echo export * from './ui';>> src\features\exams\index.ts
echo export * from './api';>> src\features\exams\index.ts
echo export * from './lib';>> src\features\exams\index.ts

echo Migration completed successfully.