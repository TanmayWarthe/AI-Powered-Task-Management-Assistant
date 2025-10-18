import re
from datetime import datetime, timedelta

def parse_natural_language(text):
    """
    Simple but powerful natural language parser
    No external NLP libraries needed!
    """
    if not text or not text.strip():
        return {"success": False, "error": "Empty text provided"}
    
    text_lower = text.lower().strip()
    
    try:
        result = {
            "title": extract_title(text),
            "description": "",
            "due_date": extract_due_date(text_lower),
            "priority": extract_priority(text_lower),
            "category": extract_category(text_lower),
            "tags": extract_tags(text_lower),
            "success": True
        }
        
        return result
        
    except Exception as e:
        return {"success": False, "error": str(e)}

def extract_title(text):
    """Smart title extraction"""
    # Remove common command phrases
    command_patterns = [
        r'remind me to',
        r'remind me',
        r'create a task for',
        r'add a task for', 
        r'task for',
        r'todo',
        r'task',
        r'reminder for',
        r'i need to',
        r'please'
    ]
    
    title = text.strip()
    
    for pattern in command_patterns:
        title = re.sub(pattern, '', title, flags=re.IGNORECASE)
    
    # Remove time/date patterns
    time_patterns = [
        r'tomorrow',
        r'today',
        r'next week',
        r'this week',
        r'monday|tuesday|wednesday|thursday|friday|saturday|sunday',
        r'at \d+',
        r'at \d+:\d+',
        r'\d+ (am|pm)',
        r'\d+:\d+ (am|pm)',
        r'on \w+',
        r'in \d+ (hours|days|weeks)'
    ]
    
    for pattern in time_patterns:
        title = re.sub(pattern, '', title, flags=re.IGNORECASE)
    
    # Clean up: remove extra spaces, capitalize first letter
    title = re.sub(r'\s+', ' ', title).strip()
    
    if not title:
        return "New Task"
    
    # Capitalize first letter
    return title[0].upper() + title[1:]

def extract_due_date(text):
    """Smart due date detection"""
    now = datetime.now()
    
    # Date patterns
    if 'tomorrow' in text:
        due_date = now + timedelta(days=1)
    elif 'today' in text:
        due_date = now
    elif 'next week' in text:
        due_date = now + timedelta(days=7)
    elif 'this week' in text:
        due_date = now + timedelta(days=3)  # Mid-week
    else:
        due_date = now + timedelta(days=1)  # Default: tomorrow
    
    # Time patterns
    time_match = re.search(r'at (\d+)(?::(\d+))?\s*(am|pm)?', text)
    if time_match:
        hour = int(time_match.group(1))
        minute = int(time_match.group(2)) if time_match.group(2) else 0
        period = time_match.group(3)
        
        # Convert to 24-hour format
        if period == 'pm' and hour < 12:
            hour += 12
        elif period == 'am' and hour == 12:
            hour = 0
        
        due_date = due_date.replace(hour=hour, minute=minute, second=0)
    else:
        # Default time: 6 PM
        due_date = due_date.replace(hour=18, minute=0, second=0)
    
    # If time already passed, move to next day
    if due_date < now:
        due_date += timedelta(days=1)
    
    return due_date.isoformat()

def extract_priority(text):
    """Priority detection"""
    high_keywords = ['urgent', 'asap', 'important', 'critical', 'emergency', 'priority']
    low_keywords = ['sometime', 'whenever', 'no rush', 'not important', 'low priority', 'casual']
    
    if any(keyword in text for keyword in high_keywords):
        return 'high'
    elif any(keyword in text for keyword in low_keywords):
        return 'low'
    
    return 'medium'

def extract_category(text):
    """Category detection"""
    categories = {
        'work': ['work', 'office', 'meeting', 'project', 'deadline', 'client', 'business'],
        'study': ['study', 'learn', 'read', 'homework', 'exam', 'class', 'college', 'school'],
        'personal': ['buy', 'shopping', 'grocery', 'personal', 'family', 'home', 'house'],
        'health': ['exercise', 'gym', 'yoga', 'doctor', 'health', 'medical', 'hospital'],
        'finance': ['bill', 'payment', 'bank', 'money', 'tax', 'invoice']
    }
    
    for category, keywords in categories.items():
        if any(keyword in text for keyword in keywords):
            return category
    
    return 'personal'

def extract_tags(text):
    """Extract relevant tags"""
    tags = []
    common_tags = ['urgent', 'important', 'meeting', 'shopping', 'study', 'work', 'personal']
    
    for tag in common_tags:
        if tag in text:
            tags.append(tag)
    
    return tags

# Test the parser
def test_parser():
    """Test with various inputs"""
    test_cases = [
        "Remind me to study math tomorrow at 5 PM",
        "Add task for buying groceries today",
        "Urgent meeting with client ASAP",
        "Complete project work next week",
        "Exercise at gym tomorrow morning",
        "Pay electricity bill this week",
        "Read book about AI",
        "Call doctor for appointment",
        "Team meeting at 3 PM today"
    ]
    
    print("🤖 AI PARSER TEST RESULTS:\n")
    for i, test in enumerate(test_cases, 1):
        result = parse_natural_language(test)
        print(f"#{i} INPUT: {test}")
        print(f"    OUTPUT: {result}\n")

if __name__ == "__main__":
    test_parser()