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
    fr: { init_msg: "Sport Agent System...Ready!", q1_title: "Questionnaire 1 : Morphologie & Expérience", q2_title: "Questionnaire 2 : Objectifs & Fréquence", q3_title: "Questionnaire 3 : Matériel & Équipement", q4_title: "Questionnaire 4 : Test de Résistance", q5_title: "Questionnaire 5 : Historique & Blessures", btn_send: "VALIDER LA RÉPONSE", btn_wasel: "LANCER L'ANALYSE (WASEL)", loading_title: "CONSTRUCTION DU PROGRAMME ATHLÉTIQUE", final_title: "PROGRAMME DE COACHING ATHLÉTIQUE", text_placeholder: "Détaillez vos anciennes blessures, douleurs articulaires ou pathologies particulières..." },
    darja: { init_msg: "Sport Agent System...Ready!", q1_title: "Moutaba3a 1: Badan w Experience", q2_title: "Moutaba3a 2: Target w Entrainement", q3_title: "Moutaba3a 3: Matériel w Salle", q4_title: "Moutaba3a 4: Imte7an l-9owa", q5_title: "Moutaba3a 5: El-Wji3a w l-Dhrab", btn_send: "AB3ATH", btn_wasel: "TAHLIL (WASEL)", loading_title: "KHIDMET EL-KHOTTA EL-RIYADHIA", final_title: "KHOLASA NEHAYEYA LEL-SPORT", text_placeholder: "Ikteb houni ken 3andek wji3a fi rkaybek, dharba 9dima..." }
};

const QuestionsStatic = {
    Q1: [
        { q: "Quel est votre niveau actuel en musculation / fitness ?", a: [ ["a", "Débutant (Jamais touché de poids)"], ["b", "Intermédiaire (6 mois à 2 ans de pratique)"], ["c", "Avancé (Plus de 2 ans réguliers)"], ["d", "Ancien athlète en reprise de sport"] ] },
        { q: "Quelle est votre morphologie dominante ?", a: [ ["a", "Plutôt mince (Difficulté à prendre du muscle)"], ["b", "Plutôt athlétique (Prend et perd facilement)"], ["c", "Plutôt corpulent (Prend facilement du gras)"], ["d", "Aucune idée, morphologie normale"] ] },
        { q: "Où allez-vous vous entraîner principalement ?", a: [ ["a", "Dans une salle de sport tout équipée"], ["b", "À la maison (Poids du corps / Élastiques)"], ["c", "À l'extérieur (Street workout / Parc)"], ["d", "Mixte (Salle et Maison)"] ] }
    ],
    Q2: [
        { q: "Quel est votre objectif physique prioritaire ?", a: [ ["a", "Prise de masse musculaire sèche"], ["b", "Perte de gras / Sèche abdominale"], ["c", "Gain de force pure / Puissance"], ["d", "Remise en forme générale / Cardio"] ] },
        { q: "Combien de séances par semaine visez-vous ?", a: [ ["a", "1 à 2 séances maximum"], ["b", "3 séances (Idéal Split/Push-Pull-Legs)"], ["c", "4 à 5 séances (Intensif)"], ["d", "Chaque jour / Pas de jour de repos"] ] }
    ],
    Q3: [
        { q: "Quel est votre rapport actuel avec l'alimentation sportive ?", a: [ ["a", "Aucun suivi, je mange ce que je veux"], ["b", "J'essaie de manger protéiné sans calculer"], ["c", "Je compte mes calories et mes macros précisément"], ["d", "Je suis un régime spécifique (Végétarien, Keto...)"] ] },
        { q: "Prenez-vous ou souhaitez-vous prendre des compléments ?", a: [ ["a", "Non, aucun intérêt pour moi"], ["b", "Oui, les basiques (Whey, Créatine)"], ["c", "Uniquement des vitamines / Oméga 3"], ["d", "Je veux que l'IA me conseille à ce sujet"] ] }
    ]
};

const CHAS = {
    state: "[INIT]", lang: "fr", currentIdx: 0,
    answers: { Q1: [], Q2: [], Q3: [], Q4: [], Q5: [] },

    init() {
        this.state = "[INIT]"; this.currentIdx = 0;
        this.answers = { Q1: [], Q2: [], Q3: [], Q4: [], Q5: [] };
        document.getElementById("chat-viewport").innerHTML = "";
        this.printCHASMessage("<h2>SPORT COACHING ONLINE</h2><p>Veuillez choisir votre langue d'analyse.</p>");
        this.renderLanguageSelection();
    },

    forceReset() { this.init(); },

    setLanguage(langCode) {
        this.lang = langCode === "4" ? "darja" : "fr";
        this.state = "[Q1_MORPHOLOGIE]"; this.currentIdx = 0;
        document.getElementById("sub-state-title").innerText = Dico[this.lang].q1_title;
        this.printUserMessage(langCode === "4" ? "Darja" : "Français");
        this.nextQuestion();
    },

    nextQuestion() {
        if (this.state === "[Q1_MORPHOLOGIE]") {
            if (this.currentIdx < QuestionsStatic.Q1.length) this.renderQuestionBlock(QuestionsStatic.Q1[this.currentIdx], "Q1");
            else { this.state = "[Q2_OBJECTIFS]"; this.currentIdx = 0; document.getElementById("sub-state-title").innerText = Dico[this.lang].q2_title; this.nextQuestion(); }
        } else if (this.state === "[Q2_OBJECTIFS]") {
            if (this.currentIdx < QuestionsStatic.Q2.length) this.renderQuestionBlock(QuestionsStatic.Q2[this.currentIdx], "Q2");
            else { this.state = "[Q3_MATERIEL]"; this.currentIdx = 0; document.getElementById("sub-state-title").innerText = Dico[this.lang].q3_title; this.nextQuestion(); }
        } else if (this.state === "[Q3_MATERIEL]") {
            if (this.currentIdx < QuestionsStatic.Q3.length) this.renderQuestionBlock(QuestionsStatic.Q3[this.currentIdx], "Q3");
            else { this.state = "[Q4_RESISTANCE]"; this.currentIdx = 0; document.getElementById("sub-state-title").innerText = Dico[this.lang].q4_title; this.generateQ4ResistanceFlow(); }
        }
    },

    handleStaticSelection(section, key, label) {
        this.answers[section].push(key); this.printUserMessage(label); this.currentIdx++; this.nextQuestion();
    },

    generateQ4ResistanceFlow() {
        let scenarios = this.lang === "fr" ? [
            { q: "TEST EFFORT : Combien de pompes complètes réglementaires pouvez-vous enchaîner ?", a:[["a","Moins de 5 pompes"],["b","5 à 15 pompes"],["c","16 à 40 pompes"],["d","Plus de 40 pompes (Facile)"]] },
            { q: "TEST ENDURANCE : Quelle est votre situation face à un footing de 30 minutes ?", a:[["a","Impossible, je m'arrête après 5 min"],["b","Très dur, je termine à bout de souffle"],["c","Gérable, rythme modéré régulier"],["d","Facile, je cours 1 heure sans problème"]] }
        ] : [
            { q: "IMTE7AN L-EFFORT: Qadech men pompe s7i7a tnajem ta3mel wra b3adhhom ?", a:[["a","A9al men 5 pompes"],["b","Men 5 l-15 pompes"],["c","Men 16 l-40 pompes"],["d","Akter men 40 pompes (Sahl)"]] },
            { q: "IMTE7AN ENDURANCE: Ki tji tejri 30 d9i9a, chniya l-vitesse mte3ek ?", a:[["a","Musta7il, na9af ba3d 5 d9aye9"],["b","S3ib barcha, nkamal sakhfane"],["c","Normal, ritem sghir w mrigel"],["d","Sahl barcha, nejri se3a kemla labes"]] }
        ];

        if (this.currentIdx < scenarios.length) this.renderQuestionBlock(scenarios[this.currentIdx], "Q4");
        else { this.state = "[Q5_HISTORIQUE]"; this.currentIdx = 0; document.getElementById("sub-state-title").innerText = Dico[this.lang].q5_title; this.generateQ5VisionFlow(); }
    },

    handleQ4Selection(key, label) {
        this.answers.Q4.push(key); this.printUserMessage(label); this.currentIdx++; this.generateQ4ResistanceFlow();
    },

    generateQ5VisionFlow() {
        let openQuestions = this.lang === "fr" ? [
            "Indiquez vos mensurations actuelles estimées (Poids en kg, Taille en cm) :",
            "Décrivez le physique ou la performance idéale que vous visez :"
        ] : [
            "Ikteb houni l-poids w toul mte3ek bedhabt (kg w cm) :",
            "Ahkili 3la l-badan eli t7eb tousolou fil lekher :"
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
        loadContainer.innerHTML = `<div>⚡ CONNECTING ATHLETIC IA (GROQ/LLAMA3)...</div>`;
        chatView.appendChild(loadContainer);
        chatView.scrollTop = chatView.scrollHeight;

        try {
            const response = await fetch(MAKE_WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ agent: "sport", key: document.getElementById("access-key").value, data: this.answers, lang: this.lang })
            });
            const result = await response.json();
            this.state = "[RENDU_FINAL]";
            document.getElementById("sub-state-title").innerText = Dico[this.lang].final_title;
            this.printCHASMessage(result.analysis_html || `<h2>Routine Sportive Prête</h2><p>${result.text_fallback}</p>`);
        } catch (err) {
            this.printCHASMessage("<h2>Erreur de synchronisation IA Sport.</h2><p>Vérifiez Make.com.</p>");
        }
        document.getElementById("response-viewport").innerHTML = `<button class="btn-action-unique" onclick="CHAS.init()">Nouvelle Routine</button>`;
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