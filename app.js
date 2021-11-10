"use strict"

const singleSearchTypes = [
  "First name", "Last Name", "Gender", "Date of Birth", "Weight", "Height",
  "Eye color", "Occupation",
  "Multi",
];

const multiSearchTypes = [
  "First name", "Last Name", "Gender", "Date of Birth", "Weight", "Height",
  "Eye color", "Occupation",
  "Exit"
];

//Menu functions.
//Used for the overall flow of the application.
/////////////////////////////////////////////////////////////////
//#region 

// app is the function called to start the entire application
function app(people){
  let searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase();
  let searchResults;
  switch(searchType){
    case 'yes':
      searchResults = searchByName(people);
      break;
    case 'no':
      // TODO: search by traits
      let searchType = promptFor("Would you like to search by a single trait or multiple traits? Enter 'single' or 'multiple" + singleSearchTypes, singleSearchTypeValidator).toLowerCase()
      console.log("search type: " + searchType);
      switch (searchType) {
        case 'multiple':
          searchResults = multiSearch(people);
          break;

        default:
          searchResults = search(searchType, people);
          break;
      }
      console.log('found ' + searchResults.length + ' results.');
      console.log('search results: ', searchResults);
      break;
      default:
    app(people); // restart app
      break;
  }
  
  // Call the mainMenu function ONLY after you find the SINGLE person you are looking for
  mainMenu(searchResults, people);
}

// Menu function to call once you find who you are looking for
function mainMenu(person, people){

  /* Here we pass in the entire person object that we found in our search, as well as the entire original dataset of people. We need people in order to find descendants and other information that the user may want. */

  if(!person){
    alert("Could not find that individual.");
    return app(people); // restart
  }

  let displayOption = promptFor("Found " + person.firstName + " " + person.lastName + " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'", autoValid);

  switch(displayOption){
    case "info":
    displayPerson(person);
    break;
    case "family":
    displayFamily(person, people);
    break;
    case "descendants":
    // TODO: get person's descendants
    break;
    case "restart":
    app(people); // restart
    break;
    case "quit":
    return; // stop execution
    default:
    return mainMenu(person, people); // ask again
  }
}

//#endregion

//Filter functions.
//Ideally you will have a function for each trait.
/////////////////////////////////////////////////////////////////
//#region 

//nearly finished function used to search through an array of people to find matching first and last name and return a SINGLE person object.
function searchByName(people){
  let firstName = promptFor("What is the person's first name?", autoValid);
  let lastName = promptFor("What is the person's last name?", autoValid);

  let foundPerson = people.filter(function(potentialMatch){
    if(potentialMatch.firstName === firstName && potentialMatch.lastName === lastName){
      return true;
    }
    else{
      return false;
    }
  })
  console.log(foundPerson)
  return foundPerson[0];
}

//unfinished function to search through an array of people to find matching eye colors. Use searchByName as reference.
function searchByEyeColor(people){
  let eyeColor = promptFor("What color eyes are we looking for?", autoValid);
  let foundEyeColor = people.filter(function (potentialMatch) {
    return potentialMatch.eyeColor === eyeColor;
  })
  console.log(foundEyeColor);
  return foundEyeColor;
}

function searchGender(people) {
  let genderNeutrality = promptFor("You want male or female?", autoValid);
  let foundGender = people.filter(function (potentialMatch) {
    return potentialMatch.gender === genderNeutrality;
  })
  console.log(foundGender);
  return foundGender;
}

function searchByDoB(people) {
  let dateOfBirth = promptFor("What date of birth are we looking for? dd/mm/yyyy format, if single digit no zeros", autoValid);
  let foundDateOfBirth = people.filter(function (potentialMatch) {
    return potentialMatch.dob === dateOfBirth;
  })
  console.log(foundDateOfBirth);
  return foundDateOfBirth;
}


function searchByWeight(people) {
  let pounds = promptFor("Input number of pounds", autoValid);
  let foundPounds = people.filter(function (potentialMatch) {
    return potentialMatch.weight == pounds;
  })
  console.log(foundPounds);
  return foundPounds;
}

function searchByHeight(people) {
  let inch = promptFor("Input number of inches", autoValid);
  let foundHeight = people.filter(function (potentialMatch) {
    return potentialMatch.height == inch;
  })
  console.log(foundHeight);
  return foundHeight;
}

function searchByOccupation(people) {
  let occupationSearch = promptFor("What occupation do you need?", autoValid);
  let foundOccupation = people.filter(function (potentialMatch) {
    return potentialMatch.occupation === occupationSearch;
  })
  console.log(foundOccupation);
  return foundOccupation;
}

//#endregion

//Display functions.
//Functions for user interface.
/////////////////////////////////////////////////////////////////
//#region 

// alerts a list of people
function displayPeople(people){
  alert(people.map(function(person){
    return person.firstName + " " + person.lastName;
  }).join("\n"));
}

function displayPerson(person){
  // print all of the information about a person:
  // height, weight, age, name, occupation, eye color.
  let personInfo = "First Name: " + person.firstName + "\n";
  personInfo += "Last Name: " + person.lastName + "\n";
  personInfo += "Last Name: " + person.lastName + "\n";
  personInfo += "Height: " + person.height + "\n";
  personInfo += "Weight: " + person.weight + "\n";
  personInfo += "DOB: " + person.dob + "\n";
  personInfo += "Occupation: " + person.occupation + "\n";
  personInfo += "Eye Color: " + person.eyeColor + "\n";
  alert(personInfo);
}


function displayFamily(person, people){
  let familyArray = []
  if (person.currentSpouse != null){
    for (let i = 0; i < people.length; i++){
      if (person.currentSpouse == people[i].id){
        familyArray.unshift(people[i].firstName + ' ' + people[i].lastName + ': Spouse');
      }
    }
  }

  if (person.parents[0] != []){
    for (let i = 0; i < people.length; i++){
      if (person.parents[0] == people[i].id){
        familyArray.unshift(people[i].firstName + ' ' + people[i].lastName + ': Parent');
      }
    }
  }

  if (person.parents[1] != []){
    for (let i = 0; i < people.length; i++){
      if (person.parents[1] == people[i].id){
        familyArray.unshift(people[i].firstName + ' ' + people[i].lastName + ': Parent');
      }
    }
  }

  let possibleSiblings = people.filter(function(potentialMatch){
    if(potentialMatch.lastName === person.lastName && potentialMatch.firstName != person.firstName){
      return true;
    }
    else{
      return false;
    }
  })

  for (let i = 0; i < possibleSiblings.length; i++){
    if (person.currentSpouse == possibleSiblings[i].id){
      delete possibleSiblings[i];
    }
    else if (person.parents[0] == possibleSiblings[i].id){
      delete possibleSiblings[i];
    }
    else if (person.parents[1] == possibleSiblings[i].id){
      delete possibleSiblings[i];
    }
  }

  possibleSiblings = possibleSiblings.filter(el=>el);

  for (let i = 0; i < possibleSiblings.length; i++){
    if (possibleSiblings[i].parents[0] == person.id || possibleSiblings[i].parents[1] == person.id){
    delete possibleSiblings[i];
    }
  }

  possibleSiblings = possibleSiblings.filter(el=>el);
  
  for (let i = 0; i < possibleSiblings.length; i++){
    familyArray.unshift(possibleSiblings[i].firstName + ' ' + possibleSiblings[i].lastName + ': Siblings');
  }

  let displayFamilyString = ''
  for (let i = 0; i < familyArray.length; i++){
    displayFamilyString +=  familyArray[i] + '\n';
  }

  alert(displayFamilyString);
}

//#endregion



//Validation functions.
//Functions to validate user input.
/////////////////////////////////////////////////////////////////
//#region 

//a function that takes in a question to prompt, and a callback function to validate the user input.
//response: Will capture the user input.
//isValid: Will capture the return of the validation function callback. true(the user input is valid)/false(the user input was not valid).
//this function will continue to loop until the user enters something that is not an empty string("") or is considered valid based off the callback function(valid).
function promptFor(question, valid){
  let isValid;
  do{
    var response = prompt(question).trim();
    isValid = valid(response);
  } while(response === ""  ||  isValid === false)
  return response;
}

// helper function/callback to pass into promptFor to validate yes/no answers.
function yesNo(input){
  if(input.toLowerCase() == "yes" || input.toLowerCase() == "no"){
    return true;
  }
  else{
    return false;
  }
}

// helper function to pass in as default promptFor validation.
//this will always return true for all inputs.
function autoValid(input){
  return true; // default validation only
}

//Unfinished validation function you can use for any of your custom validation callbacks.
//can be used for things like eye color validation for example.
function customValidation(input){
  
}

//#endregion