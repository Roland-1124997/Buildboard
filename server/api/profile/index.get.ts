export default defineBaseEventHandler(async (event) => {
	return useReturnResponse(event, {
		status: {
			code: 200,
			message: "OK",
			success: true,
		},
		data: {
			algemeen: {
				tile: "Ik bouw digitale producten die gewoon werken",
				subtitle: "Ik ben Roland Meijer, software developer met een focus op duidelijke en praktische oplossingen. In deze portfolio laat ik zien hoe ik ideeën uitwerk tot concrete resultaten.",
				locatie: "Vlaardingen, Nederland",

				contact: {
					email: {
						label: "Plan een gesprek",
						iconName: "akar-icons:envelope",
						url: "mailto:contact@roland-meijer.nl",
						eventName: "contact_email_click",
						hidden: false,
					},
					cv: {
						label: "Bekijk mijn CV",
						iconName: "akar-icons:cloud-download",
						url: "https://dashboard.roland-meijer.nl/attachments/CV-Roland-Meijer.pdf",
						eventName: "contact_cv_click",
						hidden: false,
					},
					linkdin: {
						label: "LinkedIn",
						iconName: "akar-icons:linkedin-fill",
						url: "https://www.linkedin.com/in/roland-meijer-07bb97198",
						eventName: "linkedin_profile_click",
						hidden: false,
					},
					telefoon: {
						label: "Bel mij",
						iconName: "akar-icons:phone",
						url: "tel:+31638305453",
						eventName: "contact_phone_click",
						hidden: false,
					},
					github: {
						label: "GitHub",
						iconName: "akar-icons:github-fill",
						url: "https://github.com/Roland-1124997",
						eventName: "github_profile_click",
						hidden: true,
					},
				},
			},

			ervaringen: {
				stages: [
					{
						bedrijf: "Tech Solutions",
						periode: "Juni 2023 - Augustus 2023",
						functie: "Software Development Intern",
						taken: ["Ondersteunen bij het ontwikkelen van webapplicaties", "Samenwerken met het development team", "Testen en debuggen van code"],
					},
					{
						bedrijf: "Innovatech",
						periode: "Januari 2023 - Mei 2023",
						functie: "Frontend Development Intern",
						taken: ["Bouwen van gebruikersinterfaces", "Optimaliseren van de gebruikerservaring", "Implementeren van responsive design"],
					},
					{
						bedrijf: "Data Insights",
						periode: "September 2022 - December 2022",
						functie: "Data Analysis Intern",
						taken: ["Analyseren van datasets", "Visualiseren van data", "Ondersteunen bij het maken van datagedreven beslissingen"],
					},
				],
				opleidingen: [
					{
						instelling: "Hoge School Rotterdam",
						periode: "(2025 Sep) - heden",
						graad: "AD Software Development",
						vaardigheden: ["UX/UI", "Python", "Agile Methodologieën", "Teamwork en Communicatie", "Reflettie en Zelfontwikkeling", "Databases en API's", "Projectmanagement"],
					},
					{
						instelling: "Grafisch Lyceum Rotterdam",
						periode: "(2022 Sep) - (2025 Jun)",
						graad: "MBO (4) Software Developer",
						vaardigheden: [
							"JavaScript",
							"Webontwikkeling (HTML, CSS)",
							"Frameworks (React, Vue)",
							"Versiebeheer (Git)",
							"Backend ontwikkeling (Node.js, Php, C#)",
							"MVC-architectuur",
							"Probleemoplossing",
						],
					},
					{
						instelling: "Da Vinci College Dordrecht",
						periode: "(2020 Sep) - (2022 Jun)",
						graad: "MBO (3) Allround system and devices",
						vaardigheden: ["Virtualisatie", "Netwerken", "Basis javaScript", "Algemene IT-vaardigheden", "Beheer van apparatuur", "Ondersteunen van gebruikers"],
					},
				],
			},
		},
	});
});
