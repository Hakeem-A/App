from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import os
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app)

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

@app.before_first_request
def create_tables():
    db.create_all()
    
    # Create default admin user if none exists
    if not User.query.filter_by(email='admin@company.com').first():
        admin_user = User(
            name='Admin User',
            email='admin@company.com',
            password_hash=generate_password_hash('admin123'),
            role='admin',
            status='active'
        )
        db.session.add(admin_user)
        db.session.commit()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.utcnow().isoformat()})

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)