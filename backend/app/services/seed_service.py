import json
import os
from pathlib import Path
from datetime import datetime
from flask import current_app
from backend.app.extensions import db
from backend.app.models import (
    AdminUser,
    NewsItem,
    TeamMember,
    Collaborator,
    Publication,
    Facility,
    ContactInquiry,
    HomepageConfig,
    AboutConfig,
    ResearchPillar,
    GalleryItem,
    SiteSettings,
)

def load_json(filepath: Path, fallback):
    if filepath.exists():
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"[Seed] Warning: failed to load {filepath}: {e}")
    return fallback

def seed_database():
    """Idempotently seeds the database from JSON files in the data directory."""
    data_dir = Path(current_app.config["DATA_DIR"])
    data_dir.mkdir(parents=True, exist_ok=True)

    # 1. Admin user
    if AdminUser.query.count() == 0:
        admin = AdminUser(
            id="admin-1",
            username="admin",
            email="admin@mindh-lab.org",
            role="Super Admin",
            created_at=datetime.utcnow(),
        )
        admin.set_password("Admin@MINDH2024!")
        db.session.add(admin)
        print("[Seed] Created default Super Admin user (admin / Admin@MINDH2024!)")

    # 2. News items
    if NewsItem.query.count() == 0:
        news_file = data_dir / "news.json"
        items = load_json(news_file, [])
        for it in items:
            db.session.add(NewsItem(
                id=it["id"],
                title=it["title"],
                description=it["description"],
                summary=it.get("summary") or (it["description"][:160] + "..."),
                image=it.get("image", "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800"),
                date=it.get("date", "2024-08-15"),
                category=it.get("category", "Lab Update"),
                link_text=it.get("linkText"),
                link_url=it.get("linkUrl"),
                published=it.get("published", True),
                order_index=it.get("orderIndex", 0),
                created_at=it.get("createdAt", datetime.utcnow().isoformat()),
                updated_at=it.get("updatedAt"),
            ))
        print(f"[Seed] Seeded {len(items)} news items")

    # 3. Publications
    if Publication.query.count() == 0:
        pubs_file = data_dir / "publications.json"
        pubs = load_json(pubs_file, [])
        for it in pubs:
            db.session.add(Publication(
                id=it["id"],
                title=it["title"],
                authors=it["authors"],
                journal=it["journal"],
                year=int(it["year"]),
                topic=it.get("topic", "Physiological Monitoring"),
                doi_url=it.get("doiUrl", "#"),
                pdf_url=it.get("pdfUrl", "#"),
                code_url=it.get("codeUrl"),
                abstract=it.get("abstract", ""),
                highlight=it.get("highlight"),
                bibtex=it.get("bibtex", ""),
                published=it.get("published", True),
                order_index=it.get("orderIndex", 0),
                created_at=it.get("createdAt", datetime.utcnow().isoformat()),
            ))
        print(f"[Seed] Seeded {len(pubs)} publications")

    # 4. Team members
    if TeamMember.query.count() == 0:
        team_file = data_dir / "team.json"
        members = load_json(team_file, [])
        for it in members:
            db.session.add(TeamMember(
                id=it["id"],
                name=it["name"],
                role=it["role"],
                category=it.get("category", "Researchers"),
                credentials=it.get("credentials", ""),
                bio=it.get("bio", ""),
                detailed_bio=it.get("detailedBio", ""),
                lab_role_detail=it.get("labRoleDetail", ""),
                focus=it.get("focus", []),
                skills=it.get("skills", []),
                contributions=it.get("contributions", []),
                projects=it.get("projects", []),
                publications=it.get("publications", []),
                awards=it.get("awards", []),
                avatar_url=it.get("avatarUrl", ""),
                email=it.get("email"),
                scholar_url=it.get("scholarUrl"),
                orcid_url=it.get("orcidUrl"),
                research_gate_url=it.get("researchGateUrl"),
                website_url=it.get("websiteUrl"),
                linkedin_url=it.get("linkedinUrl"),
                github_url=it.get("githubUrl"),
                twitter_url=it.get("twitterUrl"),
                instagram_url=it.get("instagramUrl"),
                show_email=it.get("showEmail", True),
                show_social_links=it.get("showSocialLinks", True),
                show_publications=it.get("showPublications", True),
                show_projects=it.get("showProjects", True),
                is_public=it.get("isPublic", True),
                published=it.get("published", True),
                order_index=it.get("orderIndex", 0),
            ))
        print(f"[Seed] Seeded {len(members)} team members")

    # 5. Facilities
    if Facility.query.count() == 0:
        fac_file = data_dir / "facilities.json"
        facilities = load_json(fac_file, [])
        for it in facilities:
            db.session.add(Facility(
                id=it["id"],
                title=it["title"],
                tag=it["tag"],
                desc=it["desc"],
                specs=it.get("specs", []),
                status=it.get("status", "Operational"),
                icon_name=it.get("iconName"),
                image_url=it.get("imageUrl"),
                published=it.get("published", True),
                order_index=it.get("orderIndex", 0),
            ))
        print(f"[Seed] Seeded {len(facilities)} facilities")

    # 6. Collaborators
    if Collaborator.query.count() == 0:
        collab_file = data_dir / "collaborators.json"
        collaborators = load_json(collab_file, [
            {
                "id": "collab-1",
                "name": "Massachusetts General Hospital & Harvard Medical School",
                "shortName": "Mass General / Harvard",
                "category": "Clinical & Hospital",
                "location": "Boston, Massachusetts, USA",
                "logoUrl": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400",
                "description": "Primary clinical trial partner for multi-bed ICU contactless optical telemetry, continuous neonatal hemodynamic monitoring, and acute sepsis early warning deployment.",
                "jointFocus": ["Zero-Contact ICU Hemodynamics", "Continuous Pediatric Monitoring", "Infectious Disease Isolation Telemetry", "Clinical Protocol Adjudication"],
                "keyContacts": ["Dr. Sarah Al-Mansoor, MD (ICU Director)", "Prof. Robert Lang, MD (Pulmonary Medicine)"],
                "activeTrials": ["Contactless ICU Vital Sign Extraction Trial (NCT05128911)", "Pediatric Respiratory Distress Early Warning Pilot"],
                "websiteUrl": "https://www.massgeneral.org",
                "isFeatured": True,
                "orderIndex": 1
            },
            {
                "id": "collab-2",
                "name": "Johns Hopkins Medicine & Whiting School of Engineering",
                "shortName": "Johns Hopkins University",
                "category": "Academic Institution",
                "location": "Baltimore, Maryland, USA",
                "logoUrl": "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=400",
                "description": "Pioneering collaborative research on explainable concept bottleneck architectures, physician alert fatigue mitigation, and human-in-the-loop clinical decision support.",
                "jointFocus": ["Explainable AI (XAI) for Critical Care", "Concept Bottleneck Architectures", "Physician Trust & Recourse Audits", "Bedside Diagnostic Usability"],
                "keyContacts": ["Dr. Marcus Thorne, PhD (Assistant Professor)", "Prof. Elena Rostova, MD, PhD"],
                "activeTrials": ["Multi-Hospital Clinician Diagnostic Usability Benchmark", "Counterfactual Explanations in Emergency Triage"],
                "websiteUrl": "https://www.hopkinsmedicine.org",
                "isFeatured": True,
                "orderIndex": 2
            },
            {
                "id": "collab-3",
                "name": "Stanford Health Care - Division of Cardiovascular Health",
                "shortName": "Stanford Health Care",
                "category": "Clinical & Hospital",
                "location": "Stanford, California, USA",
                "logoUrl": "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400",
                "description": "Multi-center clinical site evaluating wearable photoplethysmography and bio-impedance sensor fusion for ambulatory continuous blood pressure tracking and arrhythmia prediction.",
                "jointFocus": ["Cuffless Continuous Arterial Pressure", "Ambulatory Arrhythmia Telemetry", "Photoplethysmography Sensor Fusion", "AAMI Protocol Validation"],
                "keyContacts": ["Prof. David K. Patel, MD, PhD (Adjunct Investigator)", "Dr. Michael Chen, MD, FACC"],
                "activeTrials": ["CardioState Ambulatory Hypertension Cohort (1,500 Patients)", "Beat-to-Beat PTT Hemodynamic Validation"],
                "websiteUrl": "https://stanfordhealthcare.org",
                "isFeatured": True,
                "orderIndex": 3
            },
            {
                "id": "collab-4",
                "name": "MIT Institute for Medical Engineering and Science (IMES)",
                "shortName": "MIT IMES & CSAIL",
                "category": "Academic Institution",
                "location": "Cambridge, Massachusetts, USA",
                "logoUrl": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=400",
                "description": "Joint theoretical engineering on foundational physiological representation learning, high-dimensional wavelet manifolds, and edge-deployable temporal transformer models.",
                "jointFocus": ["Self-Supervised Biosignal Foundation Models", "CardioState-10M Pre-training Benchmark", "Wavelet Signal Decomposition", "Edge Microprocessor Optimization"],
                "keyContacts": ["Prof. Alex Vance, PhD", "Dr. Clara Zhang, PhD (Postdoctoral Affiliate)"],
                "activeTrials": ["10-Million-Hour Ambience Waveform Benchmark", "Cross-Modal ECG-to-PPG Synthetic Reconstruction"],
                "websiteUrl": "https://imes.mit.edu",
                "isFeatured": True,
                "orderIndex": 4
            },
            {
                "id": "collab-5",
                "name": "Philips Healthcare - Clinical Informatics Research",
                "shortName": "Philips Healthcare",
                "category": "Industry & Technology",
                "location": "Cambridge, MA & Eindhoven, Netherlands",
                "logoUrl": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400",
                "description": "Industry co-development of HL7 FHIR real-time physiological telemetry interfaces and next-generation bedside patient monitor micro-services.",
                "jointFocus": ["HL7 FHIR Interoperability Protocols", "Patient Monitor Hardware Integration"],
                "keyContacts": ["Erik Van Der Linden (VP Research)", "Dr. Anika Mehta, PhD"],
                "activeTrials": ["Bedside Smart Telemetry Protocol Trial", "Real-Time Interoperability Showcase"],
                "websiteUrl": "https://www.philips.com/healthcare",
                "isFeatured": True,
                "orderIndex": 5
            }
        ])
        for it in collaborators:
            db.session.add(Collaborator(
                id=it["id"],
                name=it["name"],
                short_name=it.get("shortName"),
                category=it["category"],
                location=it["location"],
                logo_url=it.get("logoUrl", "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400"),
                description=it["description"],
                joint_focus=it.get("jointFocus", []),
                key_contacts=it.get("keyContacts", []),
                active_trials=it.get("activeTrials", []),
                website_url=it.get("websiteUrl"),
                is_featured=it.get("isFeatured", True),
                published=it.get("published", True),
                order_index=it.get("orderIndex", 0),
            ))
        print(f"[Seed] Seeded {len(collaborators)} collaborators")

    # 7. Homepage config
    if HomepageConfig.query.count() == 0:
        hp_file = data_dir / "homepage.json"
        hp = load_json(hp_file, {
            "heroBadge": "Translational Digital Health & Informatics",
            "heroTitle": "Precision Physiological Sensing & AI-Driven Clinical Informatics",
            "heroHighlight": "Precision Physiological Sensing",
            "heroSubtitle": "Pioneering contactless vital signs, edge-deployable bio-signal processing, and continuous bedside intelligence to prevent acute clinical deterioration.",
            "stats": [
                { "label": "15,000+", "value": "Monitored Cohort", "detail": "Sub-second anomaly alert latency" },
                { "label": "±1.4 BPM", "value": "rPPG Pulse Error", "detail": "Validated contactless optical sensing" },
                { "label": "<16 ms", "value": "Bedside Inference", "detail": "Edge neural network telemetry" },
                { "label": "4.6 hrs", "value": "Early Warning", "detail": "Self-supervised bio-representation" }
            ],
            "calloutTitle": "Accelerating Translational Digital Health Together",
            "calloutSubtitle": "Whether you are a hospital clinical team seeking non-contact monitoring validation, a researcher interested in joint NSF/NIH proposals, or an industry partner, we invite you to connect.",
            "calloutButtonText": "Visit Contact & Inquiry Page",
            "calloutButtonLink": "/contact"
        })
        db.session.add(HomepageConfig(
            id="default",
            hero_badge=hp["heroBadge"],
            hero_title=hp["heroTitle"],
            hero_highlight=hp["heroHighlight"],
            hero_subtitle=hp["heroSubtitle"],
            stats=hp.get("stats", []),
            callout_title=hp["calloutTitle"],
            callout_subtitle=hp["calloutSubtitle"],
            callout_button_text=hp["calloutButtonText"],
            callout_button_link=hp["calloutButtonLink"],
        ))

    # 8. About config
    if AboutConfig.query.count() == 0:
        ab_file = data_dir / "about.json"
        ab = load_json(ab_file, {
            "missionTitle": "Translating Bedside Bio-Signals into Timely Clinical Interventions",
            "missionDescription": "The Medical Informatics and Digital Health (MINDH) Laboratory develops non-invasive physiological monitoring technologies, contactless optical sensors, and foundation models designed for direct deployment at the clinical bedside and in decentralized outpatient settings.",
            "translationPhilosophy": "Every algorithmic advancement in our laboratory is evaluated directly alongside practicing intensivists, cardiologists, and nurses to ensure that predictive power matches real-world clinical workflow constraints.",
            "directorName": "David Patel, MD, PhD",
            "directorRole": "Director, Medical Informatics & Digital Health Laboratory",
            "directorBio": "Professor of Biomedical Informatics and Associate Professor of Medicine. Dr. Patel leads multi-center investigations funded by the NIH, NSF, and clinical research foundations, focusing on continuous physiological signal processing and non-invasive cardiovascular sensing.",
            "directorImage": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=600",
            "milestones": [
                { "year": "2020", "title": "Laboratory Founded", "desc": "Established with core support from University Health Sciences and Clinical Research Consortium." },
                { "year": "2022", "title": "First In-Hospital Contactless Trial", "desc": "Deployed non-contact camera sensing across surgical telemetry beds." },
                { "year": "2023", "title": "NIH R01 Cuffless BP Consortium", "desc": "Multi-center grant awarded for continuous cuffless hemodynamic tracking." },
                { "year": "2024", "title": "Clinical Foundation Model Published", "desc": "Landmark paper accepted to Nature Digital Medicine on video rPPG." }
            ]
        })
        db.session.add(AboutConfig(
            id="default",
            mission_title=ab["missionTitle"],
            mission_description=ab["missionDescription"],
            translation_philosophy=ab["translationPhilosophy"],
            director_name=ab["directorName"],
            director_role=ab["directorRole"],
            director_bio=ab["directorBio"],
            director_image=ab["directorImage"],
            milestones=ab.get("milestones", []),
        ))

    # 9. Research pillars
    if ResearchPillar.query.count() == 0:
        res_file = data_dir / "research.json"
        pillars = load_json(res_file, [
            {
                "id": "rppg",
                "title": "Contactless Physiological Sensing",
                "subtitle": "Video-based rPPG & Thermal Imaging",
                "description": "Pioneering optical camera-based algorithms that extract pulse, respiration, and microvascular hemodynamics without physical skin contact, ideal for neonatal ICU, infectious disease isolation, and telemedicine.",
                "technologies": ["rPPG Signal Extraction", "Spatial-Temporal Attention", "Sub-pixel Motion Magnification", "Ambient Noise Filtering"],
                "metrics": [{ "label": "Pulse Accuracy", "value": "±1.4 BPM" }, { "label": "Sampling Rate", "value": "30 - 120 FPS" }],
                "icon": "Activity",
                "grantNumber": "NIH R01-EB032104",
                "status": "Active Clinical Trials",
                "published": True,
                "orderIndex": 0
            },
            {
                "id": "multimodal",
                "title": "Biomedical Signal Processing",
                "subtitle": "Multimodal ECG, PPG & Hemodynamics",
                "description": "Developing rigorous mathematical pipelines for cuffless continuous blood pressure estimation, pulse transit time (PTT) derivation, and adaptive artifact cancellation in ambulatory monitors.",
                "technologies": ["Wavelet Decomposition", "Kalman Filtering", "Beat-to-Beat PTT Tracking", "Motion Artifact Suppression"],
                "metrics": [{ "label": "BP Deviation", "value": "<4 mmHg" }, { "label": "Signal Quality Index", "value": "98.2%" }],
                "icon": "Cpu",
                "grantNumber": "NSF IIS-2104921",
                "status": "Bench & Pilot Validation",
                "published": True,
                "orderIndex": 1
            },
            {
                "id": "clinical-ai",
                "title": "Translational Clinical AI",
                "subtitle": "Bedside Decision Support & Foundation Models",
                "description": "Translating deep neural networks and self-supervised biomedical foundation models into actionable, clinically verified decision support tools that integrate seamlessly with hospital Electronic Health Records (EHR).",
                "technologies": ["Self-Supervised Learning", "EHR FHIR Interoperability", "Model Explainability (XAI)", "Prospective Trials"],
                "metrics": [{ "label": "Inference Latency", "value": "<16 ms" }, { "label": "Clinical Partners", "value": "5+ Hospital Systems" }],
                "icon": "Network",
                "grantNumber": "NIH R21-LM014298",
                "status": "Multi-Center Prospective Study",
                "published": True,
                "orderIndex": 2
            },
            {
                "id": "interventions",
                "title": "Digital Health Interventions",
                "subtitle": "Continuous Patient Monitoring & Decentralized Care",
                "description": "Designing closed-loop digital therapeutic interventions and passive bio-telemetry pipelines that allow clinicians to detect acute hemodynamic decompensation hours before overt clinical deterioration.",
                "technologies": ["Edge Computing", "HIPAA/GDPR Compliant Streams", "Early Warning Scores (NEWS2/qSOFA)", "Wearable IoT"],
                "metrics": [{ "label": "Early Detection", "value": "~4.6 hrs" }, { "label": "Monitored Cohort", "value": "15,000+ patients" }],
                "icon": "HeartPulse",
                "grantNumber": "Clinical Translational Award 2023",
                "status": "Active Deployment",
                "published": True,
                "orderIndex": 3
            }
        ])
        for it in pillars:
            db.session.add(ResearchPillar(
                id=it["id"],
                title=it["title"],
                subtitle=it.get("subtitle", ""),
                description=it["description"],
                technologies=it.get("technologies", []),
                metrics=it.get("metrics", []),
                icon=it.get("icon", "Activity"),
                grant_number=it.get("grantNumber"),
                status=it.get("status", "Active"),
                published=it.get("published", True),
                order_index=it.get("orderIndex", 0),
            ))

    # 10. Gallery items
    if GalleryItem.query.count() == 0:
        gal_file = data_dir / "gallery.json"
        gallery = load_json(gal_file, [
            {
                "id": "gal-1",
                "title": "High-Speed Optical Sensing Gantry",
                "caption": "Synchronized dual-spectrum RGB and near-infrared camera array with calibrated ambient lux control.",
                "category": "Experimental Setup",
                "imageUrl": "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80&w=1000",
                "date": "2024-05-10",
                "published": True,
                "orderIndex": 0
            },
            {
                "id": "gal-2",
                "title": "Pulsatile Hemodynamic Simulator Suite",
                "caption": "Fluke Biomedical physiological signal simulator connected to programmable pulsatile fluid phantom.",
                "category": "Experimental Setup",
                "imageUrl": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=1000",
                "date": "2024-04-18",
                "published": True,
                "orderIndex": 1
            },
            {
                "id": "gal-3",
                "title": "High-Density GPU Compute Rack",
                "caption": "Dual 8x NVIDIA A100 node cluster dedicated to training self-supervised bio-signal foundation models.",
                "category": "Experimental Setup",
                "imageUrl": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1000",
                "date": "2024-03-22",
                "published": True,
                "orderIndex": 2
            },
            {
                "id": "gal-4",
                "title": "Clinical ICU Telemetry Validation",
                "caption": "Bedside validation in medical intensive care unit with simultaneous multi-lead ECG and invasive catheter lines.",
                "category": "Clinical Site",
                "imageUrl": "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1000",
                "date": "2024-02-14",
                "published": True,
                "orderIndex": 3
            },
            {
                "id": "gal-5",
                "title": "IEEE EMBC 2024 Keynote Presentation",
                "caption": "Prof. Patel presenting real-time contactless blood pressure benchmarks to the international informatics community.",
                "category": "Conference",
                "imageUrl": "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=1000",
                "date": "2024-07-16",
                "published": True,
                "orderIndex": 4
            }
        ])
        for it in gallery:
            db.session.add(GalleryItem(
                id=it["id"],
                title=it["title"],
                caption=it.get("caption", ""),
                category=it.get("category", "Experimental Setup"),
                image_url=it["imageUrl"],
                date=it.get("date", "2024-05-10"),
                published=it.get("published", True),
                order_index=it.get("orderIndex", 0),
            ))

    # 11. Site settings
    if SiteSettings.query.count() == 0:
        set_file = data_dir / "settings.json"
        sett = load_json(set_file, {
            "labName": "MINDH Laboratory",
            "tagline": "Medical Informatics and Digital Health Laboratory",
            "contactEmail": "contact@mindh-lab.org",
            "contactPhone": "+1 (415) 555-0198",
            "address": "Division of Medical Informatics, Health Sciences Center, University Medical Campus",
            "roomLocation": "Health Sciences Tower, Suite 740, Clinical Simulation Wing",
            "visitingHours": "Monday - Friday: 09:00 - 17:00 (By Appointment)",
            "socialLinks": {
                "linkedin": "https://www.linkedin.com/company/medical-informatics-and-digital-health-lab/",
                "twitter": "https://twitter.com/MINDHLab",
                "github": "https://github.com/mindh-lab",
                "scholar": "https://scholar.google.com/citations?user=mindh-lab",
                "youtube": "https://youtube.com/@mindh-lab"
            }
        })
        db.session.add(SiteSettings(
            id="default",
            lab_name=sett["labName"],
            tagline=sett["tagline"],
            contact_email=sett["contactEmail"],
            contact_phone=sett["contactPhone"],
            address=sett["address"],
            room_location=sett["roomLocation"],
            visiting_hours=sett["visitingHours"],
            social_links=sett.get("socialLinks", {}),
        ))

    # 12. Contact Inquiries
    if ContactInquiry.query.count() == 0:
        inq_file = data_dir / "inquiries.json"
        inquiries = load_json(inq_file, [])
        for it in inquiries:
            db.session.add(ContactInquiry(
                id=it["id"],
                name=it["name"],
                email=it["email"],
                affiliation=it.get("affiliation"),
                role=it.get("role"),
                interest_type=it.get("interestType", "General Inquiry"),
                message=it["message"],
                created_at=it.get("createdAt", datetime.utcnow().isoformat()),
                status=it.get("status", "New"),
            ))

    db.session.commit()
    print("[Seed] Seeding process complete.")
