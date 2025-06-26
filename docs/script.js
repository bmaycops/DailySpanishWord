fetch('https://raw.githubusercontent.com/bmaycops/DailySpanishWord/refs/heads/main/docs/words.json')
  .then(res => res.json())
  .then(data => {
    const today = new Date().toISOString().split('T')[0];
    const todayWord = data.find(entry => entry.date === today);
    const previousWords = data.filter(entry => entry.date < today).slice(-5).reverse();

    if (todayWord) {
      const wordElement = document.getElementById('word');
      const dateElement = document.getElementById('today-date');

      // Update the word element to include pronunciation
      wordElement.innerHTML = `${todayWord.word} <span class="text-sm text-gray-500">(${todayWord.pronunciation})</span>`;
      dateElement.textContent = "Today";

      const correct = todayWord.translation.trim().toLowerCase();
      const feedbackContainer = document.getElementById('guess-feedback');
      const inputContainer = document.getElementById('input-container');
      const submitButton = document.getElementById('submit-guess');
      const inputSection = document.getElementById('input-section');

      for (let i = 0; i < correct.length; i++) {
        const inputBox = document.createElement('input');
        inputBox.maxLength = 1;
        inputBox.className = 'w-8 h-8 text-center border border-gray-300 rounded';
        inputBox.dataset.index = i;

        // Add event listener to move to the next box
        inputBox.addEventListener('input', (e) => {
          const currentIndex = parseInt(e.target.dataset.index, 10);
          const nextBox = inputContainer.querySelector(`input[data-index="${currentIndex + 1}"]`);
          if (nextBox) {
            nextBox.focus();
          }
        });

        // Add event listener for backspace functionality
        inputBox.addEventListener('keydown', (e) => {
          if (e.key === 'Backspace' && e.target.value === '') {
            const currentIndex = parseInt(e.target.dataset.index, 10);
            const previousBox = inputContainer.querySelector(`input[data-index="${currentIndex - 1}"]`);
            if (previousBox) {
              previousBox.focus();
              previousBox.value = ''; // Clear the previous box
            }
          }
        });

        // Add event listener to restrict input to letters only
        inputBox.addEventListener('keypress', (e) => {
          const char = String.fromCharCode(e.keyCode || e.which);
          if (!/^[a-zA-Z]$/.test(char)) {
            e.preventDefault(); // Prevent non-letter characters
          }
        });

        inputContainer.appendChild(inputBox);
      }

      let guessCount = 0;
      let correctGuessed = false;

      submitButton.addEventListener('click', () => {
        if (correctGuessed) return;

        const guessBoxes = inputContainer.querySelectorAll('input');
        const userGuess = Array.from(guessBoxes).map(input => input.value.toLowerCase()).join('');

        const row = document.createElement('div');
        row.className = 'flex gap-1';

        for (let i = 0; i < correct.length; i++) {
          const box = document.createElement('div');
          box.textContent = userGuess[i] || '';
          box.className = 'w-8 h-8 flex items-center justify-center font-bold text-white rounded';

          if (userGuess[i] === correct[i]) {
            box.classList.add('bg-green-500');
          } else if (correct.includes(userGuess[i])) {
            box.classList.add('bg-yellow-500');
          } else {
            box.classList.add('bg-gray-400');
          }

          row.appendChild(box);
        }

        feedbackContainer.prepend(row);
        feedbackContainer.scrollTop = 0;

        // Clear the input fields
        guessBoxes.forEach(input => {
          input.value = '';
        });

        guessCount++;

        if (userGuess === correct) {
          correctGuessed = true;
          inputContainer.remove();
          submitButton.remove();

          const success = document.createElement('p');
          success.textContent = 'Correct!';
          success.className = 'text-green-600 text-sm';
          feedbackContainer.appendChild(success);

          // Display example and pronunciation
          document.getElementById('example').textContent = `"${todayWord.example}"`;
          document.getElementById('example_translation').textContent = `"${todayWord.example_translation}"`;
          document.getElementById('pronunciation').textContent = `Pronunciation: ${todayWord.pronunciation}`;
          document.getElementById('example').classList.remove('hidden');
          document.getElementById('pronunciation').classList.remove('hidden');
          document.getElementById('example_translation').classList.remove('hidden');

        }
      });
    }
    const prevContainer = document.getElementById('previous-words');
    previousWords.forEach(entry => {
      const formattedDate = formatDate(entry.date);

      // Create the main container for the word box
      const box = document.createElement('div');
      box.className = 'bg-gray-200 pt-3 pb-6 px-6 rounded-xl shadow-sm';

      // Create the header section (word, pronunciation, and date with dropdown arrow)
      const header = document.createElement('div');
      header.className = 'flex justify-between items-center cursor-pointer';
      header.innerHTML = `
        <div class="flex items-center space-x-2">
          <p class="text-lg font-semibold">${entry.word} <span class="text-sm text-gray-500">(${entry.pronunciation})</span></p>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-xs text-gray-500">${formattedDate}</span>
          <button class="text-gray-500 text-sm">▼</button>
        </div>
      `;

      // Create the collapsible content section
      const content = document.createElement('div');
      content.className = 'hidden mt-2'; // Initially hidden
      content.innerHTML = `
        <div class="flex gap-1 mt-2">
          ${entry.translation.split('').map(char => `
            <div class="w-8 h-8 text-center border border-gray-300 rounded font-bold text-white bg-green-500">${char}</div>
          `).join('')}
        </div>
        <p class="italic text-sm mt-1">${entry.example}</p>
        <p class="italic text-sm mt-1">${entry.example_translation}</p>
      `;

      // Add event listener to toggle visibility of the content
      header.addEventListener('click', () => {
        content.classList.toggle('hidden'); // Toggle the 'hidden' class
      });

      // Append header and content to the box
      box.appendChild(header);
      box.appendChild(content);

      // Append the box to the previous words container
      prevContainer.appendChild(box);
    });
  })
  .catch(err => {
    console.error('Error fetching words:', err);
  });

// Helper function to format the date
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getFullYear();

  // Add suffix to the day (e.g., "23rd")
  const daySuffix = getDaySuffix(day);

  return `${day}${daySuffix} ${month} ${year}`;
}

// Helper function to determine the day suffix
function getDaySuffix(day) {
  if (day > 3 && day < 21) return 'th'; // Covers 4th-20th
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }}
