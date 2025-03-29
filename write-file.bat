@echo off 
echo /** 
echo  * Fetch OpenAPI Script 
echo  * 
echo  * This script fetches the OpenAPI specification from the backend API 
echo  * and saves it to a local file for code generation. 
echo  * 
echo  * Usage: 
echo  * ``` 
echo  * npm run fetch:openapi 
echo  * ``` 
echo  */ 
echo. 
echo import fs from 'fs'; 
echo import path from 'path'; 
echo import axios from 'axios'; 
echo import { argv } from 'process'; 
echo. 
echo // Default API URL to fetch the OpenAPI spec from 
echo const DEFAULT_API_URL = 'http://localhost:8080/v3/api-docs'; 
