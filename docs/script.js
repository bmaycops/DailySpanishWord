fetch('https://raw.githubusercontent.com/bmaycops/DailySpanishWord/refs/heads/main/docs/words.json')
  .then(res => res.json())
  .then(data => {
    const today = new Date().toISOString().split('T')[0];
    const todayWord = data.find(entry => entry.date === today);

    if (todayWord) {
      document.getElementById('word').textContent = todayWord.word;
      document.getElementById('translation').textContent = `(${todayWord.translation})`;
      document.getElementById('example').textContent = `"${todayWord.example}"`;
      document.getElementById('pronunciation').textContent = `Pronunciation: ${todayWord.pronunciation}`;
    } else {
      document.getElementById('word').textContent = "No word found for today.";
    }
  })
  .catch(err => {
    console.error('Error fetching words.json:', err);
  });

