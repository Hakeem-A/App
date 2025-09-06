from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)

# Configure CORS to allow React frontend
CORS(
    app,
    resources={r"/api/*": {"origins": "http://localhost:3000"}},
    supports_credentials=True,
    methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"]
)

# Handle preflight requests explicitly (important for JWT-protected routes)
@app.before_request
def handle_options():
    if request.method == "OPTIONS":
        return "", 200

# Import models after db initialization
from models import User, Client, Ticket, Router, Site, ActivityLog, TicketComment

# Import routes
from routes.auth import auth_bp
from routes.tickets import tickets_bp
from routes.clients import clients_bp
from routes.users import users_bp
from routes.sites import sites_bp
from routes.routers import routers_bp
from routes.analytics import analytics_bp

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(tickets_bp, url_prefix='/api/tickets')
app.register_blueprint(clients_bp, url_prefix='/api/clients')
app.register_blueprint(users_bp, url_prefix='/api/users')
app.register_blueprint(sites_bp, url_prefix='/api/sites')
app.register_blueprint(routers_bp, url_prefix='/api/routers')
app.register_blueprint(analytics_bp, url_prefix='/api/analytics')

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.utcnow().isoformat()})

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'error': 'Internal server error'}), 500
