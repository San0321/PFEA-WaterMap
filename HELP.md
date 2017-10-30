# Clean Water app dev docs

## Requirements
* **Node.JS installed (7.9.0 recommended)**

Please make sure you have Node.Js installed. If not, [click here](https://nodejs.org/en/) to download.
To check if you have node installed, just type `node` at your terminal. If you see a `>`, then you have it. If not, you probably don't have it.
 
## Getting started

```bash
git clone https://github.com/roym6/CleanWater.git CleanWater
cd CleanWater
npm install
mkdir uploads
``` 

This will install all dependencies so you can start developing.
Uploads dir needed to save excel files to disk

## Running server (watch mode)

```bash
npm run watch
```

## Running server

```bash
npm run start
```

Now go to http://localhost:3000/upload
json output will be printed to console as of now

## Testing

```bash
npm test
```

This will run mocha and test all files under "/tests"

## Testing in watch mode (recommended)

```bash
npm run testw
```

This will run mocha in watch mode. Whenever you make a change to a file, mocha will restart your tests. So you don't have to keep restarting mocha all the time.