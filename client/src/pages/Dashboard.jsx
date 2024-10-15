import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Row, Col, Card, Button, Dropdown, Form, Modal,
} from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../images/logo.svg';
import { formatDistanceToNow } from 'date-fns';

const Dashboard = () => {
  const [editingCardId, setEditingCardId] = useState(null);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newPresentationName, setNewPresentationName] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [presentations, setPresentations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [sortCriteria, setSortCriteria] = useState('last_updated_date');
  const [thumbnail, setThumbnail] = useState(null);

  // Fetch presentations from the API when the component mounts
  useEffect(() => {
    const fetchPresentations = async () => {
      try {
        const res = await axios.get('http://localhost:8080/presentations');
        setPresentations(res.data);
      } catch (error) {
        setError(error.response ? error.response.data.message : error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPresentations();
  }, []);

  // Function to sort presentations based on the chosen criteria
  const sortPresentations = (presentationsList) => {
    return [...presentationsList].sort((a, b) => {
      switch (sortCriteria) {
        case 'presentation_name':
          return a.presentation_name.localeCompare(b.presentation_name);
        case 'created_by_name':
          return a.created_by_name.localeCompare(b.created_by_name);
        case 'last_updated_date':
        default:
          return new Date(b.last_updated_date) - new Date(a.last_updated_date);
      }
    });
  };

  // Function to handle creating a new presentation
  const handleCreatePresentation = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('presentation_name', newPresentationName);
    formData.append('created_by_name', 'Current User');
    if (thumbnail) formData.append('thumbnail_image', thumbnail);

    try {
      const res = await axios.post('http://localhost:8080/presentations', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPresentations((prev) => [...prev, res.data]);
      handleCloseModal();
    } catch (error) {
      console.error('Error creating presentation:', error);
    }
  };

  // Function to handle saving a renamed presentation
  const handleSaveRename = async (id) => {
    try {
      const currentTimestamp = new Date().toISOString();
      await axios.put(`http://localhost:8080/presentations/${id}`, {
        presentation_name: newTitle,
        last_updated_date: currentTimestamp,
      });

      // Update the presentation list with the new title and timestamp
      setPresentations((prev) =>
        prev.map((presentation) =>
          presentation.id === id
            ? { ...presentation, presentation_name: newTitle, last_updated_date: currentTimestamp }
            : presentation
        )
      );
      setEditingCardId(null); // Exit editing mode after saving
    } catch (error) {
      console.error('Error renaming presentation:', error);
    }
  };

  // Function to handle deleting a presentation
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/presentations/${id}`);
      setPresentations((prev) => prev.filter((presentation) => presentation.id !== id)); // Update state to remove the deleted presentation
    } catch (error) {
      console.error('Error deleting presentation:', error);
    }
  };

  // Function to open the modal for creating a new presentation
  const handleOpenModal = () => setShowModal(true);

  // Function to close the modal and reset form input fields
  const handleCloseModal = () => {
    setShowModal(false);
    setNewPresentationName('');
    setThumbnail(null);
  };

  // Function to enter rename mode for a specific presentation
  const handleRenameClick = (presentationId, currentTitle) => {
    setEditingCardId(presentationId);
    setNewTitle(currentTitle);
  };

  // Function to calculate the time difference between the current time and the 'last updated' time
  const calculateTimeDifference = (date) => formatDistanceToNow(new Date(date), { addSuffix: true });

  const renderPresentationCard = (presentation) => (
    <Col md={4} lg={2} key={presentation.id} className="mb-4">
      <Card className={`presentation-card ${dropdownOpen ? 'dropdown-open' : ''}`}>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center">
            {editingCardId === presentation.id ? (
              <Form.Group className="flex-grow-1 me-2">
                <Form.Control
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <Button className="mt-2" onClick={() => handleSaveRename(presentation.id)}>
                  Save
                </Button>
              </Form.Group>
            ) : (
              <Card.Title className="flex-grow-1">{presentation.presentation_name}</Card.Title>
            )}

          <Dropdown
            align="end"
            className="ms-2"
            onToggle={(isOpen) => setDropdownOpen(isOpen)}
          >
            <Dropdown.Toggle variant="link" bsPrefix="toggle-no-caret">
              <i className="fa-solid fa-ellipsis" style={{ color: 'black' }}></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleRenameClick(presentation.id, presentation.presentation_name)}>
                <i className="fa-solid fa-pencil"></i> Rename
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleDelete(presentation.id)}>
                <i className="fa-solid fa-trash"></i> Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          </div>
          <Card.Text style={{ color: '#888', fontSize: '12px' }}>
            Last update: {calculateTimeDifference(presentation.last_updated_date)}
          </Card.Text>
          <Card.Img
            variant="top"
            src={`http://localhost:8080/uploads/${presentation.thumbnail_image}`}
            alt={presentation.presentation_name}
            style={{ height: '150px', objectFit: 'cover' }}
          />
          <Card.Text style={{ color: '#888', textAlign: 'right', fontSize: '12px' }}>
            by {presentation.created_by_name}
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Navbar expand="lg">
        <Navbar.Brand href="#home">
          <img src={logo} alt="Decktopus Logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto position-relative">
            <div className="circle-icon">
              <i className="fa-solid fa-circle" style={{ fontSize: '35px' }}></i>
              <span className="icon-text">M</span>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Container fluid>
        <Row className="my-3">
          <Col md={4} lg={2}>
            <Card className="create-card" onClick={handleOpenModal}>
              <Card.Body>
                <div className="card-create">
                  <i className="fa-solid fa-square-plus"></i>
                  <Card.Title>Create a new presentation</Card.Title>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} lg={2}>
            <Card
              className="create-card"
              style={{
                background: 'linear-gradient(45deg, rgba(0,212,255,1) 0%, rgba(255,0,255,1) 100%)',
              }}
            >
              <Card.Body>
                <div className="card-ai">
                  <span><i className="fa-solid fa-wand-magic-sparkles"></i>Create with AI</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="my-4">
          <Col>
            <h5>Decks</h5>
            <p>{presentations.length} files</p>
          </Col>
          <Col className="text-end">
            <Dropdown onSelect={(eventKey) => setSortCriteria(eventKey)}>
              <Dropdown.Toggle variant="link" className="sort-btn">
                <i className="fa-solid fa-arrow-down-wide-short"></i> Sort by
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="presentation_name">Name</Dropdown.Item>
                <Dropdown.Item eventKey="last_updated_date">Last Updated</Dropdown.Item>
                <Dropdown.Item eventKey="created_by_name">Creator</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>

        <Row>
          {sortPresentations(presentations).map(renderPresentationCard)}
        </Row>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Create New Presentation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleCreatePresentation}>
              <Form.Group className="mb-3">
                <Form.Label>Presentation Name</Form.Label>
                <Form.Control
                  type="text"
                  value={newPresentationName}
                  onChange={(e) => setNewPresentationName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Thumbnail Image</Form.Label>
                <Form.Control type="file" onChange={(e) => setThumbnail(e.target.files[0])} />
              </Form.Group>
              <Button variant="primary" type="submit">
                Create Presentation
              </Button>
              <Button variant="secondary" onClick={handleCloseModal} className="ms-2">
                Cancel
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
};

export default Dashboard;
