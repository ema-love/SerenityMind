import json
from datetime import datetime

# Mental Health Assessment Questions - Designed to identify emotional state and healing approach
ASSESSMENT_QUESTIONS = [
    {
        "id": 1,
        "question": "How have you been feeling emotionally over the past few weeks?",
        "options": [
            {"text": "Overwhelmed and emotionally exhausted most days", "color_weight": {"grey": 4, "blue": 1}},
            {"text": "Anxious but still hopeful about the future", "color_weight": {"yellow": 3, "blue": 2}},
            {"text": "Sad but finding comfort in quiet reflection", "color_weight": {"blue": 4, "green": 1}},
            {"text": "Caring for others while neglecting my own needs", "color_weight": {"pink": 4, "green": 1}}
        ]
    },
    {
        "id": 2,
        "question": "When you're struggling, what helps you feel most supported?",
        "options": [
            {"text": "Being alone in nature or peaceful environments", "color_weight": {"green": 4, "blue": 2}},
            {"text": "Talking to close friends or family members", "color_weight": {"pink": 3, "yellow": 2}},
            {"text": "Creative expression like art, music, or writing", "color_weight": {"pink": 3, "blue": 2}},
            {"text": "I often feel like nothing really helps", "color_weight": {"grey": 4, "blue": 1}}
        ]
    },
    {
        "id": 3,
        "question": "How do you typically cope with difficult emotions?",
        "options": [
            {"text": "I tend to withdraw and become very quiet", "color_weight": {"grey": 3, "blue": 3}},
            {"text": "I try to stay positive and look for silver linings", "color_weight": {"yellow": 4, "pink": 1}},
            {"text": "I seek balance through mindfulness and self-care", "color_weight": {"green": 4, "blue": 2}},
            {"text": "I focus on helping others through their problems", "color_weight": {"pink": 4, "green": 1}}
        ]
    },
    {
        "id": 4,
        "question": "What describes your energy levels and motivation recently?",
        "options": [
            {"text": "Low energy, hard to get motivated for daily tasks", "color_weight": {"grey": 4, "blue": 2}},
            {"text": "Variable - some good days, some really hard days", "color_weight": {"blue": 3, "green": 2}},
            {"text": "Motivated to grow and heal, even when it's hard", "color_weight": {"green": 4, "yellow": 1}},
            {"text": "Energetic about helping others but tired personally", "color_weight": {"pink": 3, "yellow": 2}}
        ]
    },
    {
        "id": 5,
        "question": "How do you prefer to connect with others when you need support?",
        "options": [
            {"text": "I prefer not to burden others with my problems", "color_weight": {"grey": 3, "blue": 2}},
            {"text": "Through deep, meaningful conversations", "color_weight": {"blue": 4, "pink": 1}},
            {"text": "In supportive group settings with shared experiences", "color_weight": {"green": 3, "pink": 2}},
            {"text": "By being there for others who are struggling too", "color_weight": {"pink": 4, "green": 1}}
        ]
    },
    {
        "id": 6,
        "question": "What best describes your relationship with hope right now?",
        "options": [
            {"text": "I struggle to feel hopeful about my future", "color_weight": {"grey": 4, "blue": 1}},
            {"text": "I have hope but it feels fragile and uncertain", "color_weight": {"blue": 3, "green": 2}},
            {"text": "I actively cultivate hope through self-care and growth", "color_weight": {"green": 4, "yellow": 1}},
            {"text": "I find hope by spreading positivity to others", "color_weight": {"yellow": 4, "pink": 2}}
        ]
    },
    {
        "id": 7,
        "question": "How do you handle stress and anxiety?",
        "options": [
            {"text": "I often feel paralyzed and unable to take action", "color_weight": {"grey": 4, "blue": 1}},
            {"text": "I use breathing, meditation, or mindfulness practices", "color_weight": {"blue": 4, "green": 2}},
            {"text": "I channel stress into productive activities and growth", "color_weight": {"green": 3, "yellow": 2}},
            {"text": "I try to stay optimistic and focus on good things", "color_weight": {"yellow": 3, "pink": 2}}
        ]
    },
    {
        "id": 8,
        "question": "What kind of mental health support appeals to you most?",
        "options": [
            {"text": "Gentle, patient support that meets me where I am", "color_weight": {"grey": 2, "blue": 3}},
            {"text": "Calm, mindful approaches focused on inner peace", "color_weight": {"blue": 4, "green": 2}},
            {"text": "Growth-oriented support that helps me build resilience", "color_weight": {"green": 4, "yellow": 1}},
            {"text": "Warm, compassionate support that emphasizes self-love", "color_weight": {"pink": 4, "yellow": 2}}
        ]
    }
]

COLOR_IDENTITIES = {
    "grey": {
        "name": "Silent Warriors",
        "emoji": "🖤",
        "description": "You're navigating through overwhelming feelings and emotional exhaustion. Like quiet strength in the darkness, you're surviving each day even when it feels impossible. Your journey is valid, and gentle support is what you need most.",
        "traits": ["Overwhelmed", "Emotionally tired", "Resilient despite struggle", "Needs gentle support"],
        "support_focus": "Gentle mental health support, depression resources, trauma-informed care",
        "mental_health_focus": "Depression, emotional exhaustion, overwhelm",
        "color_hex": "#6B7280"
    },
    "blue": {
        "name": "Wave Whisperers", 
        "emoji": "🌊",
        "description": "You find peace in quiet reflection and deep emotional processing. Like calm waters, you have depth and sensitivity, preferring mindful approaches to healing and growth.",
        "traits": ["Peaceful", "Reflective", "Emotionally aware", "Seeks clarity"],
        "support_focus": "Mindfulness practices, anxiety management, emotional regulation",
        "mental_health_focus": "Anxiety, emotional sensitivity, need for peace",
        "color_hex": "#3B82F6"
    },
    "green": {
        "name": "Grounded Souls",
        "emoji": "🌿", 
        "description": "You embody healing, balance, and personal growth. Like a tree that bends but doesn't break, you're committed to your wellness journey and help others find their grounding too.",
        "traits": ["Healing-focused", "Balanced", "Growth-oriented", "Resilient"],
        "support_focus": "Personal development, holistic wellness, resilience building",
        "mental_health_focus": "Recovery, self-improvement, sustainable wellness",
        "color_hex": "#10B981"
    },
    "yellow": {
        "name": "Light Bearers",
        "emoji": "☀️",
        "description": "You bring hope and warmth to yourself and others, even during difficult times. Like sunshine breaking through clouds, you actively cultivate positivity and inspire healing.",
        "traits": ["Hopeful", "Optimistic", "Energetic", "Inspiring"],
        "support_focus": "Positive psychology, social connection, motivation building",
        "mental_health_focus": "Maintaining hope, preventing burnout, sustainable optimism",
        "color_hex": "#F59E0B"
    },
    "pink": {
        "name": "Heart Keepers",
        "emoji": "💗",
        "description": "You lead with compassion and love, often caring for others while learning to care for yourself. Like a gentle sunrise, you create safe spaces for healing and emotional connection.",
        "traits": ["Compassionate", "Caring", "Empathetic", "Supportive"],
        "support_focus": "Self-compassion, boundaries, relationship wellness",
        "mental_health_focus": "Caregiver fatigue, people-pleasing, self-care",
        "color_hex": "#EC4899"
    }
}

def calculate_color_identity(responses):
    """Calculate color identity based on assessment responses"""
    color_scores = {}
    
    for response in responses:
        question_id = response['question_id']
        selected_option = response['selected_option']
        
        # Find the question and option
        question = next((q for q in ASSESSMENT_QUESTIONS if q['id'] == question_id), None)
        if question and selected_option < len(question['options']):
            option = question['options'][selected_option]
            
            # Add color weights to scores
            for color, weight in option['color_weight'].items():
                color_scores[color] = color_scores.get(color, 0) + weight
    
    # Find the color with the highest score
    if color_scores:
        dominant_color = max(color_scores.keys(), key=lambda color: color_scores[color])
        return dominant_color
    
    return "blue"  # Default fallback

def get_color_identity_info(color):
    """Get detailed information about a color identity"""
    return COLOR_IDENTITIES.get(color, COLOR_IDENTITIES["blue"])

def get_group_chat_assignment(color_identity):
    """Assign user to appropriate group chat based on color identity"""
    # Each color identity gets their own dedicated support group
    group_assignments = {
        "grey": "Silent Warriors Support Circle",
        "blue": "Wave Whisperers Sanctuary", 
        "green": "Grounded Souls Garden",
        "yellow": "Light Bearers Community",
        "pink": "Heart Keepers Haven"
    }
    
    return group_assignments.get(color_identity, "Wave Whisperers Sanctuary")

def get_mental_health_insights(color_identity):
    """Get mental health insights and potential areas of focus"""
    insights = {
        "grey": {
            "potential_concerns": ["Depression", "Emotional exhaustion", "Overwhelm", "Isolation"],
            "recommended_resources": [
                "Crisis support hotlines",
                "Depression screening tools", 
                "Gentle self-care practices",
                "Professional therapy resources"
            ],
            "warning_signs": "May benefit from professional mental health support"
        },
        "blue": {
            "potential_concerns": ["Anxiety", "Emotional sensitivity", "Stress management"],
            "recommended_resources": [
                "Mindfulness and meditation apps",
                "Anxiety management techniques",
                "Breathing exercises",
                "Emotional regulation strategies"
            ],
            "warning_signs": "Focus on anxiety management and emotional wellness"
        },
        "green": {
            "potential_concerns": ["Recovery focus", "Building resilience", "Sustainable wellness"],
            "recommended_resources": [
                "Personal development books",
                "Holistic wellness practices",
                "Goal-setting frameworks",
                "Resilience building activities"
            ],
            "warning_signs": "Strong foundation for continued growth"
        },
        "yellow": {
            "potential_concerns": ["Maintaining optimism", "Preventing burnout", "Sustainable energy"],
            "recommended_resources": [
                "Positive psychology resources",
                "Energy management techniques",
                "Social connection activities",
                "Burnout prevention strategies"
            ],
            "warning_signs": "Monitor for hidden struggles behind optimism"
        },
        "pink": {
            "potential_concerns": ["Caregiver fatigue", "People-pleasing", "Boundary issues"],
            "recommended_resources": [
                "Self-compassion exercises",
                "Boundary setting guides",
                "Caregiver support resources",
                "Self-care planning tools"
            ],
            "warning_signs": "May need support in prioritizing self-care"
        }
    }
    
    return insights.get(color_identity, insights["blue"])