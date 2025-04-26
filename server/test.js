// Constructor function for creating Car objects
function Car(make, model, year) {
  this.make = make;
  this.model = model;
  this.year = year;
}

// Creating new Car objects using the constructor
// console.log(car1);
const car1 = new Car("Toyota", "Corolla", 2020);
const car2 = new Car("Honda", "Civic", 2019);
// console.log(car2);

{
  // Debouncing function
  function debounce(func, delay) {
    let timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(func, delay);
    };
  }

  // Function to be executed on scroll
  function handleScroll() {
    console.log("Scrolling...");
    // Your scroll-related logic here
  }

  // Debounce the handleScroll function with a 300ms delay
  const debouncedScrollHandler = debounce(handleScroll, 300);

  // Attach the debouncedScrollHandler to the scroll event of the scrollContainer
  document
    .getElementById("scrollContainer")
    .addEventListener("scroll", debouncedScrollHandler);
}

//
// Throttling function
function throttle(func, interval) {
  let lastExecTime = 0;
  return function () {
    const now = Date.now();
    if (now - lastExecTime > interval) {
      func();
      lastExecTime = now;
    }
  };
}

// Function to be executed on scroll
function handleScroll() {
  console.log("Scrolling...");
  // Your scroll-related logic here
}

// Throttle the handleScroll function with a 300ms interval
const throttledScrollHandler = throttle(handleScroll, 1000);

// Attach the throttledScrollHandler to the click event of the scrollContainer
document
  .getElementById("scrollContainer")
  .addEventListener("click", throttledScrollHandler);
