import os
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.lib.units import inch

def generate_pdf():
    pdf_path = r"c:\Users\IDEAPAD GAMING\Downloads\SIH stuffs\web application for sih\urbanpulse\UrbanPulse_Judges_Presentation_Guide.pdf"
    
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=40,
        rightMargin=40,
        topMargin=40,
        bottomMargin=40
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0A192F')
    )
    
    sub_style = ParagraphStyle(
        'DocSub',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#0284C7')
    )
    
    h1_style = ParagraphStyle(
        'H1',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=colors.HexColor('#0A192F'),
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )
    
    h2_style = ParagraphStyle(
        'H2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#0284C7'),
        spaceBefore=8,
        spaceAfter=3,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#334155'),
        spaceAfter=4
    )
    
    bold_label = ParagraphStyle(
        'BoldLabel',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#0A192F')
    )
    
    callout_style = ParagraphStyle(
        'Callout',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#0F172A')
    )
    
    story = []
    
    # Title & Header
    story.append(Paragraph("UrbanPulse: Judge Presentation Guide", title_style))
    story.append(Paragraph("AI-Powered Mobile Urban Intelligence Platform Using Public Transport Fleet<br/>Smart India Hackathon 2026 • Problem Statement 26124 • Bharat Electronics Limited (BEL)", sub_style))
    story.append(Spacer(1, 10))
    
    # -------------------------------------------------------------
    # PART 1: The 60-Second Elevator Pitch
    # -------------------------------------------------------------
    story.append(Paragraph("PART 1: The 60-Second Elevator Pitch", h1_style))
    story.append(Paragraph("<i>Memorize this opening statement to deliver immediately when your presentation begins:</i>", body_style))
    
    pitch_text = (
        "<b>🗣️ Pitch Opening:</b><br/>"
        "<i>\"Respected Judges, Indian cities face thousands of potholes, damaged road signs, and traffic bottlenecks every day. "
        "Currently, municipal authorities rely on citizen complaints or manual surveys, which are slow and reactive.<br/><br/>"
        "Our solution, <b>UrbanPulse</b>, transforms existing public transport buses into <b>Mobile Urban Sensing Units</b>. "
        "As buses travel their regular daily routes across the city, edge-mounted cameras and AI automatically detect "
        "road defects, traffic violations, and safety hazards in real time.<br/><br/>"
        "Instead of spending crores on thousands of fixed CCTV poles, <b>a fleet of just 50 buses scans 90% of the city's "
        "major roads multiple times every day at zero extra fuel cost.</b>\"</i>"
    )
    
    pitch_table = Table([[Paragraph(pitch_text, callout_style)]], colWidths=[530])
    pitch_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F0F9FF')),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#BAE6FD')),
        ('LINELEFT', (0, 0), (0, 0), 3.5, colors.HexColor('#0284C7')),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('RIGHTPADDING', (0, 0), (-1, -1), 12),
    ]))
    story.append(pitch_table)
    story.append(Spacer(1, 12))
    
    # -------------------------------------------------------------
    # PART 2: The 4-Step Working Flow
    # -------------------------------------------------------------
    story.append(Paragraph("PART 2: The 4-Step Working Flow (How It Works)", h1_style))
    
    flow_data = [
        [Paragraph("<b>Step 1: Scan (Bus Fleet)</b>", bold_label),
         Paragraph("Public buses travel scheduled routes. Front and side cameras continuously record road surfaces and surroundings.", body_style)],
        [Paragraph("<b>Step 2: Detect (Edge AI)</b>", bold_label),
         Paragraph("Onboard NVIDIA Jetson Orin Nano runs YOLOv8 models locally at 28 FPS. Detects potholes, waterlogging, zebra crossings, and license plates.", body_style)],
        [Paragraph("<b>Step 3: Smart Upload (14.8 KB)</b>", bold_label),
         Paragraph("Does NOT stream heavy video over cellular network. Uploads only a 14.8 KB JSON payload with GPS coordinates, defect category, and crop snapshot. Saves 98.7% bandwidth.", body_style)],
        [Paragraph("<b>Step 4: Action & Closed-Loop</b>", bold_label),
         Paragraph("PostGIS 10m spatial analysis merges duplicate sightings into 1 ticket. When PWD repairs the defect, the next bus pass automatically re-scans and verifies.", body_style)]
    ]
    
    flow_table = Table(flow_data, colWidths=[150, 380])
    flow_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#F8FAFC')),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(flow_table)
    story.append(Spacer(1, 12))
    
    # -------------------------------------------------------------
    # PART 3: Menu-by-Menu Breakdown
    # -------------------------------------------------------------
    story.append(Paragraph("PART 3: Menu-by-Menu Breakdown (What Each Page Tells Judges)", h1_style))
    
    menus = [
        ("1. Command Center (/)",
         "Executive overview showing city statistics (Active Buses, Issues Detected, Critical Alerts), live Kolhapur transit map, real-time detection feed, and 5-step process flow.",
         "Gives city commissioners and municipal authorities an instant high-level bird's-eye view of city road health.",
         "This is our central Command Center. At a single glance, the municipal commissioner can see active buses, today's detected defects, and live incoming alerts from across the city."),
        
        ("2. Live Bus Monitor (/live-monitor)",
         "Real-time GPS tracking of active buses (BUS-042, BUS-018), route paths (R01, R03, R07), current speeds, and edge node health (battery, GPU temp, 5G status).",
         "Demonstrates seamless integration with existing public transit fleet management systems.",
         "Here we monitor the mobile sensing fleet. We can track each bus in real time, see what route it's covering, and verify that the onboard Edge AI hardware is operating at optimal temperature."),
        
        ("3. AI Detection Demo (/ai-demo) — [The Centerpiece]",
         "Interactive road simulation with real-time bounding boxes, confidence percentages (94%), and the complete 9-step edge pipeline. Presets: Pothole, Waterlogging, School Children, Rash Driving.",
         "Shows judges the exact technical depth and AI pipeline running inside each bus.",
         "This is our AI engine in action. Notice that our model runs at 28 FPS. When a pothole appears, it places a bounding box, calculates surface area, verifies with bus accelerometer, and blurs faces and private plates for privacy."),
        
        ("4. Road Health Map (/road-health)",
         "GIS map of city corridors color-coded by Road Health Index (RHI): Green (80-100 Good), Yellow (60-79 Monitor), Orange (40-59 Poor), and Red (<40 Critical).",
         "Replaces manual road inspection surveys with automated, data-backed pavement condition ratings.",
         "Instead of waiting for citizens to complain, the Road Health Map automatically highlights damaged corridors in red and orange based on real sensor data."),
        
        ("5. Detected Issues (/issues) & Detail View (/issues/[id])",
         "Searchable ticket table. Detail view shows GPS on mini-map, before/after photos, PostGIS 10m spatial clustering, and action buttons: Assign Team, Mark Repaired, AI Verify Repair.",
         "Demonstrates closed-loop maintenance lifecycle and prevents duplicate ticket spam.",
         "Here is our closed-loop ticket management. If three buses pass the same pothole, our spatial algorithm clusters them into one single issue ticket. Once PWD repairs it, the next bus pass automatically marks it as verified."),
        
        ("6. Incidents & ANPR (/incidents)",
         "Hit-and-run tracking, rash driving speed estimation, High-Security Registration Plate (HSRP) OCR with 96.4% confidence, multi-bus handoff, and direct police dispatch.",
         "Satisfies Bharat Electronics Limited (BEL)'s smart automation and security surveillance requirements.",
         "This module addresses Bharat Electronics Limited's requirement for security automation. When rash driving or an accident occurs, bus cameras capture the license plate and calculate vehicle speed, enabling instant police dispatch."),
        
        ("7. Traffic Intelligence (/traffic)",
         "Origin-Destination (OD) flow matrix between city hubs, corridor congestion bottlenecks, transit delay impact analysis, and School Zone safety risks with student crossing density alerts.",
         "Demonstrates that buses act as natural traffic probe sensors to help traffic police and protect school zones.",
         "Public buses are natural traffic probes. We analyze bus speeds to identify traffic choke points and monitor School Zones to protect children crossing the road."),
        
        ("8. Analytics (/analytics)",
         "Historical trends, monthly defect discovery charts, ward-by-ward comparisons (Ward A vs Ward D), and department resolution time benchmarks.",
         "Provides municipal commissioners with accountability and governance metrics to track contractor performance.",
         "This page empowers municipal commissioners with accountability metrics—comparing which municipal wards are fixing issues fastest."),
        
        ("9. Fleet Management (/fleet)",
         "Industrial hardware monitoring of onboard computers: NVIDIA Jetson Orin Nano specs, GPU temperature, storage capacity, offline sync queues, and remote 'Reboot Edge Node' action.",
         "Proves hardware feasibility and industrial reliability for electronics and defense evaluators.",
         "As an electronics and defense platform, hardware reliability is critical. This screen monitors the health of all onboard Jetson computers and allows remote rebooting if an edge node freezes."),
        
        ("10. System Architecture (/architecture)",
         "Full technical blueprint: Edge Layer (Cameras, Jetson, GPS, IMU), Network Layer (4G/5G MQTT + Depot Wi-Fi 6 offload), Cloud Layer (Next.js, PostGIS), and payload comparison: 14.8 KB vs 100 GB raw video.",
         "Answers judges' questions regarding network scalability, bandwidth cost, and privacy protection.",
         "This is our technical architecture diagram. We emphasize edge processing to ensure zero cellular bill shock—transmitting lightweight JSON telemetry while saving raw video for depot Wi-Fi transfer."),
        
        ("11. Pilot & Deployment (/pilot)",
         "3-Phase deployment roadmap (5 Buses → 20 Buses → 200 Buses), hardware Bill of Materials (BOM) cost (~₹42,000 per vehicle kit), and municipal ROI (₹1.8 Crore annual savings).",
         "Proves the project is commercially viable and ready for immediate deployment in Indian smart cities.",
         "We have a clear 3-phase rollout roadmap with an exact Bill of Materials. At just ₹42,000 per bus, the platform pays for itself within 6 months by eliminating manual inspection contractors."),
        
        ("12. Settings (/settings)",
         "System configuration: AI detection confidence slider (default 85%), alert notification toggles, department contact directory, and API keys.",
         "Allows municipal engineers to calibrate false positive rates and configure emergency dispatch contacts.",
         "Municipal engineers can adjust AI sensitivity thresholds to ensure only genuine, high-confidence defects trigger emergency alerts.")
    ]
    
    for title, shows, why, say in menus:
        item_block = []
        item_block.append(Paragraph(f"<b>{title}</b>", h2_style))
        item_block.append(Paragraph(f"<b>• What it shows:</b> {shows}", body_style))
        item_block.append(Paragraph(f"<b>• Why it exists:</b> {why}", body_style))
        
        say_table = Table([[Paragraph(f"<b>🗣️ What to say to judges:</b> <i>\"{say}\"</i>", callout_style)]], colWidths=[530])
        say_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F0F9FF')),
            ('LINELEFT', (0, 0), (0, 0), 2.5, colors.HexColor('#0284C7')),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ]))
        item_block.append(say_table)
        item_block.append(Spacer(1, 6))
        story.append(KeepTogether(item_block))
    
    story.append(Spacer(1, 10))
    
    # -------------------------------------------------------------
    # PART 4: Special Header Features (Demo Tools)
    # -------------------------------------------------------------
    h4_block = []
    h4_block.append(Paragraph("PART 4: Special Header Features (Interactive Demo Tools)", h1_style))
    
    header_tools = [
        ("Run Scenario Button", "Triggers a pre-scripted 15-step interactive story: Bus departs → Scans road → Detects pothole → Tags GPS → Deduplicates → Updates map → Dispatches repair team. Perfect for live jury presentations."),
        ("Simulation Live Toggle", "Starts or pauses continuous live bus movement and simulated sensor telemetry across Kolhapur transit routes."),
        ("Clickable Notification Bell (🔔)", "Clicking any alert automatically marks it as read and navigates directly to that specific issue detail page (e.g. /issues/PH-2048), traffic corridor, or bus."),
        ("Presentation Mode & HUD", "Maximizes the screen into a clean control room HUD for pitch decks and projector displays."),
        ("Mobile Hamburger Drawer (☰)", "Fully responsive drawer menu allowing field ward engineers to inspect road issues directly on their smartphones.")
    ]
    
    for tool_name, tool_desc in header_tools:
        h4_block.append(Paragraph(f"• <b>{tool_name}:</b> {tool_desc}", body_style))
    
    story.append(KeepTogether(h4_block))
    story.append(Spacer(1, 12))
    
    # -------------------------------------------------------------
    # PART 5: Recommended 3-Minute Live Demo Pitch Flow
    # -------------------------------------------------------------
    h5_block = []
    h5_block.append(Paragraph("PART 5: Recommended 3-Minute Live Demo Pitch Flow", h1_style))
    
    pitch_flow_data = [
        [Paragraph("<b>Timing</b>", bold_label), Paragraph("<b>Screen / Feature</b>", bold_label), Paragraph("<b>Action & Pitch</b>", bold_label)],
        [Paragraph("0:00 - 0:45", body_style), Paragraph("<b>Command Center (/)</b>", bold_label), Paragraph("Deliver the 60-second elevator pitch. Point out active bus count and transit map.", body_style)],
        [Paragraph("0:45 - 1:15", body_style), Paragraph("<b>Run Scenario (Header)</b>", bold_label), Paragraph("Click 'Run Scenario'. Let judges watch step-by-step automation (Steps 1 to 6).", body_style)],
        [Paragraph("1:15 - 1:50", body_style), Paragraph("<b>AI Demo (/ai-demo)</b>", bold_label), Paragraph("Show live bounding box canvas, confidence score (94%), and 9-step edge pipeline.", body_style)],
        [Paragraph("1:50 - 2:20", body_style), Paragraph("<b>Bell (🔔) → Issue Detail</b>", bold_label), Paragraph("Click Bell notification 'Critical Pothole Detected' → jumps to /issues/PH-2048 with before/after photos.", body_style)],
        [Paragraph("2:20 - 2:45", body_style), Paragraph("<b>Incidents (/incidents)</b>", bold_label), Paragraph("Show hit-and-run tracking, 96.4% HSRP plate OCR, and direct police dispatch.", body_style)],
        [Paragraph("2:45 - 3:00", body_style), Paragraph("<b>Architecture & Pilot</b>", bold_label), Paragraph("Conclude on 14.8 KB payload, ₹42,000 BOM cost per bus, and ₹1.8 Crore annual municipal savings.", body_style)],
    ]
    
    pitch_flow_table = Table(pitch_flow_data, colWidths=[80, 150, 300])
    pitch_flow_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#F1F5F9')),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    h5_block.append(pitch_flow_table)
    story.append(KeepTogether(h5_block))
    story.append(Spacer(1, 12))
    
    # -------------------------------------------------------------
    # PART 6: Key Defense & Systems Engineering Talking Points
    # -------------------------------------------------------------
    h6_block = []
    h6_block.append(Paragraph("PART 6: Key Defense & Systems Engineering Talking Points", h1_style))
    
    talking_points = [
        ("Bandwidth & Cellular Bill Shock Prevention", "We do not stream continuous 1080p video over 4G/5G. Instead, our onboard Jetson Orin Nano extracts only the detection frame, calculates the defect polygon, and transmits a 14.8 KB JSON payload. Raw video is cached locally on NVMe storage and bulk-offloaded over Depot Wi-Fi 6 at night."),
        ("Multi-Sensor Fusion (Rejecting Shadows & False Positives)", "Optical cameras can be fooled by tree shadows or dark oil stains. UrbanPulse correlates the visual pothole detection with a Z-axis vertical vibration spike (>1.8G) from the 6-DOF IMU accelerometer when the bus wheels encounter the defect, achieving 93.5% precision."),
        ("PostGIS Spatial Deduplication (10m Radius Clustering)", "If 5 different buses pass the same pothole on Station Road, our cloud backend does NOT create 5 separate municipal tickets. It runs a PostGIS ST_DWithin spatial query within a 10-meter radius, merging all sightings into Issue #PH-2048 with an incremented sighting counter."),
        ("Closed-Loop Maintenance Lifecycle", "Most systems stop at reporting. UrbanPulse completes the loop: Issue Detected → Work Order Issued → Contractor Repairs → Next Scheduled Bus Passes → AI Re-Scan Confirms Smooth Asphalt → Work Order Automatically Closed.")
    ]
    
    for tp_title, tp_desc in talking_points:
        h6_block.append(Paragraph(f"★ <b>{tp_title}:</b> {tp_desc}", body_style))
        h6_block.append(Spacer(1, 3))
        
    story.append(KeepTogether(h6_block))
    
    doc.build(story)
    print(f"PDF successfully created at: {pdf_path}")

if __name__ == "__main__":
    generate_pdf()
