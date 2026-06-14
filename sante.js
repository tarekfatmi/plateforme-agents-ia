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
    fr: { init_msg: "Health Agent System...Ready!", q1_title: "Questionnaire 1 : Profil & Métabolisme", q2_title: "Questionnaire 2 : Sommeil & Stress", q3_title: "Questionnaire 3 : Nutrition & Habitudes", q4_title: "Questionnaire 4 : Symptômes & Alertes", q5_title: "Questionnaire 5 : Objectifs Vitaux", btn_send: "VALIDER LA RÉPONSE", btn_wasel: "LANCER L'ANALYSE (WASEL)", loading_title: "ANALYSE DE VOS DONNÉES BIOMÉDICALES", final_title: "BILAN DE SANTÉ VIRTUEL FINAL", text_placeholder: "Décrivez vos antécédents, douleurs ou traitements actuels..." },
    darja: { init_msg: "Health Agent System...Ready!", q1_title: "Moutaba3a 1: Profil w Badan", q2_title: "Moutaba3a 2: Noum w Stress", q3_title: "Moutaba3a 3: Makla w Mode de vie", q4_title: "Moutaba3a 4: 3وارض w Machakel", q5_title: "Moutaba3a 5: Ahdaf Kbyra", btn_send: "AB3ATH", btn_wasel: "TAHLIL (WASEL)", loading_title: "TAHLIL EL-BADAN", final_title: "KHOLASA NEHAYEYA LEL-SAHA", text_placeholder: "Ikteb houni el-wji3a wala el-mradh mte3ek..." }
};

const QuestionsStatic = {
    Q1: [
        { q: "Quelle est votre tranche d'âge actuelle ?", a: [ ["a", "Moins de 25 ans"], ["b", "25 à 40 ans"], ["c", "41 à 60 ans"], ["d", "Plus de 60 ans"] ] },
        { q: "Quel est votre niveau d'activité physique quotidien ?", a: [ ["a", "Sédentaire (Bureau, pas de sport)"], ["b", "Actif léger (Marche, ménage)"], ["c", "Actif modéré (1 à 3 sports / semaine)"], ["d", "Athlétique / Sportif intensif"] ] },
        { q: "Comment décririez-vous votre poids actuel ?", a: [ ["a", "En dessous de mon poids de forme"], ["b", "Poids stable et satisfaisant"], ["c", "Léger surpoids"], ["d", "Forte surcharge / Obésité"] ] }
    ],
    Q2: [
        { q: "Combien d'heures dormez-vous par nuit en moyenne ?", a: [ ["a", "Moins de 5 heures (Insuffisant)"], ["b", "5 à 7 heures"], ["c", "7 à 9 heures (Idéal)"], ["d", "Plus de 9 heures"] ] },
        { q: "Comment évaluez