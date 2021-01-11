// global variables and consts
const LOCAL_STORAGE_TASK_LIST = "taskList";

// Set current day
let currentDate = moment();
let currentDateFormatted = currentDate.format("dddd, MMM Do, YYYY");


// helper function to generate time blocks e.g. ["9 am", "10 am", ...]
let generateTimeIndices = function() {
    let currentDate = moment();
    return Array(12).fill().map((_, i) => moment(currentDate, "L").set("hour", i + 12).format("h a"));
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

// this function generates individual time block entry
let generateIndividualTimeBlock = function(time, task) {
    // create time block elements
    let timeBlockRowEl = $("<div>")
        .addClass("d-flex justify-content-between row");
    let timeBlockTimeDivEl = $("<div>")
        .addClass("hour pr-2 pt-2").text(time);
    let timeBlockTaskDivEl = $("<div>")
        .addClass(`flex-grow-1`);
    let timeBlockTaskContentEl = $("<p>")
        .addClass("p-2 text-left h-100 border-left border-dark")
        .text(task);
    let timeBlockButtonEl = $("<button>")
        .addClass("btn saveBtn")
        .attr("data-time", time);
    let timeBlockButtonContentEl = $("<span>")
        .addClass("fas fa-save");
    
    timeBlockTaskDivEl.append(timeBlockTaskContentEl);
    timeBlockButtonEl.append(timeBlockButtonContentEl);
    timeBlockRowEl.append(timeBlockTimeDivEl, timeBlockTaskDivEl, timeBlockButtonEl);
    
    // append the div to the time block list
    $("#time-blocks").append(timeBlockRowEl);
}

// saves the updated taskList to localStorage item 
let saveTaskList = function() {
    localStorage.setItem(LOCAL_STORAGE_TASK_LIST, JSON.stringify(taskObj));
};

// Load task list from local storage  
let loadTaskList = function() {
    // if the item exists in localStorage, then load it, otherwise load the default taskList object
    let tasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TASK_LIST));
    
    if (tasks) {
        // if the saved task object date is older than today, then reset localStorage item 
        if ( Math.abs(moment(currentDate).diff(moment(tasks.date), 'days')) === 0 ) {
            taskObj = tasks;
        }
    }
}

// helper function to update task object
let updateTaskList = function(timeIndex, taskTxt) {
    taskObj.tasks[timeIndex] = taskTxt;
} 

// Replace p with textarea
$("#time-blocks").on("click", "p", function() {
    if (!$(this).parent().hasClass('past')) {
        let val = $(this)
            .text()
            .trim();  // Get text from the p element
  
        var textAreaEl = $("<textarea>")
            .addClass("p-2")
            .val(val);
        
        $(this).replaceWith(textAreaEl); // Replace p element with textarea
        textAreaEl.trigger("focus"); // trigger focus event
    } else {
        alert("Cannot change past tasks!");
    }
});

// Change textarea to p when the 
$("#time-blocks").on("blur", "textarea", function() {
    let val = $(this)
        .val()
        .trim(); // Get text from the textarea element
  
    var pEl = $("<p>")
        .addClass("p-2 text-left h-100 border-left border-dark")
        .text(val);
    
    $(this).replaceWith(pEl); // Replace textare element with p element
});

// checkTime
let checkTime = function( timeTxt ) {
    let currentTime = moment().format("H");
    let blockTime = moment(timeTxt, 'h a').format('H');
    let status;

    if ( blockTime - currentTime === 0 ) {
        status = 'present';
    } else if ( blockTime - currentTime > 0 ) {
        status = 'future';
    } else {
        status = 'past';
    }

    return status;
}

let updateTimeBlockStatus = function() {
    $.each($("#time-blocks").children(), function(ind, item){
        let timeTxt = $(item)
            .children(".hour")
            .text();
        let taskItem = $(item).children(".flex-grow-1");
        $(taskItem).removeClass("past present future");
        $(taskItem).addClass(checkTime(timeTxt));   
    });
}

// this function generates the whole time blocks
let generateTimeBlocks = function(){
    loadTaskList(); // update taskObj
    console.log("taskObj before loading task divs", taskObj);
    $.each(taskObj.tasks, function( key, value) {
        generateIndividualTimeBlock(key, value);
    });
    updateTimeBlockStatus();
}

// add click event listener
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

generateTimeBlocks(); // generate time blocks

// setInterval here
setInterval(function() {
    updateTimeBlockStatus();
}, 1800000);
