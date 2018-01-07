const signupForm = document.querySelector('form.signup');
const signinForm = document.querySelector('form.signin');
const signOutBtn = document.querySelector('[data-action=signout]');

/**
 * Error Handler
 */
function handleError (error) {
  alert(error)
}

/**
 * Signed In/Out States
 */
function showSignedIn (username) {
  document.querySelector('[data-value=username]').textContent = username
  document.body.setAttribute('data-account-state', 'signed-in')
}

function hideSignedIn () {
  document.body.setAttribute('data-account-state', 'signed-out')
}

hoodie.account.on('signin', function (account) {
  showSignedIn(account.username)
})

hoodie.account.on('signout', hideSignedIn)
hoodie.account.get(['session', 'username'], {local: true})
  .then(function (properties) {
    console.log(properties);
    if (properties.session) {
      showSignedIn(properties.username)
    } else {
      hideSignedIn();
    }
  });


/**
 * Handle signup form submit
 */
if(signupForm) {

  signupForm.addEventListener('submit', function (e) {
    e.preventDefault()

    const email = this.querySelector('[name=email]').value;
    const password = this.querySelector('[name=password]').value;

    hoodie.account.signUp({
      username: email,
      password: password
    })
    .then(function () {
      return hoodie.account.signIn({
        username: email,
        password: password
      })
    })
    .then(function () {
      // window.location.href = 'index.html'
    })
    .catch(handleError)

  });

}

/**
* Handle signin form submit
*/
if (signinForm) {

  signinForm.addEventListener('submit', function (e) {
    
    e.preventDefault()

    const email = this.querySelector('[name=email]').value
    const password = this.querySelector('[name=password]').value

    hoodie.account.signIn({
      username: email,
      password: password
    })

    .then(function () {
      window.location.href = 'index.html'
    })

    .catch(handleError)
  })

}

/**
 * Handle signout click.
 */
signOutBtn.addEventListener('click', function (e) {
  e.preventDefault()
  hoodie.account.signOut()
  // .then(setHashState)
})