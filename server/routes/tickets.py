from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Ticket, User, Client, TicketComment, ActivityLog
from app import db
from datetime import datetime

tickets_bp = Blueprint('tickets', __name__)

@tickets_bp.route('/', methods=['GET'])
@jwt_required()
def get_tickets():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Filter tickets based on user role
        if user.role == 'technician':
            tickets = Ticket.query.filter_by(assigned_tech_id=user_id).all()
        else:
            tickets = Ticket.query.all()
        
        return jsonify({'tickets': [ticket.to_dict() for ticket in tickets]}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tickets_bp.route('/', methods=['POST'])
@jwt_required()
def create_ticket():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        required_fields = ['title', 'client_id']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        ticket = Ticket(
            title=data['title'],
            description=data.get('description', ''),
            priority=data.get('priority', 'medium'),
            status=data.get('status', 'pending'),
            client_id=data['client_id'],
            assigned_tech_id=data.get('assigned_tech_id'),
            created_by_id=user_id
        )
        
        db.session.add(ticket)
        db.session.commit()
        
        # Log activity
        activity = ActivityLog(
            user_id=user_id,
            action='Created ticket',
            target_type='ticket',
            target_id=ticket.id,
            details=f'Created ticket: {ticket.title}'
        )
        db.session.add(activity)
        db.session.commit()
        
        return jsonify({'ticket': ticket.to_dict()}), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tickets_bp.route('/<int:ticket_id>', methods=['GET'])
@jwt_required()
def get_ticket(ticket_id):
    try:
        ticket = Ticket.query.get(ticket_id)
        
        if not ticket:
            return jsonify({'error': 'Ticket not found'}), 404
        
        return jsonify({'ticket': ticket.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tickets_bp.route('/<int:ticket_id>', methods=['PUT'])
@jwt_required()
def update_ticket(ticket_id):
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        ticket = Ticket.query.get(ticket_id)

        if not ticket:
            return jsonify({'error': 'Ticket not found'}), 404

        # Permission check: only assigned technician, admin, or agent can update
        if user.role == 'technician' and ticket.assigned_tech_id != user_id:
            return jsonify({'error': 'You can only update your assigned tickets'}), 403

        data = request.get_json()
        
        # Update fields
        if 'title' in data:
            ticket.title = data['title']
        if 'description' in data:
            ticket.description = data['description']
        if 'priority' in data:
            ticket.priority = data['priority']
        if 'status' in data:
            ticket.status = data['status']
            if data['status'] == 'completed':
                ticket.completed_at = datetime.utcnow()
        if 'assigned_tech_id' in data:
            ticket.assigned_tech_id = data['assigned_tech_id']
        if 'time_spent' in data:
            ticket.time_spent = data['time_spent']
        
        ticket.updated_at = datetime.utcnow()
        db.session.commit()
        
        # Log activity
        activity = ActivityLog(
            user_id=user_id,
            action='Updated ticket',
            target_type='ticket',
            target_id=ticket.id,
            details=f'Updated ticket: {ticket.title}'
        )
        db.session.add(activity)
        db.session.commit()
        
        return jsonify({'ticket': ticket.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tickets_bp.route('/<int:ticket_id>', methods=['DELETE'])
@jwt_required()
def delete_ticket(ticket_id):
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if user.role not in ['admin', 'agent']:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        ticket = Ticket.query.get(ticket_id)
        
        if not ticket:
            return jsonify({'error': 'Ticket not found'}), 404
        
        # Log activity before deletion
        activity = ActivityLog(
            user_id=user_id,
            action='Deleted ticket',
            target_type='ticket',
            target_id=ticket.id,
            details=f'Deleted ticket: {ticket.title}'
        )
        db.session.add(activity)
        
        db.session.delete(ticket)
        db.session.commit()
        
        return jsonify({'message': 'Ticket deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tickets_bp.route('/<int:ticket_id>/comments', methods=['POST'])
@jwt_required()
def add_comment(ticket_id):
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data.get('comment'):
            return jsonify({'error': 'Comment is required'}), 400
        
        ticket = Ticket.query.get(ticket_id)
        if not ticket:
            return jsonify({'error': 'Ticket not found'}), 404
        
        comment = TicketComment(
            ticket_id=ticket_id,
            user_id=user_id,
            comment=data['comment']
        )
        
        db.session.add(comment)
        db.session.commit()
        
        return jsonify({'comment': comment.to_dict()}), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500