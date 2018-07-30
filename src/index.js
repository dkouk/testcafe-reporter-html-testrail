//import TestRail from './TestRail';


var request = require('request');
var qs = require('querystring');
var Promise = require('bluebird');

// ----- API Reference: http://docs.gurock.com/testrail-api2/start -----

function TestRail(options) {
  this.host = options.host;
  this.user = options.user;
  this.password = options.password;

  this.uri = '/index.php?/api/v2/';
}

TestRail.prototype.apiGet = function (apiMethod, queryVariables, callback) {
  var url = this.host + this.uri + apiMethod;

  if (typeof queryVariables == 'function') {
    callback = queryVariables;
    queryVariables = null;
  }

  return this._callAPI('get', url, queryVariables, null, callback);
};

TestRail.prototype.apiPost = function (apiMethod, body, queryVariables, callback) {
  var url = this.host + this.uri + apiMethod;

  if (typeof body == 'function') {
    callback = body;
    queryVariables = body = null;
  } else if (typeof queryVariables == 'function') {
    callback = queryVariables;
    queryVariables = null;
  }

  return this._callAPI('post', url, queryVariables, body, callback);
};

TestRail.prototype._callAPI = function (method, url, queryVariables, body, callback) {
  if (queryVariables != null) {
    url += '&' + qs.stringify(queryVariables);
  }

  var requestArguments = {
    uri: url,
    headers: {
      'content-type': 'application/json',
      'accept': 'application/json'
    },
    rejectUnauthorized: false
  };

  if (body != null) {
    requestArguments.body = body;
  }

  var bool = false;
  if (typeof callback === 'function') {
    var data = request[method](requestArguments, function (err, res, body) {
      bool = true;
      if (err) {
        return callback(err);
      }
      var responseBody = body === '' ? JSON.stringify({}) : body;
      if (res.statusCode != 200) {
        var errData = body;
        try {
          errData = JSON.parse(body);
        } catch (err) {
          return callback(err.message || err);
        }
        return callback(errData, res);
      }
      return callback(null, res, JSON.parse(responseBody));
    }).auth(this.user, this.password, true);
    require('deasync').loopWhile(function () {
      return !bool;
    });
    return data;
  } else {
    return new Promise(function (resolve, reject) {
      return request[method](requestArguments, function (err, res, body) {
        if (err) {
          return reject(err);
        }
        var responseBody = body === '' ? JSON.stringify({}) : body;
        if (res.statusCode != 200) {
          var errData = body;
          try {
            errData = JSON.parse(body);
          } catch (err) {
            return callback(err.message || err);
          }
          return reject({ message: errData, response: res });
        }
        return resolve({ response: res, body: JSON.parse(responseBody) });
      }).auth(this.user, this.password, true);
    }.bind(this));
  }
};

// ----- Cases -----

TestRail.prototype.getCase = function (id, callback) {
  return this.apiGet('get_case/' + id, callback);
};

TestRail.prototype.getCases = function (project_id, filters, callback) {
  var uri = 'get_cases/' + project_id;

  if (typeof filters == 'function') {
    callback = filters;
    return this.apiGet(uri, callback);
  } else {
    return this.apiGet(uri, filters, callback);
  }
};

TestRail.prototype.addCase = function (section_id, data, callback) {
  return this.apiPost('add_case/' + section_id, JSON.stringify(data), callback);
};

TestRail.prototype.updateCase = function (case_id, data, callback) {
  return this.apiPost('update_case/' + case_id, JSON.stringify(data), callback);
};

TestRail.prototype.deleteCase = function (case_id, callback) {
  return this.apiPost('delete_case/' + case_id, callback);
};

// ----- Case Fields -----

TestRail.prototype.getCaseFields = function (callback) {
  return this.apiGet('get_case_fields', callback);
};

// ----- Case Types -----

TestRail.prototype.getCaseTypes = function (callback) {
  return this.apiGet('get_case_types', callback);
};

// ----- Configurations -----

TestRail.prototype.getConfigs = function (project_id, callback) {
  return this.apiGet('get_configs/' + project_id, callback);
};

TestRail.prototype.addConfigGroup = function (project_id, data, callback) {
  return this.apiPost('add_config_group/' + project_id, JSON.stringify(data), callback);
};

TestRail.prototype.addConfig = function (config_group_id, data, callback) {
  return this.apiPost('add_config/' + config_group_id, JSON.stringify(data), callback);
};

TestRail.prototype.updateConfigGroup = function (config_group_id, data, callback) {
  return this.apiPost('update_config_group/' + config_group_id, JSON.stringify(data), callback);
};

TestRail.prototype.updateConfig = function (config_id, data, callback) {
  return this.apiPost('update_config/' + config_id, JSON.stringify(data), callback);
};

TestRail.prototype.deleteConfigGroup = function (config_group_id, callback) {
  return this.apiPost('delete_config_group/' + config_group_id, callback);
};

TestRail.prototype.deleteConfig = function (config_id, callback) {
  return this.apiPost('delete_config/' + config_id, callback);
};

// ----- Milestones -----

TestRail.prototype.getMilestone = function (id, callback) {
  return this.apiGet('get_milestone/' + id, callback);
};

TestRail.prototype.getMilestones = function (project_id, filters, callback) {
  var uri = 'get_milestones/' + project_id;

  if (typeof filters == 'function') {
    callback = filters;
    return this.apiGet(uri, callback);
  } else {
    return this.apiGet(uri, filters, callback);
  }
};

TestRail.prototype.addMilestone = function (project_id, data, callback) {
  return this.apiPost('add_milestone/' + project_id, JSON.stringify(data), callback);
};

TestRail.prototype.updateMilestone = function (milestone_id, data, callback) {
  return this.apiPost('update_milestone/' + milestone_id, JSON.stringify(data), callback);
};

TestRail.prototype.deleteMilestone = function (milestone_id, callback) {
  return this.apiPost('delete_milestone/' + milestone_id, callback);
};

// ----- Plans -----

TestRail.prototype.getPlan = function (id, callback) {
  return this.apiGet('get_plan/' + id, callback);
};

TestRail.prototype.getPlans = function (project_id, filters, callback) {
  var uri = 'get_plans/' + project_id;

  if (typeof filters == 'function') {
    callback = filters;
    return this.apiGet(uri, callback);
  } else {
    return this.apiGet(uri, filters, callback);
  }
};

TestRail.prototype.addPlan = function (project_id, data, callback) {
  return this.apiPost('add_plan/' + project_id, JSON.stringify(data), callback);
};

TestRail.prototype.addPlanEntry = function (plan_id, data, callback) {
  return this.apiPost('add_plan_entry/' + plan_id, JSON.stringify(data), callback);
};

TestRail.prototype.updatePlan = function (plan_id, data, callback) {
  return this.apiPost('update_plan/' + plan_id, JSON.stringify(data), callback);
};

TestRail.prototype.updatePlanEntry = function (plan_id, entry_id, data, callback) {
  return this.apiPost('update_plan_entry/' + plan_id + '/' + entry_id, JSON.stringify(data), callback);
};

TestRail.prototype.closePlan = function (plan_id, callback) {
  return this.apiPost('close_plan/' + plan_id, callback);
};

TestRail.prototype.deletePlan = function (plan_id, callback) {
  return this.apiPost('delete_plan/' + plan_id, callback);
};

TestRail.prototype.deletePlanEntry = function (plan_id, entry_id, callback) {
  return this.apiPost('delete_plan_entry/' + plan_id + '/' + entry_id, callback);
};

// ----- Priorities -----

TestRail.prototype.getPriorities = function (callback) {
  return this.apiGet('get_priorities', callback);
};

// ----- Projects -----

TestRail.prototype.getProject = function (id, callback) {
  return this.apiGet('get_project/' + id, callback);
};

TestRail.prototype.getProjects = function (filters, callback) {
  var uri = 'get_projects';

  if (typeof filters == 'function') {
    callback = filters;
    return this.apiGet(uri, callback);
  } else {
    return this.apiGet(uri, filters, callback);
  }
};

TestRail.prototype.addProject = function (data, callback) {
  return this.apiPost('add_project', JSON.stringify(data), callback);
};

TestRail.prototype.updateProject = function (project_id, data, callback) {
  return this.apiPost('update_project/' + project_id, JSON.stringify(data), callback);
};

TestRail.prototype.deleteProject = function (project_id, callback) {
  return this.apiPost('delete_project/' + project_id, callback);
};

// ----- Results -----

TestRail.prototype.getResults = function (test_id, filters, callback) {
  var uri = 'get_results/' + test_id;

  if (typeof filters == 'function') {
    callback = filters;
    return this.apiGet(uri, callback);
  } else {
    return this.apiGet(uri, filters, callback);
  }
};

TestRail.prototype.getResultsForCase = function (run_id, case_id, filters, callback) {
  var uri = 'get_results_for_case/' + run_id + '/' + case_id;

  if (typeof filters == 'function') {
    callback = filters;
    return this.apiGet(uri, callback);
  } else {
    return this.apiGet(uri, filters, callback);
  }
};

TestRail.prototype.getResultsForRun = function (run_id, filters, callback) {
  var uri = 'get_results_for_run/' + run_id;

  if (typeof filters == 'function') {
    callback = filters;
    return this.apiGet(uri, callback);
  } else {
    return this.apiGet(uri, filters, callback);
  }
};

TestRail.prototype.addResult = function (test_id, data, callback) {
  return this.apiPost('add_result/' + test_id, JSON.stringify(data), callback);
};

TestRail.prototype.addResultForCase = function (run_id, case_id, data, callback) {
  return this.apiPost('add_result_for_case/' + run_id + '/' + case_id, JSON.stringify(data), callback);
};

TestRail.prototype.addResults = function (run_id, data, callback) {
  return this.apiPost('add_results/' + run_id, JSON.stringify(data), callback);
};

TestRail.prototype.addResultsForCases = function (run_id, data, callback) {
  return this.apiPost('add_results_for_cases/' + run_id, JSON.stringify(data), callback);
};

// ----- Result Fields -----

TestRail.prototype.getResultFields = function (callback) {
  return this.apiGet('get_result_fields', callback);
};

// ----- Runs -----

TestRail.prototype.getRun = function (id, callback) {
  return this.apiGet('get_run/' + id, callback);
};

TestRail.prototype.getRuns = function (project_id, filters, callback) {
  var uri = 'get_runs/' + project_id;

  if (typeof filters == 'function') {
    callback = filters;
    return this.apiGet(uri, callback);
  } else {
    return this.apiGet(uri, filters, callback);
  }
};

TestRail.prototype.addRun = function (project_id, data, callback) {
  return this.apiPost('add_run/' + project_id, JSON.stringify(data), callback);
};

TestRail.prototype.updateRun = function (run_id, data, callback) {
  return this.apiPost('update_run/' + run_id, JSON.stringify(data), callback);
};

TestRail.prototype.closeRun = function (run_id, callback) {
  return this.apiPost('close_run/' + run_id, callback);
};

TestRail.prototype.deleteRun = function (run_id, callback) {
  return this.apiPost('delete_run/' + run_id, callback);
};

// ----- Sections -----

TestRail.prototype.getSection = function (id, callback) {
  return this.apiGet('get_section/' + id, callback);
};

TestRail.prototype.getSections = function (project_id, filters, callback) {
  var uri = 'get_sections/' + project_id;

  if (typeof filters == 'function') {
    callback = filters;
    return this.apiGet(uri, callback);
  } else {
    return this.apiGet(uri, filters, callback);
  }
};

TestRail.prototype.addSection = function (project_id, data, callback) {
  return this.apiPost('add_section/' + project_id, JSON.stringify(data), callback);
};

TestRail.prototype.updateSection = function (section_id, data, callback) {
  return this.apiPost('update_section/' + section_id, JSON.stringify(data), callback);
};

TestRail.prototype.deleteSection = function (section_id, callback) {
  return this.apiPost('delete_section/' + section_id, callback);
};

// ----- Statuses -----

TestRail.prototype.getStatuses = function (callback) {
  return this.apiGet('get_statuses', callback);
};

// ----- Suites -----

TestRail.prototype.getSuite = function (id, callback) {
  return this.apiGet('get_suite/' + id, callback);
};

TestRail.prototype.getSuites = function (project_id, callback) {
  return this.apiGet('get_suites/' + project_id, callback);
};

TestRail.prototype.addSuite = function (project_id, data, callback) {
  return this.apiPost('add_suite/' + project_id, JSON.stringify(data), callback);
};

TestRail.prototype.updateSuite = function (suite_id, data, callback) {
  return this.apiPost('update_suite/' + suite_id, JSON.stringify(data), callback);
};

TestRail.prototype.deleteSuite = function (suite_id, callback) {
  return this.apiPost('delete_suite/' + suite_id, callback);
};

// ----- Templates -----

TestRail.prototype.getTemplates = function (project_id, callback) {
  return this.apiGet('get_templates/' + project_id, callback);
};

// ----- Tests -----

TestRail.prototype.getTest = function (id, callback) {
  return this.apiGet('get_test/' + id, callback);
};

TestRail.prototype.getTests = function (run_id, filters, callback) {
  var uri = 'get_tests/' + run_id;

  if (typeof filters == 'function') {
    callback = filters;
    return this.apiGet(uri, callback);
  } else return this.apiGet(uri, filters, callback);
};

// ----- Users -----

TestRail.prototype.getUser = function (id, callback) {
  return this.apiGet('get_user/' + id, callback);
};

TestRail.prototype.getUserByEmail = function (email, callback) {
  return this.apiGet('get_user_by_email', { email: email }, callback);
};

TestRail.prototype.getUsers = function (callback) {
  return this.apiGet('get_users', callback);
};


export default function () {
    return {
        noColors:           false,
        startTime:          null,
        afterErrList:       false,
        currentFixtureName: null,
        testCount:          0,
        skipped:            0,
        output:             '',
        testResult:         [],
        agents:             '',
        passed:             '',
        failed:             '',
        testStartTime:      '',
        testEndTime:        '',
        totalTaskTime:      '',
        errorTestData:      [],
        creationDate:       '',
        PlanName:           '',
        PlanID:             0,
        SuiteID:            0,
        EnableTestrail:     false,
        ProjectID:          0,
        ProjectName:        '',
		TestrailUser:       null,
		TestrailPass:       null,
        TestrailHost:        null,
        ConfigID:           [],


        reportTaskStart (startTime, userAgents, testCount) {
            this.startTime = new Date(); // set first test start time

            this.testCount = testCount;

            this.setIndent(2)
                .useWordWrap(true)
                .write(`--------------------------------------------------------------------`)
                .newline()
                .write(`|        Running tests in:`)
                .write(this.chalk.blue(userAgents))
                .write(`|`)
                .newline()
                .write(`--------------------------------------------------------------------`)
                .newline();
            this.agents = userAgents;
            this.testStartTime = new Date();
            this.ProjectName = process.env.PROJECT_NAME;
			this.EnableTestrail =  process.env.TESTRAIL_ENABLE == 'true';
			this.TestrailHost = process.env.TESTRAIL_HOST;
			this.TestrailPass = process.env.TESTRAIL_PASS;
			this.TestrailUser = process.env.TESTRAIL_USER;
			if (this.EnableTestrail) {

				if(!this.ProjectName || !this.TestrailHost || !this.TestrailPass || !this.TestrailUser) {
					this.newline()
					.write(this.chalk.red.bold('Error:  TESTRAIL_HOST, TESTRAIL_USER, TESTRAIL_PASS and PROJECT_NAME must be set as environment variables for the reporter plugin to push the result to the Testrail'));
					process.exit(1);
				}
            }

            this.PlanName = process.env.PLAN_NAME || 'TestAutomation_1';
        },

        reportFixtureStart (name) {

            this.currentFixtureName = name;
        },

        reportTestDone (name, testRunInfo) {

            this.testEndTime = new Date(); // set test end time
            var hasErr = testRunInfo.errs.length;
            var result = hasErr === 0 ? this.chalk.green(`Passed`) : this.chalk.red(`Failed`);

            var namef = `${this.currentFixtureName} - ${name}`;

            const title = `${result} ${namef}`;

            this.write(title)
                .newline();
            var testOutput = {};

            this.testStartTime = new Date(); // set net test start time
            var testStatus = '';

            if (testRunInfo.skipped) testStatus = `Skipped`;
            else if (hasErr === 0) testStatus = `Passed`;
            else testStatus = `Failed`;

            testOutput[0] = this.currentFixtureName;
            testOutput[1] = name;
            testOutput[2] = testStatus;
            testOutput[3] = this.moment
                                    .duration(testRunInfo.durationMs)
                                    .format('h[h] mm[m] ss[s]');
            var error = {};

            if (testRunInfo.skipped)
                this.skipped++;

            if (hasErr > 0) {
                error[0] = this.currentFixtureName;
                error[1] = name;
                error[2] = '';
                testOutput[4] = '';
                this._renderErrors(testRunInfo.errs);

                testRunInfo.errs.forEach((err, idx) => {

                    error[2] += this.formatError(err, `${idx + 1}) `).replace(/(?:\r\n|\r|\n)/g, '<br />').replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
                    testOutput[4] += this.formatError(err, `${idx + 1}) `).replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
                });

                this.errorTestData.push(error);
            }


            this.testResult.push(testOutput);

        },

        reportTaskDone (endTime, passed) {
            const durationMs  = endTime - this.startTime;

            const durationStr = this.moment
                                    .duration(durationMs)
                                    .format('h[h] mm[m] ss[s]');

            this.totalTaskTime = durationStr;
            let footer = passed === this.testCount ?
                         `${this.testCount} Passed` :
                         `${this.testCount - passed}/${this.testCount} Failed`;

            footer += ` (Duration: ${durationStr})`;

            if (this.skipped > 0) {
                this.write(this.chalk.cyan(`${this.skipped} Skipped`))
                    .newline();
            }

            this.passed = passed;
            this.failed = this.testCount - passed;

            this.write(footer)
                .newline();

            var d = new Date();

            this.creationDate = d.getDate() + '_' + (d.getMonth() + 1) + '_' + d.getFullYear() + '_' + d.getHours() + '_' + d.getMinutes() + '_' + d.getSeconds();

            this.generateReport();

			if (this.EnableTestrail) {
				this.publishResultToTestrail();
			}

        },

        _renderErrors (errs) {
            this.setIndent(3)
                .newline();

            errs.forEach((err, idx) => {
                var prefix = this.chalk.red(`${idx + 1}) `);

                this.newline()
                    .write(this.formatError(err, prefix))
                    .newline()
                    .newline();
            });
        },

        publishResultToTestrail () {
            const resultsTestcases = [];
            const caseidList = [];
            this.newline()
            .newline()
            .write('------------------------------------------------------')
            .newline()
            .write(this.chalk.green('Publishing the result to testrail...'));

            for (var index in this.testResult) {

                const testDesc = this.testResult[index][1].split('\|'); // split the Test Description
                let caseID = null;

                if (typeof testDesc[2] === 'undefined') {  // verify that Case_ID  of test is present or not
                    this.newline()
                    .write(this.chalk.red.bold(this.symbols.err))
                    .write('Warning:  Test: ' + this.testResult[index][1] + ' missing the Testrail ID');
                    continue;
                }

                caseID = String(testDesc[2]).toUpperCase().replace('C', ''); // remove the prefix C from CaseID

                //to check that caseID is valid ID using isnumber function
                if(isNaN(caseID)) {
                    this.newline()
                    .write(this.chalk.red.bold(this.symbols.err))
                    .write('Warning:  Test: ' + this.testResult[index][1] + ' contains invalid Test rail Case id');
                    continue;
                }

                let status = this.testResult[index][2];
                let comment = null;

                if (status === 'Skipped') {
                    status = 6;
                    comment = 'Test Skipped';
                }
                else if (status === 'Passed') {
                    status = 1;
                    comment = 'Test passed';
                }
                else {
                    status = 5;
                    comment = this.testResult[index][4];  // if error found for the Test, It will populated in the comment
                }

                const Testresult = {};

                Testresult['case_id'] = caseID.trim();
                Testresult['status_id'] = status;
                Testresult['comment'] = comment;
                resultsTestcases.push(Testresult);
                caseidList.push(caseID.trim());
            }

            if (caseidList.length == 0) {
                this.newline()
                    .write(this.chalk.red.bold(this.symbols.err))
                    .write('No test case data found to publish');
               return;
            }

            const api = new TestRail({
                host:     this.TestrailHost,
                user:     this.TestrailUser,
                password: this.TestrailPass
            });

            this.getProject(api);

            if(this.ProjectID === 0 ) return;


            this.getPlanID(api);

            if(this.PlanID === 0) return;

             this.getSuiteID(api);

            if(this.SuiteID === 0 ) return;


            const AgentDetails = this.agents[0].split('/');
            const rundetails = {
                'suite_id': this.SuiteID,
                'include_all': false,
                'case_ids':    caseidList,
                'name':        'Run_' + this.creationDate + '(' + AgentDetails[0] + '_' + AgentDetails[1] + ')'

            };



            let runId = null;
            let result = null;


            api.addPlanEntry(this.PlanID, rundetails, (err, response, run) => {

                if (err !== 'null') {
                    runId = run.runs[0].id;
                    this.newline()
                            .write('------------------------------------------------------')
                            .newline()
                            .write(this.chalk.green('Run added successfully.'))
                            .newline()
                            .write(this.chalk.blue.bold('Run name   '))
                            .write(this.chalk.yellow('Run_' + this.creationDate + '(' + AgentDetails[0] + '_' + AgentDetails[1] + ')'));

                    result = {
                        results: resultsTestcases
                    };

                    api.addResultsForCases(runId, result, (err1, response1, results) => {
                        if (err1 === 'null') {
                            this.newline()
                            .write(this.chalk.blue('---------Error at Add result -----'))
                            .newline()
                            .write(err1);
                        }
                        else if (results.length == 0) {
                            this.newline()
                            .write(this.chalk.red('No Data has been published to Testrail.'))
                            .newline()
                            .write(err1);
                        } else {
                            this.newline()
                            .write('------------------------------------------------------')
                            .newline()
                            .write(this.chalk.green('Result added to the testrail Successfully'));
                        }

                    });

                }
                else {
                    this.newline()
                            .write(this.chalk.blue('-------------Error at AddPlanEntry ----------------'))
                            .newline()
                            .write(err);
                }
            });

        },

		getProject(api) {
			api.getProjects((err, response, project) => {
                if (err !== 'null' && typeof project !== 'undefined') {

                    project.forEach(project =>{
                        if (project.name === String(this.ProjectName)) {
                            this.ProjectID = project.id;
                            this.newline()
                            .write(this.chalk.blue.bold('Project name(id) '))
                            .write(this.chalk.yellow(this.ProjectName + '(' + project.id + ')'));
                        }

                    });
                }
                else {
                    this.newline()
                    .write(this.chalk.blue('-------------Error at Get Projects  ----------------'))
                    .newline();
                    console.log(err);

                    this.ProjectID =  0;
                }
			});

		},

        getPlanID(api) {
            api.getPlans(this.ProjectID, (err, response, plan) => {
                var planid = '';
                if (err !== 'null') {

                    for(var index in plan){
                        if(plan[index].name === this.PlanName)
                        {
                        this.newline()
                        .write(this.chalk.blue.bold('Plan name(id) '))
                        .write(this.chalk.yellow(plan[index].name + '(' + plan[index].id + ')'));
                        planid =  plan[index].id;
                        break;
                        }
                    }

                    if (planid === ''){
                        this.addNewPlan(api);
                    }
                    else{
                        this.PlanID = planid;
                    }
                }
                else {
                    this.newline()
                    .write(this.chalk.blue('-------------Error at Get Plans  ----------------'))
                    .newline();
                    console.log(err);
                    this.PlanID = 0;
                }
            });
        },
        addNewPlan(api) {
            api.addPlan(this.ProjectID, { name: this.PlanName, desription: 'Added From Automation reporter plugin' }, (err, response, plan) =>{
                if (err !== 'null') {
                    if(typeof plan.id === 'undefined') {
                        this.newline()
                        .write(this.chalk.red('Plan Id found as undefined'));
                        this.PlanID = 0;
                    }
                    else {
                        this.newline()
                        .write(this.chalk.green('New Plan is created'))
                        .newline()
                        .write(this.chalk.blue.bold('Plan name(id) '))
                        .write(this.chalk.yellow(plan.name + '(' + plan.id + ')'));
                        this.PlanID =  plan.id;
                    }

                }
                else{
                    this.newline()
                    .write(this.chalk.blue('-------------Error at Add New Plan  ----------------'))
                    .newline();
                    console.log(err);

                    this.PlanID =  0;
                }
            });
        },

        getSuiteID(api){

            return api.getSuites(this.ProjectID, (err, response, suites) => {
                if (err !== 'null') {

                     if(suites.length === 0) {
                         this.newline()
                         .write(this.chalk.red('The project doesnt contain any suite'));
                         this.SuiteID =  0;
                     }
                     else {

                         var id = suites[0].id;
                         this.newline()
                         .write(this.chalk.blue.bold('Suite name(id) '))
                         .write(this.chalk.yellow(suites[0].name + '(' + id + ')'));
                         this.SuiteID =  id;
                     }
                }
                else {
                    this.newline()
                            .write(this.chalk.blue('-------------Error at Get Suites  ----------------'))
                            .newline();
                    console.log(err);
                    this.SuiteID =  0;
                }

            });
        }
        ,

        generateReport () {

            this.output += `<!DOCTYPE html>
							<html>
                            <head>
                            <title>TestCafe HTML Report</title>
                            <script src='https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.min.js'></script>
                            <meta name='viewport' content='width=device-width, initial-scale=1'>
                            <link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'>
                            <script src='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js'></script>
                            <script>
                            var config = {             type: 'pie',             data: {                 datasets: [{                     data: [                         '${this.passed}','${this.failed}'                     ],                     backgroundColor: [                         'Green',                         'Red'                     ]                 }],                 labels: [                     'Pass',                     'Failed'                 ]             },             options: {                 responsive: true             }         };          window.onload = function() {             var ctx = document.getElementById('myChart').getContext('2d');             window.myPie = new Chart(ctx, config);         }; 
                            </script>
                            </head>
                            <body>
                            <div class='container-fluid'>
                                <div class="row">
                            <div class="col-sm-8">
                                  <div>
                                  <canvas id='myChart' height='80' ></canvas>
                                  </div>
                            </div>
                            <div class="col-sm-2" style=" padding-top:80px">
                                <table class='table table-bordered' >
                                <tr>
                                    <td><b>Passed</b></td>
                                    <td> ${this.passed} </td>
                                </tr>
                                <tr>
                                    <td> <b>Failed </b></td>
                                    <td> ${this.failed} </td>
                                </tr>
                                <tr>
                                    <td> <b>Skipped </b></td>
                                    <td> ${this.skipped} </td>
                                </tr>
                                <tr class='info'>
                                    <td> <b>Total </b></td>
                                    <td> ${this.testCount + this.skipped} </td>
                                </tr>
                                </table>
                            </div>
                          </div>
                            <hr/>
                            
                            
                            <h4>Running tests in: <b>${this.agents}</b>                      <span> Total Time: ${this.totalTaskTime}</span></h4>
                            <hr/><br/>
                                <h3 style='font-color:red'> Test details</h3>
                                <table class='table table-bordered table-hover'>
                                <thead>
                                <tr>
                                    <th> Fixture Name </th>
                                    <th> Test Name </th>
                                    <th> Status </th>
                                    <th> Time </th>
                                </tr> </thead><tbody>`;

            for (var index in this.testResult) {
                var status = this.testResult[index][2];

                if (status === 'Skipped') status = `<td style='background-color:gray' >Skipped</td>`;
                else if (status === 'Passed') status = `<td style='background-color:green' >Passed</td>`;
                else status = `<td style='background-color:red' >Failed</td>`;

                this.output += `<tr>
                                <td>${this.testResult[index][0]}</td>
                                <td>${this.testResult[index][1]}</td>
                                ${status}
                                <td style='padding-right:0px;border-right:0px;'>${this.testResult[index][3]}</td>
                            </tr>`;
            }

            this.output += `</tbody></table><hr /> <br />`;

            this.output += `<h3 style='font-color:red'> Error details</h3><br /><table class='table table-bordered table-hover'><thead>
                                <tr>
                                    <th> Fixture Name </th>
                                    <th> Test Name </th>
                                    <th> Error </th>
                                </tr></thead><tbody>`;

            for (var i in this.errorTestData) {
                this.output += `<tr>
                                <td>${this.errorTestData[i][0]}</td>
                                <td>${this.errorTestData[i][1]}</td>
                                <td>${this.errorTestData[i][2]}</td>
                                </tr>`;
            }

            this.output += `</tbody></table>
                           </body>
                         </html>`;
            var fs = require('fs');

            var dir = process.env.HTML_REPORT_PATH || `${__dirname}../../../../TestResult`;

            if (!fs.existsSync(dir)) {
                let dirName = '';
                const filePathSplit = dir.split('/');
                for (let index = 0; index < filePathSplit.length; index++) {
                    dirName += filePathSplit[index] + '/';
                    if (!fs.existsSync(dirName))
                        fs.mkdirSync(dirName);
                }
            }

            var filename = `Report_${this.creationDate}.html`;

            if (typeof process.env.HTML_REPORT_NAME !== 'undefined') {
                filename = `${process.env.HTML_REPORT_NAME}.html`;
            }

            var file = `${dir}/${filename}`;

            if (typeof process.env.HTML_REPORT_PATH !== 'undefined') {
                file = process.env.HTML_REPORT_PATH + `/${filename}`;
            }

            var isError = false;
            fs.writeFile(file, this.output, function (err) {

                if (err) {

                    isError = true;
                    return console.log(err);
                }
            });
            if(!isError){
                this.newline()
                .write('------------------------------------------------------')
                .newline()
                .newline()
                .write(this.chalk.green(`The file was saved at`))
                .write(this.chalk.yellow(file));
            }
        }
    };
}
