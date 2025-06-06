import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircleIcon } from "lucide-react";

export default function About() {
  return (
    <section className="max-w-5xl mx-auto md:px-6 py-10 space-y-10">
      {/* Introduction HMM */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Reconnaissance vocale en Fon : du HMM aux réseaux neuronaux
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-base leading-relaxed">
          <p>
            Dans ce projet, nous explorons deux approches pour transcrire la langue Fon, une langue tonale d’Afrique de l’Ouest.
            La première méthode repose sur les <strong>Hidden Markov Models (HMM)</strong>, une technique statistique utilisée historiquement en reconnaissance vocale.
          </p>
          <h3 className="text-xl font-semibold mt-6">🧠 Comment fonctionne un HMM en reconnaissance vocale ?</h3>
          <p>
            Un <strong>HMM (modèle de Markov caché)</strong> est un modèle probabiliste utilisé pour représenter une séquence d’observations (comme un signal audio).
            Dans notre cas :
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Les états cachés</strong> représentent des phonèmes ou des mots.</li>
            <li><strong>Les observations</strong> sont des vecteurs acoustiques (comme les MFCCs) extraits du signal audio.</li>
            <li>Chaque état a une probabilité de transition vers un autre, et une probabilité d’émettre un certain vecteur acoustique.</li>
          </ul>
          <p>
            Pour reconnaître un mot, on déduit la séquence d’états cachés la plus probable ayant généré le signal observé. Cela se fait avec l’algorithme de Viterbi.
          </p>
          <p>
            Ce modèle est simple, mais efficace uniquement dans des contextes bien contrôlés, avec beaucoup de données et peu de variations.
          </p>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card className="border-l-4 border-blue-600">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-blue-700">📌 Étapes du projet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative border-l-2 border-gray-300 ml-4 pl-6 space-y-6">
            {[
              "Collecte de 7h d’audios Fon + transcriptions",
              "Création du lexique phonétique avec tons",
              "Alignement audio-texte avec Montreal Forced Aligner (MFA)",
              "Extraction de MFCCs et entraînement des HMM",
              "Évaluation : taux d’erreur de mot (WER) ≈ 93%",
              "Transition vers un modèle neuronal SpeechBrain Wav2Vec2",
              "Résultats améliorés et futurs ajustements",
            ].map((step, i) => (
              <div key={i} className="flex items-start space-x-3">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mt-1" />
                <p className="text-sm text-gray-800">{step}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* HMM vs Wav2Vec2 comparaison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-medium">📊 Comparaison HMM vs Wav2Vec2</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div className="bg-gray-50 border p-4 rounded">
              <h4 className="font-semibold mb-2">🔁 HMM (Hidden Markov Model)</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Utilise des états cachés et des transitions probabilistes</li>
                <li>Basé sur des MFCCs extraits manuellement</li>
                <li>Requiert un alignement audio/texte très précis</li>
                <li>Sensible au bruit et aux variations de prononciation</li>
                <li>Performance faible sur petits corpus (WER ≈ 93%)</li>
              </ul>
            </div>
            <div className="bg-green-50 border p-4 rounded">
              <h4 className="font-semibold mb-2">🧠 Wav2Vec2 + SpeechBrain</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Encode directement le signal audio brut</li>
                <li>Préentraîné sur des données de Fon parlées</li>
                <li>Prend en compte le contexte acoustique global</li>
                <li>Pas besoin de features manuelles (MFCCs)</li>
                <li>Résultats bien meilleurs sur corpus limité</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SpeechBrain Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-medium">⚙️ Utilisation du modèle préentraîné</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Nous utilisons <strong>SpeechBrain</strong> avec un modèle Wav2Vec2 préentraîné pour la langue Fon :</p>
          <pre className="bg-black text-white text-sm p-4 rounded mt-4 overflow-x-auto">
            <code>
              {`from speechbrain.pretrained import EncoderASR

asr_model = EncoderASR.from_hparams(
    source="speechbrain/asr-wav2vec2-dvoice-fongbe",
    savedir="pretrained_models/asr-wav2vec2-dvoice-fongbe"
)`}
            </code>
          </pre>
        </CardContent>
      </Card>

      {/* Résultats */}
      <Card className="border-l-4 border-green-600">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-green-700">📈 Résultats et perspectives</CardTitle>
        </CardHeader>
        <CardContent className="text-base space-y-3">
          <p>
            Le modèle SpeechBrain Wav2Vec2, finement adapté au Fon, surpasse nettement les HMM en termes de précision, robustesse et adaptation à la langue tonale.
          </p>
          <p>
            Le projet est désormais bien plus performant, même sans grand volume de données. Des extensions sont prévues pour intégrer la reconnaissance tonale fine
            et transposer la solution à d’autres langues africaines peu dotées.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}