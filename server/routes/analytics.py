from flask import Blueprint, request, jsonify, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Ticket, User, Client, Router, Site, ActivityLog
from app import db
from datetime import datetime, timedelta
from sqlalchemy import func
import csv
import io

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard_analytics():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        # Basic counts
        total_tickets = Ticket.query.count()
        total_clients = Client.query.count()
        total_routers = Router.query.count()
        total_sites = Site.query.count()
        
        # Ticket status breakdown
        ticket_status = db.session.query(
            Ticket.status,
            func.count(Ticket.id).label('count')
        ).group_by(Ticket.status).all()
        
        # Ticket priority breakdown
        ticket_priority = db.session.query(
            Ticket.priority,
            func.count(Ticket.id).label('count')
        ).group_by(Ticket.priority).all()
        
        # Recent activity
        recent_activities = ActivityLog.query.order_by(
            ActivityLog.created_at.desc()
        ).limit(10).all()
        
        # Today's tickets
        today = datetime.utcnow().date()
        todays_tickets = Ticket.query.filter(
            func.date(Ticket.created_at) == today
        ).count()
        
        # Completed tickets today
        completed_today = Ticket.query.filter(
            func.date(Ticket.completed_at) == today
        ).count()
        
        # Technician performance (for admin/agent view)
        tech_performance = []
        if user.role in ['admin', 'agent']:
            technicians = User.query.filter_by(role='technician', status='active').all()
            for tech in technicians:
                completed_tickets = Ticket.query.filter_by(
                    assigned_tech_id=tech.id,
                    status='completed'
                ).count()
                
                avg_time = db.session.query(
                    func.avg(Ticket.time_spent)
                ).filter_by(assigned_tech_id=tech.id, status='completed').scalar()
                
                tech_performance.append({
                    'id': tech.id,
                    'name': tech.name,
                    'completed_tickets': completed_tickets,
                    'avg_time_spent': round(avg_time or 0, 2)
                })
        
        return jsonify({
            'summary': {
                'total_tickets': total_tickets,
                'total_clients': total_clients,
                'total_routers': total_routers,
                'total_sites': total_sites,
                'todays_tickets': todays_tickets,
                'completed_today': completed_today
            },
            'ticket_status': [{'status': status, 'count': count} for status, count in ticket_status],
            'ticket_priority': [{'priority': priority, 'count': count} for priority, count in ticket_priority],
            'recent_activities': [activity.to_dict() for activity in recent_activities],
            'tech_performance': tech_performance
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/reports/csv', methods=['GET'])
@jwt_required()
def export_csv():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if user.role not in ['admin', 'agent']:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        # Get report type from query params
        report_type = request.args.get('type', 'tickets')
        
        output = io.StringIO()
        writer = csv.writer(output)
        
        if report_type == 'tickets':
            # Export tickets
            writer.writerow(['ID', 'Title', 'Client', 'Priority', 'Status', 'Assigned Tech', 'Created At', 'Completed At', 'Time Spent (min)'])
            
            tickets = Ticket.query.all()
            for ticket in tickets:
                writer.writerow([
                    ticket.id,
                    ticket.title,
                    ticket.client.name if ticket.client else '',
                    ticket.priority,
                    ticket.status,
                    ticket.assigned_technician.name if ticket.assigned_technician else '',
                    ticket.created_at.strftime('%Y-%m-%d %H:%M:%S') if ticket.created_at else '',
                    ticket.completed_at.strftime('%Y-%m-%d %H:%M:%S') if ticket.completed_at else '',
                    ticket.time_spent
                ])
        
        elif report_type == 'clients':
            # Export clients
            writer.writerow(['ID', 'Name', 'Email', 'Phone', 'Address', 'Status', 'Created At'])
            
            clients = Client.query.all()
            for client in clients:
                writer.writerow([
                    client.id,
                    client.name,
                    client.email,
                    client.phone,
                    client.address,
                    client.status,
                    client.created_at.strftime('%Y-%m-%d %H:%M:%S') if client.created_at else ''
                ])
        
        elif report_type == 'sites':
            # Export sites
            writer.writerow(['ID', 'Name', 'Type', 'Latitude', 'Longitude', 'Address', 'Status', 'Created At'])
            
            sites = Site.query.all()
            for site in sites:
                writer.writerow([
                    site.id,
                    site.name,
                    site.site_type,
                    site.latitude,
                    site.longitude,
                    site.address,
                    site.status,
                    site.created_at.strftime('%Y-%m-%d %H:%M:%S') if site.created_at else ''
                ])
        
        output.seek(0)
        
        response = make_response(output.getvalue())
        response.headers['Content-Type'] = 'text/csv'
        response.headers['Content-Disposition'] = f'attachment; filename={report_type}_report_{datetime.now().strftime("%Y%m%d")}.csv'
        
        return response
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/performance', methods=['GET'])
@jwt_required()
def get_performance_metrics():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if user.role != 'admin':
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        # Get date range from query params
        days = int(request.args.get('days', 30))
        start_date = datetime.utcnow() - timedelta(days=days)
        
        # Technician performance metrics
        technicians = User.query.filter_by(role='technician', status='active').all()
        performance_data = []
        
        for tech in technicians:
            # Tickets completed in period
            completed_tickets = Ticket.query.filter(
                Ticket.assigned_tech_id == tech.id,
                Ticket.status == 'completed',
                Ticket.completed_at >= start_date
            ).count()
            
            # Average resolution time
            avg_time = db.session.query(
                func.avg(Ticket.time_spent)
            ).filter(
                Ticket.assigned_tech_id == tech.id,
                Ticket.status == 'completed',
                Ticket.completed_at >= start_date
            ).scalar()
            
            # Total time spent
            total_time = db.session.query(
                func.sum(Ticket.time_spent)
            ).filter(
                Ticket.assigned_tech_id == tech.id,
                Ticket.completed_at >= start_date
            ).scalar()
            
            performance_data.append({
                'id': tech.id,
                'name': tech.name,
                'completed_tickets': completed_tickets,
                'avg_resolution_time': round(avg_time or 0, 2),
                'total_time_spent': total_time or 0,
                'efficiency': round((completed_tickets / max(total_time or 1, 1)) * 100, 2)
            })
        
        return jsonify({'performance_data': performance_data}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500