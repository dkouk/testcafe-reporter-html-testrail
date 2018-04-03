# testcafe-reporter-html-testrail

This is the **html-testrail** reporter plugin for [TestCafe](http://devexpress.github.io/testcafe).


## Install

```
npm install testcafe-reporter-html-testrail
```

## Usage

When you run tests from the command line, specify the reporter name by using the `--reporter` option:

```
testcafe chrome 'path/to/test/file.js' --reporter html-testrail
```


When you use API, pass the reporter name to the `reporter()` method:

```js
testCafe
    .createRunner()
    .src('path/to/test/file.js')
    .browsers('chrome')
    .reporter('html-testrail') // <-
    .run();
```

## Set Environement

**For HTML Report**
``` 

HTML_REPORT_PATH : set the report output folder | default: Node_modules's (in where plugin is installed) sibling folder
```

**For Testrail publish**
```
TESTRAIL_ENABLE : set true to enable Testrail api | default: false
TESTRAIL_HOST : https://mitesh.testrail.com/ 
TESTRAIL_USER : username
TESTRAIL_PASS : password or api key
PROJECT_NAME : project name
PLAN_NAME : plan name | default: TestAutomation_1
```


## Author
Mitesh Savani (https://github.com/miteshsavani)


 
