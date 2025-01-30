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
      saveQuotes(); // Save updated quotes array
      postQuoteToServer(newQuote); // Post new quote to server
      showRandomQuote();
      populateCategories(); // Update category filter
    }
  }
  
  // Populate category filter
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
  function fetchQuotesFromServer() {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => response.json())
      .then(serverData => {
        const newQuotes = serverData.map(post => ({
          text: post.title,
          category: 'General'
        }));
        syncQuotes(newQuotes);
      })
      .catch(error => console.error('Error fetching server data:', error));
  }
  
  // Sync local quotes with server data
  function syncQuotes(serverQuotes) {
    const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
    
    serverQuotes.forEach(serverQuote => {
      const existingQuoteIndex = localQuotes.findIndex(localQuote => localQuote.text === serverQuote.text);
      
      if (existingQuoteIndex === -1) {
        localQuotes.push(serverQuote);
      } else {
        localQuotes[existingQuoteIndex] = serverQuote;
      }
    });
    
    localStorage.setItem('quotes', JSON.stringify(localQuotes));
    notifyDataUpdated(); // Show notification when data is synced
  }
  
  // Periodically check for new quotes from the server
  function startSyncingPeriodically() {
    setInterval(() => {
      fetchQuotesFromServer(); // Fetch quotes from the server periodically
    }, 5000);
  }
  
  // Show a notification
  function showNotification(message) {
    const notificationDiv = document.createElement('div');
    notificationDiv.classList.add('notification');
    notificationDiv.textContent = message;
    document.body.appendChild(notificationDiv);
  
    setTimeout(() => {
      notificationDiv.remove();
    }, 3000);
  }
  
  // Notify user of data update
  function notifyDataUpdated() {
    showNotification('Quotes updated from the server!');
  }
  
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  loadQuotes();
  startSyncingPeriodically();
  