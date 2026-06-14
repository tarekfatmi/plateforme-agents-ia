const MAKE_WEBHOOK_URL = "https://hook.make.com/VOTRE_LIEN_UNIQUE_ICI";
const SOBFLOUS_MERCHANT_URL = "https://www.sobflous.tn/api/v1/payment/VOTRE_ID_MARCHAND";

const GateKeeper = {
    verifyAccess() {
        const enteredKey = document.getElementById("access-key").value.trim();
        if (!enteredKey) return alert("Veuillez saisir une clé valide.");
        if (enteredKey === "1234") {
            document.getElementById("gatekeeper").style.display = "none";
            CHAS.init();
        } else {
            alert("Clé incorrecte. Utilisez '1234' pour tester.");
        }
    },
    redirectToSobflous() { window.location.href = SOBFLOUS_MERCHANT_URL; }
};

const Dico = {
    fr: { init_msg: "Academic Agent System...Ready!", q1_title: "Questionnaire 1 : Niveau & Objectifs", q2_title: "Questionnaire 2 : Méthodologie & Temps", q3_title: "Questionnaire 3 : Blocages Principaux", q4_title: "Questionnaire 4 : Évaluation Flash", q5_title: "Questionnaire 5 : Projet d'Étude", btn_send: "VALIDER LA RÉPONSE", btn_wasel: "LANCER L'ANALYSE (WASEL)", loading_title: "CONSTRUCTION DU PLAN PÉDAGOGIQUE", final_title: "PLAN D'APPRENTISSAGE SUR MESURE", text_placeholder: "Détaillez les matières, chapitres ou examens qui vous posent problème..." },
    darja: { init_msg: "Academic Agent System...Ready!", q1_title: "Moutaba3a 1: Niveau w Ahdaf", q2_title: "Moutaba3a 2: Wa9t w hfatha", q3_title: "Moutaba3a 3: Machakel w S3oubat", q4_title: "Moutaba3a 4: Imte7an Sghir", q5_title: "Moutaba3a 5: El-Projet kbel", btn_send: "AB3ATH", btn_wasel: "TAHLIL (WASEL)", loading_title: "KHIDMET EL-KHOTTA", final_title: "KHOLASA NEHAYEYA LEL-9RAYA", text_placeholder: "Ikteb houni el-matiere wala el-chapitre l-s3ib..." }
};

const QuestionsStatic = {
    Q1: [
        { q: "Quel est votre niveau d'études actuel ?", a: [ ["a", "Collège / Lycée"], ["b", "Baccalauréat"], ["c", "Université / Licence / Master"], ["d", "Professionnel / Reconversion"] ] },
        { q: "Quel est l'objectif académique majeur ?", a: [ ["a", "Réussir un examen précis"], ["b", "Augmenter ma moyenne générale"], ["c", "Comprendre un chapitre difficile"], ["d", "Acquérir une méthodologie de travail"] ] },
        { q: "De combien de temps disposez-vous avant l'échéance ?", a: [ ["a", "Moins de 2 semaines (Urgence)"], ["b", "1 mois"], ["c", "3 mois"], ["d", "Plus de 6 mois / Fin d'année"] ] }
    ],
    Q2: [
        { q: "Combien d'heures par jour pouvez-vous réviser ?", a: [ ["a", "Moins de 1 heure"], ["b", "1 à 2 heures"], ["c", "3 à 4 heures"], ["d", "Plus de 4 heures (Intensif)"] ] },
        { q: "Quelle est votre méthode de mémorisation favorite ?", a: [ ["a", "Écrire, faire des fiches, résumer"], ["b", "Écouter le cours, enregistrements"], ["c", "Faire des exercices pratiques et quiz"], ["d", "Expliquer le cours à quelqu'un d'autre"] ] }
    ],
    Q3: [
        { q: "Où se situe votre blocage principal ?", a: [ ["a", "Manque de concentration / Distractions"], ["b", "Procrastination (Je remets à demain)"], ["c", "Angoisse et stress devant la feuille"], ["d", "Pas de problème, manque de temps"] ] },
        { q: "Comprenez-vous le cours pendant la classe ?", a: [ ["a", "Oui, tout à fait"], ["b", "Seulement si le prof explique lentement"], ["c", "Non, je décroche très vite"], ["d", "Je préfère apprendre seul chez moi"] ] }
    ]
};

const CHAS = {
    state: "[INIT]", lang: "fr", currentIdx: 0,
    answers: { Q1: [], Q2: [], Q3: [], Q4: [], Q5: [] },

    init() {
        this.state = "[INIT]"; this.currentIdx = 0;
        this.answers = { Q1: [], Q2: [], Q3: [], Q4: [], Q5: [] };
        document.getElementById("chat-viewport").innerHTML = "";
        this.printCHASMessage("<h2>ACADEMIC SYSTEM ONLINE</h2><p>Veuillez choisir votre langue d'analyse.</p>");
        this.renderLanguageSelection();
    },

    forceReset() { this.init(); },

    setLanguage(langCode) {
        this.lang = langCode === "4" ? "darja" : "fr";
        this.state = "[Q1_NIVEAU]"; this.currentIdx = 0;
        document.getElementById("sub-state-title").innerText = Dico[this.lang].q1_title;
        this.printUserMessage(langCode === "4" ? "Darja" : "Français");
        this.nextQuestion();
    },

    nextQuestion() {
        if (this.state === "[Q1_NIVEAU]") {
            if (this.currentIdx < QuestionsStatic.Q1.length) this.renderQuestionBlock(QuestionsStatic.Q1[this.currentIdx], "Q1");
            else { this.state = "[Q2_METHODE]"; this.currentIdx = 0; document.getElementById("sub-state-title").innerText = Dico[this.lang].q2_title; this.nextQuestion(); }
        } else if (this.state === "[Q2_METHODE]") {
            if (this.currentIdx < QuestionsStatic.Q2.length) this.renderQuestionBlock(QuestionsStatic.Q2[this.currentIdx], "Q2");
            else { this.state = "[Q3_BLOCAGES]"; this.currentIdx = 0; document.getElementById("sub-state-title").innerText = Dico[this.lang].q3_title; this.nextQuestion(); }
        } else if (this.state === "[Q3_BLOCAGES]") {
            if (this.currentIdx < QuestionsStatic.Q3.length) this.renderQuestionBlock(QuestionsStatic.Q3[this.currentIdx], "Q3");
            else { this.state = "[Q4_EVALUATION]"; this.currentIdx = 0; document.getElementById("sub-state-title").innerText = Dico[this.lang].q4_title; this.generateQ4EvaluationFlow(); }
        }
    },

    handleStaticSelection(section, key, label) {
        this.answers[section].push(key); this.printUserMessage(label); this.currentIdx++; this.nextQuestion();
    },

    generateQ4EvaluationFlow() {
        let scenarios = this.lang === "fr" ? [
            { q: "TEST LOGIQUE : Face un problème complexe inconnu, quelle est votre première réaction ?", a:[["a","J'abandonne après 5 minutes"],["b","Je relis le cours depuis le début"],["c","Je cherche un exemple similaire résolu"],["d","Je teste plusieurs hypothèses au hasard"]] },
            { q: "TEST STRATÉGIE : Comment organisez-vous vos révisions avant un examen ?", a:[["a","Tout la veille, nuit blanche"],["b","Planning strict sur plusieurs semaines"],["c","Au feeling, selon l'envie du jour"],["d","Uniquement en refaisant les anciens examens"]] }
        ] : [
            { q: "IMTE7AN LOGIQUE: Ki tjik s3iba mouch mte3ek, chnoua ta3mel toul ?", a:[["a","Insayeb kol chay ba3d 5 d9aye9"],["b","In3awed na9ra el-cours mel sba7"],["c","Inlawej 3la exercice kifou m7loul"],["d","Injareb ay chay iji fi beli"]] },
            { q: "IMTE7AN STRATEGIE: Kifech t7ader ro7ek l-imte7an kbir ?", a:[["a","Fil lila l-khra, lila kamla faye9"],["b","Na3mel planning 3la barcha jom3at"],["c","Kima iji, selon l-gaw mte3i enharadha"],["d","Nakhdem ken les anciens examens dima"]] }
        ];

        if (this.currentIdx < scenarios.length) this.renderQuestionBlock(scenarios[this.currentIdx], "Q4");
        else { this.state = "[Q5_PROJET]"; this.currentIdx = 0; document.getElementById("sub-state-title").innerText = Dico[this.lang].q5_title; this.generateQ5VisionFlow(); }
    },

    handleQ4Selection(key, label) {
        this.answers.Q4.push(key); this.printUserMessage(label); this.currentIdx++; this.generateQ4EvaluationFlow();
    },

    generateQ5VisionFlow() {
        let openQuestions = this.lang === "fr" ? [
            "Listez précisément les chapitres précis qui bloquent votre progression :",
            "Décrivez la note ou la mention exacte que vous visez à votre examen :"
        ] : [
            "Ikteb houni el-les chapitres el-s3abin 3lik bel gda :",
            "Chniya el-note wala el-mention eli t7eb tjibha bedhabt fil imte7an ?"
        ];

        if (this.currentIdx < openQuestions.length) this.renderOpenQuestionZone(openQuestions[this.currentIdx]);
        else { this.state = "[ATTENTE_SYNTHESE]"; document.getElementById("sub-state-title").innerText = "VALIDATION"; this.renderWaselTrigger(); }
    },

    handleQ5TextSubmit() {
        const txtArea = document.getElementById("q5-textarea");
        if (!txtArea || !txtArea.value.trim()) return;
        this.answers.Q5.push(txtArea.value.trim());
        this.printUserMessage(txtArea.value.trim().substring(0, 40) + "...");
        this.currentIdx++; this.generateQ5VisionFlow();
    },

    async triggerInternalSynthesisLoading() {
        this.state = "[SYNTHESE_INTERNE]";
        document.getElementById("sub-state-title").innerText = Dico[this.lang].loading_title;
        document.getElementById("response-viewport").innerHTML = "";

        const chatView = document.getElementById("chat-viewport");
        const loadContainer = document.createElement("div");
        loadContainer.className = "loader-interne";
        loadContainer.innerHTML = `<div>⚡ CONNECTING ACADEMIC IA (GROQ/LLAMA3)...</div>`;
        chatView.appendChild(loadContainer);
        chatView.scrollTop = chatView.scrollHeight;

        try {
            const response = await fetch(MAKE_WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ agent: "prof", key: document.getElementById("access-key").value, data: this.answers, lang: this.lang })
            });
            const result = await response.json();
            this.state = "[RENDU_FINAL]";
            document.getElementById("sub-state-title").innerText = Dico[this.lang].final_title;
            this.printCHASMessage(result.analysis_html || `<h2>Plan d'Étude Prêt</h2><p>${result.text_fallback}</p>`);
        } catch (err) {
            this.printCHASMessage("<h2>Erreur de synchronisation IA Professeur.</h2><p>Vérifiez Make.com.</p>");
        }
        document.getElementById("response-viewport").innerHTML = `<button class="btn-action-unique" onclick="CHAS.init()">Nouveau Plan</button>`;
    },

    renderLanguageSelection() {
        document.getElementById("response-viewport").innerHTML = `
            <div class="grille-boutons" style="grid-template-rows: 1fr 1fr;">
                <div class="btn-carre" onclick="CHAS.setLanguage('2')">Français</div>
                <div class="btn-carre" onclick="CHAS.setLanguage('4')">دارجة تونسية</div>
            </div>`;
    },

    renderQuestionBlock(qObj, section) {
        this.printCHASMessage(`<h3>${qObj.q}</h3>`);
        let btnHtml = `<div class="grille-boutons">`;
        qObj.a.forEach(opt => {
            let clickAction = section === "Q4" ? `CHAS.handleQ4Selection('${opt[0]}', '${opt[1].replace(/'/g, "\\'")}')` : `CHAS.handleStaticSelection('${section}', '${opt[0]}', '${opt[1].replace(/'/g, "\\'")}')`;
            btnHtml += `<div class="btn-carre" onclick="${clickAction}">${opt[1]}</div>`;
        });
        document.getElementById("response-viewport").innerHTML = btnHtml + `</div>`;
    },

    renderOpenQuestionZone(questionText) {
        this.printCHASMessage(`<h3>${questionText}</h3>`);
        document.getElementById("response-viewport").innerHTML = `
            <div class="zone-saisie-wrapper">
                <textarea class="zone-saisie" id="q5-textarea" placeholder="${Dico[this.lang].text_placeholder}"></textarea>
                <button class="btn-action-unique" style="height:35%; font-size:2rem;" onclick="CHAS.handleQ5TextSubmit()">${Dico[this.lang].btn_send}</button>
            </div>`;
    },

    renderWaselTrigger() {
        document.getElementById("response-viewport").innerHTML = `<button class="btn-action-unique" onclick="CHAS.triggerInternalSynthesisLoading()">${Dico[this.lang].btn_wasel}</button>`;
    },

    printCHASMessage(htmlContent) {
        const viewport = document.getElementById("chat-viewport");
        const block = document.createElement("div"); block.className = "message-cas";
        block.innerHTML = `<span class="badge-etape">${this.state.replace("[", "").replace("]", "")}</span><div style="margin-top:6px;">${htmlContent}</div>`;
        viewport.appendChild(block); viewport.scrollTop = viewport.scrollHeight;
    },

    printUserMessage(text) {
        const viewport = document.getElementById("chat-viewport");
        const bubble = document.createElement("div"); bubble.className = "message-user"; bubble.innerText = text;
        viewport.appendChild(bubble); viewport.scrollTop = viewport.scrollHeight;
    }
};