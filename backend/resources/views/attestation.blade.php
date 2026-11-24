<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Attestation d'Agrément — {{ $agency->name }} — ATAF</title>
    <style>
        @page { size: A4; margin: 20mm; }
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            color: #1e293b;
            background: #f8fafc;
            margin: 0;
            padding: 40px 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: #ffffff;
            padding: 50px 60px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.06);
            border: 2px solid #0D2B4E;
            position: relative;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #1A4F8A;
            padding-bottom: 25px;
            margin-bottom: 40px;
        }
        .logo-title h1 {
            margin: 0;
            color: #0D2B4E;
            font-size: 26px;
            letter-spacing: 1px;
        }
        .logo-title p {
            margin: 5px 0 0;
            color: #64748b;
            font-size: 13px;
        }
        .doc-type {
            text-align: right;
        }
        .doc-type span {
            background: #0D2B4E;
            color: #ffffff;
            padding: 6px 14px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            letter-spacing: 0.5px;
        }
        .title-section {
            text-align: center;
            margin: 40px 0;
        }
        .title-section h2 {
            font-size: 24px;
            color: #0D2B4E;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 8px;
        }
        .title-section .number {
            font-size: 18px;
            color: #1A4F8A;
            font-weight: bold;
        }
        .content {
            font-size: 15px;
            line-height: 1.8;
            color: #334155;
            margin-bottom: 40px;
        }
        .agency-box {
            background: #f1f5f9;
            border-left: 4px solid #1A4F8A;
            padding: 20px;
            border-radius: 6px;
            margin: 25px 0;
        }
        .agency-box table {
            width: 100%;
            border-collapse: collapse;
        }
        .agency-box td {
            padding: 6px 0;
            font-size: 14px;
        }
        .agency-box td.label {
            color: #64748b;
            width: 180px;
            font-weight: 500;
        }
        .agency-box td.value {
            color: #0f172a;
            font-weight: bold;
        }
        .signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 60px;
            padding-top: 20px;
        }
        .sig-block {
            text-align: center;
            width: 250px;
        }
        .sig-block .role {
            font-size: 12px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 50px;
        }
        .sig-block .name {
            font-weight: bold;
            color: #0D2B4E;
            font-size: 14px;
            border-top: 1px dashed #cbd5e1;
            padding-top: 8px;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
            padding-top: 20px;
            font-size: 11px;
            color: #94a3b8;
        }
        .print-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #1A4F8A;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .print-btn:hover { background: #12376A; }
        @media print {
            body { background: white; padding: 0; }
            .container { box-shadow: none; border: 1px solid #0D2B4E; padding: 30px; }
            .print-btn { display: none; }
        }
    </style>
</head>
<body>
    <button class="print-btn" onclick="window.print()">🖨️ Imprimer / Télécharger en PDF</button>

    <div class="container">
        <div class="header">
            <div class="logo-title">
                <h1>ATAF</h1>
                <p>Association des Transporteurs Aériens Francophones</p>
            </div>
            <div class="doc-type">
                <span>CERTIFICAT OFFICIEL</span>
            </div>
        </div>

        <div class="title-section">
            <h2>Attestation d'Agrément</h2>
            <div class="number">N° {{ $agency->agreement_number }}</div>
        </div>

        <div class="content">
            <p>Le Secrétariat Général de l'<strong>Association des Transporteurs Aériens Francophones (ATAF)</strong> certifie par la présente que l'agence de voyages désignée ci-après est dûment agréée selon les statuts et règlements de l'association :</p>

            <div class="agency-box">
                <table>
                    <tr>
                        <td class="label">Raison sociale :</td>
                        <td class="value">{{ $agency->name }}</td>
                    </tr>
                    <tr>
                        <td class="label">Localisation :</td>
                        <td class="value">{{ $agency->city }}, {{ $agency->country }}</td>
                    </tr>
                    <tr>
                        <td class="label">Numéro d'agrément :</td>
                        <td class="value" style="color: #1A4F8A;">{{ $agency->agreement_number }}</td>
                    </tr>
                    <tr>
                        <td class="label">Date de délivrance :</td>
                        <td class="value">{{ $agency->valid_from ? $agency->valid_from->format('d/m/Y') : date('d/m/Y') }}</td>
                    </tr>
                    <tr>
                        <td class="label">Validité :</td>
                        <td class="value">{{ $agency->valid_until ? $agency->valid_until->format('d/m/Y') : 'Permanente sous réserve de conformité' }}</td>
                    </tr>
                    <tr>
                        <td class="label">Statut officiel :</td>
                        <td class="value" style="color: #16a34a;">● Agréée et Active</td>
                    </tr>
                </table>
            </div>

            <p style="font-size: 13px; color: #64748b;">Cette attestation confère à l'agence susnommée la reconnaissance officielle des compagnies aériennes membres de l'ATAF et l'autorise à émettre les titres de transport aérien conformément aux normes établies.</p>
        </div>

        <div class="signatures">
            <div class="sig-block">
                <div class="role">Le Président de l'ATAF</div>
                <div class="name">Signé électroniquement</div>
            </div>
            <div class="sig-block">
                <div class="role">Le Secrétaire Général</div>
                <div class="name">Cachet et Validation</div>
            </div>
        </div>

        <div class="footer">
            <p>ATAF — Association des Transporteurs Aériens Francophones — Siège social : Paris, France</p>
            <p>Document vérifiable en temps réel sur <a href="https://ataf-frontend.vercel.app/agences" style="color: #1A4F8A; text-decoration: none;">https://ataf-frontend.vercel.app/agences</a> avec le matricule {{ $agency->agreement_number }}</p>
        </div>
    </div>
</body>
</html>
