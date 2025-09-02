from app import app, db
from models import User, Client, Ticket, Router, Site
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta
import random

def seed_database():
    with app.app_context():
        # Clear existing data
        db.drop_all()
        db.create_all()
        
        # Create users
        users_data = [
            {'name': 'Admin User', 'email': 'admin@company.com', 'password': 'admin123', 'role': 'admin'},
            {'name': 'Sarah Johnson', 'email': 'sarah.johnson@company.com', 'password': 'agent123', 'role': 'agent'},
            {'name': 'Mike Wilson', 'email': 'mike.wilson@company.com', 'password': 'tech123', 'role': 'technician'},
            {'name': 'Lisa Chen', 'email': 'lisa.chen@company.com', 'password': 'agent123', 'role': 'agent'},
            {'name': 'David Kim', 'email': 'david.kim@company.com', 'password': 'tech123', 'role': 'technician'},
            {'name': 'Emily Brown', 'email': 'emily.brown@company.com', 'password': 'tech123', 'role': 'technician'},
        ]
        
        users = []
        for user_data in users_data:
            user = User(
                name=user_data['name'],
                email=user_data['email'],
                password_hash=generate_password_hash(user_data['password']),
                role=user_data['role'],
                status='active'
            )
            users.append(user)
            db.session.add(user)
        
        db.session.commit()
        
        # Create clients
        clients_data = [
            {'name': 'John Smith', 'email': 'john.smith@example.com', 'phone': '+254-700-123-456', 'address': '123 Main St, Nairobi'},
            {'name': 'Sarah Williams', 'email': 'sarah.williams@example.com', 'phone': '+254-700-123-457', 'address': '456 Park Ave, Mombasa'},
            {'name': 'Robert Davis', 'email': 'robert.davis@example.com', 'phone': '+254-700-123-458', 'address': '789 Oak Rd, Kisumu'},
            {'name': 'Alice Cooper', 'email': 'alice.cooper@example.com', 'phone': '+254-700-123-459', 'address': '321 Pine St, Nakuru'},
            {'name': 'Bob Wilson', 'email': 'bob.wilson@example.com', 'phone': '+254-700-123-460', 'address': '654 Cedar Ave, Eldoret'},
        ]
        
        clients = []
        for client_data in clients_data:
            client = Client(
                name=client_data['name'],
                email=client_data['email'],
                phone=client_data['phone'],
                address=client_data['address'],
                status='active'
            )
            clients.append(client)
            db.session.add(client)
        
        db.session.commit()
        
        # Create routers
        router_models = ['TP-Link Archer C7', 'Netgear Nighthawk R7000', 'Asus RT-AC86U', 'Linksys EA7500', 'Google Nest Wifi']
        statuses = ['online', 'offline', 'maintenance']
        
        for i, client in enumerate(clients):
            router = Router(
                model=router_models[i % len(router_models)],
                serial_number=f'SN-{1000 + i}',
                status=random.choice(statuses),
                client_id=client.id,
                location=f'Location {i + 1}'
            )
            db.session.add(router)
        
        db.session.commit()
        
        # Create sites
        sites_data = [
            {'name': 'Main Office', 'lat': -1.312, 'lng': 36.822, 'description': 'Primary headquarters building', 'type': 'office'},
            {'name': 'Branch A', 'lat': -1.315, 'lng': 36.825, 'description': 'Regional branch office', 'type': 'branch'},
            {'name': 'Data Center', 'lat': -1.308, 'lng': 36.818, 'description': 'Primary data center', 'type': 'datacenter'},
            {'name': 'Warehouse', 'lat': -1.320, 'lng': 36.830, 'description': 'Storage facility', 'type': 'warehouse'},
            {'name': 'Remote Site', 'lat': -1.325, 'lng': 36.815, 'description': 'Remote monitoring station', 'type': 'remote'},
        ]
        
        for site_data in sites_data:
            site = Site(
                name=site_data['name'],
                description=site_data['description'],
                latitude=site_data['lat'],
                longitude=site_data['lng'],
                site_type=site_data['type'],
                status='active',
                address=f"{site_data['name']} Address, Nairobi",
                contact='+254-700-123-456'
            )
            db.session.add(site)
        
        db.session.commit()
        
        # Create tickets
        ticket_titles = [
            'Internet Connection Issue',
            'Router Configuration',
            'Slow Internet Speed',
            'WiFi Signal Weak',
            'DNS Configuration',
            'Network Security Setup',
            'Hardware Installation',
            'Software Update Required'
        ]
        
        priorities = ['low', 'medium', 'high', 'critical']
        statuses = ['pending', 'in-progress', 'completed']
        
        # Get technician IDs
        tech_ids = [user.id for user in users if user.role == 'technician']
        agent_ids = [user.id for user in users if user.role == 'agent']
        
        for i in range(20):
            ticket = Ticket(
                title=random.choice(ticket_titles),
                description=f'Description for ticket #{i + 1}. This involves resolving connectivity issues.',
                priority=random.choice(priorities),
                status=random.choice(statuses),
                client_id=random.choice([client.id for client in clients]),
                assigned_tech_id=random.choice(tech_ids) if random.random() > 0.3 else None,
                created_by_id=random.choice(agent_ids),
                time_spent=random.randint(15, 240),
                created_at=datetime.utcnow() - timedelta(days=random.randint(0, 30))
            )
            
            if ticket.status == 'completed':
                ticket.completed_at = ticket.created_at + timedelta(hours=random.randint(1, 48))
            
            db.session.add(ticket)
        
        db.session.commit()
        print("Database seeded successfully!")

if __name__ == '__main__':
    seed_database()