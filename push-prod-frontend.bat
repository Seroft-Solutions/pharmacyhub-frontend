@echo off
set DOCKER_IMAGE=syedus06/pharmacyhub-frontend
set TAG=prod
set ENV_FILE=deploy/env/.env.prod

cd /d D:\code\PharmacyHub\pharmacyhub-frontend

echo Logging into Docker Hub...
docker login || exit /b

echo Building image...
docker build -t %DOCKER_IMAGE%:%TAG% --build-arg ENV_FILE=%ENV_FILE% -f Dockerfile .

echo Pushing image to Docker Hub...
docker push %DOCKER_IMAGE%:%TAG%

echo Done: Image %DOCKER_IMAGE%:%TAG% built and pushed.
pause