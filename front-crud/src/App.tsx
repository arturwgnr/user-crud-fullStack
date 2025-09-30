import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/users");
      const data = await res.json();
      setUsers(data);
    } catch {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email) return;

    try {
      await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      setName("");
      setEmail("");
      fetchUsers();
    } catch {
      setError("Failed to create user");
    }
  }

  return (
    <div className="container">
      <h1>Users</h1>

      <form onSubmit={createUser} className="form">
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">+ Add</button>
      </form>

      {loading && <p className="status">Loading...</p>}
      {error && <p className="status error">{error}</p>}

      <div className="users">
        {users.map((u) => (
          <div key={u.id} className="card">
            <h3>{u.name}</h3>
            <p>{u.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
