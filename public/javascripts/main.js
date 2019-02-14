var token = localStorage.getItem('auth_token');

if (token) {
    token = JSON.parse(token)
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token.encoded
}