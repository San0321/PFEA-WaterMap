# PFEA water map

## Getting Started
### Requirements
- A recent version of NodeJS (tested with 9.2.0)
- npm

### Setup
```
git clone repo-name && cd repo-name
npm install
npm start
```

### Troubleshooting
Try removing node_modules/ (rm -r node_modules) and `npm install` again.

## Usage
Currently, this automatically synchronizes with a spreadsheet from Google Drive every half hour.  The spreadsheet must be "published to the web", and the spreadsheet can be updated in app.js.  It must conform to the format that is used by our example, https://docs.google.com/spreadsheets/d/e/2PACX-1vRwXK01YTeG2PQe1UjKFTzAgRAN18dfLda-O88b0CSBraD4duJkiaEPlpqaCymagDTnOBl-4SUqIAy8/pubhtml.  Specifically, it fetches the last 10 rows and uses every other row as the live data.
