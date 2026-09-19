import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=120, bottom=120, left=180, right=180):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}>'
                      f'<w:top w:w="{top}" w:type="dxa"/>'
                      f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
                      f'<w:left w:w="{left}" w:type="dxa"/>'
                      f'<w:right w:w="{right}" w:type="dxa"/>'
                      f'</w:tcMar>')
    tcPr.append(tcMar)

def add_callout(doc, quote_text, prefix="What to say to judges: "):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    
    cell = table.cell(0, 0)
    cell.width = Inches(6.5)
    set_cell_background(cell, "F0F9FF") # light cyan/sky
    set_cell_margins(cell, top=140, bottom=140, left=200, right=200)
    
    # Left border cyan
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(f'<w:tcBorders {nsdecls("w")}>'
                        f'<w:top w:val="none"/>'
                        f'<w:left w:val="single" w:sz="24" w:space="0" w:color="0284C7"/>'
                        f'<w:bottom w:val="none"/>'
                        f'<w:right w:val="none"/>'
                        f'</w:tcBorders>')
    tcPr.append(borders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.15
    
    run_prefix = p.add_run(f"🗣️ {prefix}")
    run_prefix.bold = True
    run_prefix.font.name = "Calibri"
    run_prefix.font.size = Pt(10.5)
    run_prefix.font.color.rgb = RGBColor(2, 132, 199) # Sky blue
    
    run_text = p.add_run(f'"{quote_text}"')
    run_text.italic = True
    run_text.font.name = "Calibri"
    run_text.font.size = Pt(10.5)
    run_text.font.color.rgb = RGBColor(15, 23, 42) # Dark slate
    
    doc.add_paragraph().paragraph_format.space_after = Pt(6)

def build_document():
    doc = docx.Document()
    
    # Set page margins
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    # Title Block
    title_p = doc.add_paragraph()
    title_p.paragraph_format.space_before = Pt(0)
    title_p.paragraph_format.space_after = Pt(2)
    run_title = title_p.add_run("UrbanPulse: Judge Presentation Guide")
    run_title.font.name = "Arial"
    run_title.font.size = Pt(22)
    run_title.bold = True
    run_title.font.color.rgb = RGBColor(10, 25, 47) # Deep Navy

    sub_p = doc.add_paragraph()
    sub_p.paragraph_format.space_before = Pt(0)
    sub_p.paragraph_format.space_after = Pt(14)
    run_sub = sub_p.add_run("AI-Powered Mobile Urban Intelligence Platform Using Public Transport Fleet\n"
                           "Smart India Hackathon 2026 • Problem Statement 26124 • Bharat Electronics Limited (BEL)")
    run_sub.font.name = "Calibri"
    run_sub.font.size = Pt(11)
    run_sub.font.color.rgb = RGBColor(2, 132, 199) # Cyan
    run_sub.bold = True

    # Divider line
    div_p = doc.add_paragraph()
    div_p.paragraph_format.space_after = Pt(12)
    run_div = div_p.add_run("—" * 55)
    run_div.font.color.rgb = RGBColor(203, 213, 225)

    # -------------------------------------------------------------
    # PART 1: The 60-Second Elevator Pitch
    # -------------------------------------------------------------
    h1 = doc.add_heading(level=1)
    h1_run = h1.add_run("PART 1: The 60-Second Elevator Pitch")
    h1_run.font.name = "Arial"
    h1_run.font.size = Pt(15)
    h1_run.font.color.rgb = RGBColor(10, 25, 47)
    h1.paragraph_format.space_before = Pt(10)
    h1.paragraph_format.space_after = Pt(6)

    p_memo = doc.add_paragraph()
    p_memo.paragraph_format.space_after = Pt(4)
    r_memo = p_memo.add_run("Memorize this opening statement to deliver immediately when your pitch begins:")
    r_memo.italic = True
    r_memo.font.size = Pt(10)
    r_memo.font.color.rgb = RGBColor(100, 116, 139)

    add_callout(
        doc,
        "Respected Judges, Indian cities face thousands of potholes, damaged road signs, and traffic bottlenecks every day. "
        "Currently, municipal authorities rely on citizen complaints or manual surveys, which are slow and reactive.\n\n"
        "Our solution, UrbanPulse, transforms existing public transport buses into Mobile Urban Sensing Units. "
        "As buses travel their regular daily routes across the city, edge-mounted cameras and AI automatically detect "
        "road defects, traffic violations, and safety hazards in real time.\n\n"
        "Instead of spending crores on thousands of fixed CCTV poles, a fleet of just 50 buses scans 90% of the city’s "
        "major roads multiple times every day at zero extra fuel cost.",
        prefix="Pitch Opening: "
    )

    # -------------------------------------------------------------
    # PART 2: The 4-Step Working Flow
    # -------------------------------------------------------------
    h2 = doc.add_heading(level=1)
    h2_run = h2.add_run("PART 2: The 4-Step Working Flow (How It Works)")
    h2_run.font.name = "Arial"
    h2_run.font.size = Pt(15)
    h2_run.font.color.rgb = RGBColor(10, 25, 47)
    h2.paragraph_format.space_before = Pt(12)
    h2.paragraph_format.space_after = Pt(6)

    flow_table = doc.add_table(rows=4, cols=2)
    flow_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    flow_table.autofit = False

    steps = [
        ("Step 1: Scan (Bus Fleet)", "Public buses travel their regular scheduled transit routes. High-definition front-facing and side-mounted cameras continuously record road surfaces, sidewalks, and traffic lanes."),
        ("Step 2: Detect (Edge AI on Bus)", "An onboard industrial mini-computer (NVIDIA Jetson Orin Nano) runs quantized YOLOv8 models locally at 28 FPS. It identifies potholes, waterlogging, missing zebra crossings, damaged dividers, and vehicle license plates."),
        ("Step 3: Smart Upload (14.8 KB Payload)", "The bus does NOT stream heavy raw video over cellular network (preventing data bill shock). It uploads only a lightweight 14.8 KB JSON payload with GPS coordinates, defect category, severity, and a cropped snapshot over 4G/5G. Saves 98.7% bandwidth."),
        ("Step 4: Action & Closed-Loop Verification", "The central municipal dashboard clusters duplicate detections using PostGIS 10m spatial analysis and issues a work order to the PWD. When repaired, the next bus pass automatically re-scans the coordinates and verifies the repair.")
    ]

    for idx, (step_title, step_desc) in enumerate(steps):
        row = flow_table.rows[idx]
        cell_num = row.cells[0]
        cell_desc = row.cells[1]
        
        cell_num.width = Inches(2.2)
        cell_desc.width = Inches(4.3)
        
        set_cell_background(cell_num, "F8FAFC")
        set_cell_margins(cell_num, 100, 100, 140, 140)
        set_cell_margins(cell_desc, 100, 100, 140, 140)
        
        p_num = cell_num.paragraphs[0]
        r_num = p_num.add_run(step_title)
        r_num.bold = True
        r_num.font.name = "Arial"
        r_num.font.size = Pt(10)
        r_num.font.color.rgb = RGBColor(2, 132, 199)
        
        p_desc = cell_desc.paragraphs[0]
        r_desc = p_desc.add_run(step_desc)
        r_desc.font.name = "Calibri"
        r_desc.font.size = Pt(10)
        r_desc.font.color.rgb = RGBColor(51, 65, 85)

    doc.add_paragraph().paragraph_format.space_after = Pt(10)

    # -------------------------------------------------------------
    # PART 3: Menu-by-Menu Breakdown
    # -------------------------------------------------------------
    h3 = doc.add_heading(level=1)
    h3_run = h3.add_run("PART 3: Menu-by-Menu Breakdown (What Each Page Tells Judges)")
    h3_run.font.name = "Arial"
    h3_run.font.size = Pt(15)
    h3_run.font.color.rgb = RGBColor(10, 25, 47)
    h3.paragraph_format.space_before = Pt(14)
    h3.paragraph_format.space_after = Pt(8)

    menus = [
        {
            "num": "1",
            "name": "Command Center (/)",
            "shows": "Executive overview showing city-wide statistics (Active Buses, Issues Detected, Critical Alerts), live Kolhapur transit map, real-time detection activity feed, and the 5-step process flow.",
            "why": "Gives city commissioners, municipal commissioners, and transport executives an instant high-level view of city road infrastructure without digging through raw data.",
            "say": "This is our central Command Center. At a single glance, the municipal commissioner can see active buses, today's detected defects, and live incoming alerts from across the city."
        },
        {
            "num": "2",
            "name": "Live Bus Monitor (/live-monitor)",
            "shows": "Real-time GPS tracking of active buses (BUS-042, BUS-018), route trajectories (R01, R03, R07), current speeds, and edge node health (battery voltage, GPU temperature, 5G status).",
            "why": "Demonstrates seamless integration with existing public transit fleet management systems and proves real-time telemetry streaming.",
            "say": "Here we monitor the mobile sensing fleet. We can track each bus in real time, see what route it's covering, and verify that the onboard Edge AI hardware is operating at optimal temperature."
        },
        {
            "num": "3",
            "name": "AI Detection Demo (/ai-demo) — [The Centerpiece]",
            "shows": "Interactive road simulation with real-time bounding boxes, confidence scores (94%), and the complete 9-step edge pipeline (Video Ingestion → Inference → IMU Correlation → Privacy Redaction → GPS Tagging → Deduplication). Includes presets for Pothole, Waterlogging, School Children, and Rash Driving.",
            "why": "Shows the judges the exact technical depth and AI pipeline running inside each bus.",
            "say": "This is our AI engine in action. Notice that our model runs at 28 FPS. When a pothole appears, it places a bounding box, calculates its surface area, verifies it with the bus accelerometer, and blurs human faces and private license plates for privacy."
        },
        {
            "num": "4",
            "name": "Road Health Map (/road-health)",
            "shows": "GIS map of city corridors color-coded by the Road Health Index (RHI): Green (80-100 Good), Yellow (60-79 Monitor), Orange (40-59 Poor), and Red (<40 Critical). Clicking segments displays defect counts and historical scan logs.",
            "why": "Replaces manual road inspection surveys with automated, data-backed pavement condition ratings for PWD engineers.",
            "say": "Instead of waiting for citizens to complain, the Road Health Map automatically highlights damaged corridors in red and orange based on real sensor data."
        },
        {
            "num": "5",
            "name": "Detected Issues (/issues) & Detail View (/issues/[id])",
            "shows": "Searchable ticket management table. The detail view shows exact GPS coordinates on a mini-map, before/after photos, PostGIS 10-meter spatial clustering, and action buttons: Assign Field Team, Mark Repaired, and AI Verify Repair.",
            "why": "Demonstrates closed-loop maintenance lifecycle and prevents duplicate ticket spam when multiple buses spot the same pothole.",
            "say": "Here is our closed-loop ticket management. If three buses pass the same pothole, our spatial algorithm clusters them into one single issue ticket. Once PWD repairs it, the next bus pass automatically marks it as verified."
        },
        {
            "num": "6",
            "name": "Incidents & ANPR (/incidents)",
            "shows": "Security and law enforcement intelligence: hit-and-run detection, rash driving speed estimation, High-Security Registration Plate (HSRP) OCR with 96.4% confidence, multi-bus handoff, and direct police dispatch integration.",
            "why": "Directly satisfies Bharat Electronics Limited (BEL)'s smart automation and security surveillance requirements.",
            "say": "This module addresses Bharat Electronics Limited's requirement for security automation. When rash driving or an accident occurs, bus cameras capture the license plate and calculate vehicle speed, enabling instant police dispatch."
        },
        {
            "num": "7",
            "name": "Traffic Intelligence (/traffic)",
            "shows": "Origin-Destination (OD) flow matrix between city hubs, corridor congestion bottlenecks, transit delay impact analysis, and School Zone safety risks with student crossing density alerts.",
            "why": "Demonstrates that buses act as natural traffic probe sensors, helping traffic police optimize signals and protect school zones.",
            "say": "Public buses are natural traffic probes. We analyze bus speeds to identify traffic choke points and monitor School Zones to protect children crossing the road."
        },
        {
            "num": "8",
            "name": "Analytics (/analytics)",
            "shows": "Historical trends, monthly defect discovery charts, ward-by-ward comparisons (Ward A vs Ward D), and department resolution time benchmarks.",
            "why": "Provides municipal commissioners with accountability and governance metrics to track contractor performance.",
            "say": "This page empowers municipal commissioners with accountability metrics—comparing which municipal wards are fixing issues fastest."
        },
        {
            "num": "9",
            "name": "Fleet Management (/fleet)",
            "shows": "Industrial hardware monitoring of onboard computers: NVIDIA Jetson Orin Nano specs, GPU temperature, storage capacity, offline sync queues, and remote 'Reboot Edge Node' action.",
            "why": "Proves hardware feasibility and industrial reliability for electronics and defense evaluators.",
            "say": "As an electronics and defense platform, hardware reliability is critical. This screen monitors the health of all onboard Jetson computers and allows remote rebooting if an edge node freezes."
        },
        {
            "num": "10",
            "name": "System Architecture (/architecture)",
            "shows": "Full technical blueprint: Edge Layer (Cameras, Jetson, GPS, IMU), Network Layer (4G/5G MQTT + Depot Wi-Fi 6 offload), Cloud Layer (Next.js, FastAPI, PostGIS), and data payload comparison: 14.8 KB metadata vs 100 GB raw video.",
            "why": "Answers judges' questions regarding network scalability, bandwidth cost, and privacy protection.",
            "say": "This is our technical architecture diagram. We emphasize edge processing to ensure zero cellular bill shock—transmitting lightweight JSON telemetry while saving raw video for depot Wi-Fi transfer."
        },
        {
            "num": "11",
            "name": "Pilot & Deployment (/pilot)",
            "shows": "3-Phase deployment roadmap (5 Buses → 20 Buses → 200 Buses), hardware Bill of Materials (BOM) cost (~₹42,000 per vehicle kit), and municipal ROI (₹1.8 Crore annual savings).",
            "why": "Proves the project is commercially viable and ready for immediate deployment in Indian smart cities.",
            "say": "We have a clear 3-phase rollout roadmap with an exact Bill of Materials. At just ₹42,000 per bus, the platform pays for itself within 6 months by eliminating manual inspection contractors."
        },
        {
            "num": "12",
            "name": "Settings (/settings)",
            "shows": "System configuration: AI detection confidence slider (default 85%), alert notification toggles, department contact directory, and API keys.",
            "why": "Allows municipal engineers to calibrate false positive rates and configure emergency dispatch contacts.",
            "say": "Municipal engineers can adjust AI sensitivity thresholds to ensure only genuine, high-confidence defects trigger emergency alerts."
        }
    ]

    for item in menus:
        p_item_title = doc.add_paragraph()
        p_item_title.paragraph_format.space_before = Pt(8)
        p_item_title.paragraph_format.space_after = Pt(2)
        r_it = p_item_title.add_run(f"{item['num']}. {item['name']}")
        r_it.bold = True
        r_it.font.name = "Arial"
        r_it.font.size = Pt(12)
        r_it.font.color.rgb = RGBColor(10, 25, 47)
        
        p_desc = doc.add_paragraph()
        p_desc.paragraph_format.space_after = Pt(2)
        p_desc.paragraph_format.line_spacing = 1.15
        
        r_w1 = p_desc.add_run("• What it shows: ")
        r_w1.bold = True
        r_w1.font.size = Pt(10)
        p_desc.add_run(item["shows"]).font.size = Pt(10)
        
        p_desc2 = doc.add_paragraph()
        p_desc2.paragraph_format.space_after = Pt(4)
        p_desc2.paragraph_format.line_spacing = 1.15
        r_w2 = p_desc2.add_run("• Why it exists: ")
        r_w2.bold = True
        r_w2.font.size = Pt(10)
        p_desc2.add_run(item["why"]).font.size = Pt(10)
        
        add_callout(doc, item["say"])

    # -------------------------------------------------------------
    # PART 4: Special Header Features (Demo Tools)
    # -------------------------------------------------------------
    h4 = doc.add_heading(level=1)
    h4_run = h4.add_run("PART 4: Special Header Features (Interactive Demo Tools)")
    h4_run.font.name = "Arial"
    h4_run.font.size = Pt(15)
    h4_run.font.color.rgb = RGBColor(10, 25, 47)
    h4.paragraph_format.space_before = Pt(14)
    h4.paragraph_format.space_after = Pt(6)

    header_features = [
        ("Run Scenario Button", "Triggers a pre-scripted 15-step interactive story: Bus departs → Scans road → Detects pothole → Tags GPS → Deduplicates → Updates map → Dispatches repair team. Perfect for live jury presentations."),
        ("Simulation Live Toggle", "Starts or pauses continuous live bus movement and simulated sensor telemetry across Kolhapur transit routes."),
        ("Clickable Notification Bell (🔔)", "Clicking any alert automatically marks it as read and navigates directly to that specific issue detail page (e.g. /issues/PH-2048), traffic corridor, or bus."),
        ("Presentation Mode & HUD", "Maximizes the screen into a clean control room HUD for pitch decks and projector displays."),
        ("Mobile Hamburger Drawer (☰)", "Fully responsive drawer menu allowing field ward engineers to inspect road issues directly on their smartphones.")
    ]

    for feat, desc in header_features:
        p_hf = doc.add_paragraph()
        p_hf.paragraph_format.space_after = Pt(3)
        r_hfb = p_hf.add_run(f"• {feat}: ")
        r_hfb.bold = True
        r_hfb.font.name = "Calibri"
        r_hfb.font.size = Pt(10.5)
        r_hfb.font.color.rgb = RGBColor(2, 132, 199)
        r_hfd = p_hf.add_run(desc)
        r_hfd.font.name = "Calibri"
        r_hfd.font.size = Pt(10.5)

    doc.add_paragraph().paragraph_format.space_after = Pt(10)

    # -------------------------------------------------------------
    # PART 5: Recommended 3-Minute Live Demo Pitch Flow
    # -------------------------------------------------------------
    h5 = doc.add_heading(level=1)
    h5_run = h5.add_run("PART 5: Recommended 3-Minute Live Demo Pitch Flow")
    h5_run.font.name = "Arial"
    h5_run.font.size = Pt(15)
    h5_run.font.color.rgb = RGBColor(10, 25, 47)
    h5.paragraph_format.space_before = Pt(14)
    h5.paragraph_format.space_after = Pt(6)

    demo_steps = [
        ("Minute 0:00 - 0:45", "Command Center (/)", "Start on the Command Center. Give the 60-second elevator pitch. Point out the live active bus count and the transit map of Kolhapur."),
        ("Minute 0:45 - 1:15", "Run Scenario (Header)", "Click 'Run Scenario' in the top header. Let the judges see the step-by-step automation (Step 1 to Step 6) as the bus scans the road."),
        ("Minute 1:15 - 1:50", "AI Detection Demo (/ai-demo)", "Navigate to AI Demo. Show the live bounding box canvas, confidence score (94%), and explain the 9-step edge pipeline and IMU bump sensor fusion."),
        ("Minute 1:50 - 2:20", "Click Notification (🔔) → Issue Detail", "Click the Bell icon and select 'Critical Pothole Detected'. Show how it jumps directly to the Issue Detail Page (/issues/PH-2048) with before/after photos and spatial deduplication."),
        ("Minute 2:20 - 2:45", "Incidents & ANPR (/incidents)", "Switch to Incidents. Show hit-and-run tracking, 96.4% HSRP license plate OCR, and direct one-click police dispatch."),
        ("Minute 2:45 - 3:00", "System Architecture (/architecture) & Pilot", "Conclude on the Architecture and Pilot pages. Highlight the 14.8 KB payload, ₹42,000 BOM cost per bus, and ₹1.8 Crore annual municipal savings.")
    ]

    table_pitch = doc.add_table(rows=len(demo_steps), cols=3)
    table_pitch.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_pitch.autofit = False

    for idx, (timing, page, action) in enumerate(demo_steps):
        row = table_pitch.rows[idx]
        c0, c1, c2 = row.cells[0], row.cells[1], row.cells[2]
        
        c0.width = Inches(1.5)
        c1.width = Inches(1.8)
        c2.width = Inches(3.2)
        
        set_cell_background(c0, "F1F5F9")
        set_cell_margins(c0, 80, 80, 100, 100)
        set_cell_margins(c1, 80, 80, 100, 100)
        set_cell_margins(c2, 80, 80, 100, 100)
        
        r0 = c0.paragraphs[0].add_run(timing)
        r0.bold = True
        r0.font.size = Pt(9.5)
        r0.font.color.rgb = RGBColor(15, 23, 42)
        
        r1 = c1.paragraphs[0].add_run(page)
        r1.bold = True
        r1.font.size = Pt(9.5)
        r1.font.color.rgb = RGBColor(2, 132, 199)
        
        r2 = c2.paragraphs[0].add_run(action)
        r2.font.size = Pt(9.5)
        r2.font.color.rgb = RGBColor(51, 65, 85)

    doc.add_paragraph().paragraph_format.space_after = Pt(14)

    # -------------------------------------------------------------
    # PART 6: Key Defense & Systems Engineering Talking Points
    # -------------------------------------------------------------
    h6 = doc.add_heading(level=1)
    h6_run = h6.add_run("PART 6: Key Defense & Systems Engineering Talking Points")
    h6_run.font.name = "Arial"
    h6_run.font.size = Pt(15)
    h6_run.font.color.rgb = RGBColor(10, 25, 47)
    h6.paragraph_format.space_before = Pt(14)
    h6.paragraph_format.space_after = Pt(6)

    talking_points = [
        ("Bandwidth & Cellular Bill Shock Prevention", "We do not stream continuous 1080p video over 4G/5G. Instead, our onboard Jetson Orin Nano extracts only the detection frame, calculates the defect polygon, and transmits a 14.8 KB JSON payload. Raw video is cached locally on NVMe storage and bulk-offloaded over Depot Wi-Fi 6 at night."),
        ("Multi-Sensor Fusion (Rejecting Shadows & False Positives)", "Optical cameras can be fooled by tree shadows or dark oil stains. UrbanPulse correlates the visual pothole detection with a Z-axis vertical vibration spike (>1.8G) from the 6-DOF IMU accelerometer when the bus wheels encounter the defect, achieving 93.5% precision."),
        ("PostGIS Spatial Deduplication (10m Radius Clustering)", "If 5 different buses pass the same pothole on Station Road, our cloud backend does NOT create 5 separate municipal tickets. It runs a PostGIS ST_DWithin spatial query within a 10-meter radius, merging all sightings into Issue #PH-2048 with an incremented sighting counter."),
        ("Closed-Loop Maintenance Lifecycle", "Most systems stop at reporting. UrbanPulse completes the loop: Issue Detected → Work Order Issued → Contractor Repairs → Next Scheduled Bus Passes → AI Re-Scan Confirms Smooth Asphalt → Work Order Automatically Closed.")
    ]

    for tp_title, tp_desc in talking_points:
        p_tp = doc.add_paragraph()
        p_tp.paragraph_format.space_after = Pt(4)
        p_tp.paragraph_format.line_spacing = 1.15
        
        r_tpb = p_tp.add_run(f"★ {tp_title}: ")
        r_tpb.bold = True
        r_tpb.font.name = "Calibri"
        r_tpb.font.size = Pt(10.5)
        r_tpb.font.color.rgb = RGBColor(10, 25, 47)
        
        r_tpd = p_tp.add_run(tp_desc)
        r_tpd.font.name = "Calibri"
        r_tpd.font.size = Pt(10.5)
        r_tpd.font.color.rgb = RGBColor(51, 65, 85)

    # Save document
    doc_path = "c:\\Users\\IDEAPAD GAMING\\Downloads\\SIH stuffs\\web application for sih\\urbanpulse\\UrbanPulse_Judges_Presentation_Guide.docx"
    doc.save(doc_path)
    print(f"Document successfully created at: {doc_path}")

if __name__ == "__main__":
    build_document()
