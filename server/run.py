from app import app, db
from utils.seed_data import seed_database
import os

if __name__ == '__main__':
    # Initialize database and seed data
    with app.app_context():
        db.create_all()

        from models import User
        if User.query.count() == 0:
            print("Seeding database with initial data...")
            seed_database()

    # Run the application
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
