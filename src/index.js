import './reset.css'
import './style.css'

const $ = document.querySelector.bind(document)


function renderResult(script, html, style) {
  const result = `<!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo it</title>
    <style>${style}</style>
  </head>
    ${html}
  
    <script type="module">
      ${script}
    </script>
  <body>
  </body>`

  localStorage.setItem('script', script)
  localStorage.setItem('html', html)
  localStorage.setItem('style', style)

  return result;
}


window.renderPage = function () {
  console.log('reload')

  const script = $('.editor[role="js"]').value
  const html = $('.editor[role="html"]').value
  const style = $('.editor[role="style"]').value

  const result = renderResult(script, html, style)
  const blob = new File([result], 'index.html', { type: 'text/html' })
  const uri = URL.createObjectURL(blob)

  $('.result-frame').src = uri
}

window.onload = () => {
  $('.editor[role="js"]').value = localStorage.getItem("script")
  $('.editor[role="html"]').value = localStorage.getItem("html")
  $('.editor[role="style"]').value = localStorage.getItem("style")
}

