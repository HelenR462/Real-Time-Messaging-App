import React from "react";

function ChatCard({ users = [] }) {
  // console.log("Users data:", users); 

  return (
    <div>
      <div className='card'>
        <div className='card-body'>
          <ul className='side-bar'>
            {Array.isArray(users) && users.length > 0 ? (
              users.map((user) => (
                <li key={user.user_id}>
                  <img src={user.image_url} alt={user.username} />
                  <h6>{user.username}</h6>
                </li>
              ))
            ) : (
              <p>No users available.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ChatCard;
