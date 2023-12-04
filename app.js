const bellElement = document.getElementsByClassName("bell-container")[0];
const dcElement = document.getElementsByClassName("dc-container")[0];
const notificationDropdown = document.getElementsByClassName(
  "notification-dropdown"
)[0];
const storeDropdown = document.getElementsByClassName("store-dropdown")[0];
const closeTrialElement =
  document.getElementsByClassName("close-trial-button")[0];
const trialBoxElement = document.getElementsByClassName("select-plan")[0];
const arrowDownElement = document.getElementsByClassName("arrow-down")[0];
const arrowUpElement = document.getElementsByClassName("arrow-up")[0];
const arrowButton = document.getElementsByClassName("arrow-icon")[0];
const arrows = document.querySelectorAll(".arrow");
const guidesElement = document.getElementsByClassName("guides")[0];
const allGuideElement = document.querySelectorAll(".guide");
const progressBar = document.querySelector(".complete-loader");
const progressText = document.getElementsByClassName("progress-text")[0];
const checkboxButtons = document.querySelectorAll(".btn-svg");
const menuItems = storeDropdown.querySelectorAll("[role='menuitem']");
const dcButton = dcElement.querySelector(".btn-dc");

const HIDDEN_CLASS = "hidden";
const OPEN_CLASS = "open-guide";

// Toggling the alert popup

const toggleAlert = () => {
  notificationDropdown.classList.toggle(HIDDEN_CLASS);
};

// Alert Trigger

bellElement.addEventListener("click", () => {
  const isExpanded = bellElement.attributes["aria-expanded"].value === "true";

  if (isExpanded) {
    bellElement.ariaExpanded = "false";
  } else {
    bellElement.ariaExpanded = "true";
  }
  toggleAlert();
  storeDropdown.classList.add(HIDDEN_CLASS);
});

// The logics here are for the store link dropdown

const handleEscKeyPress = (event) => {
  if (event.key === "Escape") {
    toggleStoreDropdown();
  }
};

const handleDirectionKeyPress = (event, itemIndex) => {
  const isLastItem = itemIndex === menuItems.length - 1;
  const isFirstItem = itemIndex === 0;
  const nextItem = menuItems.item(itemIndex + 1);
  const prevItem = menuItems.item(itemIndex - 1);

  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    if (isLastItem) {
      menuItems.item(0).focus();
      return;
    }

    nextItem.focus();
  } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
    if (isFirstItem) {
      menuItems.item(menuItems.length - 1).focus();
      return;
    }

    prevItem.focus();
  }
};

const closeStoreDropdown = () => {
  dcButton.ariaExpanded = "false";
  dcButton.focus();
};

const openStoreDropdown = () => {
  dcButton.ariaExpanded = "true";
  menuItems.item(0).focus();
};

const toggleStoreDropdown = () => {
  notificationDropdown.classList.add(HIDDEN_CLASS);
  storeDropdown.classList.toggle(HIDDEN_CLASS);

  const isExpanded = dcButton.attributes["aria-expanded"].value === "true";

  if (!isExpanded) {
    openStoreDropdown();
    storeDropdown.addEventListener("keyup", handleEscKeyPress);

    menuItems.forEach(function (item, itemIndex) {
      item.addEventListener("keyup", (event) => {
        handleDirectionKeyPress(event, itemIndex);
      });
    });
  } else {
    closeStoreDropdown();
  }
};

dcElement.addEventListener("click", toggleStoreDropdown);

// For removing the trial popup

closeTrialElement.addEventListener("click", () => {
  trialBoxElement.style.display = "none";
});

// Logics here are for the step guides

function toggleGuides(element) {
  if (element.classList.contains("arrow-down")) {
    guidesElement.classList.remove(HIDDEN_CLASS);
    element.classList.add(HIDDEN_CLASS);
    arrowUpElement.classList.remove(HIDDEN_CLASS);
    return;
  }

  if (element.classList.contains("arrow-up")) {
    guidesElement.classList.add(HIDDEN_CLASS);
    element.classList.add(HIDDEN_CLASS);
    arrowDownElement.classList.remove(HIDDEN_CLASS);
  }
}

arrowButton.addEventListener("click", function () {
  const notHidden = Array.from(arrows).find((element) => {
    if (!element.classList.contains(HIDDEN_CLASS)) {
      return element;
    }
  });

  toggleGuides(notHidden);
});

allGuideElement.forEach((element) =>
  element.addEventListener("click", function () {
    if (!element.classList.contains(OPEN_CLASS)) {
      closeAllGuide();
    }

    element.classList.add(OPEN_CLASS);
  })
);

function closeAllGuide() {
  allGuideElement.forEach((element) => element.classList.remove(OPEN_CLASS));
}

// Initialize progress variables
let totalSteps = allGuideElement.length;
let completedSteps = 0;

// Function to update progress bar
function updateProgressBar() {
  const progressPercentage = (completedSteps / totalSteps) * 100;
  progressBar.style.width = `${progressPercentage}%`;
  progressText.textContent = `${completedSteps} / ${totalSteps} completed`;
}

// Function to handle checkbox button click
function handleCheckboxClick(index) {
  const checkboxButton = document.querySelectorAll(".btn-svg")[index];
  const completeCheckbox = checkboxButton.querySelector(".complete-checkbox");
  const emptyCheckbox = checkboxButton.querySelector(".dashed-checkbox");
  const spinner = checkboxButton.querySelector(".spinner");

  // Show spinner and hide other icons
  emptyCheckbox.classList.add(HIDDEN_CLASS);
  completeCheckbox.classList.add(HIDDEN_CLASS);
  spinner.classList.remove(HIDDEN_CLASS);

  // Simulate loading for 3 seconds
  setTimeout(() => {
    // Toggle the completion status
    allGuideElement[index].classList.toggle("completed");

    // Update completedSteps based on the completion status
    completedSteps = document.querySelectorAll(".guide.completed").length;

    // Update the progress bar
    updateProgressBar();

    // Hide spinner and show completed icon
    if (allGuideElement[index].classList.contains("completed")) {
      completeCheckbox.classList.remove(HIDDEN_CLASS);
      spinner.classList.add(HIDDEN_CLASS);
    } else {
      spinner.classList.add(HIDDEN_CLASS);
      emptyCheckbox.classList.remove(HIDDEN_CLASS);
      closeAllGuide();
      allGuideElement[index].classList.add(OPEN_CLASS);
      return;
    }
    spinner.classList.add(HIDDEN_CLASS);

    closeAllGuide();

    // Expand the next incomplete step
    for (let i = 0; i < totalSteps; i++) {
      if (!allGuideElement[i].classList.contains("completed")) {
        allGuideElement[i].classList.add(OPEN_CLASS);
        break;
      }
    }
  }, 3000);
}

checkboxButtons.forEach((button, index) => {
  button.addEventListener("click", () => handleCheckboxClick(index));
});
