// async function signupFormHandler(event) {
//     event.preventDefault();
  
//     const user_name = document.querySelector('#user_name-signup').value.trim();
//     const email = document.querySelector('#email-signup').value.trim();
//     const password = document.querySelector('#password-signup').value.trim();
      
//     if (user_name && email && password) {
//       const response = await fetch('/api/users', {
//         method: 'post',
//         body: JSON.stringify({ user_name, email, password }),
//         headers: { 'Content-Type': 'application/json' }
//       });
  
//       if (response.ok) {
//         document.location.replace('/dashboard');
//       } else {
//         alert(response.statusText);
//       }
//     }
//   }
  
// document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);