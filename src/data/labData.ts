import { Publication, ResearchPillar, LabNewsItem, TeamMember, Collaborator, LabFacility } from '../types';

export const LAB_PUBLICATIONS: Publication[] = [
  {
    id: 'pub-1',
    title: 'Contactless Physiological Monitoring Using Video-Based rPPG',
    authors: 'R. Sharma, E. Vance, C. Zhang, D. Patel, MINDH Consortium',
    journal: 'IEEE Transactions on Biomedical Engineering / Nature Digital Medicine',
    year: 2024,
    topic: 'Physiological Monitoring',
    doiUrl: 'https://doi.org/10.xxxx/example1',
    pdfUrl: 'https://arxiv.org/abs/example1',
    codeUrl: 'https://github.com/mindh-lab/rppg-contactless-vitals',
    abstract:
      'We present a robust deep learning framework for remote photoplethysmography (rPPG) that extracts pulse wave signals and respiratory rates from standard RGB video feeds under ambient hospital lighting variations.',
    highlight: 'Mean Absolute Error: 1.42 BPM across 120 intensive care subjects.',
    bibtex: `@article{sharma2024contactless,
  title={Contactless Physiological Monitoring Using Video-Based rPPG},
  author={Sharma, R. and Vance, E. and Zhang, C. and Patel, D.},
  journal={IEEE / Nature Digital Medicine},
  year={2024},
  doi={10.xxxx/example1}
}`,
  },
  {
    id: 'pub-2',
    title: 'Deep Learning Architectures for Real-Time Clinical Vital Sign Estimation',
    authors: 'H. Lin, K. Zhao, M. Thorne, S. Al-Mansoor',
    journal: 'Frontiers in Digital Health',
    year: 2023,
    topic: 'Clinical AI',
    doiUrl: 'https://doi.org/10.xxxx/example2',
    pdfUrl: 'https://arxiv.org/abs/example2',
    codeUrl: 'https://github.com/mindh-lab/dl-clinical-vitals',
    abstract:
      'Investigates edge-deployable spatio-temporal convolutional neural networks combined with transformer attention to estimate heart rate, heart rate variability (HRV), and oxygen saturation in real-time.',
    highlight: 'Real-time inference at 60 FPS on low-power bedside edge microprocessors.',
    bibtex: `@article{lin2023deeplearning,
  title={Deep Learning Architectures for Real-Time Clinical Vital Sign Estimation},
  author={Lin, H. and Zhao, K. and Thorne, M. and Al-Mansoor, S.},
  journal={Frontiers in Digital Health},
  year={2023},
  doi={10.xxxx/example2}
}`,
  },
  {
    id: 'pub-3',
    title: 'Continuous Blood Pressure Estimation via Multimodal Signal Analysis',
    authors: 'J. Mercer, A. Rostami, V. Chen, T. Bradley',
    journal: 'Sensors / Biomedical Signal Processing and Control',
    year: 2023,
    topic: 'Signal Processing',
    doiUrl: 'https://doi.org/10.xxxx/example3',
    pdfUrl: 'https://arxiv.org/abs/example3',
    codeUrl: 'https://github.com/mindh-lab/continuous-bp-multimodal',
    abstract:
      'A novel non-invasive methodology coupling photoplethysmography (PPG) and electrocardiography (ECG) pulse transit time (PTT) calculations with adaptive Kalman filtering for beat-to-beat systolic and diastolic pressure tracking.',
    highlight: 'Meets AAMI standards with SBP error < 4.2 mmHg and DBP < 3.8 mmHg.',
    bibtex: `@article{mercer2023continuous,
  title={Continuous Blood Pressure Estimation via Multimodal Signal Analysis},
  author={Mercer, J. and Rostami, A. and Chen, V. and Bradley, T.},
  journal={Sensors / Biomedical Signal Processing and Control},
  year={2023},
  doi={10.xxxx/example3}
}`,
  },
  {
    id: 'pub-4',
    title: 'Self-Supervised Contrastive Representation Learning for Arrhythmia Detection in Wearable ECG',
    authors: 'K. Zhao, S. Kapoor, J. Mercer, MINDH Clinical Team',
    journal: 'Lancet Digital Health / IEEE JBHI',
    year: 2024,
    topic: 'Clinical AI',
    doiUrl: 'https://doi.org/10.xxxx/example4',
    pdfUrl: 'https://arxiv.org/abs/example4',
    codeUrl: 'https://github.com/mindh-lab/ecg-contrastive-arrhythmia',
    abstract:
      'Pre-training transformer backbones across 1.2M unannotated ambulatory single-lead ECG segments yielding high generalizability on paroxysmal atrial fibrillation and premature ventricular contractions.',
    highlight: 'AUC-ROC 0.962 on independent multi-hospital prospective clinical trial cohort.',
    bibtex: `@article{zhao2024arrhythmia,
  title={Self-Supervised Contrastive Representation Learning for Arrhythmia Detection in Wearable ECG},
  author={Zhao, K. and Kapoor, S. and Mercer, J.},
  journal={Lancet Digital Health / IEEE JBHI},
  year={2024},
  doi={10.xxxx/example4}
}`,
  },
  {
    id: 'pub-5',
    title: 'Non-Invasive Vascular Compliance Assessment via High-Speed Video Photoplethysmography',
    authors: 'E. Vance, R. Sharma, D. Patel',
    journal: 'IEEE Journal of Biomedical and Health Informatics',
    year: 2024,
    topic: 'Physiological Monitoring',
    doiUrl: 'https://doi.org/10.xxxx/example5',
    pdfUrl: 'https://arxiv.org/abs/example5',
    codeUrl: 'https://github.com/mindh-lab/vascular-compliance-vppg',
    abstract:
      'Quantifies systemic vascular resistance and arterial stiffness through dicrotic notch analysis extracted from contactless facial and subungual microcirculation optical recordings.',
    highlight: 'Strong correlation with applanation tonometry gold standard (r = 0.88).',
    bibtex: `@article{vance2024vascular,
  title={Non-Invasive Vascular Compliance Assessment via High-Speed Video Photoplethysmography},
  author={Vance, E. and Sharma, R. and Patel, D.},
  journal={IEEE JBHI},
  year={2024},
  doi={10.xxxx/example5}
}`,
  },
];

export const RESEARCH_PILLARS: ResearchPillar[] = [
  {
    id: 'rppg',
    title: 'Contactless Physiological Sensing',
    subtitle: 'Video-based rPPG & Thermal Imaging',
    description:
      'Pioneering optical camera-based algorithms that extract pulse, respiration, and microvascular hemodynamics without physical skin contact, ideal for neonatal ICU, infectious disease isolation, and telemedicine.',
    technologies: ['rPPG Signal Extraction', 'Spatial-Temporal Attention', 'Sub-pixel Motion Magnification', 'Ambient Noise Filtering'],
    metrics: [
      { label: 'Pulse Accuracy', value: '±1.4 BPM' },
      { label: 'Sampling Rate', value: '30 - 120 FPS' },
    ],
    icon: 'Activity',
  },
  {
    id: 'multimodal',
    title: 'Biomedical Signal Processing',
    subtitle: 'Multimodal ECG, PPG & Hemodynamics',
    description:
      'Developing rigorous mathematical pipelines for cuffless continuous blood pressure estimation, pulse transit time (PTT) derivation, and adaptive artifact cancellation in ambulatory monitors.',
    technologies: ['Wavelet Decomposition', 'Kalman Filtering', 'Beat-to-Beat PTT Tracking', 'Motion Artifact Suppression'],
    metrics: [
      { label: 'BP Deviation', value: '<4 mmHg' },
      { label: 'Signal Quality Index', value: '98.2%' },
    ],
    icon: 'Cpu',
  },
  {
    id: 'clinical-ai',
    title: 'Translational Clinical AI',
    subtitle: 'Bedside Decision Support & Foundation Models',
    description:
      'Translating deep neural networks and self-supervised biomedical foundation models into actionable, clinically verified decision support tools that integrate seamlessly with hospital Electronic Health Records (EHR).',
    technologies: ['Self-Supervised Learning', 'EHR FHIR Interoperability', 'Model Explainability (XAI)', 'Prospective Trials'],
    metrics: [
      { label: 'Inference Latency', value: '<16 ms' },
      { label: 'Clinical Partners', value: '5+ Hospital Systems' },
    ],
    icon: 'Network',
  },
  {
    id: 'interventions',
    title: 'Digital Health Interventions',
    subtitle: 'Continuous Patient Monitoring & Decentralized Care',
    description:
      'Designing closed-loop digital therapeutic interventions and passive bio-telemetry pipelines that allow clinicians to detect acute hemodynamic decompensation hours before overt clinical deterioration.',
    technologies: ['Edge Computing', 'HIPAA/GDPR Compliant Streams', 'Early Warning Scores (NEWS2/qSOFA)', 'Wearable IoT'],
    metrics: [
      { label: 'Early Detection', value: '~4.6 hrs' },
      { label: 'Monitored Cohort', value: '15,000+ patients' },
    ],
    icon: 'HeartPulse',
  },
];

export const LAB_NEWS: LabNewsItem[] = [
  {
    id: 'news-1',
    date: '2024-08-15',
    category: 'Paper Accepted',
    title: 'Paper on Contactless rPPG Accepted to Nature Digital Medicine',
    description: 'Our clinical trial evaluating video-based vital sign extraction across 120 ICU beds has been accepted for publication. Demonstrating sub-1.5 BPM mean absolute error without skin contact.',
    summary: 'Our clinical trial evaluating video-based vital sign extraction in 120 ICU beds has been accepted for publication.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
    linkText: 'Read Publication',
    linkUrl: '#publications',
    createdAt: '2024-08-15T08:00:00.000Z',
  },
  {
    id: 'news-2',
    date: '2024-06-20',
    category: 'Clinical Pilot',
    title: 'Translational Clinical Pilot Launched with Regional Medical Center',
    description: 'Commenced prospective hospital deployment of our edge-AI hemodynamic warning system across surgical step-down wards, streaming real-time bedside telemetry with sub-16ms latency.',
    summary: 'Commenced prospective hospital deployment of our edge-AI hemodynamic warning system across surgical step-down wards.',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
    linkText: 'Learn More',
    linkUrl: '#research',
    createdAt: '2024-06-20T10:30:00.000Z',
  },
  {
    id: 'news-3',
    date: '2024-04-10',
    category: 'Grant Award',
    title: 'NIH R01 Grant Awarded for Continuous Cuffless Blood Pressure Research',
    description: 'A 4-year multi-center investigation into multimodal optical and bioimpedance sensor fusion for ambulatory cardiovascular assessment and non-invasive hypertension tracking.',
    summary: 'A 4-year multi-center investigation into multimodal optical and bioimpedance sensor fusion for ambulatory cardiovascular assessment.',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
    linkText: 'Inquire Collaboration',
    linkUrl: '#contact',
    createdAt: '2024-04-10T14:15:00.000Z',
  },
  {
    id: 'news-4',
    date: '2024-02-28',
    category: 'Keynote',
    title: 'Keynote at IEEE EMBC: Foundations of Bedside Computational Physiology',
    description: 'Prof. David Patel presented our latest findings on self-supervised foundation models trained on continuous multi-lead ECG and photoplethysmography streams.',
    summary: 'Keynote presentation at IEEE Engineering in Medicine and Biology Society on wearable physiological monitoring.',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800',
    linkText: 'View Presentation Details',
    linkUrl: 'https://www.linkedin.com/company/medical-informatics-and-digital-health-lab/',
    createdAt: '2024-02-28T09:00:00.000Z',
  },
];

export const LAB_TEAM: TeamMember[] = [
  {
    id: 'member-1',
    name: 'Prof. David K. Patel, MD, PhD',
    role: 'Principal Investigator & Lab Director',
    category: 'Faculty',
    credentials: 'MD (Cardiology), PhD (Biomedical Engineering, MIT)',
    bio: 'Associate Professor of Medical Informatics leading translational clinical AI, bedside telemetry foundation models, and contactless physiological monitoring.',
    detailedBio: 'Prof. David K. Patel is the Director of the Medical Informatics and Digital Health (MINDH) Laboratory. With dual board certification in Cardiovascular Medicine and a PhD in Biomedical Engineering, he directs multi-center clinical trials bridging raw bedside sensor streams with clinician-facing decision support systems. He previously held research appointments at Harvard Medical School and has authored over 95 peer-reviewed papers in Nature Digital Medicine, IEEE TBME, and Lancet Digital Health.',
    labRoleDetail: 'Oversees overall laboratory research strategy, multi-center hospital deployments, NIH R01 grant management, and clinical mentorship.',
    focus: ['Translational Informatics', 'Contactless Physiological Sensing', 'Bedside Foundation Models', 'Clinical Trial Leadership'],
    skills: ['Clinical Trial Design', 'Physiological Signal Processing', 'Translational AI Governance', 'Multimodal Biosensors', 'Hemodynamic Modeling'],
    contributions: [
      'Pioneered sub-1.5 BPM video-based contactless rPPG pulse rate estimation across 120 intensive care beds.',
      'Architected edge-AI hemodynamic collapse early warning scoring system deployed across 3 regional hospitals.',
      'Recipient of 3 NIH R01 and R21 translational medical instrumentation awards.'
    ],
    projects: [
      { title: 'Contactless Multi-Spectral ICU Vital Sensing (NIH R01)', status: 'Active', description: 'Multi-center clinical trial deploying 4K chromatic sensors for zero-contact pediatric and ICU patient telemetry.' },
      { title: 'Continuous Cuffless Arterial Pressure Monitoring', status: 'Active', description: 'Sensor fusion of optical photoplethysmography and bio-impedance for ambulatory hypertension tracking.' },
      { title: 'Self-Supervised ECG Foundation Model (CardioState-10M)', status: 'Completed', description: 'Trained on 10 million hours of continuous telemetry to predict arrhythmia onset 4 hours in advance.' }
    ],
    publications: [
      { title: 'Prospective Multi-Center Trial of Contactless Video Photoplethysmography in Critically Ill Adults', year: 2024, journalOrConference: 'Nature Digital Medicine', doi: '10.1038/s41746-024-01120-x', link: 'https://nature.com' },
      { title: 'Foundations of Bedside Computational Physiology: Self-Supervised Waveform Representation', year: 2023, journalOrConference: 'IEEE Trans. Biomedical Engineering', doi: '10.1109/TBME.2023.3289012' },
      { title: 'Real-Time Hemodynamic Decompensation Warning Using Multimodal Deep Attention', year: 2022, journalOrConference: 'Lancet Digital Health', doi: '10.1016/S2589-7500(22)00145-8' }
    ],
    awards: [
      { title: "NIH Director's Transformative Research Award", year: '2023', organization: 'National Institutes of Health' },
      { title: 'IEEE EMBC Outstanding Clinical Engineering Paper', year: '2021', organization: 'IEEE Engineering in Medicine & Biology' }
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
    email: 'd.patel@mindh-lab.org',
    scholarUrl: 'https://scholar.google.com',
    orcidUrl: 'https://orcid.org/0000-0002-1825-0097',
    researchGateUrl: 'https://researchgate.net',
    websiteUrl: 'https://mindh-lab.org/david-patel',
    linkedinUrl: 'https://www.linkedin.com/company/medical-informatics-and-digital-health-lab/',
    twitterUrl: 'https://twitter.com',
    showEmail: true,
    showSocialLinks: true,
    showPublications: true,
    showProjects: true,
    isPublic: true,
    orderIndex: 1,
  },
  {
    id: 'member-2',
    name: 'Dr. Elena Vance, PhD',
    role: 'Senior Research Scientist & Vision Lead',
    category: 'Researchers',
    credentials: 'PhD in Computer Science (Computer Vision, Stanford)',
    bio: 'Specializes in video photoplethysmography, spatial-temporal graph networks, and illumination invariance in surgical and intensive care environments.',
    detailedBio: 'Dr. Vance is a Senior Research Scientist leading the Optical Sensing and Computer Vision core at MINDH Lab. Her research centers on extracting micro-chromatic skin color fluctuations caused by sub-surface capillary blood flow using consumer and industrial video streams. Prior to joining MINDH, she completed a postdoctoral fellowship at the Stanford AI Lab, focusing on robust video processing under erratic motion and variable illumination.',
    labRoleDetail: 'Directs computer vision algorithm development, camera rig calibration, and benchmark dataset curation.',
    focus: ['rPPG Extraction', 'Computer Vision in Healthcare', 'Microcirculation Imaging', 'Optical Physics'],
    skills: ['PyTorch / JAX', 'OpenCV', 'Chrominance Physics Models', 'Optical Flow Estimation', 'Real-Time C++ Video Pipelines'],
    contributions: [
      'Created the ChromPhys benchmark containing 500+ hours of synchronized ground-truth multi-wavelength clinical video.',
      'Designed motion-compensated face and palm tracker maintaining signal-to-noise ratio during pediatric agitation.',
      'Holder of 2 US patents on contactless vital sign extraction under non-stationary lighting.'
    ],
    projects: [
      { title: 'Deep Chromatic Diffusion for Contactless SpO2', status: 'Active', description: 'Multi-wavelength reflectance estimation overcoming skin pigmentation bias in contactless pulse oximetry.' },
      { title: 'Microcirculation Perfusion Index Video Mapping', status: 'Completed', description: 'High-speed 120fps mapping of localized peripheral perfusion changes during induced septic shock models.' }
    ],
    publications: [
      { title: 'Illumination-Invariant Neural Photoplethysmography with Spatio-Temporal Attention', year: 2024, journalOrConference: 'IEEE CVPR (Healthcare Vision)', doi: '10.1109/CVPR.2024.08912' },
      { title: 'Mitigating Pigmentation Bias in Non-Contact Oxygen Saturation Estimation', year: 2023, journalOrConference: 'Nature Digital Medicine', doi: '10.1038/s41746-023-00914-1' }
    ],
    awards: [
      { title: 'MIT Technology Review 35 Under 35 Honoree', year: '2023', organization: 'MIT Tech Review' }
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
    email: 'e.vance@mindh-lab.org',
    scholarUrl: 'https://scholar.google.com',
    orcidUrl: 'https://orcid.org/0000-0001-9042-4521',
    linkedinUrl: 'https://www.linkedin.com/company/medical-informatics-and-digital-health-lab/',
    twitterUrl: 'https://twitter.com',
    showEmail: true,
    showSocialLinks: true,
    showPublications: true,
    showProjects: true,
    isPublic: true,
    orderIndex: 2,
  },
  {
    id: 'member-3',
    name: 'Dr. Rohan Sharma, PhD',
    role: 'Postdoctoral Research Fellow',
    category: 'Researchers',
    credentials: 'PhD in Electrical & Biomedical Engineering (Georgia Tech)',
    bio: 'Pioneers multimodal bio-impedance and optical sensor fusion algorithms for continuous ambulatory blood pressure estimation.',
    detailedBio: 'Dr. Rohan Sharma joined MINDH in 2023 following doctoral research on ultra-low-power biomedical micro-instrumentation. His work focuses on wearable sensor fusion—coupling high-frequency bio-impedance plethysmography with miniaturized reflective PPG to calculate continuous pulse wave transit time (PWTT) and pulse wave velocity (PWV) without an occlusive cuff.',
    labRoleDetail: 'Leads wearable hardware prototyping, microcontroller firmware design, and benchtop artifact simulation.',
    focus: ['Biomedical Signal Processing', 'Wearable Hemodynamics', 'Embedded Edge AI', 'Cuffless Blood Pressure'],
    skills: ['Embedded C/C++', 'DSP & Wavelet Transforms', 'BLE Telemetry', 'Analog Front-End Design', 'Physiological Modeling'],
    contributions: [
      'Developed sub-5mW wrist-worn bio-impedance acquisition board with continuous 500Hz sampling.',
      'Reduced mean absolute error in diastolic blood pressure tracking by 42% on standard MIMIC-IV benchmark.'
    ],
    projects: [
      { title: 'Ambulatory 24h Cuffless BP Patch', status: 'Active', description: 'Clinical trial assessing 24-hour ambulatory blood pressure monitoring compared to A-line ground truth in CCU.' }
    ],
    publications: [
      { title: 'Nonlinear Pulse Wave Transit Time Calibration for Ambulatory Blood Pressure', year: 2024, journalOrConference: 'IEEE Trans. Biomedical Circuits & Systems', doi: '10.1109/TBCAS.2024.33120' }
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    email: 'r.sharma@mindh-lab.org',
    scholarUrl: 'https://scholar.google.com',
    orcidUrl: 'https://orcid.org/0000-0003-4512-9810',
    linkedinUrl: 'https://www.linkedin.com/company/medical-informatics-and-digital-health-lab/',
    showEmail: true,
    showSocialLinks: true,
    showPublications: true,
    showProjects: true,
    isPublic: true,
    orderIndex: 3,
  },
  {
    id: 'member-4',
    name: 'Kevin Zhao, MS',
    role: 'Doctoral Candidate',
    category: 'PhD Scholars',
    credentials: 'PhD Candidate in Health Informatics & Computer Science',
    bio: 'Developing self-supervised contrastive learning algorithms on high-frequency streaming ECG and vital sign telemetry for early shock warning.',
    detailedBio: 'Kevin Zhao is a 4th-year PhD candidate co-advised by Prof. Patel and the Department of Computer Science. His dissertation investigates foundational representations of high-dimensional multi-lead electrophysiological time-series data, specifically self-supervised masking objectives for predicting acute hemodynamic decompensation.',
    labRoleDetail: "Maintains the lab's GPU cluster compute pipeline and leads transformer model development.",
    focus: ['Foundation Models for ECG', 'Time-series Transformers', 'Clinical Decision Support', 'Sepsis Early Warning'],
    skills: ['PyTorch', 'HuggingFace', 'Distributed Training (DDP/DeepSpeed)', 'EHR Data Mining', 'Survival Analysis'],
    contributions: [
      'Open-sourced CardioTransformer, achieving state-of-the-art F1 score on PhysioNet 2021 CinC Challenge.',
      'Demonstrated 3.2-hour median lead time for septic shock prediction using continuous waveform pre-training.'
    ],
    projects: [
      { title: 'CardioState: Continuous Latent Space Representation', status: 'Active', description: 'Multi-channel masked autoencoding on 12-lead ECG telemetry.' }
    ],
    publications: [
      { title: 'Self-Supervised Contrastive Learning Across Heterogeneous Physiological Waveforms', year: 2023, journalOrConference: 'NeurIPS Workshop on Machine Learning for Health (ML4H)', doi: '10.48550/arXiv.2310.12941' }
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    email: 'k.zhao@mindh-lab.org',
    scholarUrl: 'https://scholar.google.com',
    linkedinUrl: 'https://www.linkedin.com/company/medical-informatics-and-digital-health-lab/',
    twitterUrl: 'https://twitter.com',
    showEmail: true,
    showSocialLinks: true,
    showPublications: true,
    showProjects: true,
    isPublic: true,
    orderIndex: 4,
  },
  {
    id: 'member-5',
    name: 'Maya Lin, BS',
    role: 'Graduate Research Assistant',
    category: 'Students',
    credentials: 'MS Student in Biomedical Engineering',
    bio: 'Investigating vocal acoustics and prosodic biomarkers for continuous cognitive workload and respiratory insufficiency assessment.',
    detailedBio: "Maya Lin is a master's graduate researcher conducting experiments in the MINDH Prosodic & Affect Chamber. Her research investigates how acoustic micro-variations in formant frequencies, jitter, and shimmer correlate with early diaphragmatic fatigue and nocturnal dyspnea.",
    labRoleDetail: 'Coordinates human participant testing in the acoustic chamber and oversees audio feature engineering.',
    focus: ['Vocal Biomarkers', 'Respiratory Acoustics', 'Audio Signal Processing', 'Human Factors'],
    skills: ['Librosa', 'Audio Feature Extraction', 'Acoustic Chamber Calibration', 'Statistical Testing'],
    contributions: [
      'Constructed calibrated speech corpus with concurrent spirometry and plethysmography baselines across 60 volunteers.'
    ],
    projects: [
      { title: 'Vocal Prosody for Pulmonary Exacerbation Detection', status: 'Active', description: 'Mobile microphone acoustic analysis for outpatient chronic lung disease flare-up triage.' }
    ],
    publications: [
      { title: 'Acoustic Glottal Features as Proxies for Minute Ventilation During Physical Exertion', year: 2024, journalOrConference: 'Interspeech (Bio-Acoustics Session)', doi: '10.21437/Interspeech.2024-1182' }
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600',
    email: 'm.lin@mindh-lab.org',
    linkedinUrl: 'https://www.linkedin.com/company/medical-informatics-and-digital-health-lab/',
    showEmail: true,
    showSocialLinks: true,
    showPublications: true,
    showProjects: true,
    isPublic: true,
    orderIndex: 5,
  },
  {
    id: 'member-6',
    name: 'Dr. Marcus Thorne, PhD',
    role: 'Alumni (Former Senior Postdoc)',
    category: 'Alumni',
    credentials: 'PhD in Bioengineering (Now Assistant Professor at Johns Hopkins)',
    bio: 'Former MINDH Postdoctoral Fellow (2020-2023) who pioneered explainable concept bottleneck models for bedside risk interpretation.',
    detailedBio: 'Dr. Marcus Thorne was a postdoctoral fellow in the MINDH Lab from 2020 to 2023, where he co-developed the XAI Bedside Testbed. He is now a tenure-track Assistant Professor of Biomedical Engineering at Johns Hopkins University, continuing active research collaboration with MINDH on clinician interpretability.',
    labRoleDetail: 'Adjunct collaborator and alumni mentor.',
    focus: ['Explainable AI (XAI)', 'Concept Bottleneck Models', 'Clinical Recourse', 'Human-AI Teaming'],
    skills: ['Interpretability Frameworks', 'Counterfactual Explanations', 'Clinician Usability Audits'],
    contributions: [
      'Led the first clinical trial comparing clinician diagnostic speed with black-box vs concept-bottleneck ICU risk predictors.'
    ],
    projects: [
      { title: 'Clinician Interpretability & Alert Fatigue Mitigation', status: 'Completed', description: 'Bedside trial measuring provider trust calibration under conflicting model recommendations.' }
    ],
    publications: [
      { title: 'Concept Bottleneck Models Reduce Clinician Automation Bias in Critical Care', year: 2023, journalOrConference: 'Nature Machine Intelligence', doi: '10.1038/s42256-023-00712-4' }
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
    email: 'm.thorne@jhu.edu',
    scholarUrl: 'https://scholar.google.com',
    orcidUrl: 'https://orcid.org/0000-0002-8812-4019',
    linkedinUrl: 'https://www.linkedin.com/company/medical-informatics-and-digital-health-lab/',
    showEmail: true,
    showSocialLinks: true,
    showPublications: true,
    showProjects: true,
    isPublic: true,
    orderIndex: 6,
  },
  {
    id: 'member-7',
    name: 'Dr. Sarah Al-Mansoor, MD',
    role: 'Clinical Collaborator & Critical Care Physician',
    category: 'Collaborators',
    credentials: 'MD, Associate Professor of Pulmonary & Critical Care Medicine',
    bio: 'Director of Medical ICU at Regional Hospital, overseeing prospective validation and bedside clinical usability of MINDH algorithms.',
    detailedBio: 'Dr. Sarah Al-Mansoor is an attending critical care physician and clinical co-investigator with the MINDH Lab. She directs the medical intensive care unit where our contactless optical monitoring and hemodynamic early-warning systems are clinically piloted. Her clinical expertise ensures that mathematical models translate directly into actionable bedside alerts.',
    labRoleDetail: 'Principal clinical collaborator; leads institutional review board (IRB) protocols and clinical ground truth adjudication.',
    focus: ['Critical Care Medicine', 'Sepsis Phenotyping', 'Bedside Usability', 'Clinical Trial Oversight'],
    skills: ['Critical Care Hemodynamics', 'ICU Bedside Telemetry', 'IRB Clinical Protocol Design', 'EHR Chart Abstraction'],
    contributions: [
      'Established prospective multi-center telemetry bio-bank linking continuous high-frequency waveforms with clinical outcomes.'
    ],
    projects: [
      { title: 'Prospective Sepsis Decompensation Alerting Trial', status: 'Active', description: 'Randomized controlled trial evaluating early bedside notification response times.' }
    ],
    publications: [
      { title: 'Impact of Continuous Bedside Physiological AI on Nursing Alert Response Times', year: 2024, journalOrConference: 'Critical Care Medicine', doi: '10.1097/CCM.0000000000006240' }
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1594824813571-638f02614d3f?auto=format&fit=crop&q=80&w=600',
    email: 's.almansoor@regional-health.org',
    scholarUrl: 'https://scholar.google.com',
    linkedinUrl: 'https://www.linkedin.com/company/medical-informatics-and-digital-health-lab/',
    showEmail: true,
    showSocialLinks: true,
    showPublications: true,
    showProjects: true,
    isPublic: true,
    orderIndex: 7,
  },
];

export const LAB_COLLABORATORS: Collaborator[] = [
  {
    id: 'collab-1',
    name: 'Massachusetts General Hospital & Harvard Medical School',
    shortName: 'Mass General / Harvard',
    category: 'Clinical & Hospital',
    location: 'Boston, Massachusetts, USA',
    logoUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400',
    description:
      'Primary clinical trial partner for multi-bed ICU contactless optical telemetry, continuous neonatal hemodynamic monitoring, and acute sepsis early warning deployment.',
    jointFocus: [
      'Zero-Contact ICU Hemodynamics',
      'Continuous Pediatric Monitoring',
      'Infectious Disease Isolation Telemetry',
      'Clinical Protocol Adjudication'
    ],
    keyContacts: ['Dr. Sarah Al-Mansoor, MD (ICU Director)', 'Prof. Robert Lang, MD (Pulmonary Medicine)'],
    activeTrials: [
      'Contactless ICU Vital Sign Extraction Trial (NCT05128911)',
      'Pediatric Respiratory Distress Early Warning Pilot'
    ],
    websiteUrl: 'https://www.massgeneral.org',
    isFeatured: true,
    orderIndex: 1,
  },
  {
    id: 'collab-2',
    name: 'Johns Hopkins Medicine & Whiting School of Engineering',
    shortName: 'Johns Hopkins University',
    category: 'Academic Institution',
    location: 'Baltimore, Maryland, USA',
    logoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=400',
    description:
      'Pioneering collaborative research on explainable concept bottleneck architectures, physician alert fatigue mitigation, and human-in-the-loop clinical decision support.',
    jointFocus: [
      'Explainable AI (XAI) for Critical Care',
      'Concept Bottleneck Architectures',
      'Physician Trust & Recourse Audits',
      'Bedside Diagnostic Usability'
    ],
    keyContacts: ['Dr. Marcus Thorne, PhD (Assistant Professor)', 'Prof. Elena Rostova, MD, PhD'],
    activeTrials: [
      'Multi-Hospital Clinician Diagnostic Usability Benchmark',
      'Counterfactual Explanations in Emergency Triage'
    ],
    websiteUrl: 'https://www.hopkinsmedicine.org',
    isFeatured: true,
    orderIndex: 2,
  },
  {
    id: 'collab-3',
    name: 'Stanford Health Care - Division of Cardiovascular Health',
    shortName: 'Stanford Health Care',
    category: 'Clinical & Hospital',
    location: 'Stanford, California, USA',
    logoUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400',
    description:
      'Multi-center clinical site evaluating wearable photoplethysmography and bio-impedance sensor fusion for ambulatory continuous blood pressure tracking and arrhythmia prediction.',
    jointFocus: [
      'Cuffless Continuous Arterial Pressure',
      'Ambulatory Arrhythmia Telemetry',
      'Photoplethysmography Sensor Fusion',
      'AAMI Protocol Validation'
    ],
    keyContacts: ['Prof. David K. Patel, MD, PhD (Adjunct Investigator)', 'Dr. Michael Chen, MD, FACC'],
    activeTrials: [
      'CardioState Ambulatory Hypertension Cohort (1,500 Patients)',
      'Beat-to-Beat PTT Hemodynamic Validation'
    ],
    websiteUrl: 'https://stanfordhealthcare.org',
    isFeatured: true,
    orderIndex: 3,
  },
  {
    id: 'collab-4',
    name: 'MIT Institute for Medical Engineering and Science (IMES)',
    shortName: 'MIT IMES & CSAIL',
    category: 'Academic Institution',
    location: 'Cambridge, Massachusetts, USA',
    logoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=400',
    description:
      'Joint theoretical engineering on foundational physiological representation learning, high-dimensional wavelet manifolds, and edge-deployable temporal transformer models.',
    jointFocus: [
      'Self-Supervised Biosignal Foundation Models',
      'CardioState-10M Pre-training Benchmark',
      'Wavelet Signal Decomposition',
      'Edge Microprocessor Optimization'
    ],
    keyContacts: ['Prof. Alex Vance, PhD', 'Dr. Clara Zhang, PhD (Postdoctoral Affiliate)'],
    activeTrials: [
      '10-Million-Hour Ambience Waveform Benchmark',
      'Cross-Modal ECG-to-PPG Synthetic Reconstruction'
    ],
    websiteUrl: 'https://imes.mit.edu',
    isFeatured: true,
    orderIndex: 4,
  },
  {
    id: 'collab-5',
    name: 'Philips Healthcare - Clinical Informatics Research',
    shortName: 'Philips Healthcare',
    category: 'Industry & Technology',
    location: 'Cambridge, MA & Eindhoven, Netherlands',
    logoUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400',
    description:
      'Industry co-development of HL7 FHIR real-time physiological telemetry interfaces and next-generation bedside patient monitor micro-services.',
    jointFocus: [
      'HL7 FHIR Interoperability Protocols',
      'Patient Monitor Hardware Integration',
      'Medical Device Regulatory Pathways',
      'Real-Time Telemetry Streaming'
    ],
    keyContacts: ['Dr. Jennifer Krause, PhD (Principal Scientist)', 'Markus Lindqvist (VP Clinical Systems)'],
    activeTrials: [
      'Next-Generation Bedside Edge Module Pilot',
      'Hospital Electronic Health Record Integration Verification'
    ],
    websiteUrl: 'https://www.philips.com/healthcare',
    isFeatured: true,
    orderIndex: 5,
  },
  {
    id: 'collab-6',
    name: 'NVIDIA Healthcare & Life Sciences (Inception Partner)',
    shortName: 'NVIDIA Healthcare',
    category: 'Industry & Technology',
    location: 'Santa Clara, California, USA',
    logoUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400',
    description:
      'Accelerating bedside inference latency using NVIDIA Clara Holoscan and TensorRT, achieving sub-16ms multimodal model execution directly at point-of-care.',
    jointFocus: [
      'Clara Holoscan Deployment Architecture',
      'Sub-16ms Real-Time Inference Validation',
      'TensorRT Biosignal Quantization',
      'Bedside GPU Acceleration'
    ],
    keyContacts: ['Healthcare AI Solutions Engineering Team'],
    activeTrials: [
      'Real-Time 60 FPS rPPG Video Processing Benchmarks',
      'Hospital Point-of-Care Neural Engine Testing'
    ],
    websiteUrl: 'https://www.nvidia.com/en-us/industries/healthcare-and-life-sciences',
    isFeatured: true,
    orderIndex: 6,
  },
  {
    id: 'collab-7',
    name: 'National Institutes of Health (NIH - NHLBI & NIBIB)',
    shortName: 'National Institutes of Health',
    category: 'Grant & Funding',
    location: 'Bethesda, Maryland, USA',
    logoUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=400',
    description:
      'Primary federal grant supporter for multi-year translational research on cuffless continuous arterial blood pressure monitoring and contactless optical physiological sensing.',
    jointFocus: [
      'Grant NIH R01 HL158921 (Continuous BP)',
      'Grant NIH R21 EB032114 (Contactless ICU Telemetry)',
      'Translational Clinical Science Governance',
      'Open-Science Bio-Signal Benchmarks'
    ],
    keyContacts: ['Division of Cardiovascular Sciences Program Directorate'],
    activeTrials: [
      '4-Year Multi-Center Translation Grant Pipeline',
      'Physiological Telemetry Open Research Repository'
    ],
    websiteUrl: 'https://www.nih.gov',
    isFeatured: true,
    orderIndex: 7,
  },
  {
    id: 'collab-8',
    name: 'American Heart Association (AHA) - Health Tech Collaborative',
    shortName: 'American Heart Association',
    category: 'Grant & Funding',
    location: 'Dallas, Texas, USA',
    logoUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=400',
    description:
      'Supporting decentralized clinical trials and cardiovascular health equity research to provide ambulatory hemodynamic telemetry across underserved patient populations.',
    jointFocus: [
      'Innovative Project Award: Wearable Optical Hemodynamics',
      'Cardiovascular Health Disparity Reduction',
      'Decentralized Tele-Cardiology Protocols',
      'Longitudinal Patient Engagement'
    ],
    keyContacts: ['AHA Institute for Precision Cardiovascular Medicine'],
    activeTrials: [
      'Community Ambulatory Hypertension Longitudinal Study',
      'Mobile Health Equivalence Trials'
    ],
    websiteUrl: 'https://www.heart.org',
    isFeatured: false,
    orderIndex: 8,
  },
];

export const LAB_FACILITIES: LabFacility[] = [
  {
    id: "optical-rig",
    title: "Contactless Optical Rig",
    tag: "Optics & Vision",
    iconName: "Camera",
    desc: "Calibrated ambient illumination array with synchronized reference contact PPG for contactless vital sign estimation algorithms.",
    specs: ["4K 120fps Chromatic Sensors", "Calibrated Lux Chamber (0-2000 lx)", "Synchronized Medical ECG/PPG Baseline"],
    status: "Operational",
    imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800",
    orderIndex: 1
  },
  {
    id: "wearable-chamber",
    title: "Wearable Telemetry Chamber",
    tag: "Embedded Bio-Sensing",
    iconName: "Radio",
    desc: "Micro-power signal acquisition testbench for bio-impedance, galvanic skin response, and motion-artifact simulation.",
    specs: ["Sub-mW Power Analyzers", "Programmable Motion Artifact Gimbal", "Micro-Electrode Skin Interface Bench"],
    status: "Operational",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
    orderIndex: 2
  },
  {
    id: "sim-cluster",
    title: "Clinical Simulation Cluster",
    tag: "Compute & Streaming",
    iconName: "Server",
    desc: "Dedicated high-throughput compute cluster for sequential state-space modeling, triage risk calibration, and synthetic patient generation.",
    specs: ["GPU Inference Blades (48GB VRAM)", "Low-Latency Bedside Stream Pipeline (<16ms)", "Synthetic EHR Sandbox Isolation"],
    status: "24/7 Compute",
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    orderIndex: 3
  },
  {
    id: "phantom-workstation",
    title: "Phantom Imaging Workstation",
    tag: "Acoustic & Volumetric",
    iconName: "Microscope",
    desc: "Volumetric slice analysis and diffusion prior testbed for synthetic anatomical phantoms and low-dose imaging reconstruction.",
    specs: ["Tissue-Equivalent Polyacrylamide Phantoms", "Sparse-Sampling Simulators", "3D Deformable Motion Visualizers"],
    status: "Operational",
    imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800",
    orderIndex: 4
  },
  {
    id: "prosodic-lab",
    title: "Prosodic & Affect Chamber",
    tag: "Acoustic Biomarkers",
    iconName: "Headphones",
    desc: "Acoustically isolated chamber for continuous vocal prosody, pupil dilation tracking, and simulated cognitive workload protocols.",
    specs: ["Acoustic Isolation (<22 dBA ambient)", "High-Fidelity Studio Condenser Mics", "Binocular 250Hz Infrared Eye Tracker"],
    status: "Active Protocols",
    imageUrl: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
    orderIndex: 5
  },
  {
    id: "xai-bedside",
    title: "XAI Bedside Clinical Suite",
    tag: "Human-in-the-Loop",
    iconName: "ShieldCheck",
    desc: "Clinician-in-the-loop audit suite evaluating concept bottleneck interpretability, counterfactual recourse, and alert fatigue reduction.",
    specs: ["Dual Bedside High-DPI Monitors", "Interactive Saliency Audit Logging", "Clinician Usability Latency Profiler"],
    status: "Clinical Trials",
    imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800",
    orderIndex: 6
  }
];


