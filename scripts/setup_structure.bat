@echo off
REM Create main FSD layers
mkdir src\features
mkdir src\entities
mkdir src\shared

REM Create feature-specific directories
mkdir src\features\licensing
mkdir src\features\licensing\ui
mkdir src\features\licensing\model
mkdir src\features\licensing\api

mkdir src\features\exams
mkdir src\features\exams\ui
mkdir src\features\exams\model
mkdir src\features\exams\api

REM Create shared layers
mkdir src\shared\ui
mkdir src\shared\api
mkdir src\shared\config
mkdir src\shared\lib
mkdir src\shared\types

REM Create entities layer structure
mkdir src\entities\user
mkdir src\entities\pharmacy
mkdir src\entities\license

REM Move existing files to new structure
REM UI Components
move src\components\ui\* src\shared\ui\
move src\components\NavigationBar\* src\shared\ui\navigation\
move src\components\NavSideBar\* src\shared\ui\sidebar\

REM API and Services
move src\api\* src\shared\api\
move src\services\* src\shared\api\services\

REM Config and Utils
move src\config\* src\shared\config\
move src\lib\* src\shared\lib\
move src\types\* src\shared\types\
move src\utils\* src\shared\lib\utils\

REM Features specific moves
move src\components\RegistrationForm\* src\features\licensing\ui\forms\
move src\components\Pharmacist\* src\features\licensing\ui\pharmacist\
move src\components\PharmacyManager\* src\features\licensing\ui\pharmacy-manager\
move src\components\Proprietor\* src\features\licensing\ui\proprietor\
move src\components\Salesman\* src\features\licensing\ui\salesman\

echo Directory structure setup complete.