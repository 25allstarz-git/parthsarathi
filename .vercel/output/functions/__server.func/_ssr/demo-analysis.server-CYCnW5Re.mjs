//#region node_modules/.nitro/vite/services/ssr/assets/demo-analysis.server-CYCnW5Re.js
var PROFILES = {
	"Criminal Law": {
		urgency: "critical",
		urgency_reason: "Criminal proceedings carry liberty consequences and strict statutory timelines for bail and remand.",
		court: "Sessions Court, Delhi",
		specializations: ["Criminal Law", "Bail & Remand"],
		insights: [{
			heading: "Anticipatory bail merits early consideration",
			detail: "Where arrest is apprehended, a petition under Section 482 BNSS (formerly Section 438 CrPC) may be moved before the Sessions Court, supported by the documents on record."
		}, {
			heading: "Preserve the first information record",
			detail: "A certified copy of the FIR and case diary entries should be obtained early; delay in obtaining them weakens the ability to challenge procedural lapses."
		}],
		precedents: [{
			citation: "(2020) 5 SCC 1",
			title: "Sushila Aggarwal v. State (NCT of Delhi)",
			holding: "Anticipatory bail need not be limited to a fixed period and may continue till trial.",
			relevance: "Supports a request for unrestricted protection pending investigation."
		}, {
			citation: "(2014) 8 SCC 273",
			title: "Arnesh Kumar v. State of Bihar",
			holding: "Arrest is not automatic in offences punishable up to seven years; notice must precede it.",
			relevance: "Relevant where arrest is threatened without the statutory notice."
		}],
		similar: [{
			case_number: "CRL.M.C. 3412/2025",
			title: "Ramesh Chandra v. State (NCT of Delhi)",
			court: "Delhi High Court",
			outcome: "Anticipatory bail granted with conditions of cooperation in investigation.",
			similarity: .82
		}, {
			case_number: "CRL.A. 482/2026",
			title: "State v. Mohan Lal Yadav",
			court: "Sessions Court, Saket",
			outcome: "Charge modified after documentary contradictions were demonstrated.",
			similarity: .68
		}]
	},
	"Family Law": {
		urgency: "high",
		urgency_reason: "Matrimonial and custody matters affect maintenance and the welfare of dependants, which courts treat as time-sensitive.",
		court: "Family Court, Patiala House",
		specializations: ["Family Law", "Matrimonial Disputes"],
		insights: [{
			heading: "Interim maintenance can be sought immediately",
			detail: "An application under Section 24 of the Hindu Marriage Act, 1955 or Section 144 BNSS permits interim maintenance while the main petition is pending."
		}, {
			heading: "Mediation is a mandatory first step",
			detail: "Family Courts ordinarily refer parties to the mediation centre before framing issues; a considered settlement position saves several hearings."
		}],
		precedents: [{
			citation: "(2021) 2 SCC 324",
			title: "Rajnesh v. Neha",
			holding: "Uniform affidavit of assets and liabilities is mandatory in all maintenance proceedings.",
			relevance: "Determines the disclosure both sides must file at the first hearing."
		}],
		similar: [{
			case_number: "HMA 1187/2025",
			title: "Sunita Sharma v. Anil Sharma",
			court: "Family Court, Rohini",
			outcome: "Interim maintenance of ₹18,000 per month awarded pending trial.",
			similarity: .75
		}]
	},
	"Consumer Protection": {
		urgency: "medium",
		urgency_reason: "A two-year limitation runs from the date the cause of action arose, leaving room for a properly prepared complaint.",
		court: "District Consumer Disputes Redressal Commission",
		specializations: ["Consumer Protection", "Real Estate (RERA)"],
		insights: [{
			heading: "Deficiency in service must be pleaded specifically",
			detail: "Each failure — delay, non-delivery or misrepresentation — should be pleaded with the corresponding invoice, booking letter or correspondence annexed."
		}, {
			heading: "Compensation with interest is routinely allowed",
			detail: "Commissions commonly award refund with interest from the date of payment, together with litigation costs."
		}],
		precedents: [{
			citation: "(2019) 5 SCC 725",
			title: "Pioneer Urban Land v. Govindan Raghavan",
			holding: "One-sided builder agreements amount to an unfair trade practice.",
			relevance: "Supports refund with interest where possession is inordinately delayed."
		}],
		similar: [{
			case_number: "CC 884/2025",
			title: "Meera Iyer v. Skyline Realtors Pvt. Ltd.",
			court: "State Consumer Commission, Delhi",
			outcome: "Refund with 9% interest and ₹50,000 costs allowed.",
			similarity: .71
		}]
	},
	"Property Law": {
		urgency: "high",
		urgency_reason: "Possession and title disputes risk irreversible alienation of the property if unprotected.",
		court: "District Court, Tis Hazari",
		specializations: ["Property Law", "Civil Litigation"],
		insights: [{
			heading: "Seek an interim injunction with the plaint",
			detail: "An application under Order XXXIX Rules 1 and 2 CPC filed with the suit protects the status quo of the property pending trial."
		}, {
			heading: "Title chain must be assembled",
			detail: "Sale deed, mutation records, tax receipts and the encumbrance certificate together establish the chain of title."
		}],
		precedents: [{
			citation: "(2012) 1 SCC 656",
			title: "Suraj Lamp & Industries v. State of Haryana",
			holding: "Sale agreements and general powers of attorney do not convey title.",
			relevance: "Central where the opposite party relies on a GPA transaction."
		}],
		similar: [{
			case_number: "O.S. 2214/2025",
			title: "Harbans Singh v. Gurmeet Kaur",
			court: "District Court, Tis Hazari",
			outcome: "Status quo ordered; possession protected pending trial.",
			similarity: .66
		}]
	},
	"Motor Accident Claims": {
		urgency: "high",
		urgency_reason: "Medical expenditure and loss of income continue while the claim is pending.",
		court: "Motor Accident Claims Tribunal, Karkardooma",
		specializations: ["Motor Accident Claims", "Insurance"],
		insights: [{
			heading: "Detailed Accident Report is the foundation",
			detail: "The DAR filed by the police, together with the FIR, mechanical inspection report and medical records, drives the quantum of compensation."
		}, {
			heading: "Income proof determines the multiplier",
			detail: "Salary slips, income tax returns or a certificate of earnings should be placed on record to establish the annual income."
		}],
		precedents: [{
			citation: "(2017) 16 SCC 680",
			title: "National Insurance Co. v. Pranay Sethi",
			holding: "Standardised future prospects and conventional heads of compensation laid down.",
			relevance: "Governs the computation of the claim amount."
		}],
		similar: [{
			case_number: "MACP 631/2025",
			title: "Kavita Devi v. Oriental Insurance Co.",
			court: "MACT, Karkardooma",
			outcome: "Compensation of ₹14.6 lakh awarded with 7.5% interest.",
			similarity: .7
		}]
	},
	"Cyber Law": {
		urgency: "critical",
		urgency_reason: "Digital evidence and intermediary logs are retained for limited periods; preservation requests are time-critical.",
		court: "Cyber Crime Cell / Magistrate Court",
		specializations: ["Cyber Law", "Criminal Law"],
		insights: [{
			heading: "Request preservation of electronic records",
			detail: "A written request to the intermediary and the investigating officer under the IT Act, 2000 preserves logs before routine deletion."
		}, {
			heading: "Certificate under Section 63 BSA",
			detail: "Electronic records require the statutory certificate (formerly Section 65B of the Evidence Act) to be admissible."
		}],
		precedents: [{
			citation: "(2020) 7 SCC 1",
			title: "Arjun Panditrao Khotkar v. Kailash Kushanrao",
			holding: "Certificate for electronic evidence is mandatory where the original device is not produced.",
			relevance: "Determines how the screenshots and logs must be proved."
		}],
		similar: [{
			case_number: "CRL.M.C. 1902/2025",
			title: "Ananya Rao v. State of Karnataka",
			court: "Karnataka High Court",
			outcome: "Directions issued for expeditious takedown and preservation of records.",
			similarity: .64
		}]
	}
};
var DEFAULT_PROFILE = {
	urgency: "medium",
	urgency_reason: "No immediate statutory deadline is apparent from the material placed on record.",
	court: "District Court",
	specializations: ["Civil Litigation"],
	insights: [{
		heading: "Assemble a documentary chronology",
		detail: "A dated chronology with each document annexed is what a court reads first; it also shortens the advocate's preparation."
	}, {
		heading: "Check the limitation position",
		detail: "The Limitation Act, 1963 prescribes distinct periods for each type of claim; the period is computed from the date the cause of action arose."
	}],
	precedents: [{
		citation: "(1978) 1 SCC 248",
		title: "Maneka Gandhi v. Union of India",
		holding: "Any procedure affecting life or liberty must be fair, just and reasonable.",
		relevance: "General standard of procedural fairness applicable to the matter."
	}],
	similar: [{
		case_number: "C.S. 1456/2025",
		title: "Rakesh Verma v. Delhi Development Authority",
		court: "District Court, Saket",
		outcome: "Relief granted after documentary chronology was accepted.",
		similarity: .58
	}]
};
var CATEGORY_KEYWORDS = [
	["Criminal Law", /\b(fir|police|arrest|bail|theft|assault|498a|chargesheet|criminal|ipc|bns)\b/i],
	["Family Law", /\b(divorce|maintenance|custody|marriage|matrimonial|dowry|alimony)\b/i],
	["Consumer Protection", /\b(refund|builder|possession|defect|consumer|service|warranty|delivery)\b/i],
	["Property Law", /\b(property|land|tenant|landlord|possession|title|sale deed|mutation)\b/i],
	["Motor Accident Claims", /\b(accident|vehicle|motor|collision|insurance claim|injury)\b/i],
	["Cyber Law", /\b(cyber|online|phishing|hacked|social media|otp|fraudulent transaction|upi)\b/i],
	["Labour & Employment", /\b(salary|terminated|employer|wages|gratuity|provident fund|labour)\b/i]
];
function pickCategory(description, chosen) {
	if (chosen) return chosen;
	for (const [category, pattern] of CATEGORY_KEYWORDS) if (pattern.test(description)) return category;
	return "Civil Litigation";
}
function toTitle(description, category) {
	const firstSentence = description.split(/[.\n]/)[0]?.trim() ?? "";
	const trimmed = firstSentence.length > 12 ? firstSentence.slice(0, 78) : `${category} matter`;
	return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}
function findDates(description) {
	const results = [];
	const pattern = /(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4})|(\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4})/g;
	const seen = /* @__PURE__ */ new Set();
	let match;
	while ((match = pattern.exec(description)) && results.length < 5) {
		const value = match[0];
		if (seen.has(value)) continue;
		seen.add(value);
		results.push({
			date: value,
			event: "Date referred to in the citizen's statement of facts.",
			source: "Statement of facts submitted at intake"
		});
	}
	results.push({
		date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
		event: "Matter registered on ParthSarathi and queued for advocate review.",
		source: "Platform record"
	});
	return results;
}
function demoAnalysis(input) {
	const category = pickCategory(input.description, input.category);
	const profile = PROFILES[category] ?? DEFAULT_PROFILE;
	const docNames = input.documents.map((d) => d.file_name);
	const primarySource = docNames[0] ?? "Statement of facts submitted at intake";
	const sentences = input.description.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter((s) => s.length > 20).slice(0, 4);
	const facts = sentences.map((sentence, index) => ({
		label: index === 0 ? "Core grievance" : `Fact ${index + 1}`,
		value: sentence.length > 220 ? `${sentence.slice(0, 217)}…` : sentence,
		source: index === 0 ? "Statement of facts submitted at intake" : primarySource,
		confidence: index === 0 ? .94 : .82
	}));
	if (docNames.length) facts.push({
		label: "Documents on record",
		value: `${docNames.length} document${docNames.length > 1 ? "s" : ""} filed: ${docNames.join(", ")}.`,
		source: docNames.join(", "),
		confidence: 1
	});
	return {
		summary: `This is a ${category.toLowerCase()} matter. ${sentences[0] ?? input.description.slice(0, 200)} Based on the material placed on record${docNames.length ? ` and the ${docNames.length} document(s) uploaded` : ""}, the matter has been classified as ${profile.urgency} urgency. ${profile.urgency_reason} The next practical step is to engage an advocate practising in ${profile.specializations[0]} so that the appropriate proceeding can be instituted before the ${profile.court}.`,
		category,
		urgency: profile.urgency,
		urgency_reason: profile.urgency_reason,
		extracted_facts: facts,
		key_dates: findDates(input.description),
		parties: [{
			role: "Applicant",
			name: "The citizen filing this matter"
		}, {
			role: "Respondent",
			name: "Opposite party named in the statement of facts"
		}],
		legal_insights: profile.insights.map((i) => ({
			...i,
			source: primarySource
		})),
		similar_cases: profile.similar,
		precedents: profile.precedents,
		recommended_specializations: profile.specializations,
		suggested_title: toTitle(input.description, category),
		suggested_court: profile.court
	};
}
//#endregion
export { demoAnalysis };
