const request = require('supertest');
const app = require('../app'); // Adjust the path to your Express app
const Presentation = require('../models/presentationModel');
const { sequelize } = require('../models'); 

jest.mock('../models/presentationModel'); // Mock the presentation model


beforeAll(async () => {
    await sequelize.authenticate(); // Ensure connection is established
    console.log('Database connected and tables created');
  });
  
  afterAll(async () => {
    await sequelize.close(); // Close the database connection
  });

describe('Presentation API', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock data before each test
  });

  test('GET /presentations should list all presentations', async () => {
    const presentations = [{ id: 1, presentation_name: 'Test Presentation' }];
    Presentation.findAll.mockResolvedValue(presentations);

    const response = await request(app).get('/presentations');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(presentations);
    expect(Presentation.findAll).toHaveBeenCalledTimes(1);
  });

  test('GET /presentations should handle errors', async () => {
    Presentation.findAll.mockRejectedValue(new Error('Database error'));

    const response = await request(app).get('/presentations');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Database error' });
  });

  test('POST /presentations should create a new presentation', async () => {
    const newPresentation = { id: 2, presentation_name: 'New Presentation', created_by_name: 'User', thumbnail_image: null };
    Presentation.create.mockResolvedValue(newPresentation);

    const response = await request(app)
      .post('/presentations')
      .send({ presentation_name: 'New Presentation', created_by_name: 'User' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(newPresentation);
    expect(Presentation.create).toHaveBeenCalledWith({
      presentation_name: 'New Presentation',
      created_by_name: 'User',
      thumbnail_image: null
    });
  });

  test('POST /presentations should handle errors when creating a presentation', async () => {
    Presentation.create.mockRejectedValue(new Error('Failed to create presentation'));

    const response = await request(app)
      .post('/presentations')
      .send({ presentation_name: 'New Presentation', created_by_name: 'User' });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Failed to create presentation' });
  });

  test('PUT /presentations/:id should rename the presentation', async () => {
    const id = 1;
    const updatedPresentation = { id, presentation_name: 'Updated Presentation' };
    Presentation.findByPk.mockResolvedValue(updatedPresentation);
    Presentation.prototype.save = jest.fn();

    const response = await request(app)
      .put(`/presentations/${id}`)
      .send({ presentation_name: 'Updated Presentation' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(updatedPresentation);
    expect(Presentation.findByPk).toHaveBeenCalledWith(id);
    expect(Presentation.prototype.save).toHaveBeenCalled();
  });

  test('PUT /presentations/:id should return 404 if presentation not found', async () => {
    const id = 1;
    Presentation.findByPk.mockResolvedValue(null); // No presentation found

    const response = await request(app).put(`/presentations/${id}`).send({ presentation_name: 'Updated Presentation' });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Presentation not found' });
  });

  test('PUT /presentations/:id should handle errors when renaming', async () => {
    const id = 1;
    const errorMessage = 'Error while saving';
    const existingPresentation = { id, presentation_name: 'Old Name', save: jest.fn().mockRejectedValue(new Error(errorMessage)) };
    Presentation.findByPk.mockResolvedValue(existingPresentation);

    const response = await request(app).put(`/presentations/${id}`).send({ presentation_name: 'Updated Presentation' });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: errorMessage });
  });

  test('DELETE /presentations/:id should delete a presentation', async () => {
    const id = 1;
    const existingPresentation = { id, thumbnail: 'thumbnail.jpg', destroy: jest.fn() };
    Presentation.findByPk.mockResolvedValue(existingPresentation);
    
    const response = await request(app).delete(`/presentations/${id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Presentation deleted successfully' });
    expect(Presentation.findByPk).toHaveBeenCalledWith(id);
    expect(existingPresentation.destroy).toHaveBeenCalled();
  });

  test('DELETE /presentations/:id should return 404 if presentation not found', async () => {
    const id = 1;
    Presentation.findByPk.mockResolvedValue(null); // No presentation found

    const response = await request(app).delete(`/presentations/${id}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Presentation not found' });
  });

  test('DELETE /presentations/:id should handle errors when deleting', async () => {
    const id = 1;
    const existingPresentation = { id, thumbnail: 'thumbnail.jpg', destroy: jest.fn().mockRejectedValue(new Error('Deletion error')) };
    Presentation.findByPk.mockResolvedValue(existingPresentation);
    
    const response = await request(app).delete(`/presentations/${id}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Deletion error' });
  });
});