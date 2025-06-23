// frontend/script.js
fetch('http://localhost:3000/word/today')
  .then(res => res.json())
  .then(data => {
    document.getElementById('word').textContent = data.word;
    document.getElementById('translation').textContent = `(${data.translation})`;
    document.getElementById('example').textContent = `"${data.example}"`;
    document.getElementById('pronunciation').textContent = `Pronunciation: ${data.pronunciation}`;
  })
  .catch(err => {
    console.error('Error fetching word:', err);
  });
