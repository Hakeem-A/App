from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Client, User, ActivityLog
from app import db

clients_bp = Blueprint('clients', __name__)

@clients_bp.route('/', methods=['GET'])
@jwt_required()
def get_clients():
    try:
        clients = Client.query.all()
        return jsonify({'clients': [client.to_dict() for client in clients]}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@clients_bp.route('/', methods=['POST'])
@jwt_required()
def create_client():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        required_fields = ['name', 'email', 'phone', 'address']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Check if email already exists
        if Client.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already exists'}), 400
        
        client = Client(
            name=data['name'],
            email=data['email'],
            phone=data['phone'],
            address=data['address'],
            status=data.get('status', 'active')
        )
        
        db.session.add(client)
        db.session.commit()
        
        # Log activity
        activity = ActivityLog(
            user_id=user_id,
            action='Created client',
            target_type='client',
            target_id=client.id,
            details=f'Created client: {client.name}'
        )
        db.session.add(activity)
        db.session.commit()
        
        return jsonify({'client': client.to_dict()}), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@clients_bp.route('/<int:client_id>', methods=['GET'])
@jwt_required()
def get_client(client_id):
    try:
        client = Client.query.get(client_id)
        
        if not client:
            return jsonify({'error': 'Client not found'}), 404
        
        return jsonify({'client': client.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@clients_bp.route('/<int:client_id>', methods=['PUT'])
@jwt_required()
def update_client(client_id):
    try:
        user_id = get_jwt_identity()
        client = Client.query.get(client_id)
        
        if not client:
            return jsonify({'error': 'Client not found'}), 404
        
        data = request.get_json()
        
        # Check if email already exists (excluding current client)
        if 'email' in data:
            existing_client = Client.query.filter_by(email=data['email']).filter(Client.id != client_id).first()
            if existing_client:
                return jsonify({'error': 'Email already exists'}), 400
        
        # Update fields
        if 'name' in data:
            client.name = data['name']
        if 'email' in data:
            client.email = data['email']
        if 'phone' in data:
            client.phone = data['phone']
        if 'address' in data:
            client.address = data['address']
        if 'status' in data:
            client.status = data['status']
        
        client.updated_at = datetime.utcnow()
        db.session.commit()
        
        # Log activity
        activity = ActivityLog(
            user_id=user_id,
            action='Updated client',
            target_type='client',
            target_id=client.id,
            details=f'Updated client: {client.name}'
        )
        db.session.add(activity)
        db.session.commit()
        
        return jsonify({'client': client.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@clients_bp.route('/<int:client_id>', methods=['DELETE'])
@jwt_required()
def delete_client(client_id):
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if user.role not in ['admin', 'agent']:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        client = Client.query.get(client_id)
        
        if not client:
            return jsonify({'error': 'Client not found'}), 404
        
        # Check if client has active tickets
        if client.tickets:
            return jsonify({'error': 'Cannot delete client with active tickets'}), 400
        
        # Log activity before deletion
        activity = ActivityLog(
            user_id=user_id,
            action='Deleted client',
            target_type='client',
            target_id=client.id,
            details=f'Deleted client: {client.name}'
        )
        db.session.add(activity)
        
        db.session.delete(client)
        db.session.commit()
        
        return jsonify({'message': 'Client deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500