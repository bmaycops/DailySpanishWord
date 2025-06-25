fetch('https://raw.githubusercontent.com/bmaycops/DailySpanishWord/refs/heads/wordle-style/docs/words.json')
  .then(res => res.json())
  .then(data => {
    const today = new Date().toISOString().split('T')[0];
    const todayWord = data.find(entry => entry.date === today);
    const previousWords = data.filter(entry => entry.date < today).slice(-5).reverse();

    if (todayWord) {
      document.getElementById('word').textContent = todayWord.word;
      document.getElementById('today-date').textContent = "Today";

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
        guessCount++;

        if (userGuess === correct) {
          correctGuessed = true;
          inputContainer.remove();
          submitButton.remove();

          const success = document.createElement('p');
          success.textContent = 'Correct!';
          success.className = 'text-green-600 text-sm';
          feedbackContainer.appendChild(success);

          document.getElementById('example').textContent = `"${todayWord.example}"`;
          document.getElementById('pronunciation').textContent = `Pronunciation: ${todayWord.pronunciation}`;
          document.getElementById('example').classList.remove('hidden');
          document.getElementById('pronunciation').classList.remove('hidden');
        }
      });
    }
    const prevContainer = document.getElementById('previous-words');
    previousWords.forEach(entry => {
      const formattedDate = formatDate(entry.date); // Format the date
      const box = document.createElement('div');
      box.className = 'bg-gray-200 text-gray-700 p-4 rounded-xl shadow-sm relative';
      box.innerHTML = `
        <span class="absolute top-2 right-4 text-xs text-gray-500">${formattedDate}</span>
        <p class="text-lg font-semibold">${entry.word}</p>
        <p class="text-md">(${entry.translation})</p>
        <p class="italic text-sm mt-1">${entry.example}</p>
        <p class="text-xs mt-1 text-gray-500">Pronunciation: ${entry.pronunciation}</p>
      `;
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
  }
}