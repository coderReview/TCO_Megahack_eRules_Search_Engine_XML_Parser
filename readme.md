## LRS parser

## Requirements
* node v6 (https://nodejs.org)

## Configuration

Configuration files are located under `config.js` file.  

|Name|Description|
|----|-----------|
|`mongodbUrl`| The mongodb url|
|`baseDir`| The base directory path with xml files|
|`naicsXmlFile`| The filename for xml with naics codes|
|`programXmlFile`| The filename for xml with programs|
|`regulationsFilePattern`| The file pattern for regulation files|


## Install dependencies
`npm i`

## Usage

Add to your parent app in package.json
```
"lrs_parser": "url to your rep"
```

See sample scripts under `test_files`.  
In real app replace  
`const parser = require('../')`  
by  
`const parser = require('lrs_parser')`


Scripts:
- `node test_files/init.js` init all models
- `node test_files/naics.js` demo usage for NaicsCodes
- `node test_files/programs.js` demo usage for Programs
- `node test_files/regulation.js` demo usage for Regulations
