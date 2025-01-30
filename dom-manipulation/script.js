let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Inspiration" }
  ];
  
  // Load quotes from local storage on page load
  function loadQuotes() {
    const savedQuotes = localStorage.getItem('quotes');
    if (savedQuotes) {
      quotes = JSON.parse(savedQuotes);
    }
    showRandomQuote(); // Show random quote when page loads
    populateCategories(); // Populate categories filter
  }
  
  // Save quotes to local storage
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }
  
  // Show random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    document.getElementById('quoteDisplay').innerText = `${quote.text} - ${quote.category}`;
  }
  
  // Add new quote
  function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value;
    const quoteCategory = document.getElementById('newQuoteCategory').value;
  
    if (quoteText && quoteCategory) {
      const newQuote = { text: quoteText, category: quoteCategory };
      quotes.push(newQuote);
      saveQuotes(); // Save updated quotes array to localStorage
      showRandomQuote(); // Show a random quote after adding a new one
      populateCategories(); // Update the category filter
      clearAddQuoteForm(); // Clear the form fields after adding a quote
    } else {
      alert('Please enter both a quote and a category');
    }
  }
  
  // Clear form fields after quote is added
  function clearAddQuoteForm() {
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
  }
  
  // Create Add Quote Form
  function createAddQuoteForm() {
    const formContainer = document.getElementById('addQuoteFormContainer');
  
    // Create the form elements
    const inputText = document.createElement('input');
    inputText.id = 'newQuoteText';
    inputText.type = 'text';
    inputText.placeholder = 'Enter a new quote';
  
    const inputCategory = document.createElement('input');
    inputCategory.id = 'newQuoteCategory';
    inputCategory.type = 'text';
    inputCategory.placeholder = 'Enter quote category';
  
    const addButton = document.createElement('button');
    addButton.innerText = 'Add Quote';
    addButton.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent form submission
      addQuote(); // Call addQuote function
    });
  
    // Append elements to the form container
    formContainer.innerHTML = ''; // Clear any previous content
    formContainer.appendChild(inputText);
    formContainer.appendChild(inputCategory);
    formContainer.appendChild(addButton);
  }
  
  // Populate category filter dropdown
  function populateCategories() {
    const categories = [...new Set(quotes.map(quote => quote.category))];
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = '<option value="all">All Categories</option>'; // Reset options
  
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  
    // Restore the last selected category from localStorage
    const lastCategory = localStorage.getItem('lastSelectedCategory');
    if (lastCategory) {
      categoryFilter.value = lastCategory;
    }
  }
  
  // Filter quotes by category
  function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const filteredQuotes = selectedCategory === 'all'
      ? quotes
      : quotes.filter(quote => quote.category === selectedCategory);
    
    document.getElementById('quoteDisplay').innerText = filteredQuotes.map(quote => `${quote.text} - ${quote.category}`).join('\n');
    localStorage.setItem('lastSelectedCategory', selectedCategory); // Save the last selected filter
  }
  
  // Export quotes to JSON
  function exportToJson() {
    const blob = new Blob([JSON.stringify(quotes)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
  }
  
  // Import quotes from JSON file
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories(); // Update categories after import
      alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
  }
  
  // Initialize the app
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  createAddQuoteForm(); // Create the add quote form when the page loads
  loadQuotes(); // Load quotes from local storage
  