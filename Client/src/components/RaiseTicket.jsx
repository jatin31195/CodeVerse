import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Helper to reliably extract a user ID from a user object
const getUserId = (user) => {
  if (!user) return "";
  if (typeof user === "string") return user;
  if (user._id) return user._id.toString();
  if (user.$oid) return user.$oid.toString();
  return "";
};

const RaiseTicket = () => {
  // States for questions
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState('');

  // States for tickets
  const [myTickets, setMyTickets] = useState([]);       // Tickets raised by current user
  const [otherTickets, setOtherTickets] = useState([]);   // Tickets raised by others

  // Additional states
  const [ticketRaised, setTicketRaised] = useState(false);
  const [solutionText, setSolutionText] = useState('');
  const [currentTicket, setCurrentTicket] = useState(null);

  // Current user ID (stored in sessionStorage by your auth logic)
  const currentUserId = sessionStorage.getItem('userId');

  // Retrieve token from sessionStorage and add it to headers
  const getAuthConfig = () => {
    const token = sessionStorage.getItem('token');
    return {
      headers: {
        Authorization: token,
      },
    };
  };

  // Fetch questions and tickets on component mount
  useEffect(() => {
    fetchQuestions();
    fetchMyTickets();
    fetchOtherTickets();
  }, []);

  // Filter questions by search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredQuestions(questions);
    } else {
      const filtered = questions.filter((q) =>
        q.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredQuestions(filtered);
    }
  }, [searchTerm, questions]);

  // ---- BACKEND CALLS ----

  const fetchQuestions = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/questions', getAuthConfig());
      let fetchedQuestions = [];
      if (Array.isArray(res.data)) {
        fetchedQuestions = res.data;
      } else if (res.data.questions) {
        fetchedQuestions = res.data.questions;
      }
      setQuestions(fetchedQuestions);
      setFilteredQuestions(fetchedQuestions);
    } catch (err) {
      console.error('Error fetching questions:', err);
    }
  };

  // Fetch tickets raised by the current user
  const fetchMyTickets = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/ticket-Raise/my', getAuthConfig());
      let myTix = [];
      if (Array.isArray(res.data.tickets)) {
        myTix = res.data.tickets;
      } else if (res.data.tickets) {
        myTix = res.data.tickets;
      }
      console.log('Fetched My Tickets:', myTix);
      setMyTickets(myTix);
    } catch (err) {
      console.error('Error fetching my tickets:', err);
    }
  };

  // Fetch tickets raised by others
  const fetchOtherTickets = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/ticket-Raise', getAuthConfig());
      let tickets = [];
      if (Array.isArray(res.data)) {
        tickets = res.data;
      } else if (res.data.tickets) {
        tickets = res.data.tickets;
      }
      // Filter out tickets raised by the current user
      const otherTix = tickets.filter((t) => getUserId(t.raisedBy) !== currentUserId);
      console.log('Fetched Other Tickets:', otherTix);
      setOtherTickets(otherTix);
    } catch (err) {
      console.error('Error fetching other tickets:', err);
    }
  };

  const refreshTickets = async () => {
    await fetchMyTickets();
    await fetchOtherTickets();
  };

  // Raise a new ticket for the selected question
  const handleRaiseTicket = async (e) => {
    e.preventDefault();
    if (!selectedQuestion) {
      alert('Please select a question.');
      return;
    }
    try {
      await axios.post(
        'http://localhost:8080/api/ticket-Raise/raise',
        { questionIdentifier: selectedQuestion },
        getAuthConfig()
      );
      setTicketRaised(true);
      alert('Ticket raised successfully');
      refreshTickets();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error raising ticket');
    }
  };

  // For non-raisers: provide a text solution
  const handleProvideTextSolution = async (ticketId) => {
    if (!solutionText) {
      alert('Enter a solution text');
      return;
    }
    try {
      await axios.post(
        `http://localhost:8080/api/ticket-Raise/${ticketId}/solution`,
        { solutionText },
        getAuthConfig()
      );
      alert('Solution submitted successfully');
      setSolutionText('');
      setCurrentTicket(null);
      refreshTickets();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error submitting solution');
    }
  };

  // For non-raisers: request a video meet
  const handleRequestVideoMeet = async (ticketId) => {
    try {
      await axios.post(
        `http://localhost:8080/api/ticket-Raise/${ticketId}/request-video`,
        {},
        getAuthConfig()
      );
      alert('Video meet request sent');
      refreshTickets();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error requesting video meet');
    }
  };

  // For raisers: accept solution and then immediately close the ticket
  const handleAcceptAndCloseTicket = async (ticketId, solutionId) => {
    try {
      await axios.post(
        'http://localhost:8080/api/ticket-Raise/accept-solution',
        { ticketId, solutionId },
        getAuthConfig()
      );
      // Immediately close the ticket after accepting the solution
      await axios.put(
        `http://localhost:8080/api/ticket-Raise/${ticketId}/close`,
        {},
        getAuthConfig()
      );
      alert('Ticket closed successfully.');
      refreshTickets();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error processing ticket');
    }
  };

  // ---- RENDER HELPERS ----

  // Render for tickets raised by the current user
  const renderMyTicketCard = (ticket) => {
    return (
      <div key={ticket._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
        <p>
          <strong>Question:</strong> {ticket.questionId.title || ticket.questionId}
        </p>
        <p>
          <strong>Status:</strong> {ticket.status}
        </p>
        <div>
          <h4>Solutions:</h4>
          {ticket.solutions && ticket.solutions.length > 0 ? (
            ticket.solutions.map((solution) => (
              <div key={solution._id} style={{ border: '1px dashed #ccc', padding: '5px', marginBottom: '5px' }}>
                <p>{solution.text}</p>
                <p>Provided By: {solution.providedBy.username || getUserId(solution.providedBy)}</p>
                {solution.accepted ? (
                  <p style={{ color: 'green' }}>Accepted</p>
                ) : (
                  // Show one OK button to accept and close the ticket
                  ticket.status === 'open' && (
                    <button onClick={() => handleAcceptAndCloseTicket(ticket._id, solution._id)}>
                      OK
                    </button>
                  )
                )}
              </div>
            ))
          ) : (
            <p>No solutions submitted yet.</p>
          )}
        </div>
      </div>
    );
  };

  // Render for tickets raised by others
  const renderOtherTicketCard = (ticket) => {
    return (
      <div key={ticket._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
        <p>
          <strong>Question:</strong> {ticket.questionId.title || ticket.questionId}
        </p>
        <p>
          <strong>Raised By:</strong> {ticket.raisedBy.username || getUserId(ticket.raisedBy)}
        </p>
        <p>
          <strong>Status:</strong> {ticket.status}
        </p>
        <div>
          <h4>Solutions:</h4>
          {ticket.solutions && ticket.solutions.length > 0 ? (
            ticket.solutions.map((solution) => (
              <div key={solution._id} style={{ border: '1px dashed #ccc', padding: '5px', marginBottom: '5px' }}>
                <p>{solution.text}</p>
                <p>Provided By: {solution.providedBy.username || getUserId(solution.providedBy)}</p>
                {solution.accepted && <p style={{ color: 'green' }}>Accepted</p>}
              </div>
            ))
          ) : (
            <p>No solutions submitted yet.</p>
          )}
        </div>
        {ticket.status === 'open' && (
          <>
            <button onClick={() => setCurrentTicket(ticket)}>Provide Text Solution</button>
            {currentTicket && currentTicket._id === ticket._id && (
              <div>
                <textarea
                  placeholder="Enter text solution"
                  value={solutionText}
                  onChange={(e) => setSolutionText(e.target.value)}
                ></textarea>
                <button onClick={() => handleProvideTextSolution(ticket._id)}>
                  Submit Solution
                </button>
              </div>
            )}
            <button onClick={() => handleRequestVideoMeet(ticket._id)}>
              Request Video Meet
            </button>
          </>
        )}
        {ticket.videoMeetRequest && ticket.videoMeetRequest.status === 'accepted' && (
          <p>
            <strong>Video Meet Link:</strong>{' '}
            <a href={ticket.videoMeetLink} target="_blank" rel="noopener noreferrer">
              {ticket.videoMeetLink}
            </a>
          </p>
        )}
      </div>
    );
  };

  // ---- MAIN RENDER ----
  return (
    <div>
      <h2>Raise Ticket</h2>
      {!ticketRaised ? (
        <form onSubmit={handleRaiseTicket}>
          <div>
            <label>Search Question: </label>
            <input
              type="text"
              placeholder="Search question by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label>Select Question: </label>
            <select
              value={selectedQuestion}
              onChange={(e) => setSelectedQuestion(e.target.value)}
            >
              <option value="">--Select a Question--</option>
              {filteredQuestions && filteredQuestions.length > 0 ? (
                filteredQuestions.map((q) => (
                  <option key={q._id} value={q._id}>
                    {q.title}
                  </option>
                ))
              ) : (
                <option disabled>No questions found</option>
              )}
            </select>
          </div>
          <button type="submit">Raise Ticket</button>
        </form>
      ) : (
        <p>You have already raised a ticket.</p>
      )}

      <hr />

      <h2>My Tickets</h2>
      {myTickets && myTickets.length > 0 ? (
        myTickets.map((ticket) => renderMyTicketCard(ticket))
      ) : (
        <p>No tickets raised by you.</p>
      )}

      <hr />

      <h2>Other Tickets</h2>
      {otherTickets && otherTickets.length > 0 ? (
        otherTickets.map((ticket) => renderOtherTicketCard(ticket))
      ) : (
        <p>No tickets available.</p>
      )}
    </div>
  );
};

export default RaiseTicket;
