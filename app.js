"use strict"
let isValid = false;
let targetPerson = "";

const singleSearchTypes = [
  "Gender", " Date of Birth", " Weight", " Height ",
  " Eye color", " Occupation",
  " Multi",
];

const multiSearchTypes = [
  "1: Gender", " 2: Date of Birth", " 3: Weight", " 4: Height",
  " 5: Eye color", " 6: Occupation",
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
      let searchType = promptFor('How do you want to search? ' + singleSearchTypes, singleSearchTypeValidator);
      console.log("search type: " + searchType);
      switch (searchType) {
        case 'multi':
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
  
  searchResults = displaySearchResults(searchResults);
  // Call the mainMenu function ONLY after you find the SINGLE person you are looking for
  mainMenu(searchResults, people);
}

function multiSearch(people) {
  console.log("Beginning multi-search");
  let searchType = promptFor('Multi-search: Pick criteria you want to search (input numbers separated by a comma): '
  + '\n' + multiSearchTypes, autoValid);

  let filteredPeople = people; 
  searchType.split(',');

  if(searchType.includes(1)){
    filteredPeople = searchByGender(filteredPeople);
  }

  if(searchType.includes(2)){
    filteredPeople = searchByDoB(filteredPeople);
  }

  if(searchType.includes(3)){
    filteredPeople = searchByWeight(filteredPeople);
  }

  if(searchType.includes(4)){
    filteredPeople = searchByHeight(filteredPeople);
  }

  if(searchType.includes(5)){
    filteredPeople = searchByEyeColor(filteredPeople);
  }

  if(searchType.includes(6)){
    filteredPeople = searchByOccupation(filteredPeople);
  }
  
  return filteredPeople;
}

function search(searchType, people) {
  switch (searchType) {
    case "first name":
      return searchByFirstName(people);
    case "last name":
      return searchByLastName(people);
    case "weight":
      return searchByWeight(people);
    case "height":
      return searchByHeight(people);
    case "gender":
      return searchByGender(people);
    case "date of birth":
      return searchByDoB(people);
    case "eye color":
      return searchByEyeColor(people);
    case "occupation":
      return searchByOccupation(people);
    default:
      console.log('Search type [' + searchType + '] not found');
      return people;
  }
}

function displaySearchResults(searchResults){
  let resultsString = ''
  for(let i = 0; i < searchResults.length; i++){
    resultsString += (i + 1) + ': ' + searchResults[i].firstName + ' ' + searchResults[i].lastName + '\n';
  }

  let option = prompt(resultsString + '\n' + 'Enter number for person on list: ')

  return searchResults[option-1];
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
    displayDescendants(person, people);
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

function searchByGender(people) {
  let genderNeutrality = promptFor("What is the person's gender?", autoValid);
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
  let pounds = promptFor("Input weight in pounds", autoValid);
  let foundPounds = people.filter(function (potentialMatch) {
    return potentialMatch.weight == pounds;
  })
  console.log(foundPounds);
  return foundPounds;
}

function searchByHeight(people) {
  let inch = promptFor("Input height in inches", autoValid);
  let foundHeight = people.filter(function (potentialMatch) {
    return potentialMatch.height == inch;
  })
  console.log(foundHeight);
  return foundHeight;
}

function searchByOccupation(people) {
  let occupationSearch = promptFor("What occupation do they work?", autoValid);
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
  personInfo += "Gender: " + person.gender + "\n";
  personInfo += "Height: " + person.height + "\n";
  personInfo += "Weight: " + person.weight + "\n";
  personInfo += "DoB: " + person.dob + "\n";
  personInfo += "Occupation: " + person.occupation + "\n";
  personInfo += "Eye Color: " + person.eyeColor + "\n";
  alert(personInfo);
}

function getPossibleSiblings(person, people){
let possibleSiblings = people.filter(function(potentialMatch){
    if(potentialMatch.parents[0] === person.parents[0] && potentialMatch.firstName != person.firstName && potentialMatch.parents.length != 0){
      return true;
    }
    else{
      return false;
    }
  })

  return possibleSiblings;
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

  let possibleSiblings = getPossibleSiblings(person, people);
  
  if(possibleSiblings.length > 0){
    for (let i = 0; i < possibleSiblings.length; i++){
      familyArray.unshift(possibleSiblings[i].firstName + ' ' + possibleSiblings[i].lastName + ': Siblings');
    }
  }

  let displayFamilyString = ''
  for (let i = 0; i < familyArray.length; i++){
    displayFamilyString +=  familyArray[i] + '\n';
  }

  if (displayFamilyString == ''){
    alert('No immediate family found.')
  }
  else{
  alert(displayFamilyString);
  }
}

function getChildren(person, people){
  let children = people.filter(function(potentialMatch){
    if(potentialMatch.parents[0] === person.id || potentialMatch.parents[1] === person.id ){
      return true;
    }
    else{
      return false;
    }
  })
  return children;
}

function getGrandChildren(childArray,people){
  let fullGrandChildArray = []
  for (let i = 0; i < childArray.length; i++){
    let grandChildArray = getChildren(childArray[i], people)
    if (grandChildArray.length != 0){
      fullGrandChildArray.push(grandChildArray);
    }
  }
  return fullGrandChildArray;
}

function displayDescendants(person, people){
  let childArray = []
  childArray = getChildren(person, people);

  let fullGrandChildArray = []
  fullGrandChildArray = getGrandChildren(childArray,people);

  let descendantString = '';
  for (let i = 0; i < childArray.length; i++){
    descendantString += (childArray[i].firstName + ' ' + childArray[i].lastName + ': Child\n');
  }
  for (let i = 0; i < fullGrandChildArray.length; i++){
    descendantString += (fullGrandChildArray[i][i].firstName + ' ' + fullGrandChildArray[i][i].lastName + ': Grandchild\n');
  }

  if (descendantString == ''){
    alert('No descendants found.')
  }
  else{
    alert(descendantString);
  }
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
function singleSearchTypeValidator(input) {
  input = input.toLowerCase()
  return input === "first name" || input === "last name" || input === "gender" || input === "date of birth"
    || input === "height" || input === "weight" || input === "eye color" || input === "occupation" || input === "multi";
}

function multiSearchTypeValidator(input) {
  input = input.toLowerCase()
  return input === "first name" || input === "last name" || input === "gender" || input === "date of birth"
    || input === "height" || input === "weight" || input === "eye color" || input === "occupation" || input === "exit";
}

//#endregion