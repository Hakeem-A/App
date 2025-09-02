# Customer Care Backend API

A Flask-based REST API for the Customer Care Application.

## Features

- JWT-based authentication
- Role-based access control (Admin, Agent, Technician)
- Complete CRUD operations for all entities
- Activity logging and audit trails
- CSV export functionality
- Analytics and reporting

## Quick Start

### Prerequisites
- Python 3.8+
- pip

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Run the application:
```bash
python run.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Tickets
- `GET /api/tickets/` - Get all tickets
- `POST /api/tickets/` - Create new ticket
- `GET /api/tickets/<id>` - Get specific ticket
- `PUT /api/tickets/<id>` - Update ticket
- `DELETE /api/tickets/<id>` - Delete ticket
- `POST /api/tickets/<id>/comments` - Add comment to ticket

### Clients
- `GET /api/clients/` - Get all clients
- `POST /api/clients/` - Create new client
- `GET /api/clients/<id>` - Get specific client
- `PUT /api/clients/<id>` - Update client
- `DELETE /api/clients/<id>` - Delete client

### Users (Admin only)
- `GET /api/users/` - Get all users
- `POST /api/users/` - Create new user
- `PUT /api/users/<id>` - Update user
- `DELETE /api/users/<id>` - Delete user
- `GET /api/users/technicians` - Get all technicians

### Sites
- `GET /api/sites/` - Get all sites
- `POST /api/sites/` - Create new site
- `PUT /api/sites/<id>` - Update site
- `DELETE /api/sites/<id>` - Delete site

### Routers
- `GET /api/routers/` - Get all routers
- `POST /api/routers/` - Create new router
- `PUT /api/routers/<id>` - Update router
- `DELETE /api/routers/<id>` - Delete router
- `PUT /api/routers/<id>/status` - Update router status

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard analytics
- `GET /api/analytics/reports/csv` - Export CSV reports
- `GET /api/analytics/performance` - Get performance metrics

## Default Users

The system comes with these default users:

- **Admin**: admin@company.com / admin123
- **Agent**: sarah.johnson@company.com / agent123
- **Technician**: mike.wilson@company.com / tech123

## Database Schema

The application uses SQLite by default with the following models:
- Users (authentication and roles)
- Clients (customer information)
- Tickets (support requests)
- Routers (network equipment)
- Sites (geographic locations)
- Activity Logs (audit trail)
- Ticket Comments (communication history)

## Security

- Passwords are hashed using Werkzeug
- JWT tokens for authentication
- Role-based access control
- Input validation and sanitization
- Activity logging for audit trails

## Development

To reset the database with fresh seed data:
```bash
python utils/seed_data.py
```

## Production Deployment

1. Set environment variables in production
2. Use a production WSGI server like Gunicorn
3. Configure a production database (PostgreSQL recommended)
4. Set up proper logging and monitoring