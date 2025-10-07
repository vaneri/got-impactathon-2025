export type Language = "en" | "sv";

export interface Translations {
  // Header
  appTitle: string;
  appSubtitle: string;
  ecoBadge: string;
  ecoBadgeMobile: string;
  platformLabel: string;

  // Map Section
  mapTitle: string;
  mapDescription: string;
  emergencyLabel: string;
  emergencyText: string;
  liveData: string;
  updated: string;

  // Public Document Section
  publicDocTitle: string;
  publicDocDescription: string;
  contactInfoTitle: string;
  contactInfoDescription: string;
  dataProtectionTitle: string;
  dataProtectionDescription: string;

  // What You Can Report
  whatToReportTitle: string;
  roadsTitle: string;
  roadsDescription: string;
  lightingTitle: string;
  lightingDescription: string;
  parksTitle: string;
  parksDescription: string;
  publicSpacesTitle: string;
  publicSpacesDescription: string;

  // How to Report
  howToReportTitle: string;
  howToStep1: string;
  howToStep2: string;
  howToStep3: string;
  howToStep4: string;

  // Stats
  totalLocations: string;
  activeReports: string;
  pendingReview: string;
  systemStatus: string;
  operational: string;

  // Footer
  platformVersion: string;
  copyright: string;
  carbonNeutral: string;

  // Button
  reportButton: string;
  reportButtonTitle: string;
  reportButtonAria: string;

  // Camera Capture Modal
  cameraModalTitle: string;
  cameraModalDescription: string;
  cameraEnvironmentalTitle: string;
  cameraEnvironmentalDescription: string;
  cameraActivateButton: string;
  cameraCancelButton: string;
  cameraRecording: string;
  cameraCaptureButton: string;
  cameraLocationAcquiring: string;
  cameraLocationAcquired: string;
  cameraLatitude: string;
  cameraLongitude: string;
  cameraCancelAction: string;
  cameraSubmitReport: string;

  // Success Modal
  successModalTitle: string;
  successModalMessage: string;
  successModalSubMessage: string;
  successModalCloseButton: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Header
    appTitle: "Gothenburg FaultReport",
    appSubtitle: "Fault Reporting - Streets, Squares & Parks",
    ecoBadge: "Eco-Friendly",
    ecoBadgeMobile: "Eco-Friendly",
    platformLabel: "Community Platform",

    // Map Section
    mapTitle: "Fault Reporting - Streets, Squares and Parks",
    mapDescription:
      "Report holes in streets or bike paths, broken street lights, overgrown bushes, damaged benches, or any infrastructure issues. Your report becomes an official public document and helps us maintain our community.",
    emergencyLabel: "Emergency?",
    emergencyText: "For urgent issues, call the City immediately at",
    liveData: "Live Data",
    updated: "Updated",

    // Public Document Section
    publicDocTitle: "Your Report Becomes a Public Document",
    publicDocDescription:
      "When you submit a report, it is registered as an official public document. All citizens have the right to access and read public documents under Sweden's principle of public access to information (offentlighetsprincipen).",
    contactInfoTitle: "Optional Contact Information",
    contactInfoDescription:
      "You can choose to remain anonymous. However, without contact details, we cannot ask follow-up questions or update you on progress.",
    dataProtectionTitle: "Data Protection",
    dataProtectionDescription:
      "We process your personal data in accordance with GDPR and Swedish law. Learn more about how we handle your information.",

    // What You Can Report
    whatToReportTitle: "What You Can Report",
    roadsTitle: "Roads & Paths",
    roadsDescription:
      "Holes in streets, damaged bike paths, broken sidewalks, or paving issues. Include exact address or coordinates.",
    lightingTitle: "Street Lighting",
    lightingDescription:
      "Lights that are not working, flickering, or damaged. Provide location and light pole number if available.",
    parksTitle: "Parks & Green Spaces",
    parksDescription:
      "Overgrown bushes that need cutting, damaged benches, broken playground equipment, or maintenance issues.",
    publicSpacesTitle: "Public Spaces",
    publicSpacesDescription:
      "Issues in squares, public furniture damage, graffiti, or general maintenance needed in shared areas.",

    // How to Report
    howToReportTitle: "📝 How to Submit a Good Report",
    howToStep1:
      'Be Specific: Describe the fault in detail. Instead of "broken light," write "street light not working on Main Street between 5th and 6th Avenue."',
    howToStep2:
      "Provide Location: Include exact address (street name and number) or GPS coordinates so we can find and fix the issue quickly.",
    howToStep3:
      "Add Photos: Take clear photos showing the problem. Multiple angles help our teams understand the situation better.",
    howToStep4:
      "Include Contact Info: Optional but recommended. We can update you on progress and ask questions if needed.",

    // Stats
    totalLocations: "Total Locations",
    activeReports: "Active Reports",
    pendingReview: "Pending Review",
    systemStatus: "System Status",
    operational: "Operational",

    // Footer
    platformVersion: "Platform Version 1.0.0",
    copyright: "© 2025 Gothenburg FaultReport.",
    carbonNeutral: "Carbon Neutral Operations",

    // Button
    reportButton: "Report",
    reportButtonTitle: "Report Fault",
    reportButtonAria: "Report new fault or issue",

    // Camera Capture Modal
    cameraModalTitle: "Submit Location Report",
    cameraModalDescription:
      "Capture visual documentation with geographic coordinates for official records and analysis.",
    cameraEnvironmentalTitle: "Environmental Impact",
    cameraEnvironmentalDescription:
      "Your report helps maintain a cleaner, healthier environment for the community. Together, we create sustainable change.",
    cameraActivateButton: "Activate Camera",
    cameraCancelButton: "Cancel Operation",
    cameraRecording: "RECORDING",
    cameraCaptureButton: "Capture Image",
    cameraLocationAcquiring: "Acquiring GPS coordinates...",
    cameraLocationAcquired: "Location Acquired",
    cameraLatitude: "Latitude:",
    cameraLongitude: "Longitude:",
    cameraCancelAction: "Cancel",
    cameraSubmitReport: "Submit Report",

    // Success Modal
    successModalTitle: "Report Submitted Successfully!",
    successModalMessage:
      "Your fault report has been registered in the system as an official public document.",
    successModalSubMessage:
      "Thank you for contributing to a cleaner, safer community. Your report will be reviewed and addressed by the appropriate department.",
    successModalCloseButton: "Close",
  },
  sv: {
    // Header
    appTitle: "Göteborg Felanmälan",
    appSubtitle: "Felanmälan - Gator, Torg & Parker",
    ecoBadge: "Miljövänlig",
    ecoBadgeMobile: "Miljövänlig",
    platformLabel: "Kommunplattform",

    // Map Section
    mapTitle: "Felanmälan - Gator, Torg och Parker",
    mapDescription:
      "Om du har en fråga eller synpunkter på hål i gatan eller på cykelbanan, om gatlampan inte lyser eller om ett buskage behöver klippas kan du använda detta formulär. Din fråga blir en allmän handling som hjälper oss att underhålla vårt samhälle.",
    emergencyLabel: "Akut?",
    emergencyText: "Är det akut ring Göteborgs Stad",
    liveData: "Live Data",
    updated: "Uppdaterad",

    // Public Document Section
    publicDocTitle: "Din Fråga Blir en Allmän Handling",
    publicDocDescription:
      "När du skickar in en fråga här registreras den som en allmän handling i Göteborgs Stad. Allmänna handlingar är dokument som alla medborgare har tillgång till och rätt att begära ut och läsa. Detta beror på att vi i Sverige har en offentlighetsprincip som ger alla medborgare rätt till insyn i kommunens arbete.",
    contactInfoTitle: "Kontaktuppgifter (valfritt)",
    contactInfoDescription:
      "Du kan välja att inte ange några kontaktuppgifter. Om du väljer att vara anonym har vi ingen möjlighet att återkomma till dig med kompletterande frågor och det är då inte säkert att vi kan hjälpa dig med ditt problem.",
    dataProtectionTitle: "Dataskydd",
    dataProtectionDescription:
      "Vi behandlar dina personuppgifter i enlighet med GDPR och svensk lag. Läs mer om hur Göteborgs Stad behandlar dina personuppgifter.",

    // What You Can Report
    whatToReportTitle: "Vad Du Kan Anmäla",
    roadsTitle: "Gator & Vägar",
    roadsDescription:
      "Hål i gatan, skadade cykelbanor, trasiga trottoarer eller asfaltproblem. Ange exakt adress eller koordinater.",
    lightingTitle: "Belysning",
    lightingDescription:
      "Lampor som inte fungerar, blinkar eller är skadade. Ange plats och stolpnummer om möjligt.",
    parksTitle: "Parker & Grönytor",
    parksDescription:
      "Buskage som behöver klippas, skadade bänkar, trasig lekplatsutrustning eller andra underhållsproblem.",
    publicSpacesTitle: "Offentliga Platser",
    publicSpacesDescription:
      "Problem på torg, skadade parkbänkar, klotter eller allmänt underhåll som behövs på gemensamma ytor.",

    // How to Report
    howToReportTitle: "📝 Så Gör Du en Bra Anmälan",
    howToStep1:
      'Var Specifik: Beskriv felet så utförligt som möjligt. Istället för "trasig lampa," skriv "gatlampa lyser inte på Huvudgatan mellan 5:e och 6:e avenyn."',
    howToStep2:
      "Ange Plats: Inkludera exakt adress (gatunamn och nummer) eller GPS-koordinater så att vi snabbt kan hitta och åtgärda problemet.",
    howToStep3:
      "Lägg Till Bilder: Ta tydliga foton som visar problemet. Flera vinklar hjälper våra team att förstå situationen bättre.",
    howToStep4:
      "Inkludera Kontaktuppgifter: Valfritt men rekommenderat. Vi kan uppdatera dig om framsteg och ställa frågor om det behövs.",

    // Stats
    totalLocations: "Totalt Platser",
    activeReports: "Aktiva Rapporter",
    pendingReview: "Väntar Granskning",
    systemStatus: "Systemstatus",
    operational: "I Drift",

    // Footer
    platformVersion: "Plattformsversion 1.0.0",
    copyright: "© 2025 Göteborg Felanmälan.",
    carbonNeutral: "Koldioxidneutrala Operationer",

    // Button
    reportButton: "Anmäl",
    reportButtonTitle: "Anmäl Fel",
    reportButtonAria: "Anmäl nytt fel eller problem",

    // Camera Capture Modal
    cameraModalTitle: "Skicka Platsrapport",
    cameraModalDescription:
      "Ta en bild med geografiska koordinater för officiella register och analys.",
    cameraEnvironmentalTitle: "Miljöpåverkan",
    cameraEnvironmentalDescription:
      "Din anmälan hjälper till att upprätthålla en renare, hälsosammare miljö för samhället. Tillsammans skapar vi hållbar förändring.",
    cameraActivateButton: "Aktivera Kamera",
    cameraCancelButton: "Avbryt Operation",
    cameraRecording: "SPELAR IN",
    cameraCaptureButton: "Ta Bild",
    cameraLocationAcquiring: "Hämtar GPS-koordinater...",
    cameraLocationAcquired: "Plats Hämtad",
    cameraLatitude: "Latitud:",
    cameraLongitude: "Longitud:",
    cameraCancelAction: "Avbryt",
    cameraSubmitReport: "Skicka Rapport",

    // Success Modal
    successModalTitle: "Rapporten Har Skickats!",
    successModalMessage:
      "Din felanmälan har registrerats i systemet som en allmän handling.",
    successModalSubMessage:
      "Tack för att du bidrar till ett renare och säkrare samhälle. Din anmälan kommer att granskas och hanteras av lämplig avdelning.",
    successModalCloseButton: "Stäng",
  },
};
