from app import app, db
import models
import routes

with app.app_context():
    # Create all database tables
    db.create_all()
    
    # Initialize default data
    from routes import create_default_data
    create_default_data()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
