(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()
  const stars = document.querySelectorAll('#starRating span');
  const ratingInput = document.getElementById('ratingInput');

  stars.forEach(star => {
    star.addEventListener('click', () => {
      const selectedRating = parseInt(star.getAttribute('data-value'));
      ratingInput.value = selectedRating;  // ⭐️ Hidden input gets this value

      // Fill stars according to selected rating
      stars.forEach(s => {
        const sVal = parseInt(s.getAttribute('data-value'));
        if (sVal <= selectedRating) {
          s.textContent = '★';
          s.classList.add('filled');
        } else {
          s.textContent = '☆';
          s.classList.remove('filled');
        }
      });
    });
  });

  // Prevent submit if no star selected
  document.querySelector('form').addEventListener('submit', function (e) {

  });