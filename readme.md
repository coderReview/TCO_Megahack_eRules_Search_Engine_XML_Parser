# TCO_Megahack_eRules_Search_Engine_XML_Parser
Welcome to the EPA eRules Search Engine! This project is part of the Megahack at the 2016 Topcoder Open: http://tco16.topcoder.com/tco-megahack/

There are the three repos that are part of the eRules Search Engine:
https://github.com/topcoderinc/TCO_Megahack_eRules_Search_Engine_Frontend
https://github.com/topcoderinc/TCO_Megahack_eRules_Search_Engine_Backend
https://github.com/topcoderinc/TCO_Megahack_eRules_Search_Engine_API
https://github.com/topcoderinc/TCO_Megahack_eRules_Search_Engine_XML_Parser

Please feel free to checkout out our live site (http://tco16.topcoder.com/tco-megahack/) and issue some pull requests on our code!

-Topcoder


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
