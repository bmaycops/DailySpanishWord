fetch('https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO_NAME/main/words.json')
  .then(res => res.json())
  .then(data => {
    const today = new Date().toISOString().split('T')[0];
    const todayWord = data.find(entry => entry.date === today);
    const previousWords = data.filter(entry => entry.date < today).slice(-5).reverse(); // latest 5

    if (todayWord) {
      document.getElementById('word').textContent = todayWord.word;
      document.getElementById('translation').textContent = `(${todayWord.translation})`;
      document.getElementById('example').textContent = `"${todayWord.example}"`;
      document.getElementById('pronunciation').textContent = `Pronunciation: ${todayWord.pronunciation}`;
      document.getElementById('today-date').textContent = todayWord.date;
    }

    const prevContainer = document.getElementById('previous-words');
    previousWords.forEach(entry => {
      const box = document.createElement('div');
      box.className = 'bg-gray-200 text-gray-700 p-4 rounded-xl shadow-sm relative';
      box.innerHTML = `
        <span class="absolute top-2 left-4 text-xs text-gray-500">${entry.date}</span>
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
