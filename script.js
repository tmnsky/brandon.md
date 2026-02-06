// Blinking cursor (matches Obsidian's ~530ms blink rate)
const cursor = document.querySelector('.cursor-blink');
if (cursor) {
  setInterval(() => {
    cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
  }, 530);
}
