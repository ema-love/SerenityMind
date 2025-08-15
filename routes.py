from flask import render_template, request, redirect, url_for, session, flash, jsonify
from app import app, db
from models import User, AssessmentResult, GroupChat, ChatMessage, MoodEntry, HabitEntry, EmotionEntry, Poem, Announcement
from assessment import ASSESSMENT_QUESTIONS, calculate_color_identity, get_color_identity_info, get_group_chat_assignment, get_mental_health_insights
import json
from datetime import datetime, timedelta
import logging

@app.route('/')
def index():
    """Landing page with platform overview"""
    announcements = Announcement.query.filter_by(is_active=True).order_by(Announcement.created_at.desc()).limit(3).all()
    return render_template('index.html', announcements=announcements)

@app.route('/register', methods=['GET', 'POST'])
def register():
    """Anonymous user registration"""
    if request.method == 'POST':
        nickname = request.form['nickname']
        email = request.form.get('email', '').strip()  # Optional
        password = request.form['password']
        
        # Check if nickname already exists
        if User.query.filter_by(nickname=nickname).first():
            flash('Nickname already taken. Please choose another.', 'error')
            return render_template('register.html')
        
        # Check if email is provided and already exists
        if email and User.query.filter_by(email=email).first():
            flash('Email already registered. Please use a different email.', 'error')
            return render_template('register.html')
        
        # Create new user
        user = User()
        user.nickname = nickname
        user.email = email if email else None
        user.set_password(password)
        
        try:
            db.session.add(user)
            db.session.commit()
            
            # Log user in
            session['user_id'] = user.id
            session['user_nickname'] = user.nickname
            
            flash('Welcome to Serenity! Please complete your assessment to personalize your experience.', 'success')
            return redirect(url_for('assessment'))
            
        except Exception as e:
            db.session.rollback()
            logging.error(f"Registration error: {e}")
            flash('Registration failed. Please try again.', 'error')
    
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    """User login"""
    if request.method == 'POST':
        nickname = request.form['nickname']
        password = request.form['password']
        
        user = User.query.filter_by(nickname=nickname).first()
        
        if user and user.check_password(password):
            session['user_id'] = user.id
            session['user_nickname'] = user.nickname
            
            if not user.assessment_completed:
                return redirect(url_for('assessment'))
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid nickname or password.', 'error')
    
    return render_template('register.html', login_mode=True)

@app.route('/logout')
def logout():
    """User logout"""
    session.clear()
    flash('You have been logged out safely.', 'info')
    return redirect(url_for('index'))

@app.route('/assessment', methods=['GET', 'POST'])
def assessment():
    """Mental health assessment"""
    if 'user_id' not in session:
        return redirect(url_for('register'))
    
    user = User.query.get(session['user_id'])
    if not user:
        session.clear()
        return redirect(url_for('register'))
    
    if request.method == 'POST':
        # Process assessment responses
        responses = []
        for question in ASSESSMENT_QUESTIONS:
            answer = request.form.get(f'question_{question["id"]}')
            if answer is not None:
                responses.append({
                    'question_id': question['id'],
                    'selected_option': int(answer)
                })
        
        if len(responses) == len(ASSESSMENT_QUESTIONS):
            # Calculate color identity
            color_identity = calculate_color_identity(responses)
            
            # Save assessment result
            assessment_result = AssessmentResult()
            assessment_result.user_id = user.id
            assessment_result.responses = json.dumps(responses)
            assessment_result.color_identity = color_identity
            assessment_result.suggested_support = get_color_identity_info(color_identity)['support_focus']
            
            # Update user
            user.color_identity = color_identity
            user.assessment_completed = True
            
            # Assign to group chat
            group_name = get_group_chat_assignment(color_identity)
            group_chat = GroupChat.query.filter_by(name=group_name).first()
            
            if not group_chat:
                # Create group chat if it doesn't exist
                group_chat = GroupChat()
                group_chat.name = group_name
                group_chat.color_identity = color_identity
                group_chat.description = f"Support group for {get_color_identity_info(color_identity)['name']} individuals"
                db.session.add(group_chat)
            
            user.group_chat_id = group_chat.id
            
            try:
                db.session.add(assessment_result)
                db.session.commit()
                
                # Show detailed results before going to dashboard
                return redirect(url_for('assessment_results'))
                
            except Exception as e:
                db.session.rollback()
                logging.error(f"Assessment save error: {e}")
                flash('Failed to save assessment. Please try again.', 'error')
        else:
            flash('Please answer all questions to complete the assessment.', 'error')
    
    return render_template('assessment.html', questions=ASSESSMENT_QUESTIONS)

@app.route('/assessment_results')
def assessment_results():
    """Show detailed assessment results"""
    if 'user_id' not in session:
        return redirect(url_for('register'))
    
    user = User.query.get(session['user_id'])
    if not user or not user.assessment_completed:
        return redirect(url_for('assessment'))
    
    color_info = get_color_identity_info(user.color_identity)
    mental_health_insights = get_mental_health_insights(user.color_identity)
    group_name = get_group_chat_assignment(user.color_identity)
    
    return render_template('assessment_results.html', 
                         user=user,
                         color_info=color_info,
                         mental_health_insights=mental_health_insights,
                         group_name=group_name)

@app.route('/dashboard')
def dashboard():
    """Personal user dashboard"""
    if 'user_id' not in session:
        return redirect(url_for('register'))
    
    user = User.query.get(session['user_id'])
    if not user:
        session.clear()
        return redirect(url_for('register'))
    
    if not user.assessment_completed:
        return redirect(url_for('assessment'))
    
    # Get recent data for dashboard
    today = datetime.now().date()
    week_ago = today - timedelta(days=7)
    
    recent_moods = MoodEntry.query.filter(
        MoodEntry.user_id == user.id,
        MoodEntry.created_at >= week_ago
    ).order_by(MoodEntry.created_at.desc()).limit(7).all()
    
    recent_habits = HabitEntry.query.filter(
        HabitEntry.user_id == user.id,
        HabitEntry.created_at >= week_ago
    ).all()
    
    recent_emotions = EmotionEntry.query.filter(
        EmotionEntry.user_id == user.id,
        EmotionEntry.created_at >= week_ago
    ).order_by(EmotionEntry.created_at.desc()).limit(5).all()
    
    recent_poems = Poem.query.filter_by(user_id=user.id).order_by(Poem.updated_at.desc()).limit(3).all()
    
    color_info = get_color_identity_info(user.color_identity)
    
    return render_template('dashboard.html', 
                         user=user, 
                         color_info=color_info,
                         recent_moods=recent_moods,
                         recent_habits=recent_habits,
                         recent_emotions=recent_emotions,
                         recent_poems=recent_poems)

@app.route('/track_mood', methods=['POST'])
def track_mood():
    """Track user mood"""
    if 'user_id' not in session:
        return redirect(url_for('register'))
    
    user = User.query.get(session['user_id'])
    if not user:
        return redirect(url_for('register'))
    
    mood_level = int(request.form.get('mood_level', 5))
    mood_type = request.form.get('mood_type', 'neutral')
    notes = request.form.get('notes', '')
    
    mood_entry = MoodEntry()
    mood_entry.user_id = user.id
    mood_entry.mood_level = mood_level
    mood_entry.mood_type = mood_type
    mood_entry.notes = notes
    
    try:
        db.session.add(mood_entry)
        db.session.commit()
        flash('Mood tracked successfully!', 'success')
    except Exception as e:
        db.session.rollback()
        logging.error(f"Mood tracking error: {e}")
        flash('Failed to track mood. Please try again.', 'error')
    
    return redirect(url_for('dashboard'))

@app.route('/track_habit', methods=['POST'])
def track_habit():
    """Track user habit"""
    if 'user_id' not in session:
        return redirect(url_for('register'))
    
    user = User.query.get(session['user_id'])
    if not user:
        return redirect(url_for('register'))
    
    habit_name = request.form.get('habit_name', '')
    completed = request.form.get('completed') == 'on'
    
    # Check if habit already exists today
    today = datetime.now().date()
    existing_habit = HabitEntry.query.filter(
        HabitEntry.user_id == user.id,
        HabitEntry.habit_name == habit_name,
        db.func.date(HabitEntry.created_at) == today
    ).first()
    
    if existing_habit:
        existing_habit.completed = completed
    else:
        habit_entry = HabitEntry()
        habit_entry.user_id = user.id
        habit_entry.habit_name = habit_name
        habit_entry.completed = completed
        db.session.add(habit_entry)
    
    try:
        db.session.commit()
        flash('Habit tracked successfully!', 'success')
    except Exception as e:
        db.session.rollback()
        logging.error(f"Habit tracking error: {e}")
        flash('Failed to track habit. Please try again.', 'error')
    
    return redirect(url_for('dashboard'))

@app.route('/track_emotion', methods=['POST'])
def track_emotion():
    """Track user emotion"""
    if 'user_id' not in session:
        return redirect(url_for('register'))
    
    user = User.query.get(session['user_id'])
    if not user:
        return redirect(url_for('register'))
    
    emotion_name = request.form.get('emotion_name', '')
    intensity = int(request.form.get('intensity', 5))
    trigger = request.form.get('trigger', '')
    
    emotion_entry = EmotionEntry()
    emotion_entry.user_id = user.id
    emotion_entry.emotion_name = emotion_name
    emotion_entry.intensity = intensity
    emotion_entry.trigger = trigger
    
    try:
        db.session.add(emotion_entry)
        db.session.commit()
        flash('Emotion tracked successfully!', 'success')
    except Exception as e:
        db.session.rollback()
        logging.error(f"Emotion tracking error: {e}")
        flash('Failed to track emotion. Please try again.', 'error')
    
    return redirect(url_for('dashboard'))

@app.route('/write_poem', methods=['GET', 'POST'])
def write_poem():
    """Write or edit poem"""
    if 'user_id' not in session:
        return redirect(url_for('register'))
    
    user = User.query.get(session['user_id'])
    if not user:
        return redirect(url_for('register'))
    
    if request.method == 'POST':
        title = request.form.get('title', '')
        content = request.form.get('content', '')
        is_private = request.form.get('is_private') == 'on'
        poem_id = request.form.get('poem_id')
        
        if poem_id:
            # Edit existing poem
            poem = Poem.query.filter_by(id=poem_id, user_id=user.id).first()
            if poem:
                poem.title = title
                poem.content = content
                poem.is_private = is_private
                poem.updated_at = datetime.utcnow()
        else:
            # Create new poem
            poem = Poem()
            poem.user_id = user.id
            poem.title = title
            poem.content = content
            poem.is_private = is_private
            db.session.add(poem)
        
        try:
            db.session.commit()
            flash('Poem saved successfully!', 'success')
            return redirect(url_for('dashboard'))
        except Exception as e:
            db.session.rollback()
            logging.error(f"Poem save error: {e}")
            flash('Failed to save poem. Please try again.', 'error')
    
    # For GET request or if POST failed
    poem_id = request.args.get('id')
    poem = None
    if poem_id:
        poem = Poem.query.filter_by(id=poem_id, user_id=user.id).first()
    
    return render_template('write_poem.html', poem=poem, user=user)

@app.route('/chat')
def chat():
    """Community chat page"""
    if 'user_id' not in session:
        return redirect(url_for('register'))
    
    user = User.query.get(session['user_id'])
    if not user or not user.assessment_completed:
        return redirect(url_for('assessment'))
    
    group_chat = user.group_chat
    if not group_chat:
        flash('You are not assigned to a community group yet.', 'error')
        return redirect(url_for('dashboard'))
    
    # Get recent messages
    messages = ChatMessage.query.filter_by(group_chat_id=group_chat.id).order_by(ChatMessage.created_at.asc()).limit(50).all()
    
    return render_template('chat.html', 
                         user=user, 
                         group_chat=group_chat, 
                         messages=messages)

@app.route('/send_message', methods=['POST'])
def send_message():
    """Send chat message"""
    if 'user_id' not in session:
        return redirect(url_for('register'))
    
    user = User.query.get(session['user_id'])
    if not user or not user.group_chat:
        return redirect(url_for('chat'))
    
    content = request.form.get('content', '').strip()
    if not content:
        flash('Please enter a message.', 'error')
        return redirect(url_for('chat'))
    
    message = ChatMessage()
    message.user_id = user.id
    message.group_chat_id = user.group_chat.id
    message.content = content
    
    try:
        db.session.add(message)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        logging.error(f"Message send error: {e}")
        flash('Failed to send message. Please try again.', 'error')
    
    return redirect(url_for('chat'))

@app.route('/toggle_dark_mode', methods=['POST'])
def toggle_dark_mode():
    """Toggle dark mode"""
    if 'user_id' in session:
        user = User.query.get(session['user_id'])
        if user:
            user.dark_mode = not user.dark_mode
            session['dark_mode'] = user.dark_mode
            try:
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                logging.error(f"Dark mode toggle error: {e}")
    
    return redirect(request.referrer or url_for('dashboard'))

@app.route('/about')
def about():
    """About page"""
    return render_template('about.html')

@app.route('/features')
def features():
    """Features page"""
    return render_template('features.html')

@app.route('/support')
def support():
    """Support page"""
    return render_template('support.html')

@app.route('/privacy')
def privacy():
    """Privacy policy page"""
    return render_template('privacy.html')

# Initialize some default data
def create_default_data():
    """Create default announcements and group chats"""
    if not Announcement.query.first():
        announcement1 = Announcement()
        announcement1.title = "Welcome to Serenity"
        announcement1.content = "A safe space for healing, growth, and community support. Your mental health journey matters."
        announcement1.is_active = True
        
        announcement2 = Announcement()
        announcement2.title = "Mental Health Awareness Month"
        announcement2.content = "This month, we're focusing on breaking stigma and promoting open conversations about mental wellness."
        announcement2.is_active = True
        
        announcement3 = Announcement()
        announcement3.title = "New Features Coming Soon"
        announcement3.content = "Serenity Journal is launching soon with enhanced reflection tools and guided healing exercises."
        announcement3.is_active = True
        
        db.session.add(announcement1)
        db.session.add(announcement2)
        db.session.add(announcement3)
    
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        logging.error(f"Default data creation error: {e}")