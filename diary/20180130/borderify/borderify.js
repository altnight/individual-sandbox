const patterns = [
  {
    // default
    origin: /\*/,
    border: "5px solid red"
  },
  {
    origin: /https?:\/\/.*google.*/,
    border: "5px solid blue"
  },
  {
    origin: /https?:\/\/ja.wikipedia.org/,
    border: "5px solid green"
  },
  {
    origin: /https?:\/\/qiita.com/,
    border: "20px solid #55c500"
  },
]

const target = location.origin
const setStyle = (border) => {
  document.body.style.border = border
}

patterns.forEach(v => {
  if (v.origin.test(target)) {
    setStyle(v.border)
  }
})

