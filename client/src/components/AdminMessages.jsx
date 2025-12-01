import { useState, useEffect } from "react";
import axios from "axios";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const getAllMessages = async () => {
      
      try {
        const res = await axios.get("http://localhost:5000/api/contact");
        setMessages(res.data); 
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      getAllMessages();
    }
  }, []);

  return (
    <div className="w-100 p-4">
      <h2 className="mb-4">Admin Messages</h2>

      {loading ? (
        <p>Loading messages...</p>
      ) : messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <div className="list-group">
          {messages.map((msg) => (
            <div key={msg._id} className="list-group-item">
              <h5 className="mb-1">{msg.name} ({msg.email})</h5>
              <p className="mb-1">{msg.message}</p>
              <small className="text-muted">
                Sent on: {new Date(msg.createdAt).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
