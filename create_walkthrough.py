import os
import sys
from PIL import Image, ImageDraw, ImageFont

# Define video specs
WIDTH, HEIGHT = 1280, 720
FPS = 30
SLIDE_DURATION = 5  # seconds per slide
TOTAL_SLIDES = 3
FADE_DURATION = 1.0  # seconds for fade in/out
FADE_FRAMES = int(FADE_DURATION * FPS)
TOTAL_FRAMES = FPS * SLIDE_DURATION * TOTAL_SLIDES

# Fonts
FONT_BOLD_PATH = "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf"
FONT_REG_PATH = "/usr/share/fonts/truetype/freefont/FreeSans.ttf"

try:
    font_title = ImageFont.truetype(FONT_BOLD_PATH, 44)
    font_subtitle = ImageFont.truetype(FONT_REG_PATH, 22)
    font_header = ImageFont.truetype(FONT_BOLD_PATH, 28)
    font_body = ImageFont.truetype(FONT_REG_PATH, 18)
    font_body_bold = ImageFont.truetype(FONT_BOLD_PATH, 18)
    font_meta = ImageFont.truetype(FONT_REG_PATH, 14)
    font_badge = ImageFont.truetype(FONT_BOLD_PATH, 13)
except Exception as e:
    print(f"Error loading fonts: {e}")
    font_title = font_subtitle = font_header = font_body = font_body_bold = font_meta = font_badge = ImageFont.load_default()

# Colors
C_BG_START = (11, 15, 25)      # Slate dark
C_BG_END = (30, 41, 59)        # Steel slate
C_CORAL = (255, 68, 79)        # Primary Coral
C_BLUE = (56, 189, 248)        # Accent Blue
C_TEXT_MAIN = (248, 250, 252)  # White
C_TEXT_MUTED = (148, 163, 184) # Gray
C_CARD_BG = (15, 23, 42, 200)  # Darker semitransparent card
C_BORDER = (51, 65, 85, 120)   # Subtle border

def draw_gradient_bg(draw):
    for y in range(HEIGHT):
        ratio = y / HEIGHT
        r = int(C_BG_START[0] * (1 - ratio) + C_BG_END[0] * ratio)
        g = int(C_BG_START[1] * (1 - ratio) + C_BG_END[1] * ratio)
        b = int(C_BG_START[2] * (1 - ratio) + C_BG_END[2] * ratio)
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))

def draw_header_bar(draw):
    # Top logo bar
    draw.rectangle([0, 0, WIDTH, 60], fill=(15, 23, 42))
    draw.line([0, 60, WIDTH, 60], fill=(51, 65, 85), width=1)
    
    # Logo
    draw.text((40, 16), "APEX", fill=C_CORAL, font=font_title.__class__(FONT_BOLD_PATH, 24))
    draw.text((115, 16), "OFFICE SERVICES", fill=C_TEXT_MAIN, font=font_title.__class__(FONT_REG_PATH, 24))
    
    # Status dot
    draw.ellipse([WIDTH - 140, 24, WIDTH - 130, 34], fill=(34, 197, 94))
    draw.text((WIDTH - 120, 20), "Platform Active", fill=C_TEXT_MUTED, font=font_meta)

def draw_glass_card(img_draw, x, y, w, h, bg_color=C_CARD_BG, border_color=C_BORDER):
    # Custom card with rounded appearance and borders
    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    
    # Draw translucent body
    overlay_draw.rounded_rectangle([x, y, x + w, y + h], radius=12, fill=bg_color, outline=border_color, width=2)
    return overlay

def render_slide_1(frame_idx):
    # Welcome / Intro Slide
    image = Image.new("RGB", (WIDTH, HEIGHT))
    draw = ImageDraw.Draw(image)
    draw_gradient_bg(draw)
    
    # Left Content
    draw.text((80, 180), "Welcome to", fill=C_CORAL, font=font_subtitle)
    draw.text((80, 210), "APEX OFFICE SERVICES", fill=C_TEXT_MAIN, font=font_title)
    
    desc_lines = [
        "A highly unified multi-office administration system built for",
        "global enterprise operations. Designed with safety, speed,",
        "and pristine user experiences in mind.",
    ]
    y_offset = 320
    for line in desc_lines:
        draw.text((80, y_offset), line, fill=C_TEXT_MUTED, font=font_body)
        y_offset += 28
        
    # Quick statistics banner
    draw.rectangle([80, 450, 480, 560], fill=(15, 23, 42, 180), outline=(51, 65, 85))
    draw.text((100, 465), "GLOBAL CAPACITY", fill=C_TEXT_MUTED, font=font_meta)
    draw.text((100, 485), "15+ Offices", fill=C_TEXT_MAIN, font=font_header)
    draw.text((280, 465), "COMPLIANCE LEVEL", fill=C_TEXT_MUTED, font=font_meta)
    draw.text((280, 485), "100% Secure", fill=C_BLUE, font=font_header)

    # Right Content (Mockup Card of Office Operations)
    card_overlay = draw_glass_card(draw, 640, 160, 560, 450)
    image = Image.alpha_composite(image.convert("RGBA"), card_overlay).convert("RGB")
    draw = ImageDraw.Draw(image)
    
    # Inner Mockup Details
    draw.text((680, 200), "Apex Global Locations", fill=C_TEXT_MAIN, font=font_header)
    draw.line([680, 245, 1120, 245], fill=(51, 65, 85), width=1)
    
    locations = [
        ("CYPRUS", "Nicosia Office", "Active Desk"),
        ("MALAYSIA", "Cyberjaya (HQ)", "Active Desk"),
        ("MALTA", "Birkirkara Office", "Active Desk"),
        ("UK", "London Central", "Active Desk"),
        ("SINGAPORE", "Marina Bay", "Active Desk")
    ]
    y_loc = 270
    for country, name, status in locations:
        # Glow indicator
        draw.ellipse([680, y_loc + 6, 688, y_loc + 14], fill=C_CORAL)
        draw.text((705, y_loc), f"{country} - {name}", fill=C_TEXT_MAIN, font=font_body)
        draw.text((1020, y_loc), status, fill=C_BLUE, font=font_meta)
        y_loc += 55
        
    draw_header_bar(draw)
    return image

def render_slide_2(frame_idx):
    # Core Capabilities / Ticketing Process
    image = Image.new("RGB", (WIDTH, HEIGHT))
    draw = ImageDraw.Draw(image)
    draw_gradient_bg(draw)
    
    # Left Content
    draw.text((80, 160), "Key Platform Modules", fill=C_CORAL, font=font_subtitle)
    draw.text((80, 190), "Unified Help Desk", fill=C_TEXT_MAIN, font=font_title)
    
    features = [
        ("✓  Multi-Office Support", "Dynamic ticket assignment tailored by region."),
        ("✓  Real-Time Tracking", "Interactive timeline of status changes & replies."),
        ("✓  Department Isolation", "IT, Facilities, and Office Admin routing."),
        ("✓  Secure whistleblowing Gateway", "Anonymous HR and Compliance reporting."),
        ("✓  Clean CSV Exports", "Zero-leak secure reports with proper encoding.")
    ]
    y_f = 270
    for title, desc in features:
        draw.text((80, y_f), title, fill=C_BLUE, font=font_body_bold)
        draw.text((80, y_f + 24), desc, fill=C_TEXT_MUTED, font=font_meta)
        y_f += 75
        
    # Right Content (Mockup Ticket View)
    card_overlay = draw_glass_card(draw, 640, 150, 560, 480)
    image = Image.alpha_composite(image.convert("RGBA"), card_overlay).convert("RGB")
    draw = ImageDraw.Draw(image)
    
    # Title of ticket
    draw.text((680, 180), "TICKET PROFILE", fill=C_TEXT_MUTED, font=font_meta)
    draw.text((680, 205), "REQ-2024-052: GitHub access request", fill=C_TEXT_MAIN, font=font_body_bold)
    
    # Priority Badge
    draw.rounded_rectangle([1030, 180, 1130, 210], radius=4, fill=(234, 179, 8, 40), outline=(234, 179, 8))
    draw.text((1045, 187), "MEDIUM", fill=(234, 179, 8), font=font_badge)
    
    # Ticket Meta
    draw.text((680, 250), "Staff Name:", fill=C_TEXT_MUTED, font=font_meta)
    draw.text((780, 250), "Demetrios Vasiliou", fill=C_TEXT_MAIN, font=font_body)
    draw.text((680, 280), "Department:", fill=C_TEXT_MUTED, font=font_meta)
    draw.text((780, 280), "IT Admin Team", fill=C_TEXT_MAIN, font=font_body)
    
    draw.line([680, 315, 1130, 315], fill=(51, 65, 85), width=1)
    
    # Ticket timeline
    draw.text((680, 335), "TIMELINE LOGS", fill=C_TEXT_MUTED, font=font_meta)
    
    timeline = [
        ("09:00 AM", "Submitted by Demetrios (EMP-05198)"),
        ("13:00 PM", "Assigned to Priya Nair (Technician)"),
        ("14:30 PM", "Access provisioned for public repositories.")
    ]
    y_time = 370
    for t_str, desc in timeline:
        draw.ellipse([680, y_time + 6, 686, y_time + 12], fill=C_CORAL)
        draw.line([683, y_time + 12, 683, y_time + 55], fill=(51, 65, 85), width=2)
        draw.text((700, y_time), t_str, fill=C_BLUE, font=font_body_bold)
        draw.text((780, y_time), desc, fill=C_TEXT_MAIN, font=font_body)
        y_time += 50
        
    draw_header_bar(draw)
    return image

def render_slide_3(frame_idx):
    # Analytics / Compliance / Closing
    image = Image.new("RGB", (WIDTH, HEIGHT))
    draw = ImageDraw.Draw(image)
    draw_gradient_bg(draw)
    
    # Left Content
    draw.text((80, 180), "Advanced Analytics", fill=C_CORAL, font=font_subtitle)
    draw.text((80, 210), "Performance Panel", fill=C_TEXT_MAIN, font=font_title)
    
    desc_lines = [
        "Track volume spikes, monitor average resolution times,",
        "and handle high-priority compliance requests cleanly.",
        "Equipped with zero-leak cryptographic whitelisting for",
        "maximum enterprise safety.",
    ]
    y_offset = 320
    for line in desc_lines:
        draw.text((80, y_offset), line, fill=C_TEXT_MUTED, font=font_body)
        y_offset += 28
        
    # Bottom Call to Action
    draw.text((80, 480), "Ready for Deployment", fill=C_BLUE, font=font_body_bold)
    draw.text((80, 510), "Configured on Secure Cloud Run", fill=C_TEXT_MAIN, font=font_body)
    
    # Right Content (Mockup Analytics Dashboard)
    card_overlay = draw_glass_card(draw, 640, 160, 560, 450)
    image = Image.alpha_composite(image.convert("RGBA"), card_overlay).convert("RGB")
    draw = ImageDraw.Draw(image)
    
    draw.text((680, 200), "Monthly Volume Analytics", fill=C_TEXT_MAIN, font=font_header)
    draw.line([680, 245, 1120, 245], fill=(51, 65, 85), width=1)
    
    # Draw simple barchart
    categories = [
        ("IT Support", 85, C_BLUE),
        ("Facilities", 60, C_CORAL),
        ("Office Admin", 40, C_TEXT_MUTED),
        ("Compliance", 20, (34, 197, 94))
    ]
    y_bar = 280
    for name, pct, color in categories:
        draw.text((680, y_bar), name, fill=C_TEXT_MAIN, font=font_body)
        
        # Bar BG
        draw.rounded_rectangle([820, y_bar + 4, 1100, y_bar + 18], radius=4, fill=(30, 41, 59))
        # Active Bar
        w_active = int((1100 - 820) * (pct / 100.0))
        draw.rounded_rectangle([820, y_bar + 4, 820 + w_active, y_bar + 18], radius=4, fill=color)
        
        # Text percent
        draw.text((1115, y_bar), f"{pct}%", fill=C_TEXT_MAIN, font=font_meta)
        y_bar += 70
        
    draw_header_bar(draw)
    return image

# Main generation loop
if __name__ == "__main__":
    os.makedirs("/tmp/frames", exist_ok=True)
    print("Generating walkthrough video frames...")
    
    for f in range(TOTAL_FRAMES):
        slide_num = f // (FPS * SLIDE_DURATION)
        slide_frame = f % (FPS * SLIDE_DURATION)
        
        # Select base slide renderer
        if slide_num == 0:
            img = render_slide_1(slide_frame)
        elif slide_num == 1:
            img = render_slide_2(slide_frame)
        else:
            img = render_slide_3(slide_frame)
            
        # Compute smooth fade overlay
        opacity = 1.0
        # Fade in at start of each slide
        if slide_frame < FADE_FRAMES:
            opacity = slide_frame / float(FADE_FRAMES)
        # Fade out at end of each slide
        elif slide_frame >= (FPS * SLIDE_DURATION) - FADE_FRAMES:
            opacity = ((FPS * SLIDE_DURATION) - slide_frame) / float(FADE_FRAMES)
            
        # Apply fade overlay
        if opacity < 1.0:
            overlay = Image.new('RGBA', (WIDTH, HEIGHT), (15, 23, 42, int(255 * (1 - opacity))))
            img = Image.alpha_composite(img.convert('RGBA'), overlay).convert('RGB')
            
        # Save frame
        frame_path = f"/tmp/frames/frame_{f:04d}.png"
        img.save(frame_path)
        
        if f % 30 == 0:
            print(f"Rendered {f}/{TOTAL_FRAMES} frames...")
            
    print("All frames rendered successfully!")
