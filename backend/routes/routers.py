from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Router, User, Client, ActivityLog
from app import db
from datetime import datetime

routers_bp = Blueprint('routers', __name__)

@routers_bp.route('/', methods=['GET'])
@jwt_required()
def get_routers():
    try:
        routers = Router.query.all()
        return jsonify({'routers': [router.to_dict() for router in routers]}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@routers_bp.route('/', methods=['POST'])
@jwt_required()
def create_router():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        required_fields = ['model', 'serial_number', 'client_id']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Check if serial number already exists
        if Router.query.filter_by(serial_number=data['serial_number']).first():
            return jsonify({'error': 'Serial number already exists'}), 400
        
        # Verify client exists
        client = Client.query.get(data['client_id'])
        if not client:
            return jsonify({'error': 'Client not found'}), 404
        
        router = Router(
            model=data['model'],
            serial_number=data['serial_number'],
            status=data.get('status', 'offline'),
            client_id=data['client_id'],
            location=data.get('location', '')
        )
        
        db.session.add(router)
        db.session.commit()
        
        # Log activity
        activity = ActivityLog(
            user_id=user_id,
            action='Created router',
            target_type='router',
            target_id=router.id,
            details=f'Created router: {router.model} ({router.serial_number})'
        )
        db.session.add(activity)
        db.session.commit()
        
        return jsonify({'router': router.to_dict()}), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@routers_bp.route('/<int:router_id>', methods=['PUT'])
@jwt_required()
def update_router(router_id):
    try:
        user_id = get_jwt_identity()
        router = Router.query.get(router_id)
        
        if not router:
            return jsonify({'error': 'Router not found'}), 404
        
        data = request.get_json()
        
        # Check if serial number already exists (excluding current router)
        if 'serial_number' in data:
            existing_router = Router.query.filter_by(serial_number=data['serial_number']).filter(Router.id != router_id).first()
            if existing_router:
                return jsonify({'error': 'Serial number already exists'}), 400
        
        # Update fields
        if 'model' in data:
            router.model = data['model']
        if 'serial_number' in data:
            router.serial_number = data['serial_number']
        if 'status' in data:
            router.status = data['status']
            router.last_seen = datetime.utcnow()
        if 'client_id' in data:
            # Verify client exists
            client = Client.query.get(data['client_id'])
            if not client:
                return jsonify({'error': 'Client not found'}), 404
            router.client_id = data['client_id']
        if 'location' in data:
            router.location = data['location']
        
        router.updated_at = datetime.utcnow()
        db.session.commit()
        
        # Log activity
        activity = ActivityLog(
            user_id=user_id,
            action='Updated router',
            target_type='router',
            target_id=router.id,
            details=f'Updated router: {router.model} ({router.serial_number})'
        )
        db.session.add(activity)
        db.session.commit()
        
        return jsonify({'router': router.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@routers_bp.route('/<int:router_id>', methods=['DELETE'])
@jwt_required()
def delete_router(router_id):
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if user.role not in ['admin', 'agent']:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        router = Router.query.get(router_id)
        
        if not router:
            return jsonify({'error': 'Router not found'}), 404
        
        # Log activity before deletion
        activity = ActivityLog(
            user_id=user_id,
            action='Deleted router',
            target_type='router',
            target_id=router.id,
            details=f'Deleted router: {router.model} ({router.serial_number})'
        )
        db.session.add(activity)
        
        db.session.delete(router)
        db.session.commit()
        
        return jsonify({'message': 'Router deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@routers_bp.route('/<int:router_id>/status', methods=['PUT'])
@jwt_required()
def update_router_status(router_id):
    try:
        user_id = get_jwt_identity()
        router = Router.query.get(router_id)
        
        if not router:
            return jsonify({'error': 'Router not found'}), 404
        
        data = request.get_json()
        status = data.get('status')
        
        if not status:
            return jsonify({'error': 'Status is required'}), 400
        
        router.status = status
        router.last_seen = datetime.utcnow()
        router.updated_at = datetime.utcnow()
        db.session.commit()
        
        # Log activity
        activity = ActivityLog(
            user_id=user_id,
            action='Updated router status',
            target_type='router',
            target_id=router.id,
            details=f'Changed router status to {status}: {router.model}'
        )
        db.session.add(activity)
        db.session.commit()
        
        return jsonify({'router': router.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500