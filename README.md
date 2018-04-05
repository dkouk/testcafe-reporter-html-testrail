# testcafe-reporter-html-testrail

This is the **html-testrail** reporter plugin for [TestCafe](http://devexpress.github.io/testcafe).

<p align="center">
    <img src="https://raw.github.com/mitesh.savani/testcafe-reporter-html-testrail/master/media/Console_Output.jpg" alt="preview" />
</p>

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

## Additional Configuration

#### For HTML Report
``` 
HTML_REPORT_PATH : set the report output folder | default: Node_modules's (in where plugin is installed) sibling folder
```

<p align="center">
    <img src="https://raw.github.com/mitesh.savani/testcafe-reporter-html-testrail/master/media/HTML_Output.jpg" alt="preview" />
</p>

#### For Testrail publish

Before using Testrail publisher, You need to set test description in `specific format` as per bleow.

##### Format:

```
test('<< Group Name>> | << Test Name >> | << Testrail Case_ID >> ', async t => { .... });

<< Group Name >> - It can be any like Smoke, sanity, functional.
<< Test Name >>  - Test name of that test cases
<< Testrail Case_ID >>  - case ID of testrail's test case (The testcase should be present in the given PROJECT_NAME)

Example:

test('Smoke | Verify the Login Page | C875986 ', async t=> { ... });
```

`Assumption`: Testrail should contains Project which you will set as PROJECT_NAME and All the Automation test cases should present in the Testrail(that Case_ID will you set in the test description)

##### Environment Variables
```
TESTRAIL_ENABLE : set true to enable Testrail api | default: false
TESTRAIL_HOST : https://mitesh.testrail.com/ 
TESTRAIL_USER : username
TESTRAIL_PASS : password or api key
PROJECT_NAME : project name
PLAN_NAME : plan name | default: TestAutomation_1
```
`Note:` If you do not specify the ``PLAN_NANE`` then plugin will create `TestAutomation_1` plan name (if not exist) in the given Project  

## Author
Mitesh Savani (https://github.com/miteshsavani)


 
