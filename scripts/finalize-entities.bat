@echo off
echo Finalizing entity organization...

REM Create model files for entities
echo export interface User {> src\entities\user\model.ts
echo   id: string;>> src\entities\user\model.ts
echo   email: string;>> src\entities\user\model.ts
echo   role: string;>> src\entities\user\model.ts
echo   name?: string;>> src\entities\user\model.ts
echo }>> src\entities\user\model.ts

echo export interface Pharmacy {> src\entities\pharmacy\model.ts
echo   id: string;>> src\entities\pharmacy\model.ts
echo   name: string;>> src\entities\pharmacy\model.ts
echo   address: string;>> src\entities\pharmacy\model.ts
echo   licenseNumber?: string;>> src\entities\pharmacy\model.ts
echo }>> src\entities\pharmacy\model.ts

echo export interface License {> src\entities\license\model.ts
echo   id: string;>> src\entities\license\model.ts
echo   number: string;>> src\entities\license\model.ts
echo   type: string;>> src\entities\license\model.ts
echo   expiryDate: string;>> src\entities\license\model.ts
echo   status: string;>> src\entities\license\model.ts
echo }>> src\entities\license\model.ts

REM Create index files for entities
echo export * from './model';> src\entities\user\index.ts
echo export * from './model';> src\entities\pharmacy\index.ts
echo export * from './model';> src\entities\license\index.ts

REM Move entity-related types
move src\shared\types\User.tsx src\entities\user\types.ts
type src\shared\types\role.ts >> src\entities\user\types.ts
del src\shared\types\role.ts

echo Creating API layers for entities...
mkdir src\entities\user\api
mkdir src\entities\pharmacy\api
mkdir src\entities\license\api

REM Create API files
echo // User API endpoints and services> src\entities\user\api\index.ts
echo // Pharmacy API endpoints and services> src\entities\pharmacy\api\index.ts
echo // License API endpoints and services> src\entities\license\api\index.ts

echo Entity organization complete.