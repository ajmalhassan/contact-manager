/* Base url constant
*  @constant
 */
const baseURL = "http://192.168.1.53:8000/api/v3/";

/* userHasClicked flag : to prevent further clicking */
let userHasClickedOnce = false;

function testJax() {
    console.log('called')
    android.mathJaxProcessed()
}

/* invoked to render MathJax
* @function
* @param {string} element - HTML DOM element
* @params {function} androidCallback - 
 */
function renderMathJax(element = '', invokeAndroid = false) {
    setTimeout(() => {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, element]);
        /* 
        pass android call back here to be called after typesetting is done.
        */
       if(invokeAndroid) {
        MathJax.Hub.Queue(testJax);
       }
    });
}

/* invoked when an answer is clicked 
*  @callback
*  @param {Object} event - the action event object
*  @param {String} correct_choice - correct option letter
*/
function handleAnswerClick(event, data) {
    if (!userHasClickedOnce) {
        const { correct_choice, solution } = data.question;

        userHasClickedOnce = true;

        /* we are doing event.path.length - 9 this to overcome a problem that when pressed on the MathJax
        rendered equation, the target will be that element and it doesnt have the dataset
        but JS maintains a path that contains all the parents of that clicked element
        and the 9th element from the end ie from the Global window is the main card element */
        let label = event.path[event.path.length - 9].id.split("-")[1];

        let targetOptionElem = $(`#card-${label}`);

        $(`#alpha-${label}`).removeClass("text-default");

        if (targetOptionElem.data("label") === correct_choice) {
            targetOptionElem.addClass("bg-success");
        } else {
            let correctOptionElem = $(`#card-${correct_choice}`);

            targetOptionElem.addClass("bg-danger");

            $(`#alpha-${correct_choice}`).removeClass("text-default");

            correctOptionElem.addClass("bg-success");
        }
        if (solution) {
            displaySolution(correct_choice, solution);
        }
    }
}

/*  displays question in the view
* @param {object} data - contains question details
*/
function displayQuestion(data, type) {
    let reportStatus = "";
    /* checking if this is a reported question */
    if (type === "REPORTED") {
        reportStatus = data.is_resolved
            ? '<span class="pill pill__success m-b-8 pull-right --absolute">Resolved</span><br>'
            : '<span class="pill pill__danger m-b-8 pull-right  --absolute">Not Resolved</span><br>';
    }

    /* setting the question and the modules */
    $("#question").html(`
        ${reportStatus}
        <div id="moduleText" class="text-muted font-sm font-bold m-b-16">
        ${data.question.subject_name}  ${
        data.question.topic_name ? " &middot; " + data.question.topic_name : ""
    }
        ${
            data.question.module_name
                ? " &middot; " + data.question.module_name
                : ""
        }
        </div>
        <div class="question">
            <div class="question__no text-muted">${data.id}.</div>
            <div class="question__text">${data.question.statement}</div>
        </div>
    `);
}

/*  displays solution in the view after option is pressed
* @param {string} label - label of correct option
* @param {string} solution - Contains solution text
*/
function displaySolution(label, solution) {
    $("#solution").removeClass("d-none");
    $("#solution").html(`
  <div class="soln-header text-muted font-sm font-bold m-b-sm p-w-sm">
      Solution ${label.toUpperCase()}
  </div>
  <div class="card m-b-sm b-r-8 p-md border-t-primary card__shadow">
      <p class="solution no-margin">
          ${solution}
      </p>
  </div>
`);
    renderMathJax('#solution')
}

/*  displays reported issue related in the view 
* @param {string} statement - statement submitted by user
* @param {string} comment - response by entri.me
*/
function displayIssueData(statement, comment) {
    $("#reported").empty();
    if (statement) {
        $("#reported").append(`
            <div class="soln-header text-muted font-sm font-bold m-b-sm p-w-sm">
                Issue statement
            </div>
            <div class="card m-b-sm b-r-8 p-md border-t-warning card__shadow">
                <p class="solution no-margin">
                    ${statement}
                </p>
            </div>
        `);
    }

    if (comment) {
        $("#reported").append(`
            <div class="soln-header text-muted font-sm font-bold m-b-sm p-w-sm">
            Issue response
            </div>
            <div class="card m-b-sm b-r-8 p-md border-t-warning card__shadow">
                <p class="solution no-margin">
                    ${comment}
                </p>
            </div>
        `);
    }

    renderMathJax('#reported')
}

/* generating the choicesHTML
* @param {Object} question - contains the choices and objects*/
function displayChoices(question) {
    /* clearing previous values */
    let choicesHTML = "";

    let optionAlpha = "a";

    while (
        question.hasOwnProperty("choice_" + optionAlpha) &&
        question["choice_" + optionAlpha]
    ) {
        choicesHTML += `
    <div class="column">
    <div id="card-${optionAlpha}" class="choice_option card card__shadow m-b-sm b-r-8"
        data-label="${optionAlpha}">
        <div class="choice" id="choice-${optionAlpha}">
            <div class="choice__alphabet text-default" id="alpha-${optionAlpha}">
                ${optionAlpha.toUpperCase()}
            </div>
            <div class="choice__text" id="text-${optionAlpha}">
                ${question["choice_" + optionAlpha]}
            </div>
        </div>
    </div>
    </div>`;
        optionAlpha = String.fromCharCode(optionAlpha.charCodeAt() + 1);
    }

    $("#choices").html(choicesHTML);
}

/* initialize initiates http request and populates the DOM
* @callbackfunction
@params {object} data - contains Question data
@params {string} type - contains type of view
 */
function initialize(data, type) {
    /* setting default for type */
    type = type || "BOOKMARKED";

    /* sets the questions and its modules */
    displayQuestion(data, type);

    /* sets the generated */
    displayChoices(data.question);

    /* adding event listner to choice cards */
    $(".choice_option").on("click", () => handleAnswerClick(event, data));

    /* display issue related data if type is REPORTED */
    if (type === "REPORTED") {
        displayIssueData(data.issue_statement, data.ce_comment);
    }
    /* rerenders the MathJax on the DOM */
    renderMathJax('body', true);
}

/* Invoked when DOM has finished loading
  @event
  @param {function} initialize - populates the DOM with values
*/
// $(document).ready();