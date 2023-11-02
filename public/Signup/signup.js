async function signup(e) {
    try {
        e.preventDefault();
        console.log(e.target.email.value);

        const signupDetails = {
            name: e.target.name.value,
            email: e.target.email.value,
            phone: e.target.phone.value,
            password: e.target.password.value,
        };
        console.log(signupDetails);

        const response = await axios.post('http://localhost:5000/users/signup', signupDetails);

        if (response.status === 201) {
            console.log("Signed up Successfully...");
            // Display a success alert
            alert("Successfully signed up");
        }
        else if (response.status === 409) {
            console.log("User already exists, Please Login");

            alert("User already exists, Please Login");
        } else {
            throw new Error('Failed to signup');
        }
    } catch (err) {
        console.error(err);
        document.body.innerHTML += `<div style="color:red;"> ${err.message} </div>`;
    }
}