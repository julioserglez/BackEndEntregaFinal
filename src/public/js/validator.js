const codigo = parseInt(document.querySelector('input[name="codigo"]').value);
if (codigo < 100 || codigo > 999) {
  alert('El código debe estar entre 100 y 999');
  return;
}



