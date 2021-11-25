# Create a cypress project
- Open your project folder in VS Code
- Clone the application to a folder at project root-level
- Follow installation guide for the application

## Install cypress in the project
Create a folder for your tests and initiate cypress there
```
mkdir backend-tests
cd backend-tests
npm init -y && npm install cypress@8.7.0 --save-dev
```
Expected result: Creates `/node_modules`, `package-lock.json` and `package.json`

Set-up cypress
Go to package.json and add edit scripts
```javascript
"scripts": {
    "cypress:open": "cypress open",
    "cypress:run": "cypress run --reporter mochawesome",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```
Run cypress once
```
npm run cypress:open
```
Expected result: 
Creates `/cypress`-folder and opens cypress in browser

Now you can continue with creating spec-files and running tests.