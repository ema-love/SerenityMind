# Serenity - Mental Wellness Platform

## Overview

Serenity is a mental wellness platform designed for young adults to explore their mental health journey with complete anonymity. The platform provides personalized support through color-based identity assessment, community chat groups, mood tracking, habit monitoring, and creative expression tools like poetry. Built with a healing-centered approach, it emphasizes privacy, anonymity, and supportive community connections.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Template Engine**: Flask's Jinja2 templating system for server-side rendering
- **CSS Framework**: Bootstrap 5.3.0 for responsive design and component styling
- **JavaScript**: Vanilla JavaScript with modular architecture organized under `Serenity` namespace
- **Animation Library**: Lottie Player for healing-centered animations and visual feedback
- **UI Design**: Healing-centered color palette with CSS custom properties for consistent theming
- **Accessibility**: Built-in accessibility features and ARIA support

### Backend Architecture
- **Web Framework**: Flask with SQLAlchemy ORM for database operations
- **Application Structure**: Modular Flask application with separate files for models, routes, and assessment logic
- **Session Management**: Flask sessions for user authentication and state management
- **Security**: Werkzeug password hashing and proxy fix middleware for production deployment
- **Database Models**: User, AssessmentResult, GroupChat, ChatMessage, MoodEntry, HabitEntry, EmotionEntry, Poem, and Announcement

### Data Storage
- **Database**: SQLite for development with configurable DATABASE_URL for production
- **ORM**: SQLAlchemy with DeclarativeBase for model definitions
- **Connection Management**: Connection pooling with pre-ping and recycle settings
- **Data Types**: Mixed data storage including JSON for assessment responses and text for user-generated content

### Authentication and Authorization
- **Anonymous Registration**: Optional email with required nickname for complete anonymity
- **Password Security**: Werkzeug password hashing with secure storage
- **Session-Based Auth**: Flask sessions for user state management without exposing real identities
- **Privacy-First Design**: Minimal data collection with focus on user anonymity

### Assessment System
- **Color Identity Mapping**: Psychological assessment that assigns users to color-based identity groups
- **Question Framework**: Structured assessment with weighted responses for personalized results
- **Group Assignment**: Automatic assignment to community chat groups based on color identity
- **Support Recommendations**: Personalized support suggestions based on assessment results

## External Dependencies

### Frontend Libraries
- **Bootstrap 5.3.0**: UI framework for responsive design and components
- **Font Awesome 6.4.0**: Icon library for consistent iconography
- **Lottie Player**: Web component for rendering After Effects animations

### Backend Framework
- **Flask**: Core web framework for request handling and routing
- **Flask-SQLAlchemy**: Database ORM integration with Flask
- **Werkzeug**: WSGI utilities including security helpers and middleware

### Development Tools
- **SQLAlchemy**: Database toolkit and ORM for Python
- **Jinja2**: Template engine integrated with Flask

### Deployment Considerations
- **ProxyFix Middleware**: Configured for reverse proxy deployments
- **Environment Variables**: Support for DATABASE_URL and SESSION_SECRET configuration
- **Static Asset Management**: Flask static file serving with organized CSS/JS structure

### Animation and Media
- **Lottie Files**: External animation assets hosted on Lottie Files CDN for healing-centered visual experiences
- **SVG Assets**: Local butterfly logo and iconography for branding consistency