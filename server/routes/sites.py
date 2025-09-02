from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Site, User, ActivityLog
from app import db
from datetime import datetime

sites_bp = Blueprint('sites', __name__)

@sites_bp.route('/', methods=['GET'])
@jwt_required()
def get_sites():
    try:
        sites = Site.query.all()
        return jsonify({'sites': [site.to_dict() for site in sites]}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@sites_bp.route('/', methods=['POST'])
@jwt_required()
def create_site():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if user.role not in ['admin', 'technician']:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        data = request.get_json()
        
        required_fields = ['name', 'latitude', 'longitude']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        site = Site(
            name=data['name'],
            description=data.get('description', ''),
            latitude=float(data['latitude']),
            longitude=float(data['longitude']),
            site_type=data.get('type', 'office'),
            status=data.get('status', 'active'),
            address=data.get('address', ''),
            contact=data.get('contact', '')
        )
        
        db.session.add(site)
        db.session.commit()
        
        # Log activity
        activity = ActivityLog(
            user_id=user_id,
            action='Created site',
            target_type='site',
            target_id=site.id,
            details=f'Created site: {site.name}'
        )
        db.session.add(activity)
        db.session.commit()
        
        return jsonify({'site': site.to_dict()}), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@sites_bp.route('/<int:site_id>', methods=['PUT'])
@jwt_required()
def update_site(site_id):
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if user.role not in ['admin', 'technician']:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        site = Site.query.get(site_id)
        
        if not site:
            return jsonify({'error': 'Site not found'}), 404
        
        data = request.get_json()
        
        # Update fields
        if 'name' in data:
            site.name = data['name']
        if 'description' in data:
            site.description = data['description']
        if 'latitude' in data:
            site.latitude = float(data['latitude'])
        if 'longitude' in data:
            site.longitude = float(data['longitude'])
        if 'type' in data:
            site.site_type = data['type']
        if 'status' in data:
            site.status = data['status']
        if 'address' in data:
            site.address = data['address']
        if 'contact' in data:
            site.contact = data['contact']
        
        site.updated_at = datetime.utcnow()
        db.session.commit()
        
        # Log activity
        activity = ActivityLog(
            user_id=user_id,
            action='Updated site',
            target_type='site',
            target_id=site.id,
            details=f'Updated site: {site.name}'
        )
        db.session.add(activity)
        db.session.commit()
        
        return jsonify({'site': site.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@sites_bp.route('/<int:site_id>', methods=['DELETE'])
@jwt_required()
def delete_site(site_id):
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if user.role not in ['admin', 'technician']:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        site = Site.query.get(site_id)
        
        if not site:
            return jsonify({'error': 'Site not found'}), 404
        
        # Log activity before deletion
        activity = ActivityLog(
            user_id=user_id,
            action='Deleted site',
            target_type='site',
            target_id=site.id,
            details=f'Deleted site: {site.name}'
        )
        db.session.add(activity)
        
        db.session.delete(site)
        db.session.commit()
        
        return jsonify({'message': 'Site deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500