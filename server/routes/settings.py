from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import SystemSettings, User, ActivityLog
from app import db
from datetime import datetime

settings_bp = Blueprint('settings', __name__)

@settings_bp.route('/', methods=['GET'])
@jwt_required()
def get_settings():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if user.role != 'admin':
            return jsonify({'error': 'Insufficient permissions'}), 403

        settings = SystemSettings.query.all()
        return jsonify({'settings': [setting.to_dict() for setting in settings]}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@settings_bp.route('/', methods=['POST'])
@jwt_required()
def update_settings():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if user.role != 'admin':
            return jsonify({'error': 'Insufficient permissions'}), 403

        data = request.get_json()

        if not data or not isinstance(data, dict):
            return jsonify({'error': 'Invalid data format'}), 400

        updated_settings = []

        for key, value in data.items():
            # Find existing setting or create new one
            setting = SystemSettings.query.filter_by(key=key).first()

            if setting:
                old_value = setting.value
                setting.value = str(value)
                setting.updated_at = datetime.utcnow()
            else:
                setting = SystemSettings(
                    key=key,
                    value=str(value),
                    description=get_setting_description(key),
                    category=get_setting_category(key)
                )
                db.session.add(setting)

            updated_settings.append(setting)

        db.session.commit()

        # Log activity
        activity = ActivityLog(
            user_id=user_id,
            action='Updated system settings',
            target_type='system',
            target_id=0,
            details=f'Updated {len(updated_settings)} settings'
        )
        db.session.add(activity)
        db.session.commit()

        return jsonify({
            'message': 'Settings updated successfully',
            'settings': [setting.to_dict() for setting in updated_settings]
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@settings_bp.route('/<key>', methods=['GET'])
@jwt_required()
def get_setting(key):
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if user.role != 'admin':
            return jsonify({'error': 'Insufficient permissions'}), 403

        setting = SystemSettings.query.filter_by(key=key).first()

        if not setting:
            return jsonify({'error': 'Setting not found'}), 404

        return jsonify({'setting': setting.to_dict()}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_setting_description(key):
    descriptions = {
        'enable_tech_site_add': 'Allow technicians to add sites on the map',
        'maintenance_mode': 'Enable maintenance mode to restrict access to admin users only',
        'enable_notifications': 'Enable system notifications',
        'auto_save_interval': 'Auto-save interval in minutes',
        'max_file_size': 'Maximum file upload size in MB',
        'session_timeout': 'Session timeout in minutes',
        'backup_frequency': 'Database backup frequency (daily, weekly, monthly)',
        'email_notifications': 'Enable email notifications for important events'
    }
    return descriptions.get(key, f'Setting for {key}')

def get_setting_category(key):
    categories = {
        'enable_tech_site_add': 'permissions',
        'maintenance_mode': 'system',
        'enable_notifications': 'notifications',
        'auto_save_interval': 'system',
        'max_file_size': 'uploads',
        'session_timeout': 'security',
        'backup_frequency': 'maintenance',
        'email_notifications': 'notifications'
    }
    return categories.get(key, 'general')
