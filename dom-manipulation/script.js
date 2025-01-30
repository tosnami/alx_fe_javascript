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
      postQuoteToServer(newQuote); // Post new quote to server
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
  
  // Fetch quotes from the server (mock API)
  async function fetchQuotesFromServer() {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts'); // Mock API endpoint
      const serverData = await response.json();
  
      // For this example, we assume each post's title is a quote
      const newQuotes = serverData.map(post => ({
        text: post.title, 
        category: 'General' // Assign default category
      }));
  
      // Sync server data with local data
      syncQuotes(newQuotes);
    } catch (error) {
      console.error('Error fetching server data:', error);
    }
  }
  
  // Post new quote to the server (mock API)
  async function postQuoteToServer(quote) {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: quote.text, 
          body: quote.text, 
          category: quote.category
        })
      });
  
      const data = await response.json();
      console.log('Successfully posted quote to server:', data);
    } catch (error) {
      console.error('Error posting quote to server:', error);
    }
  }
  
  // Sync local quotes with server data
  function syncQuotes(serverQuotes) {
    const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
  
    serverQuotes.forEach(serverQuote => {
      const existingQuoteIndex = localQuotes.findIndex(localQuote => localQuote.text === serverQuote.text);
      
      if (existingQuoteIndex === -1) {
        localQuotes.push(serverQuote); // If no conflict, add to local
      } else {
        // Conflict resolution: Update the local quote with the server quote (if necessary)
        localQuotes[existingQuoteIndex] = serverQuote;
        showNotification('Conflict resolved: Updated local data with server quote!');
      }
    });
  
    localStorage.setItem('quotes', JSON.stringify(localQuotes)); // Save merged data
    showNotification('Quotes updated from the server!');
  }
  
  // Periodically check for new quotes from the server
  function startSyncingPeriodically() {
    setInterval(() => {
      fetchQuotesFromServer(); // Fetch quotes from the server periodically
    }, 5000); // Every 5 seconds, adjust as needed
  }
  
  // Show a notification in the UI
  function showNotification(message) {
    const notificationDiv = document.createElement('div');
    notificationDiv.classList.add('notification');
    notificationDiv.textContent = message;
    document.body.appendChild(notificationDiv);
  
    // Remove notification after 3 seconds
    setTimeout(() => {
      notificationDiv.remove();
    }, 3000);
  }
  
  // Initialize the app
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  createAddQuoteForm(); // Create the add quote form when the page loads
  loadQuotes(); // Load quotes from local storage
  startSyncingPeriodically(); // Start periodic syncing
  