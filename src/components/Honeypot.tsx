type HoneypotProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
};

export default function Honeypot({ id, value, onChange }: HoneypotProps) {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
      {/* Champ leurre anti-robots. Il n'a volontairement pas d'attribut `name` :
          avec un nom ou un libellé explicite, les navigateurs le remplissent
          automatiquement et le formulaire était rejeté pour de vrai. */}
      <input
        id={id}
        aria-label="Ne pas remplir"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        data-lpignore="true"
        data-1p-ignore="true"
        data-form-type="other"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
