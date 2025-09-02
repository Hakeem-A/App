from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash
from models import User, ActivityLog
from app import db
from datetime import datetime

users_bp = Blueprint('users', __name__)

@users_bp.route('/', methods=['GET'])
@jwt_required()
def get_users():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if user.role != 'admin':
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        users = User.query.all()
        return jsonify({'users': [user.to_dict() for user in users]}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@users_bp.route('/', methods=['POST'])
@jwt_required()
def create_user():
    try:
        user_id = get_jwt_identity()
        current_user = User.query.get(user_id)
        
        if current_user.role != 'admin':
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        data = request.get_json()
        
        required_fields = ['name', 'email', 'password', 'role']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Check if email already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already exists'}), 400
        
        user = User(
            name=data['name'],
            email=data['email'],
            password_hash=generate_password_hash(data['password']),
            role=data['role'],
            status=data.get('status', 'active')
        )
        
        db.session.add(user)
        db.session.commit()
        
        # Log activity
        activity = ActivityLog(
            user_id=user_id,
            action='Created user',
            target_type='user',
            target_id=user.id,
            details=f'Created user: {user.name} ({user.role})'
        )
        db.session.add(activity)
        db.session.commit()
        
        return jsonify({'user': user.to_dict()}), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@users_bp.route('/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        if current_user.role != 'admin':
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Check if email already exists (excluding current user)
        if 'email' in data:
            existing_user = User.query.filter_by(email=data['email']).filter(User.id != user_id).first()
            if existing_user:
                return jsonify({'error': 'Email already exists'}), 400
        
        # Update fields
        if 'name' in data:
            user.name = data['name']
        if 'email' in data:
            user.email = data['email']
        if 'role' in data:
            user.role = data['role']
        if 'status' in data:
            user.status = data['status']
        if 'password' in data and data['password']:
            user.password_hash = generate_password_hash(data['password'])
        
        user.updated_at = datetime.utcnow()
        db.session.commit()
        
        # Log activity
        activity = ActivityLog(
            user_id=current_user_id,
            action='Updated user',
            target_type='user',
            target_id=user.id,
            details=f'Updated user: {user.name}'
        )
        db.session.add(activity)
        db.session.commit()
        
        return jsonify({'user': user.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@users_bp.route('/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        if current_user.role != 'admin':
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        if current_user_id == user_id:
            return jsonify({'error': 'Cannot delete your own account'}), 400
        
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Log activity before deletion
        activity = ActivityLog(
            user_id=current_user_id,
            action='Deleted user',
            target_type='user',
            target_id=user.id,
            details=f'Deleted user: {user.name} ({user.role})'
        )
        db.session.add(activity)
        
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({'message': 'User deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@users_bp.route('/technicians', methods=['GET'])
@jwt_required()
def get_technicians():
    try:
        technicians = User.query.filter_by(role='technician', status='active').all()
        return jsonify({'technicians': [tech.to_dict() for tech in technicians]}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500