// Array to store quote objects
let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" }
  ];
  
  // Function to show a random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
  
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `
      <p>"${quote.text}"</p>
      <p><em>- ${quote.category}</em></p>
    `;
  }
  
  // Function to add a new quote
  function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;
  
    if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
  
      // Clear the input fields after adding
      document.getElementById("newQuoteText").value = '';
      document.getElementById("newQuoteCategory").value = '';
  
      alert("New quote added successfully!");
    } else {
      alert("Please fill out both fields.");
    }
  }
  
  // Event listener for the 'Show New Quote' button
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  