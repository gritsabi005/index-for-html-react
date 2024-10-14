import React, { useState } from 'react';

function App() {
  const mainUrl = "http://localhost:8080";
  const [jwt, setJwt] = useState(null);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [deleteUsername, setDeleteUsername] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const deleteAccount = () => {
    fetch(mainUrl + "/deleteAccount", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: deleteUsername, password: deletePassword })
    })
    .then(response => response.json())
    .then(data => {
      alert("Account deleted: " + data.message);
    })
    .catch(error => {
      console.error("Delete account error:", error);
      alert("Failed to delete account: " + error.message);
    });
  };  

  const register = () => {
    fetch(mainUrl + "/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailAddress: registerEmail, password: registerPassword })
    })
    .then(response => response.json())
    .then(data => {
      alert("Registration successful: " + data.message);
    })
    .catch(error => {
      console.error("Registration error:", error);
      alert("Registration failed: " + error.message);
    });
  };

  const login = () => {
    fetch(mainUrl + "/logInNow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password: password })
    })
    .then(response => response.json())
    .then(data => {
      if (data.token) {
        setJwt(data.token);
        alert("Login successful!");
      } else {
        alert("Login Failed: " + data.error);
      }
    })
    .catch(error => console.log("Error", error));
  };

  const readMessage = () => {
    if (jwt) {
      fetch(mainUrl + "/readMessages", {
        method: "GET",
        headers: { "Authorization": `Bearer ${jwt}` }
      })
      .then(response => response.json())
      .then(data => setMessages(data))
      .catch(error => console.log("Error", error));
    } else {
      alert("You are not authorized");
    }
  };

  const writeMessage = () => {
    if (jwt) {
      fetch(mainUrl + "/writeMessages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${jwt}` },
        body: JSON.stringify({ content: newMessage })
      })
      .then(response => response.json())
      .then(data => {
        alert("Message Saved: " + data.status);
        setNewMessage('');
      })
      .catch(error => console.log("Error", error));
    } else {
      alert("You are not authorized");
    }
  };

  return (
    <div>
      <h1>Register here</h1>
      <input 
        type="text" 
        placeholder="Use your email" 
        value={registerEmail} 
        onChange={(e) => setRegisterEmail(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Choose your password" 
        value={registerPassword} 
        onChange={(e) => setRegisterPassword(e.target.value)} 
      />
      <button onClick={register}>Register</button>

      <h1>Log In here</h1>
      <input 
        type="text" 
        placeholder="User Name" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button onClick={login}>Log In</button>

      <h1>Delete your account here</h1>
      <input 
        type="text" 
        placeholder="Delete with your username" 
        value={deleteUsername} 
        onChange={(e) => setDeleteUsername(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Delete with your password" 
        value={deletePassword} 
        onChange={(e) => setDeletePassword(e.target.value)} 
      />
      <button onClick={deleteAccount}>Delete Account</button>

      <h1>You can only access these features once you're logged in</h1>
      <button onClick={readMessage}>Read Message</button>
      <input 
        type="text" 
        placeholder="Write new notes" 
        value={newMessage} 
        onChange={(e) => setNewMessage(e.target.value)} 
      />
      <button onClick={writeMessage}>Save</button>

      <div id="messages">
        {messages.length > 0 ? messages.map((message, index) => (
          <p key={index}>{message}</p>
        )) : <p>Your message will be shown here once you're logged in and have access to the features.</p>}
      </div>
    </div>
  );
}

export default App;
