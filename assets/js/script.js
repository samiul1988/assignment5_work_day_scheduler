// global variables and consts
const LOCAL_STORAGE_TASK_LIST = "taskList";

// Get current day using moment js
let currentDate = moment();
let currentDateFormatted = currentDate.format("dddd, MMM Do, YYYY");

// helper function to generate time blocks e.g. ["9 am", "10 am", ...]
let generateTimeIndices = function() {
    let currentDate = moment();
    return Array(9).fill().map((_, i) => moment(currentDate, "L").set("hour", i + 9).format("h a"));
}

// helper function to create time/task paired object
let createEmptyTaskList = function() {
    let tempObj = {}
    generateTimeIndices().map(time => tempObj[time] = "-");
    return tempObj;
}

// Initialize task object
let taskObj = {
    date: currentDate.format("YYYY-MM-DD"),
    tasks: createEmptyTaskList()
}

// this function generates individual time block for the webpage
let generateIndividualTimeBlock = function(time, task) {
    // create time block elements
    let timeBlockRowEl = $("<div>")
        .addClass("d-flex justify-content-between row");  // outer container
    let timeBlockTimeDivEl = $("<div>")
        .addClass("hour pr-2 pt-2").text(time);    // time div
    let timeBlockTaskDivEl = $("<div>")
        .addClass(`flex-grow-1`);         // container for task entry   
    let timeBlockTaskContentEl = $("<p>")
        .addClass("p-2 text-left h-100 border-left border-dark")
        .text(task);    // task entry
    let timeBlockButtonEl = $("<button>")
        .addClass("btn saveBtn")
        .attr("data-time", time);   // save button
    let timeBlockButtonContentEl = $("<span>")
        .addClass("fas fa-save");  // save button icon
    
    // combine elements to form the block
    timeBlockTaskDivEl.append(timeBlockTaskContentEl);
    timeBlockButtonEl.append(timeBlockButtonContentEl);
    timeBlockRowEl.append(timeBlockTimeDivEl, timeBlockTaskDivEl, timeBlockButtonEl);
    
    // append the div to the time block container
    $("#time-blocks").append(timeBlockRowEl);
}

// this function saves the updated taskList to localStorage item 
let saveTaskList = function() {
    localStorage.setItem(LOCAL_STORAGE_TASK_LIST, JSON.stringify(taskObj));
};

// this function loads task list from local storage  
let loadTaskList = function() {
    // load the taskList object from localStorage
    let tasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TASK_LIST));
    
    // check the validity of the loaded object 
    if (tasks) {
        // if the saved task object date is older than today, then reset localStorage item
        // otherwise load the item to taskObj
        if ( Math.abs(moment(currentDate).diff(moment(tasks.date), 'days')) === 0 ) {
            taskObj = tasks;
        }else{
            saveTaskList();
        }
    }
}

// helper function to update task object
let updateTaskList = function(timeIndex, taskTxt) {
    taskObj.tasks[timeIndex] = taskTxt;
} 

// delegated event handler to replace <p> with <textarea> when a task item is clicked
$("#time-blocks").on("click", "p", function() {
    if (!$(this).parent().hasClass('past')) {
        let val = $(this)
            .text()
            .trim();  // Get text from the task item element
  
        var textAreaEl = $("<textarea>")
            .addClass("p-2 h-100 w-100")
            .val(val);  // create a textarea element
        
        $(this).replaceWith(textAreaEl); // Replace <p> element with <textarea>
        textAreaEl.trigger("focus"); // trigger focus event
    } else {
        alert("Cannot change past tasks!"); // show warning for past tasks
    }
});

// delegated event handler to replace <textarea> to <p> when editing is complete 
$("#time-blocks").on("blur", "textarea", function() {
    let val = $(this)
        .val()
        .trim(); // Get text from the textarea element
  
    var pEl = $("<p>")
        .addClass("p-2 text-left h-100 border-left border-dark")
        .text(val); // create a <p> element
    
    $(this).replaceWith(pEl); // Replace textare element with p element
});

// helper function to generate appropriate status of a time block
let checkTime = function( timeTxt ) {
    let currentTime = moment().format("H"); // get current hour
    let blockTime = moment(timeTxt, 'h a').format('H'); // get input hour
    let status;

    // determine status
    if ( blockTime - currentTime === 0 ) { 
        status = 'present';
    } else if ( blockTime - currentTime > 0 ) {
        status = 'future';
    } else {
        status = 'past';
    }

    return status;
}

// this function generates appropriate color codes for the task entry
// to display past, present and future time blocks 
let updateTimeBlockStatus = function() {
    $.each($("#time-blocks").children(), function(ind, item){
        let timeTxt = $(item)
            .children(".hour")
            .text(); // Get hour 
        let taskItem = $(item).children(".flex-grow-1"); // select container for coloring
        $(taskItem).removeClass("past present future"); // reset previous classes
        $(taskItem).addClass(checkTime(timeTxt)); // set updated class  
    });
}

// this function generates the whole time blocks
let generateTimeBlocks = function(){
    loadTaskList(); // update taskObj
    
    // loop through each item and generate div element for the page
    $.each(taskObj.tasks, function( key, value) {
        generateIndividualTimeBlock(key, value);
    });

    updateTimeBlockStatus(); // update colors of each task item to display status (past, present or future) 
}

// delegate click event listener to the save buttons
$("#time-blocks").on("click", "button", function() {
    // get the time index
    let timeIndex = $(this).attr("data-time");
    
    // get the task entry from the sibling element 
    let taskTxt = $(this)
        .siblings(".flex-grow-1")
        .children()
        .first()
        .text()
        .trim();
    
    // update taskObj
    updateTaskList(timeIndex, taskTxt);

    // save task to localStorage
    saveTaskList();
});

$("#currentDay").text(currentDateFormatted); // Show Current Day in the Title

generateTimeBlocks(); // Generate time blocks

// update status (color) of each time block every 30 minutes
setInterval(function() {
    updateTimeBlockStatus();
}, 1800000);
